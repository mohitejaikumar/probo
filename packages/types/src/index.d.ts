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
    side: Sides;
    type: OrderType;
    status: string;
    price: number;
    quantity: number;
}
export interface Event {
    title: string;
    description: string;
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
export declare enum Sides {
    YES = 0,
    NO = 1
}
export declare enum OrderType {
    SELL = 0,
    BUY = 1
}
//# sourceMappingURL=index.d.ts.map