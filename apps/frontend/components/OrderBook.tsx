"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

import Activity from "@/components/Activity";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Orderbook } from "@repo/types";
import { ArrowRightLeft } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePrice } from "@/contexts/PriceContext";

interface RecentActivity {
  tradeId: string;
  yesUserId: string;
  noUserId: string;
  yesPrice: number;
  noPrice: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function OrderBook({ eventId }: { eventId: string }) {
  const [subTab, setSubTab] = useState("Order Book");
  const [selectedOrderType, setSelectedOrderType] = useState("NO");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderbook, setOrderBook] = useState<Orderbook | null>(null);
  const [totalYesQty, setTotalYesQty] = useState<number>(0);
  const [totalNoQty, setTotalNoQty] = useState<number>(0);
  const [yesProbability, setYesProbability] = useState<number[]>([]);
  const [noProbability, setNoProbability] = useState<number[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const { setLMSRPrices } = usePrice();

  function getProbability(yesQty: number, noQty: number, b: number) {
    const expYES = Math.exp(yesQty / b);
    const expNO = Math.exp(noQty / b);
    const priceYES = expYES / (expYES + expNO);
    const priceNO = expNO / (expYES + expNO);
    return {
      YES: Math.round(priceNO * 100 * 2) / 2,
      NO: Math.round(priceYES * 100 * 2) / 2,
    };
  }

  function setPrices(yesPrice: number, noPrice: number) {
    setLMSRPrices(yesPrice, noPrice);
  }

  useLayoutEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, []);

  useEffect(() => {
    if (orderbook) {
      setTotalYesQty(() =>
        orderbook.YES.reduce((acc, item) => {
          return item.quantity + acc;
        }, 0)
      );

      setTotalNoQty(() =>
        orderbook.NO.reduce((acc, item) => {
          return item.quantity + acc;
        }, 0)
      );
    }
  }, [orderbook]);

