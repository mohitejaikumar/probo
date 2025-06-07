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
  exitOrder,
  getAllEvents,
  getEvent,
  initiateOrder,
} from "./routers/events";

const app = express();

app.use(express.json());
app.use(cors());

async function processingQueue() {
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
    }
  }
}

processingQueue();

app.listen(3001, () => {
  console.log("Engine listening on port 3001");
});
