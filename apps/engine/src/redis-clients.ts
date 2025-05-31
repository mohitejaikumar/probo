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

  await inititalizeStremGroups();
}

async function inititalizeStremGroups() {
  try {
    await publisher.xGroupCreate("event_stream", "ws_broadcaster", "$", {
      MKSTREAM: true,
    });
  } catch (error: any) {
    if (error.message.includes("BUSYGROUP")) {
      console.log("Consumer grp already exists");
    }
    console.log(error);
  }
}

export async function BroadcastChannel(eventType: string, data: any) {
  const streamData = {
    type: eventType,
    data: JSON.stringify(data),
  };

  await publisher.xAdd("event_stream", "*", streamData);
}

startEngine();
