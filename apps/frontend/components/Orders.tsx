"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { OrderInterface } from "@repo/types";

interface Order {
  id: string;
  item: "YES" | "NO";
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
}

interface OrdersProps {
  eventId: string;
}

function getOppositeSide(side: string) {
  if (side == "YES") return "NO";
  else return "YES";
}

const Orders: React.FC<OrdersProps> = ({ eventId }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const handleExitOrder = async (
    orderId: string,
    price: number,
    eventId: string,
    quantity: number,
    side: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/event/exit`,
        {
          userId,
          eventId,
          orderId,
          side: (orderId.endsWith("+pseudo")
            ? getOppositeSide(side)
            : side
          ).toUpperCase(),
          price,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.jwtToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [orders, setOrders] = useState<OrderInterface[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/user/orders/${userId}/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.jwtToken}`,
            },
          }
        );
        console.log("response", response.data);
        setOrders(response.data.orders);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchOrders();
  }, [eventId, userId]);
  console.log("orders", orders);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 mt-4 max-h-[1000px] overflow-y-auto">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table Header - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 pb-2 border-b border-neutral-200 text-sm font-medium text-neutral-600 ">
            <div>Item</div>
            <div>Side</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Action</div>
          </div>

          {/* Orders List */}
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border border-neutral-200 rounded-lg p-3 md:p-0 md:border-none md:rounded-none mx-2">
              {/* Mobile Layout */}
              <div className="md:hidden space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.side === "YES"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {order.side}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.type === "BUY"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}>
                      {order.type}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleExitOrder(
                        order.orderId,
                        order.price,
                        eventId,
                        order.quantity,
                        order.side
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors">
                    Exit
                  </button>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Price: ₹{order.price}</span>
                  <span>Qty: {order.quantity}</span>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-5 gap-4 py-3 items-center text-sm">
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.side === "YES"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {order.side}
                  </span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.type === "BUY"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                    {order.type}
                  </span>
                </div>
                <div className="text-neutral-800">₹{order.price}</div>
                <div className="text-neutral-600">{order.quantity}</div>
                <div>
                  <button
                    onClick={() =>
                      handleExitOrder(
                        order.orderId,
                        order.price,
                        eventId,
                        order.quantity,
                        order.side
                      )
                    }
                    className={`cursor-pointer ${
                      order.status == "PENDING"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white text-xs px-3 py-1 rounded transition-colors`}
                    disabled={order.status == "PENDING"}>
                    {order.status == "PENDING" ? "Pending" : "Exit"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
