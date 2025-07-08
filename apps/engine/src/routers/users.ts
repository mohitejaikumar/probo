import { publisher } from "../redis-clients";
import { InMemoryINRBalances } from "../store";
import prisma from "@repo/db";

export async function userCreation(message: any) {
  const { messageId, userId } = message;
  if (!InMemoryINRBalances[userId]) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (user) {
        InMemoryINRBalances[userId] = {
          balance: user.balance,
          lockedBalance: user.lockedBalance,
        };
      } else {
        const data = JSON.stringify({
          status: "FAILED",
          messageId: messageId,
        });
        await publisher.publish(`userCreation::${messageId}`, data);
        return;
      }
    } catch (err) {
      console.log("Error: ", err);
      const data = JSON.stringify({
        status: "FAILED",
        messageId: messageId,
      });
      await publisher.publish(`userCreation::${messageId}`, data);
    }

    const data = JSON.stringify({
      status: "SUCCESS",
      messageId: messageId,
    });
    await publisher.publish(`userCreation::${messageId}`, data);
  }
}

export async function userLogin(message: any) {
  const { messageId, userId } = message;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user) {
    InMemoryINRBalances[userId] = {
      balance: user.balance,
      lockedBalance: user.lockedBalance,
    };

    const data = JSON.stringify({
      status: "SUCCESS",
      messageId: messageId,
    });
    await publisher.publish(`userLogin::${messageId}`, data);
  } else {
    const data = JSON.stringify({
      status: "FAILED",
      messageId: messageId,
    });
    await publisher.publish(`userLogin::${messageId}`, data);
  }
}

export async function userRecharge(message: any) {
  const { messageId, amount, userId } = message;

  if (InMemoryINRBalances[userId]) {
    InMemoryINRBalances[userId].balance += amount;

    const data = JSON.stringify({
      status: "SUCCESS",
      messageId,
      balance: InMemoryINRBalances[userId].balance,
    });
    console.log(InMemoryINRBalances);
    await publisher.publish(`userRecharge::${messageId}`, data);
  } else {
    const data = JSON.stringify({
      status: "FAILED",
      messageId,
    });
    await publisher.publish(`userRecharge::${messageId}`, data);
  }
}

export async function userBalance(message: any) {
  const { messageId, userId } = message;

  if (InMemoryINRBalances[userId]) {
    const data = JSON.stringify({
      status: "SUCCESS",
      messageId,
      balance: InMemoryINRBalances[userId].balance,
    });
    console.log(InMemoryINRBalances);
    await publisher.publish(`userBalance::${messageId}`, data);
  } else {
    const data = JSON.stringify({
      status: "FAILED",
      messageId,
    });
    await publisher.publish(`userBalance::${messageId}`, data);
  }
}
