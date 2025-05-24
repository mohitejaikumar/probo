import {
  Event,
  INRBalance,
  Orderbook,
  OrderInterface,
  Trades,
} from "@repo/types";

export const InMemoryOrderBook: { [eventId: string]: Orderbook } = {};
export const InMemoryEvents: { [eventId: string]: Event } = {};
export const InMemoryINRBalances: { [userId: string]: INRBalance } = {};
export const InMemoryTrades: { [tradeId: string]: Trades } = {};
export const InMemoryOrders: { [orderId: string]: OrderInterface } = {};
