import { cn } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface EventDescription {
  id: string;
  imageURL: string;
  title: string;
  description: string;
  yesPrice: number;
  noPrice: number;
}

export default async function Events() {
  const currentTab = "All events";
  const availableTabs = ["All events", "Cricket"];

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/event/`
  );
  const allEvents: EventDescription[] = response.data.events;
  console.log(allEvents);

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
          {allEvents.length > 0 &&
            allEvents.map((event, index) => {
              return (
                <Link key={index} href={`/events/${event.id}`}>
                  <div
                    key={index}
                    className="p-4 pt-6 bg-white rounded-lg md:w-[400px] w-[90vw] flex flex-col justify-between cursor-pointer">
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
                      <p className="text-xl font-semibold">
                        {event.description.length > 100
                          ? event.description.slice(0, 100) + " read more ..."
                          : event.description}
                      </p>
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
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
