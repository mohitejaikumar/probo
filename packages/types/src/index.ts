export interface INRBalance {
  balance: number;
  lockedBalance: number;
}

export interface UserOrders {
  quantity: number;
  userId: string;
  orderId: string;
  timestamp: Date;
}

export interface Order {
  price: number;
  quantity: number;
  userOrders: UserOrders[];
}

export interface Orderbook {
  YES: Order[];
  NO: Order[];
}

export interface OrderInterface {
  orderId: string;
  userId: string;
  eventId: string;
  side: "YES" | "NO";
  type: "BUY" | "SELL";
  status: string;
  price: number;
  quantity: number;
  timestamp: Date;
}

export interface Event {
  title: string;
  description: string;
  endTime: Date;
}

export interface Trades {
  tradeId: string;
  sellerId: string;
  buyerId: string;
  eventId: string;
  sellQuantity: number;
  buyQuantity: number;
  sellPrice: number;
  buyPrice: number;
  sellOrderId: string;
  side: "YES" | "NO";
  buyOrderId: string;
  timestamp: Date;
}

export enum Sides {
  YES,
  NO,
}

export enum OrderType {
  SELL,
  BUY,
}
