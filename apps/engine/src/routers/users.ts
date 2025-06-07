import { publisher } from "../redis-clients";
import { InMemoryINRBalances } from "../store";

export async function userCreation(message: any) {
  const { messageId, userId } = message;
  if (!InMemoryINRBalances[userId]) {
    /*
    1. check if it is in db
        - if it is in db get balance data and store it inmemory
    2. if it is not in db 
        - store inmemory and create new row in db
    */

    InMemoryINRBalances[userId] = {
      balance: 0,
      lockedBalance: 0,
    };

    const data = JSON.stringify({
      status: "SUCCESS",
      messageId: messageId,
    });
    await publisher.publish(`userCreation::${messageId}`, data);
  } else {
    const data = JSON.stringify({
      status: "FAILED",
      messageId: messageId,
    });
    await publisher.publish(`userCreation::${messageId}`, data);
  }
}

export async function userLogin(message: any) {
  const { messageId, userId } = message;
  /*
    1. check if it is in db
        - if it is in db get balance data and store it inmemory
    2. if it is not in db 
        - return failed 
  */
  if (!InMemoryINRBalances[userId]) {
    InMemoryINRBalances[userId] = {
      balance: 0,
      lockedBalance: 0,
    };

    // TODO: prisma call

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
