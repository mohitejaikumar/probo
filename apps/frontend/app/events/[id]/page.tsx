"use client";
import OrderPlace from "@/components/OrderPlace";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import Activity from "@/components/Activity";

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

export default function Page() {
  const [subTab, setSubTab] = useState("Activity");
  const event = {
    id: "1",
    imageURL:
      "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
    title: "Football",
    description: "Spain to win against Portugal?",
    yesPrice: 1.5,
    noPrice: 8.5,
  };
  const getBarWidth = (quantity: number, maxQuantity: number) => {
    return `${Math.min((quantity / maxQuantity) * 100, 100)}%`;
  };
  const orderbook = {
    NO: [
      {
        price: 4.5,
        quantity: 2332,
      },
      {
        price: 5,
        quantity: 2205,
      },
      {
        price: 5.5,
        quantity: 52,
      },
      {
        price: 6,
        quantity: 725,
      },
      {
        price: 6.5,
        quantity: 1132,
      },
    ],
    YES: [
      {
        price: 6,
        quantity: 1057,
      },
      {
        price: 6.5,
        quantity: 12433,
      },
      {
        price: 7,
        quantity: 2759,
      },
      {
        price: 7.5,
        quantity: 155,
      },
      {
        price: 8,
        quantity: 169,
      },
    ],
  };
  const maxYesQty = orderbook.YES.reduce((acc, item) => {
    return item.quantity + acc;
  }, 0);
  const maxNoQty = orderbook.NO.reduce((acc, item) => {
    return item.quantity + acc;
  }, 0);
  return (
    <div className="w-screen min-h-screen bg-[#F3F3F3] pt-[60px]">
      <div className="md:max-w-[90vw]  2xl:max-w-[1200px] mx-auto  py-1 flex gap-2 flex-col md:flex-row px-4 md:px-0">
        <div className="basis-[70%]">
          <div className="flex items-center gap-10 mt-[5vh] flex-col md:flex-row">
            <div className="w-[100px] h-[100px] z-10 rounded-lg relative shrink-0 bg-[#F3F3F3]">
              <Image
                src={event.imageURL}
                alt={event.description}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <p className="text-3xl font-semibold font-sans">
              {event.description}
            </p>
          </div>
          <div className="mt-12 ">
            <span className="border-b-2 border-black text-neutral-700 px-3 pb-2 text-lg">
              Orderbook
            </span>
          </div>
          {/* ORDERBOOK */}
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
              <div className="flex gap-6 pt-4">
                <div className="basis-[50%]">
                  {/* Heading */}
                  <div className="flex items-center justify-between pt-4 pb-2 text-sm font-sans">
                    <h1 className=" font-semibold ">PRICE</h1>
                    <div className="flex gap-2">
                      <span>QTY AT</span>
                      <span className="text-blue-500">YES</span>
                    </div>
                  </div>
                  {orderbook.YES.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-between border-t-1 border-neutral-200 py-1">
                        <span>{item.price}</span>
                        <span>{item.quantity}</span>
                        <div
                          className="absolute top-0 right-0 h-full bg-blue-500 opacity-20"
                          style={{
                            width: getBarWidth(item.quantity, maxYesQty),
                          }}></div>
                      </div>
                    );
                  })}
                </div>
                <div className="basis-[50%]">
                  {/* Heading */}
                  <div className="flex items-center justify-between w-full  text-sm font-sans pt-4 pb-2">
                    <h1 className=" font-semibold">PRICE</h1>
                    <div className="flex gap-2">
                      <span>QTY AT</span>
                      <span className="text-red-500">NO</span>
                    </div>
                  </div>
                  {orderbook.NO.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-between border-t-1 border-neutral-200 py-1">
                        <span>{item.price}</span>
                        <span>{item.quantity}</span>
                        <div
                          className="absolute top-0 right-0 h-full bg-red-500 opacity-20"
                          style={{
                            width: getBarWidth(item.quantity, maxNoQty),
                          }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {subTab == "Activity" && <Activity matches={dummyMatches} />}
          </div>
        </div>
        <div className="bg-white flex-1 max-w-[400px] mt-10 rounded-xl border-1 border-neutral-200 h-fit p-4">
          <OrderPlace
            currentNoBuyPrice={4}
            currentYesBuyPrice={6}
            userBalance={100000}
          />
        </div>
      </div>
    </div>
  );
}
