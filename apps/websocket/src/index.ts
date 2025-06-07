// if id= '>' in redis then see the messages not delivered to other consumers
//  id is != '>' then all the pending messages in history which is not processed by this consumer

import { Orderbook } from "@repo/types/src";
import { redis } from "./redis-client";
import { InMemoryOrderBook } from "./store";
import { BroadCaster } from "./broadcaster";

async function processStreams() {
  const streamName = "event_streams";
  const consumerName = "broadcast_consumer";
  let lastId = ">";

  while (true) {
    const message = await redis.xReadGroup(
      consumerName,
      "broadcast_consumer",
      [
        {
          key: streamName,
          id: lastId,
        },
      ],
      {
        BLOCK: 0,
        COUNT: 1,
      }
    );
    console.log(JSON.stringify(message, null, 2));
    if (message && Array.isArray(message) && message.length > 0) {
      const streamedMessage = message[0] as {
        name: string;
        messages: {
          id: string;
          message: Record<string, string>;
        }[];
      };
      if (
        streamedMessage &&
        Array.isArray(streamedMessage.messages) &&
        streamedMessage.messages.length > 0
      ) {
        const actuallMessages = streamedMessage.messages;

        actuallMessages.forEach(
          ({ id, message }: { id: string; message: any }) => {
            const parsedData = JSON.parse(message.data);
            const eventId = parsedData.eventId;
            console.log(`event::${eventId}`, parsedData);
            BroadCaster.getInstance().broadCast(eventId, parsedData);
          }
        );
      }
    } else {
      console.log("NO events 🥺");
    }
  }
}

processStreams();
