import prisma from "@repo/db";
import { createClient } from "redis";

const redis = createClient();

redis
  .connect()
  .then(() => {
    console.log("redis connected");
  })
  .catch((err) => {
    console.log("error in redis connection", err);
  });

async function startArchiever() {
  const eventGroup = "event_streams";
  const consumerGroup = "archiever_consumer";
  let lastId = ">";

  while (true) {
    const message = await redis.xReadGroup(
      consumerGroup,
      "archiever_consumer",
      [{ key: eventGroup, id: lastId }],
      { BLOCK: 0, COUNT: 1 }
    );

    if (message && Array.isArray(message) && message.length > 0) {
      const streamedMessage = message[0] as {
        name: string;
        messages: {
          id: string;
          message: Record<string, string>;
        }[];
      };
      if (
        streamedMessage &&
        Array.isArray(streamedMessage.messages) &&
        streamedMessage.messages.length > 0
      ) {
        const actuallMessages = streamedMessage.messages;

        actuallMessages.forEach(
          async ({ id, message }: { id: string; message: any }) => {
            console.log("message", message);
            const parsedData = JSON.parse(message.data);
            console.log("parsedData", parsedData);

            if (message.type == "order_creation") {
              try {
                const order = await prisma.order.upsert({
                  where: {
                    id: parsedData.orderId,
                  },
                  update: {
                    userId: parsedData.userId,
                    eventId: parsedData.eventId,
                    side: parsedData.side,
                    price: parsedData.price,
                    quantity: parsedData.quantity,
                    status: parsedData.status,
                    createdAt: new Date(parsedData.timestamp),
                    type: parsedData.type,
                  },
                  create: {
                    id: parsedData.orderId,
                    userId: parsedData.userId,
                    eventId: parsedData.eventId,
                    side: parsedData.side,
                    price: parsedData.price,
                    quantity: parsedData.quantity,
                    status: parsedData.status,
                    createdAt: new Date(parsedData.timestamp),
                    type: parsedData.type,
                  },
                });
                console.log("order saved", order);
              } catch (err) {
                console.log("error: ", err);
              }
            } else if (
              message.type == "trade" ||
              message.type == "exit_trade"
            ) {
              try {
                await prisma.$transaction(async (tx) => {
                  const trade = await tx.trade.upsert({
                    where: {
                      id: parsedData.tradeId,
                    },
                    update: {
                      buyerId: parsedData.buyerId,
                      buyerOrderId: parsedData.buyOrderId,
                      buyPrice: parsedData.buyPrice,
                      sellerId: parsedData.sellerId,
                      sellerOrderId: parsedData.sellOrderId,
                      sellPrice: parsedData.sellPrice,
                      buyQty: parsedData.buyQuantity,
                      sellQty: parsedData.sellQuantity,
                      eventId: parsedData.eventId,
                      createdAt: new Date(parsedData.timestamp),
                    },
                    create: {
                      id: parsedData.tradeId,
                      buyerId: parsedData.buyerId,
                      buyerOrderId: parsedData.buyOrderId,
                      buyPrice: parsedData.buyPrice,
                      sellerId: parsedData.sellerId,
                      side: parsedData.side,
                      sellerOrderId: parsedData.sellOrderId,
                      sellPrice: parsedData.sellPrice,
                      buyQty: parsedData.buyQuantity,
                      sellQty: parsedData.sellQuantity,
                      eventId: parsedData.eventId,
                      createdAt: new Date(parsedData.timestamp),
                    },
                  });
                  console.log("trade saved", trade);
                  const yesPrice =
                    parsedData.side === "YES"
                      ? parsedData.sellPrice
                      : 10 - parsedData.sellPrice;
                  const noPrice = 10 - yesPrice;
                  console.log("yesPrice", yesPrice);
                  console.log("noPrice", noPrice);
                  await tx.event.update({
                    where: {
                      id: parsedData.eventId,
                    },
                    data: {
                      yesPrice: {
                        push: yesPrice,
                      },
                      noPrice: {
                        push: noPrice,
                      },
                    },
                  });
                  // matched quantity update
                  if (message.type == "exit_trade") {
                    await tx.order.updateMany({
                      where: {
                        id: {
                          in: [parsedData.buyOrderId, parsedData.sellOrderId],
                        },
                      },
                      data: {
                        matchedQuantity: {
                          decrement: parsedData.buyQuantity,
                        },
                      },
                    });
                  }
                });
              } catch (err) {
                console.log("Error: ", err);
              }
            } else if (message.type == "pseudo_order_creation") {
              try {
                await prisma.$transaction(async (tx) => {
                  const originalOrder = await tx.order.findUnique({
                    where: {
                      id: parsedData.orderId,
                    },
                  });
                  if (!originalOrder) {
                    return;
                  }
                  const pseudoOrder = await tx.order.upsert({
                    where: {
                      id: parsedData.pseudoOrderId,
                    },
                    update: {
                      id: parsedData.pseudoOrderId,
                      userId: originalOrder.userId,
                      eventId: originalOrder.eventId,
                      side: parsedData.side,
                      price: originalOrder.price,
                      quantity: parsedData.remainingQty,
                      matchedQuantity: 0,
                      createdAt: new Date(originalOrder.createdAt),
                      type: "SELL",
                    },
                    create: {
                      ...originalOrder,
                      id: parsedData.pseudoOrderId,
                      side: parsedData.side,
                      type: "SELL",
                      quantity: parsedData.remainingQty,
                    },
                  });
                  await tx.order.update({
                    where: {
                      id: parsedData.orderId,
                    },
                    data: {
                      quantity: {
                        decrement: parsedData.remainingQty,
                      },
                    },
                  });
                });
              } catch (err) {
                console.log("Error: ", err);
              }
            } else if (message.type == "order_matched") {
              try {
                await prisma.order.update({
                  where: {
                    id: parsedData.id,
                  },
                  data: {
                    type: parsedData.type,
                    status: parsedData.status,
                  },
                });
              } catch (error) {
                console.log("error in order_matched", error);
              }
            } else if (message.type == "order_executed") {
              try {
                await prisma.order.update({
                  where: {
                    id: parsedData.id,
                  },
                  data: {
                    status: parsedData.status,
                  },
                });
              } catch (err) {
                console.log("error in order_executed", err);
              }
            } else if (message.type == "update_stock_balance") {
              try {
                await prisma.stockBalance.upsert({
                  where: {
                    userId_eventId: {
                      userId: parsedData.userId,
                      eventId: parsedData.eventId,
                    },
                  },
                  update: {
                    yesQty: parsedData.yesQty,
                    noQty: parsedData.noQty,
                  },
                  create: {
                    userId: parsedData.userId,
                    eventId: parsedData.eventId,
                    yesQty: parsedData.yesQty,
                    noQty: parsedData.noQty,
                  },
                });
              } catch (err) {
                console.log("Error: ", err);
              }
            } else if (message.type == "order_update") {
              try {
                await prisma.$transaction(async (tx) => {
                  await tx.order.updateMany({
                    where: {
                      id: {
                        in: [parsedData.sellerOrderId, parsedData.buyerOrderId],
                      },
                    },
                    data: {
                      matchedQuantity: {
                        increment: parsedData.matchedQuantity,
                      },
                    },
                  });

                  await tx.order.update({
                    where: {
                      id: parsedData.sellerOrderId,
                    },
                    data: {
                      status: parsedData.status,
                    },
                  });
                });
              } catch (err) {
                console.log("Error: ", err);
              }
            } else if (message.type == "balance_update") {
              try {
                await prisma.user.update({
                  where: {
                    id: parsedData.userId,
                  },
                  data: {
                    balance: {
                      increment: parsedData.isBalanceIncrement
                        ? parsedData.balance
                        : 0,
                      decrement: parsedData.isBalanceIncrement
                        ? 0
                        : parsedData.balance,
                    },
                    lockedBalance: {
                      increment: parsedData.isLockedBalanceIncrement
                        ? parsedData.lockedBalance
                        : 0,
                      decrement: parsedData.isLockedBalanceIncrement
                        ? 0
                        : parsedData.lockedBalance,
                    },
                  },
                });
              } catch (err) {
                console.log("error updating balance");
              }
            }

            // ACK
            await redis.xAck(eventGroup, consumerGroup, id);
          }
        );
      }
    } else {
      console.log("NO events 🥺");
    }
  }
}

startArchiever();
