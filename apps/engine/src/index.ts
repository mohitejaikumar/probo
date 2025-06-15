import express from "express";
import cors from "cors";
import { queue } from "./redis-clients";
import {
  userBalance,
  userCreation,
  userLogin,
  userRecharge,
} from "./routers/users";
import {
  createEvent,
  exitOrder,
  getAllEvents,
  getEvent,
  initiateOrder,
} from "./routers/events";
import prisma from "@repo/db";
import {
  InMemoryEvents,
  InMemoryINRBalances,
  InMemoryOrderBook,
  InMemoryOrders,
  InMemoryTrades,
} from "./store";

const app = express();

app.use(express.json());
app.use(cors());

async function processingQueue() {
  await getAllData();
  while (true) {
    const data = await queue.brPop("engineQueue", 0);
    if (!data) continue;
    const { element } = data;
    const message = JSON.parse(element);
    console.log(message);

    const { type } = message;

    switch (type) {
      case "userCreation":
        await userCreation(message);
        break;
      case "userLogin":
        await userLogin(message);
        break;
      case "userBalance":
        await userBalance(message);
        break;
      case "userRecharge":
        await userRecharge(message);
        break;
      case "getAllEvents":
        await getAllEvents(message);
        break;
      case "getEvent":
        await getEvent(message);
        break;
      case "initiateOrder":
        await initiateOrder(message);
        break;
      case "exitOrder":
        await exitOrder(message);
        break;
      case "eventCreation":
        await createEvent(message);
    }
  }
}

processingQueue();

app.listen(3002, () => {
  console.log("Engine listening on port 3001");
});

async function getAllData() {
  const allEvents = await prisma.event.findMany({});
  console.log("allEvents: ", allEvents);
  allEvents.forEach((event) => {
    InMemoryEvents[event.id] = {
      description: event.description,
      endTime: event.endTime,
      title: event.title,
    };
    InMemoryOrderBook[event.id] = {
      NO: [],
      YES: [],
    };
  });

  const allUsers = await prisma.user.findMany({
    include: {
      orders: {
        where: {
          event: {
            endTime: {
              gt: new Date(),
            },
          },
        },
      },
      boughtTrade: {
        where: {
          event: {
            endTime: {
              gt: new Date(),
            },
          },
        },
      },
      sellTrade: {
        where: {
          event: {
            endTime: {
              gt: new Date(),
            },
          },
        },
      },
    },
  });

  console.log("alldata: ", allUsers);

  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i]!;
    // setup everything from memory to here
    // get all the orders
    InMemoryINRBalances[user.id] = {
      balance: user.balance,
      lockedBalance: user.lockedBalance,
    };
    user.sellTrade.map((item) => {
      InMemoryTrades[item.id] = {
        buyerId: item.buyerId,
        buyOrderId: item.buyerOrderId,
        buyPrice: item.buyPrice,
        buyQuantity: item.buyQty,
        eventId: item.eventId,
        sellerId: item.sellerId,
        sellOrderId: item.sellerOrderId,
        sellPrice: item.sellPrice,
        sellQuantity: item.sellQty,
        tradeId: item.id,
      };
    });
    user.boughtTrade.map((item) => {
      InMemoryTrades[item.id] = {
        buyerId: item.buyerId,
        buyOrderId: item.buyerOrderId,
        buyPrice: item.buyPrice,
        buyQuantity: item.buyQty,
        eventId: item.eventId,
        sellerId: item.sellerId,
        sellOrderId: item.sellerOrderId,
        sellPrice: item.sellPrice,
        sellQuantity: item.sellQty,
        tradeId: item.id,
      };
    });
    user.orders.map((item) => {
      InMemoryOrders[item.id] = {
        eventId: item.eventId,
        orderId: item.id,
        price: item.price,
        quantity: item.quantity,
        side: item.side,
        status: item.status,
        type: item.type,
        userId: item.userId,
      };
    });
    user.orders.map((item) => {
      const side = item.side;
      if (InMemoryOrderBook[item.eventId] == undefined) {
        InMemoryOrderBook[item.eventId] = {
          YES: [],
          NO: [],
        };
      }
      let orderAppended = false;
      InMemoryOrderBook[item.eventId]![side]!.map((item2) => {
        if (item2.price == item.price) {
          orderAppended = true;
          let userOrder = item2.userOrders.find(
            (item3) => item3.orderId === item.id
          );
          if (!userOrder) {
            item2.userOrders.push({
              orderId: item.id,
              quantity: item.quantity,
              userId: item.userId,
            });
          }
        }
      });
      if (orderAppended) {
        InMemoryOrderBook[item.eventId]![side]!.push({
          price: item.price,
          quantity: item.quantity,
          userOrders: [
            {
              orderId: item.id,
              quantity: item.quantity,
              userId: item.userId,
            },
          ],
        });
      }
    });
  }
}
