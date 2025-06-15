import WebSocket, { WebSocketServer } from "ws";
import { InMemoryOrderBook, InMemoryTrades } from "./store";

export class BroadCaster {
  static clients: {
    ws: WebSocket;
    eventId: string;
  }[];
  static instance: BroadCaster | null;
  constructor() {
    BroadCaster.clients = [];
    const wss = new WebSocketServer({
      port: 8080,
    });

    wss.on("connection", (ws: WebSocket) => {
      ws.on("message", async (data: WebSocket.RawData) => {
        const message = data.toString();
        console.log("Connecting message", message);
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
          if (InMemoryOrderBook[eventId]) {
            ws.send(
              JSON.stringify({
                type: "orderbook",
                data: JSON.stringify({
                  eventId: eventId,
                  orderbook: InMemoryOrderBook[eventId],
                }),
              })
            );
          }
          ws.send(
            JSON.stringify({
              type: "recentTrade",
              data: InMemoryTrades.slice(0, 6),
            })
          );
        }
      });

      ws.on("close", () => {
        BroadCaster.clients = BroadCaster.clients.filter(
          (client) => client.ws !== ws
        );
        console.log("Client disconnected.");
      });
      ws.on("error", () => {
        BroadCaster.clients = BroadCaster.clients.filter(
          (client) => client.ws !== ws
        );
        console.log("Client error - disconnected.");
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
