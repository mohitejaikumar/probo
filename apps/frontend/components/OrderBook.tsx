"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

import Activity from "@/components/Activity";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Orderbook } from "@repo/types";
import axios from "axios";

interface RecentActivity {
  tradeId: string;
  yesUserId: string;
  noUserId: string;
  yesPrice: number;
  noPrice: number;
}

export const dummyMatches = [
  {
    tradeId: "trade_001",
    yesUserId: "user_100",
    noUserId: "user_200",
    yesPrice: 4.0,
    noPrice: 6.0,
  },
  {
    tradeId: "trade_002",
    yesUserId: "user_101",
    noUserId: "user_201",
    yesPrice: 5.0,
    noPrice: 5.0,
  },
  {
    tradeId: "trade_003",
    yesUserId: "user_102",
    noUserId: "user_202",
    yesPrice: 6.5,
    noPrice: 3.5,
  },
  {
    tradeId: "trade_004",
    yesUserId: "user_103",
    noUserId: "user_203",
    yesPrice: 7.0,
    noPrice: 3.0,
  },
  {
    tradeId: "trade_005",
    yesUserId: "user_104",
    noUserId: "user_204",
    yesPrice: 2.5,
    noPrice: 7.5,
  },
];

export default function OrderBook({ eventId }: { eventId: string }) {
  const [subTab, setSubTab] = useState("Order Book");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderbook, setOrderBook] = useState<Orderbook | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [yesPrice, setYesPrice] = useState<number>(0);
  const [noPrice, setNoPrice] = useState<number>(0);
  const [totalYesQty, setTotalYesQty] = useState<number>(0);
  const [totalNoQty, setTotalNoQty] = useState<number>(0);
  const [isYesSelected, setIsYesSelected] = useState(true);
  const [yesProbability, setYesProbability] = useState<number[]>([]);
  const [noProbability, setNoProbability] = useState<number[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

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
          const totalYesQuantity = ws_data.orderbook.YES.reduce((acc, item) => {
            return item.quantity + acc;
          }, 0);
          const totalNoQuantity = ws_data.orderbook.NO.reduce((acc, item) => {
            return item.quantity + acc;
          }, 0);

          console.log(
            `totalYESQty: ${totalYesQuantity}, totalNOQty: ${totalNoQuantity}`
          );
          const totalQuantity = totalYesQuantity + totalNoQuantity;

          if (totalQuantity > 0) {
            const currentYesProb = (totalNoQuantity / totalQuantity) * 100;
            const currentNoProb = (totalYesQuantity / totalQuantity) * 100;
            console.log(`yesProb: ${currentYesProb}, noProb: ${currentNoProb}`);
            setYesProbability((prev) => [...prev, currentYesProb]);
            setNoProbability((prev) => [...prev, currentNoProb]);
          }
        }
        setTimeSeriesData((prev) => [...prev, new Date().toLocaleTimeString()]);
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
    <div className="w-full bg-white rounded-xl border-1 border-neutral-200 mt-10 h-[300px] px-6 pt-6 pb-4">
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
  );
}
