import { Orderbook, Trades } from "@repo/types/src";

export const InMemoryOrderBook: { [eventId: string]: Orderbook } = {};
export const InMemoryTrades: (Trades & {
  item: "YES" | "NO";
  isPseudoMatch: boolean;
})[] = [];
