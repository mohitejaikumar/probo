import WebSocket from "ws";
import { InMemoryOrderBook } from "./store";

export class BroadCaster {
  static wss: WebSocket.Server;
  static clients: {
    ws: WebSocket;
    eventId: string;
  }[];
  static instance: BroadCaster | null;
  constructor() {
    BroadCaster.clients = [];
    BroadCaster.wss = new WebSocket.Server({
      port: 8080,
    });

    BroadCaster.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", async (message: string) => {
        const parseMessage = JSON.parse(message);
        const eventId = parseMessage.eventId;
        if (eventId) {
          // add this to clients and send the latest orderbook and whenever there
          // is update just send the all the clients
          const isClientExists = BroadCaster.clients.find(
            (client) => client.ws === ws && client.eventId === eventId
          );
          if (!isClientExists) {
            BroadCaster.clients.push({ ws, eventId: eventId });
          }
          if (!InMemoryOrderBook[eventId]) {
            ws.send(JSON.stringify(InMemoryOrderBook[eventId]));
          } else {
            ws.send("null");
          }
        }
      });

      ws.on("close", () => {
        BroadCaster.clients = BroadCaster.clients.filter(
          (client) => client.ws !== ws
        );
        console.log("Client disconnected.");
      });
    });
  }

  static getInstance() {
    if (!BroadCaster.instance) {
      BroadCaster.instance = new BroadCaster();
    }
    return BroadCaster.instance;
  }

  broadCast(eventId: string, data: any) {
    BroadCaster.clients.forEach((client) => {
      if (
        client.eventId == eventId &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }
}
