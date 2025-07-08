import OrderBook from "@/components/OrderBook";
import OrderPlace from "@/components/OrderPlace";
import Orders from "@/components/Orders";
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
    <div className="w-full min-h-screen bg-[#F3F3F3] pt-[60px] overflow-x-hidden pb-[10vh]">
      <div className="max-w-[90vw] overflow-x-hidden 2xl:max-w-[1200px] mx-auto py-1 flex gap-2 flex-col xl:flex-row px-4 md:px-0">
        <div className="basis-[70%] overflow-x-hidden">
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
          <div className="mt-12">
            <span className="border-b-2 border-black text-neutral-700 px-3 pb-2 text-lg">
              Orderbook
            </span>
          </div>
          {/* ORDERBOOK */}
          <OrderBook eventId={String(eventId)} />
        </div>
        <div className="flex-1 xl:max-w-[400px] overflow-x-hidden mt-10">
          <div className="bg-white rounded-xl border border-neutral-200 h-fit p-4">
            <OrderPlace userBalance={100000} eventId={String(eventId)} />
          </div>
          <Orders eventId={String(eventId)} />
        </div>
      </div>
    </div>
  );
}
