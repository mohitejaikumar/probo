import { createClient } from "redis";

export const queue = createClient();
export const subscriber = createClient();

async function startRedis() {
  await queue.connect().then(() => {
    console.log("connected to backend::queue ");
  });

  await subscriber.connect().then(() => {
    console.log("connected to backend::publisher");
  });

  queue.on("error", (error) => {
    console.log("Error occured in backend::queue", error);
  });

  subscriber.on("error", (error) => {
    console.log("Error occured in backend::publisher", error);
  });
}

startRedis();