  const getBarWidth = (quantity: number, maxQuantity: number) => {
    return `${Math.min((quantity / maxQuantity) * 100, 100)}%`;
  };

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BROADCASTER_URL}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ eventId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data?.type == "trade") {
        const ws_data = JSON.parse(data.data);
        if (ws_data.isPseudoMatch) {
          setRecentActivity((prev) => {
            return [
              {
                tradeId: ws_data.tradeId,
                noPrice:
                  ws_data.item == "NO"
                    ? ws_data.sellPrice
                    : 10 - ws_data.sellPrice,
                yesPrice:
                  ws_data.item == "YES"
                    ? ws_data.sellPrice
                    : 10 - ws_data.sellPrice,
                noUserId:
                  ws_data.item == "NO" ? ws_data.buyerId : ws_data.sellerId,
                yesUserId:
                  ws_data.item == "YES" ? ws_data.buyerId : ws_data.sellerId,
              },
              ...prev,
            ].slice(0, 6);
          });
        }
        const yesPrice =
          ws_data.side === "YES" ? ws_data.sellPrice : 10 - ws_data.sellPrice;
        const noPrice = 10 - yesPrice;
        setPrices(yesPrice, noPrice);
        setYesProbability((prev) => [...prev, yesPrice * 10]);
        setNoProbability((prev) => [...prev, noPrice * 10]);
        setTimeSeriesData((prev) => {
          return [
            ...prev,
            new Date(ws_data.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          ];
        });
      }
      if (data?.type == "orderbook") {
        const ws_data = JSON.parse(data.data);
        console.log("ws_orderbook", ws_data);
        setOrderBook(ws_data.orderbook);
      }
      if (data?.type == "recentTrade") {
        let recentTrades: RecentActivity[] = [];
        let timestamps: number[] = [];
        let yesPrice: number | null = null;
        let noPrice: number | null = null;
        //@ts-ignore
        data.data.map((trade) => {
          recentTrades.push({
            tradeId: trade.tradeId,
            noPrice:
              trade.item == "NO" ? trade.sellPrice : 10 - trade.sellPrice,
            yesPrice:
              trade.item == "YES" ? trade.sellPrice : 10 - trade.sellPrice,
            noUserId: trade.item == "NO" ? trade.buyerId : trade.sellerId,
            yesUserId: trade.item == "YES" ? trade.buyerId : trade.sellerId,
          });
          timestamps.push(new Date(trade.timestamp).getTime());
          let yPrice =
            trade.side === "YES" ? trade.sellPrice : 10 - trade.sellPrice;
          let nPrice = 10 - yPrice!;
          if (!yesPrice && !noPrice) {
            console.log("setting prices", yPrice, nPrice);
            setPrices(yPrice, nPrice);
          }
          yesPrice = yPrice;
          noPrice = nPrice;
          setYesProbability((prev) => [yPrice * 10, ...prev]);
          setNoProbability((prev) => [nPrice * 10, ...prev]);
        });
        timestamps.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        console.log("timestamps", timestamps);
        setTimeSeriesData(() =>
          timestamps.map((item) => {
            return new Date(item).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
          })
        );
        setRecentActivity(recentTrades);
      }
    };
    ws.onclose = () => console.log("WebSocket connection closed");
    ws.onerror = (error) => {
      console.log("Websocket error", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="w-full bg-white rounded-xl border-1 border-neutral-200 mt-10 h-[350px] px-6 pt-6 pb-4 overflow-hidden">
        {/* SubTabs */}
        <div className="border-b-1 border-neutral-200 pb-2 flex gap-10">
          <span
            className={cn(
              subTab == "Order Book"
                ? "text-black font-semibold"
                : "text-neutral-500 font-normal",
              "text-md font-sans cursor-pointer"
            )}
            onClick={() => setSubTab("Order Book")}>
            Order Book
          </span>
          <span
            className={cn(
              subTab == "Activity"
                ? "text-black font-semibold"
                : "text-neutral-500 font-normal",
              "text-md font-sans cursor-pointer"
            )}
            onClick={() => setSubTab("Activity")}>
            Activity
          </span>
        </div>
        {/* Price Distribution & Activity */}
        {subTab == "Order Book" && (
          <div className="flex gap-6 pt-4 ">
            <div className="basis-[50%] h-[200px] overflow-y-auto">
              {/* Heading */}
              <div className="flex items-center justify-between pt-4 pb-2 text-sm font-sans">
                <h1 className=" font-semibold ">PRICE</h1>
                <div className="flex gap-2">
                  <span>QTY AT</span>
                  <span className="text-blue-500">YES</span>
                </div>
              </div>
              <div>
                {orderbook &&
                  orderbook.YES.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-between border-t-1 border-neutral-200 py-1 px-2">
                        <span>{item.price}</span>
                        <span>{item.quantity}</span>
                        <div
                          className="absolute top-0 right-0 h-full bg-blue-500 opacity-20"
                          style={{
                            width: getBarWidth(item.quantity, totalYesQty),
                          }}></div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="basis-[50%] h-[200px] overflow-y-auto">
              {/* Heading */}
              <div className="flex items-center justify-between w-full  text-sm font-sans pt-4 pb-2">
                <h1 className=" font-semibold">PRICE</h1>
                <div className="flex gap-2">
                  <span>QTY AT</span>
                  <span className="text-red-500">NO</span>
                </div>
              </div>
              <div>
                {orderbook &&
                  orderbook.NO.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-between border-t-1 border-neutral-200 py-1 px-2">
                        <span>{item.price}</span>
                        <span>{item.quantity}</span>
                        <div
                          className="absolute top-0 right-0 h-full bg-red-500 opacity-20"
                          style={{
                            width: getBarWidth(item.quantity, totalNoQty),
                          }}></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        {subTab == "Activity" && <Activity matches={recentActivity} />}
      </div>
      <Card className="border-neutral-200 overflow-hidden mt-6 bg-white w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2">
              <ArrowRightLeft
                className={cn(
                  selectedOrderType == "YES"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-600",
                  "rounded-lg p-2 cursor-pointer"
                )}
                size={35}
                onClick={() => {
                  if (selectedOrderType == "YES") {
                    setSelectedOrderType("NO");
                  } else {
                    setSelectedOrderType("YES");
                  }
                }}
              />
              <div
                className={cn(
                  selectedOrderType == "YES" ? "text-blue-500" : "text-red-400",
                  "font-[600]"
                )}>
                <h1>{selectedOrderType}</h1>
                <h1>
                  {selectedOrderType == "YES"
                    ? yesProbability[yesProbability.length - 1]
                    : noProbability[noProbability.length - 1]}
                  % Probability
                </h1>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={
                selectedOrderType == "YES"
                  ? yesProbability.map((item, index) => {
                      return {
                        month: timeSeriesData[index],
                        desktop: item,
                      };
                    })
                  : noProbability.map((item, index) => {
                      return {
                        month: timeSeriesData[index],
                        desktop: item,
                      };
                    })
              }
              margin={{
                left: 12,
                right: 12,
                bottom: 40,
                top: 12,
              }}>
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
              />
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                height={60}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={{
                  stroke: selectedOrderType == "YES" ? "#2B7FFF" : "#DC2626",
                  strokeWidth: 2,
                }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => `${value}%`}
                    className={
                      selectedOrderType == "YES"
                        ? "bg-blue-200 text-blue-400"
                        : "bg-red-200 text-red-400"
                    }
                  />
                }
              />

              <Line
                dataKey="desktop"
                type="natural"
                stroke={selectedOrderType == "YES" ? "#2B7FFF" : "#DC2626"}
                strokeWidth={2}
                dot={{
                  fill: selectedOrderType == "YES" ? "#2B7FFF" : "#DC2626",
                }}
                activeDot={{
                  r: 6,
                  fill: selectedOrderType == "YES" ? "#2B7FFF" : "#DC2626",
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
