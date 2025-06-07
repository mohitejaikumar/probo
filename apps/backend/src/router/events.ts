import { createId } from "@paralleldrive/cuid2";
import { Router } from "express";
import { queue, subscriber } from "../redis-clients.js";

const router = Router();

router.get("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  if (eventId == "") {
    res.json({
      message: "eventId is not present",
    });
    return;
  }
  const messageId = createId();
  const data = JSON.stringify({
    eventId,
    messageId,
    type: "getEvent",
  });

  await subscriber.subscribe(`getEvent::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`getEvent::${messageId}`);
    if (parseData.messageId == messageId && parseData.status == "SUCCESS") {
      res.json({
        event: parseData.event,
      });
      return;
    }
    res.json({
      message: `Error fetching messageId:${messageId} event:${eventId}`,
    });
    return;
  });
  console.log(`queued the event::${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.get("/", async (req, res) => {
  const messageId = createId();
  const data = JSON.stringify({
    messageId,
    type: "getAllEvents",
  });

  await subscriber.subscribe(`getEvents::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`getEvents::${messageId}`);
    if (parseData.messageId == messageId && parseData.status == "SUCCESS") {
      res.json(parseData.events);
      return;
    }
    res.status(500).json({
      message: `Error fetching all events message:${messageId}`,
    });
    return;
  });
  console.log(`queued the event::${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.post("/initiate", async (req, res) => {
  const { userId, eventId, side, price, quantity } = req.body;

  if (!userId || !eventId || !side || !price || !quantity) {
    res.status(400).json({
      message: "invalid information",
    });
    return;
  }
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    eventId,
    side,
    price,
    quantity,
    messageId,
    type: "initiateOrder",
  });

  await subscriber.subscribe(`initiateOrder::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`initiateOrder::${messageId}`);
    if (parseData.messageId == messageId && parseData.status == "SUCCESS") {
      res.json({
        message: "Order placed Successfully",
      });
      return;
    }
    res.status(500).json({
      message: `Error placing order message:${messageId}`,
    });
    return;
  });
  console.log(`queued the event::${messageId}`);
  await queue.lPush("engineQueue", data);
});

router.post("/exit", async (req, res) => {
  const { userId, eventId, orderId, side, price, quantity } = req.body;

  if (!userId || !eventId || !orderId || !side || !price || !quantity) {
    res.status(400).json({
      message: "invalid information",
    });
    return;
  }
  const messageId = createId();
  const data = JSON.stringify({
    userId,
    eventId,
    orderId,
    side,
    price,
    quantity,
    messageId,
    type: "exitOrder",
  });

  await subscriber.subscribe(`exitOrder::${messageId}`, async (data) => {
    const parseData = JSON.parse(data);
    await subscriber.unsubscribe(`exitOrder::${messageId}`);
    if (parseData.messageId == messageId && parseData.status == "SUCCESS") {
      res.json({
        message: "Order Exited Successfully",
      });
      return;
    }
    res.status(500).json({
      message: `Error exiting order message:${messageId}`,
    });
    return;
  });
  console.log(`queued the event::${messageId}`);
  await queue.lPush("engineQueue", data);
});

export default router;
