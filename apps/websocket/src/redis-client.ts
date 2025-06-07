import { createClient } from "redis";

export const redis = createClient();

async function startEngine() {
  await redis.connect().then(() => {
    console.log("redis client Connected");
  });

  redis.on("error", () => {
    console.log("Error occured in redis");
  });
}

startEngine();
