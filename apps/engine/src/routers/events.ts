import { createId } from "@paralleldrive/cuid2";
import { BroadcastChannel, publisher } from "../redis-clients";
import {
  InMemoryEvents,
  InMemoryINRBalances,
  InMemoryOrderBook,
  InMemoryOrders,
  InMemoryTrades,
} from "../store";
import { Sides } from "@repo/types";
import prisma from "@repo/db";

export async function getAllEvents(message: any) {
  const { messageId } = message;
  const events = Object.keys(InMemoryEvents).map((key) => {
    return {
      id: key,
      title: InMemoryEvents[key]!.title,
      description: InMemoryEvents[key]!.description,
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      yesPrice: 5.0,
      noPrice: 5.0,
    };
  });
  const data = JSON.stringify({
    messageId,
    events: events,
    status: "SUCCESS",
  });
  await publisher.publish(`getEvents::${messageId}`, data);
  return;
}

export async function getEvent(message: any) {
  const { messageId, eventId } = message;
  if (InMemoryEvents[eventId]) {
    const data = JSON.stringify({
      messageId,
      status: "SUCCESS",
      event: {
        title: InMemoryEvents[eventId].title,
        description: InMemoryEvents[eventId].description,
        imageURL:
          "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
        yesPrice: 5.0,
        noPrice: 5.0,
      },
    });
    await publisher.publish(`getEvent::${messageId}`, data);
  } else {
    const data = JSON.stringify({
      messageId,
      status: "FAILED",
    });
    await publisher.publish(`getEvent::${messageId}`, data);
  }
}

export async function createEvent(message: any) {
  const { messageId, title, description, endTime } = message;
  let event;
  try {
    event = await prisma.event.create({
      data: {
        title: title,
        description: description,
        endTime: new Date(endTime),
      },
    });

    const data = JSON.stringify({
      messageId,
      eventId: event.id,
      status: "SUCCESS",
    });
    InMemoryEvents[event.id] = {
      title,
      description,
      endTime: new Date(endTime),
    };
    InMemoryOrderBook[event.id] = {
      NO: [],
      YES: [],
    };
    await publisher.publish(`eventCreation::${messageId}`, data);
  } catch (err) {
    const data = JSON.stringify({
      messageId,
      status: "FAILED",
    });
    await publisher.publish(`eventCreation::${messageId}`, data);
  }

  return;
}

export function getOppSide(mySide: Sides) {
  if (Sides.YES) return Sides.NO;
  return Sides.YES;
}

export function getOppSideString(mySide: string) {
  if (mySide == "YES") return "NO";
  return "YES";
}

export const initiateOrder = async (message: any) => {
  const { userId, eventId, side, price, quantity, messageId } = message;
  // Publish FAILED back to the backend
  if (
    !userId ||
    !eventId ||
    !side ||
    !price ||
    !quantity ||
    !messageId ||
    !InMemoryINRBalances[userId] ||
    (InMemoryINRBalances[userId] &&
      InMemoryINRBalances[userId]!.balance < price * quantity) ||
    !InMemoryOrderBook[eventId]
  ) {
    console.log(
      "Failing: ",
      InMemoryINRBalances[userId],
      InMemoryOrderBook[eventId]
    );
    const data = JSON.stringify({
      messageId,
      status: "FAILED",
    });
    await publisher.publish(`initiateOrder::${messageId}`, data);
    return;
  }
  // Add entry to orders
  const orderId = createId();
  InMemoryOrders[orderId] = {
    side: side,
    type: "BUY",
    price: price,
    quantity: quantity,
    status: "LIVE",
    userId: userId,
    eventId: eventId,
    orderId: orderId,
  };

  // BroadCast this event
  console.log(InMemoryOrders[orderId]);

  // do core logic of order initiation
  await initiateOrderLogic(userId, eventId, side, price, quantity, orderId);
  const data = JSON.stringify({
    messageId,
    status: "SUCCESS",
  });
  await publisher.publish(`initiateOrder::${messageId}`, data);
  return;
};

