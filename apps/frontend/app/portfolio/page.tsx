import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Order {
  id: string;
  imageURL: string;
  description: string;
  entry: number;
  exit: number;
}

interface Orders {
  id: string;
  imageURL: string;
  description: string;
  entry: number;
  exit: number;
}

async function getOrders(userId: string) {
  const orders: Orders[] = [];
  const userOrders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: true,
    },
  });
  const userTrades = await prisma.trade.findMany({
    where: {
      sellerId: userId,
      sellerOrderId: {
        in: userOrders.map((order) => order.id),
      },
    },
  });

  for (const order of userOrders) {
    const trade = userTrades.find((trade) => trade.sellerOrderId === order.id);
    if (trade) {
      orders.push({
        id: order.id,
        imageURL: order.event.title,
        description: order.event.description,
        entry: order.price,
        exit: trade.sellPrice,
      });
    }
  }
  return orders;
}

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    redirect("/");
  }
  const orders = await getOrders(session.user.id);
  return (
    <div className="mx-auto p-4 md:px-6 lg:px-8 pt-[10vh] bg-[#F3F3F3] max-w-[1200px]">
      {orders.length > 0 && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              My Portfolio
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Track your trading positions and performance
            </p>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {order.imageURL}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium  leading-tight mb-3">
                        {order.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Entry
                          </p>
                          <p className="text-sm font-semibold">
                            ₹{order.entry}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Exit
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              order.entry > order.exit
                                ? "text-red-500"
                                : "text-green-500"
                            }`}>
                            ₹{order.exit}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            P&L
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              order.entry > order.exit
                                ? "text-red-500"
                                : "text-green-500"
                            }`}>
                            {order.entry > order.exit ? "-" : "+"}₹
                            {Math.abs(order.exit - order.entry).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tablet and Desktop View */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle>Trading Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold text-sm text-muted-foreground">
                          Event
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-sm text-muted-foreground">
                          Entry
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-sm text-muted-foreground">
                          Exit
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-sm text-muted-foreground">
                          P&L
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="text-xl flex-shrink-0">
                                {order.imageURL}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium  leading-tight">
                                  {order.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span className="text-sm font-semibold">
                              ₹{order.entry}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span
                              className={`text-sm font-semibold ${
                                order.entry > order.exit
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}>
                              ₹{order.exit}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span
                              className={`text-sm font-semibold ${
                                order.entry > order.exit
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}>
                              {order.entry > order.exit ? "-" : "+"}₹
                              {Math.abs(order.exit - order.entry).toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="mb-8">
            <div className="relative">
              {/* Scroll/Paper illustration */}
              <div className="w-48 h-32 bg-white border-2 border-gray-300 rounded-lg shadow-lg transform rotate-2 mb-4">
                <div className="absolute top-2 left-2 w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="absolute top-6 left-4 right-4 h-0.5 bg-gray-200"></div>
                <div className="absolute top-10 left-4 right-8 h-0.5 bg-gray-200"></div>
                <div className="absolute top-14 left-4 right-12 h-0.5 bg-gray-200"></div>
                <div className="absolute top-18 left-4 right-6 h-0.5 bg-gray-200"></div>
              </div>

              {/* Cat illustration */}
              <div className="absolute -bottom-6 -left-8 text-6xl transform -rotate-12">
                🐱
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 text-2xl">✨</div>
              <div className="absolute -bottom-4 right-4 text-xl">💫</div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Nothing to see here... yet
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              Your active trades will appear here once you start trading
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>🎯 Place your first trade to get started</p>
              <p>📊 Track your portfolio performance</p>
              <p>💰 Monitor your profits and losses</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
