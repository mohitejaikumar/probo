import { createClient } from "redis";

export const queue = createClient();
export const publisher = createClient();

async function startEngine() {
  await queue.connect().then(() => {
    console.log("connected to engine::queue ");
  });

  await publisher.connect().then(() => {
    console.log("connected to engine::publisher");
  });

  queue.on("error", (error) => {
    console.log("Error occured in queue", error);
  });

  publisher.on("error", (error) => {
    console.log("Error occured in publisher", error);
  });
}

startEngine();
