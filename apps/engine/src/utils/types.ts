import {
  Events,
  INRBalance,
  Orderbook,
  OrderInterface,
  Trades,
} from "@repo/types";

export const InMemoryOrderBook: { [eventId: string]: Orderbook } = {};
export const InMemoryOrders: { [orderId: string]: OrderInterface } = {};
export const InMemoryTrades: { [tradeId: string]: Trades } = {};
export const InMemoryEvents: { [eventId: string]: Events } = {};
export const InMemoryINRBalance: { [userId: string]: INRBalance } = {};