export const initiateOrderLogic = async (
  userId: string,
  eventId: string,
  side: "YES" | "NO",
  price: number,
  quantity: number,
  orderId: string
) => {
  const orderbook = InMemoryOrderBook[eventId]!;
  const oppType = getOppSideString(side);
  const sortedOrders = orderbook[side].sort((a, b) => a.price - b.price);
  const cost = price * quantity;

  InMemoryINRBalances[userId]!.lockedBalance += cost;
  InMemoryINRBalances[userId]!.balance -= cost;

  let remainingQty = quantity;
  /*
  Buying YES -> 
  1. Waits for someone who Buy 'No' .
  2. Someone who exits 'YES' so that this person can take its position .
  3. Also if we dont find above two cases we can have one pseudo sell order for No

  Extra Info :
  how 3rd case take place:-
  suppose A is ready to Buy 'YES' for @4 and 1st and 2nd case is not possible 
  so create pseudo order for Sell(pseudo sell) 'NO' for @(10-4).
  Now if someone B come to Buy 'No' :
  Transactions :-
  now pool has (4+6) @10 so if 'NO' wins B will get this @10, if YES wins then A get @10


  Selling/Exiting  YES @4 ->
  1. Waits for someone in NO who exits not sell
  2. Some in YES who is ready to buy at <= selling price , so that he can take that pool .
  3. Create pseudo sell order for NO @(10-4) same logic as if someone come to buy No at @6 .
  */

  // case1 && case2
  for (let i = 0; i < sortedOrders.length; i++) {
    let order = sortedOrders[i]!;
    if (order.price <= price && remainingQty > 0) {
      if (order.quantity > 0) {
        let tradeOty = Math.min(remainingQty, order.quantity);

        while (tradeOty > 0 && order.userOrders.length > 0) {
          const sellerOrder = order.userOrders[0];
          const sellerTradeOty = Math.min(tradeOty, sellerOrder?.quantity!);

          if (sellerOrder == undefined) {
            order.userOrders.shift();
            continue;
          }
          const sellerOrderId = sellerOrder.orderId;
          let isPseudoMatch = false;
          // this is case of pseudo case from opposite side
          if (
            InMemoryOrders[sellerOrderId]?.type == "SELL" &&
            InMemoryOrders[sellerOrderId]?.status == "LIVE" &&
            sellerOrderId.endsWith("+pseudo")
          ) {
            isPseudoMatch = true;
            if (sellerTradeOty == sellerOrder.quantity) {
              // mark this as full order completed
              InMemoryOrders[sellerOrderId].status = "EXECUTED";
            }
            // broadcast this message
            const update = {
              id: sellerOrderId,
              eventId: eventId,
              type: "SELL",
            };
            await BroadcastChannel("order_update", update);
          }
          // this is case of sitting sellorders
          if (
            InMemoryOrders[sellerOrderId]?.type == "SELL" &&
            InMemoryOrders[sellerOrderId]?.status == "LIVE" &&
            !sellerOrderId.endsWith("+pseudo")
          ) {
            if (sellerTradeOty == sellerOrder.quantity) {
              // mark this as completed
              InMemoryOrders[sellerOrderId].status = "EXECUTED";
            }
            const update = {
              id: sellerOrderId,
              eventId,
              type: "BUY",
            };
            await BroadcastChannel("order_update", update);
          }

          const tradeId = createId();
          InMemoryTrades[tradeId] = {
            tradeId: tradeId,
            eventId: eventId,
            buyerId: userId,
            buyOrderId: orderId,
            buyPrice: price,
            buyQuantity: sellerTradeOty,
            sellerId: sellerOrder.userId,
            sellOrderId: sellerOrderId,
            sellPrice: order.price,
            sellQuantity: sellerTradeOty,
          };
          await BroadcastChannel("trade", {
            ...InMemoryTrades[tradeId],
            item: side,
            isPseudoMatch,
          });
          console.log(
            `Date: ${new Date().toLocaleDateString()} InMemoryTrades: ${InMemoryTrades[tradeId]}`
          );

          // Balance Logic
          sellerOrder.quantity -= sellerTradeOty;
          tradeOty -= sellerTradeOty;
          remainingQty -= sellerTradeOty;
          order.quantity -= sellerTradeOty;

          InMemoryINRBalances[userId]!.lockedBalance -= cost;

          // balance out the quantities bought at low price
          InMemoryINRBalances[userId]!.balance -=
            (price - order.price) * sellerTradeOty;

          // remove the order if it is finished
          if (sellerOrder.quantity == 0) {
            InMemoryOrders[sellerOrderId]!.status = "EXECUTED";
            order.userOrders.shift();
          }
        }
      }
      if (order.quantity == 0) {
        sortedOrders.splice(i, 1);
        i--;
      }
    }
  }

  // case3 (pseudo order)
  if (remainingQty > 0) {
    const orderWithMyOppPrice = orderbook[oppType].find(
      (order) => order.price === 10 - price
    );
    const pseudoOrderId = orderId + "+pseudo";

    if (orderWithMyOppPrice != undefined) {
      orderWithMyOppPrice.quantity += remainingQty;
      orderWithMyOppPrice.userOrders.push({
        userId,
        orderId: pseudoOrderId,
        quantity: remainingQty,
      });
    } else {
      orderbook[oppType].push({
        price: 10 - price,
        quantity: remainingQty,
        userOrders: [
          {
            userId,
            orderId: pseudoOrderId,
            quantity: remainingQty,
          },
        ],
      });
    }
    console.log("created pseudo order", pseudoOrderId);
    InMemoryOrders[pseudoOrderId] = InMemoryOrders[orderId]!;
    InMemoryOrders[pseudoOrderId]!.type = "SELL";
    InMemoryOrders[pseudoOrderId]!.side = getOppSideString(side);
    InMemoryOrders[pseudoOrderId].quantity = remainingQty;
    // PURE BALANCE WITH SELLTYPE
    InMemoryOrders[orderId]!.quantity -= remainingQty;
    remainingQty = 0;
  } else {
    InMemoryOrders[orderId]!.status = "MATCHED";
  }

  const broadcastOrderBook = {
    eventId,
    orderbook: {
      YES: orderbook.YES,
      NO: orderbook.NO,
    },
  };
  await BroadcastChannel("orderbook", broadcastOrderBook);
  return;
};

