"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function Events() {
  const [currentTab, setCurrentTab] = useState("All events");
  const availableTabs = ["All events", "Cricket"];
  const events = [
    {
      id: "1",
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      title: "Football",
      description: "Jannik Sinner to win the match against C. Alcaraz?",
      yesPrice: 1.5,
      noPrice: 8.5,
    },
    {
      id: "2",
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      title: "Blockchain",
      description:
        "Bitcoin is forecasted to reach at 106195.21 USDT or more at 11:40 PM?",
      yesPrice: 1.5,
      noPrice: 8.5,
    },
    {
      id: "3",
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      title: "Jannik Sinner to win the match against C. Alcaraz?",
      description: "Live Score(Sets won): J Sinner-0 | C Alcaraz-0",
      yesPrice: 1.5,
      noPrice: 8.5,
    },
    {
      id: "4",
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      title: "Football",
      description: "Spain to win against Portugal?",
      yesPrice: 1.5,
      noPrice: 8.5,
    },
    {
      id: "5",
      imageURL:
        "https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_e2155c49-3dcd-45a6-93e5-f585230916e4.png&w=256&q=75",
      title: "Youtuber",
      description:
        "Sourav Joshi-My New Room Editing Table' video to cross 2.82M views at 12:00 AM?",
      yesPrice: 1.5,
      noPrice: 8.5,
    },
  ];
  return (
    <div className="w-screen min-h-screen bg-[#F3F3F3] py-1 pb-10 overflow-x-hidden">
      <div className="md:px-20 px-4 mt-[60px] border-b-1 border-neutral-200 py-3 flex items-center gap-10">
        {availableTabs.map((tab, index) => {
          return (
            <h1
              key={index}
              className={cn(
                currentTab == tab
                  ? "text-black font-medium"
                  : "font-normal text-neutral-600",
                "text-md cursor-pointer"
              )}>
              {tab}
            </h1>
          );
        })}
      </div>
      <div className="md:px-20 px-4 mt-10 md:w-[80vw] w-full overflow-x-hidden">
        <h1 className="text-xl font-semibold border-b-1 border-neutral-200 pb-2">
          {currentTab}
        </h1>
        <div className="flex flex-wrap gap-6 mt-10">
          {events.map((event, index) => {
            return (
              <div
                key={index}
                className="p-4 pt-6 bg-white rounded-lg md:w-[400px] w-[90vw] mx-4 md:mx-0 flex flex-col justify-between cursor-pointer">
                <div className="flex items-center  gap-4">
                  <div className="w-[90px] h-[50px] z-10 rounded-lg relative shrink-0">
                    <Image
                      src={event.imageURL}
                      alt={event.description}
                      fill
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <p className="text-xl font-semibold">{event.description}</p>
                </div>
                <div className="flex gap-4 w-full justify-center items-center mt-7">
                  <button className="font-semibold basis-1/2 py-2 bg-blue-100 text-blue-500 rounded-md cursor-pointer">
                    Yes ₹{event.yesPrice}
                  </button>
                  <button className="font-semibold basis-1/2 py-2 bg-red-100 text-red-500 rounded-md cursor-pointer">
                    No ₹{event.noPrice}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
