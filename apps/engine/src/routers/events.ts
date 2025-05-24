import { createId } from "@paralleldrive/cuid2";
import { publisher } from "../redis-clients";
import {
  InMemoryEvents,
  InMemoryINRBalances,
  InMemoryOrderBook,
  InMemoryOrders,
} from "../store";
import { OrderType, Sides } from "@repo/types";

export async function getAllEvents(message: any) {
  const { messageId } = message;
  const data = JSON.stringify({
    messageId,
    events: InMemoryEvents,
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
      event: InMemoryEvents[eventId],
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
    InMemoryINRBalances[userId] ||
    InMemoryINRBalances[userId]!.balance < price * quantity ||
    !InMemoryOrderBook[eventId]
  ) {
    const data = JSON.stringify({
      messageId,
      status: "FAILED",
    });
    publisher.publish("initiateOrder", data);
    return;
  }
  // Add entry to orders
  const orderId = createId();
  InMemoryOrders[orderId] = {
    side: side == "yes" ? Sides.YES : Sides.NO,
    type: OrderType.BUY,
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

  const data = JSON.stringify({
    messageId,
    status: "SUCCESS",
  });
  publisher.publish("initiateOrder", data);
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
  const oppType = side === "YES" ? "NO" : "YES";
  const sortedOrders = orderbook[side].sort((a, b) => a.price - b.price);
  const cost = price * quantity;

  let remainingQty = quantity;

  InMemoryINRBalances[userId]!.balance -= cost;
  InMemoryINRBalances[userId]!.lockedBalance += cost;

  for (let order of sortedOrders) {
    if (order.price <= price && remainingQty > 0){
      // 
      if (order.price === price && order.quantity === 0) {
        orderbook[oppType].forEach(async (oppOrder)=>{

        })
      }
    }
  }
};