export const exitOrder = async (message: any) => {
  const { userId, eventId, side, price, quantity, orderId, messageId } =
    message;

  if (
    !userId ||
    !eventId ||
    !side ||
    !price ||
    !quantity ||
    !orderId ||
    !messageId ||
    !InMemoryOrders[orderId]
  ) {
    const data = JSON.stringify({
      messageId,
      status: "FAILED",
    });
    await publisher.publish(`exitOrder::${messageId}`, data);
    return;
  }
  // do core logic call
  await exit(eventId, side, price, quantity, orderId, userId);
  const data = JSON.stringify({
    messageId,
    status: "SUCCESS",
  });
  await publisher.publish(`exitOrder::${messageId}`, data);
};

export async function exit(
  eventId: string,
  side: "YES" | "NO",
  price: number,
  quantity: number,
  orderId: string,
  userId: string
) {
  const sellprice = 10 - price;
  let orderbook = InMemoryOrderBook[eventId]!;
  const oppSide = getOppSideString(side);
  let remainingQty = quantity;
  let oppOrders = orderbook[oppSide];
  // case1 (match with oppSide seller except pseudo sellers)
  for (let i = 0; i < oppOrders.length; i++) {
    let order = oppOrders[i]!;
    if (order.price === sellprice && remainingQty > 0) {
      let tradeQty = Math.min(remainingQty, order.quantity);
      for (let i = 0; i < order.userOrders.length; i++) {
        if (tradeQty > 0) {
          const sellerOrder = order.userOrders[i];
          const sellerQuantity = Math.min(tradeQty, sellerOrder?.quantity!);
          if (sellerOrder == undefined) {
            order.userOrders.shift();
            continue;
          }
          const sellerOrderId = sellerOrder.orderId;
          if (sellerOrderId.endsWith("+pseudo")) {
            continue;
          }

          const tradeId = createId();

          InMemoryTrades[tradeId] = {
            tradeId,
            buyerId: sellerOrder.userId,
            buyOrderId: sellerOrderId,
            buyPrice: sellprice,
            buyQuantity: sellerQuantity,
            eventId,
            sellerId: userId,
            sellOrderId: orderId,
            sellPrice: price,
            sellQuantity: sellerQuantity,
          };
          // await BroadcastChannel("trade", {
          //   ...InMemoryTrades[tradeId],
          //   item: side,
          // });

          // Balances
          sellerOrder.quantity -= sellerQuantity;
          remainingQty -= sellerQuantity;
          tradeQty -= sellerQuantity;
          if (sellerOrder.quantity == 0) {
            InMemoryOrders[sellerOrderId]!.status = "EXECUTED";
            order.userOrders.splice(i, 1);
            i--;
          }
        }
      }
    }
    if (order.quantity == 0) {
      oppOrders.splice(i, 1);
      i--;
    }
  }
  InMemoryINRBalances[userId]!.balance += (quantity - remainingQty) * price;
  if (remainingQty == 0) {
    const orderExit = {
      id: orderId,
      eventId,
      status: "EXECUTED",
    };
    await BroadcastChannel("order_exit", orderExit);
    console.log(InMemoryOrders[orderId]);
  }
  if (remainingQty > 0) {
    // sit on the orderbook
    const ordersWithMyPrice = orderbook[side].filter(
      (order) => order.price == price
    );
    if (ordersWithMyPrice.length == 0) {
      orderbook[side].push({
        price,
        quantity: remainingQty,
        userOrders: [
          {
            orderId,
            quantity: remainingQty,
            userId,
          },
        ],
      });
    } else {
      orderbook[side].forEach((order) => {
        if (order.price == price) {
          order.quantity += remainingQty;
          order.userOrders.push({
            orderId,
            quantity: remainingQty,
            userId,
          });
        }
      });
    }
  }
  const broadcastData = {
    eventId,
    orderbook: {
      Yes: orderbook.YES,
      No: orderbook.NO,
    },
  };
  await BroadcastChannel("orderbook", broadcastData);
  return;
}
