import { createId } from "@paralleldrive/cuid2";
import { Router } from "express";
import { queue, subscriber } from "../redis-clients.js";
import handleMiddleWare from "../middleware.js";

const router = Router();

router.post("/login", handleMiddleWare, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.json({
      message: "invalid information",
    });
    return;
  }
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    messageId,
    type: "userLogin",
  });

  await subscriber.subscribe(`userLogin::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`userLogin::${messageId}`);
    if ((parseData.messageId = messageId && parseData.status == "SUCCESS")) {
      console.log("user login success");
      res.json({
        message: "user login successfull",
      });
      return;
    }
    console.log("user login failed");
    res.status(404).json({
      message: "User not found",
    });
    return;
  });
  console.log(`queued event:${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.post("/signUp", handleMiddleWare, async (req, res) => {
  const { userId } = req.body;
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    messageId,
    type: "userCreation",
  });

  await subscriber.subscribe(`userCreation::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`userCreation::${messageId}`);
    if ((parseData.messageId = messageId && parseData.status == "SUCCESS")) {
      res.json({
        message: "user created successfully",
      });
      return;
    }
    res.status(500).json({
      message: "User not created",
    });
    return;
  });
  console.log(`queued event:${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.post("/recharge", handleMiddleWare, async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    res.status(400).json({
      message: "Invalid Information",
    });
  }
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    amount,
    messageId,
    type: "userRecharge",
  });

  await subscriber.subscribe(`userRecharge::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`userRecharge::${messageId}`);
    if ((parseData.messageId = messageId && parseData.status == "SUCCESS")) {
      res.json({
        message: `User has intotal: ${parseData.balance}`,
      });
      return;
    }
    res.status(404).json({
      message: "User recharge failed",
    });
    return;
  });
  console.log(`queued event:${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.get("/balance/:userId", handleMiddleWare, async (req, res) => {
  const userId = req.params.userId;

  if (userId == "") {
    res.status(400).json({
      message: "userId not present",
    });
  }
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    messageId,
    type: "userBalance",
  });

  await subscriber.subscribe(`userBalance::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`userBalance::${messageId}`);
    if ((parseData.messageId = messageId && parseData.status == "SUCCESS")) {
      res.json({
        message: `User has intotal: ${parseData.balance}`,
        balance: parseData.balance,
      });
      return;
    }
    res.status(404).json({
      message: "Error fetching user balance",
    });
    return;
  });
  console.log(`queued event:${messageId}`);
  await queue.lPush("engineQueue", data);
});

export default router;
