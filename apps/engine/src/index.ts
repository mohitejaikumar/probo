import express from "express";
import cors from "cors";
import { queue } from "./redis-clients";

const app = express();

app.use(express.json());
app.use(cors());

async function processingQueue() {
  while (true) {
    const data = await queue.brPop("eventQueue", 0);
    if (!data) continue;
    const { element } = data;
    const message = JSON.parse(element);
    console.log(message);

    const { type } = message;

    switch (type) {
      case "userCreation":
        break;
    }
  }
}

app.listen(3001, () => {
  console.log("Engine listening on port 3001");
});
