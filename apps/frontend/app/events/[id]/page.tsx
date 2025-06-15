import OrderBook from "@/components/OrderBook";
import OrderPlace from "@/components/OrderPlace";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const res = await params;
  console.log("params", res);
  const eventId = res.id;
  const session = await getServerSession(authOptions);
  console.log("session: ", session);
  console.log("eventID", eventId, "jwtToken", session?.user.jwtToken);
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/event/${eventId}`,
    {
      headers: {
        Authorization: "Bearer " + session?.user.jwtToken,
      },
    }
  );

  const event = response.data.event;

  return (
    <div className="w-screen min-h-screen bg-[#F3F3F3] pt-[60px] overflow-x-hidden">
      <div className="md:max-w-[90vw] overflow-hidden  2xl:max-w-[1200px] mx-auto  py-1 flex gap-2 flex-col xl:flex-row px-4 md:px-0">
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
          <OrderBook eventId={String(eventId)} />
        </div>
        <div className="bg-white flex-1 xl:max-w-[400px] overflow-x-hidden mt-10 rounded-xl border-1 border-neutral-200 h-fit p-4">
          <OrderPlace
            currentNoBuyPrice={4}
            currentYesBuyPrice={6}
            userBalance={100000}
            eventId={String(eventId)}
          />
        </div>
      </div>
    </div>
  );
}
