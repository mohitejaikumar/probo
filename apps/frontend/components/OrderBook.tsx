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

  function getPrices(yesQty: number, noQty: number, b: number) {
    const expYES = Math.exp(yesQty / b);
    const expNO = Math.exp(noQty / b);
    const priceYES = expYES / (expYES + expNO);
    const priceNO = expNO / (expYES + expNO);
    return {
      YES: Math.round(priceNO * 100 * 2) / 2,
      NO: Math.round(priceYES * 100 * 2) / 2,
    };
  }

  function setPrices(yesQty: number, noQty: number, b: number) {
    setLMSRPrices(yesQty, noQty, b);
    // Normalize to get prices
    const priceYES = getPrices(yesQty, noQty, b).YES;
    const priceNO = getPrices(yesQty, noQty, b).NO;

    setYesProbability((prev) => [...prev, priceYES]);
    setNoProbability((prev) => [...prev, priceNO]);
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
      }
      if (data?.type == "orderbook") {
        const ws_data = JSON.parse(data.data);
        console.log("ws_orderbook", ws_data);
        setOrderBook(ws_data.orderbook);
        // calculate YES and NO price using the Logarithmic formulae

        if (ws_data.orderbook) {
          // @ts-ignore
          const totalYesQuantity = ws_data.orderbook.YES.reduce((acc, item) => {
            return item.quantity + acc;
          }, 0);
          // @ts-ignore
          const totalNoQuantity = ws_data.orderbook.NO.reduce((acc, item) => {
            return item.quantity + acc;
          }, 0);

          console.log(
            `totalYESQty: ${totalYesQuantity}, totalNOQty: ${totalNoQuantity}`
          );

          // Set initial probability arrays if they're empty
          if (yesProbability.length === 0) {
            // Create a map of timestamps to quantities for probability calculation
            const timestampQuantityMap = new Map<
              number,
              { yesQty: number; noQty: number }
            >();

            // Process YES orders
            ws_data.orderbook.YES.forEach((item) => {
              item.userOrders?.forEach((order) => {
                const timestamp = new Date(order.timestamp).getTime();
                const existing = timestampQuantityMap.get(timestamp) || {
                  yesQty: 0,
                  noQty: 0,
                };
                existing.yesQty += order.quantity;
                timestampQuantityMap.set(timestamp, existing);
              });
            });

            // Process NO orders
            ws_data.orderbook.NO.forEach((item) => {
              item.userOrders?.forEach((order) => {
                const timestamp = new Date(order.timestamp).getTime();
                const existing = timestampQuantityMap.get(timestamp) || {
                  yesQty: 0,
                  noQty: 0,
                };
                existing.noQty += order.quantity;
                timestampQuantityMap.set(timestamp, existing);
              });
            });

            // Sort timestamps and calculate cumulative probabilities
            const sortedTimestamps = Array.from(
              timestampQuantityMap.keys()
            ).sort((a, b) => a - b);
            let cumulativeYesQty = 0;
            let cumulativeNoQty = 0;
            const initialYesProbs: number[] = [];
            const initialNoProbs: number[] = [];

            sortedTimestamps.forEach((timestamp) => {
              const quantities = timestampQuantityMap.get(timestamp)!;
              cumulativeYesQty += quantities.yesQty;
              cumulativeNoQty += quantities.noQty;

              const totalQty = cumulativeYesQty + cumulativeNoQty;
              if (totalQty > 0) {
                const { YES, NO } = getPrices(
                  cumulativeYesQty,
                  cumulativeNoQty,
                  1
                );
                const yesProb = YES;
                const noProb = NO;
                initialYesProbs.push(yesProb);
                initialNoProbs.push(noProb);
              }
            });

            setYesProbability(initialYesProbs);
            setNoProbability(initialNoProbs);
            setLMSRPrices(totalYesQuantity, totalNoQuantity, 1);
          } else setPrices(totalYesQuantity, totalNoQuantity, 1);
        }
        const timestamps = [
          ...(ws_data.orderbook?.YES.flatMap((item) =>
            item.userOrders?.map((order) => new Date(order.timestamp).getTime())
          ) || []),
          ...(ws_data.orderbook?.NO.flatMap((item) =>
            item.userOrders?.map((order) => new Date(order.timestamp).getTime())
          ) || []),
        ];
        timestamps.sort((a, b) => a - b);
        if (timeSeriesData.length == 0) {
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
        } else {
          setTimeSeriesData((prev) => [
            ...prev,
            new Date(timestamps[timestamps.length - 1]).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }
            ),
          ]);
        }
      }
      if (data?.type == "recentTrade") {
        let recentTrades: RecentActivity[] = [];
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
        });
        setRecentActivity((prev) => {
          return [...recentTrades, ...prev].slice(0, 6);
        });
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
