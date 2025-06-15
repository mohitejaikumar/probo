export interface INRBalance {
  balance: number;
  lockedBalance: number;
}

export interface UserOrders {
  quantity: number;
  userId: string;
  orderId: string;
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
  buyOrderId: string;
}

export enum Sides {
  YES,
  NO,
}

export enum OrderType {
  SELL,
  BUY,
}
