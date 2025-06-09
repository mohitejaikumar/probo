import Image from "next/image";

export interface Match {
  tradeId: string;
  yesUserId: string;
  noUserId: string;
  yesPrice: number;
  noPrice: number;
}
export default function Activity({ matches }: { matches: Match[] }) {
  const getBarWidth = (quantity: number, maxQuantity: number) => {
    return `${Math.min((quantity / maxQuantity) * 100, 100)}%`;
  };
  return (
    <div className="overflow-y-auto h-[220px] py-6 md:px-10">
      {matches.map((trade, index) => {
        return (
          <div
            key={index}
            className="flex items-center justify-between border-b-2 border-neutral-200 py-6">
            <div className="h-10 w-10 relative">
              <Image
                src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fcomponents%2Ftrading%2Fprofile.png&w=96&q=75"
                alt="person"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="relative h-9 w-[70%] rounded-xl flex items-center justify-between px-6">
              <div
                className="absolute top-0 right-0 h-full bg-red-400 opacity-10 rounded-r-lg"
                style={{
                  width: getBarWidth(trade.noPrice, 10),
                }}></div>
              <div
                className="absolute top-0 left-0 h-full bg-blue-400 opacity-10 rounded-l-lg"
                style={{
                  width: getBarWidth(trade.yesPrice, 10),
                }}></div>
              <h1 className="text-blue-500 text-sm font-semibold">
                ₹{trade.yesPrice}
              </h1>
              <h1 className="text-red-500 text-sm font-semibold">
                ₹{trade.noPrice}
              </h1>
            </div>
            <div className="h-10 w-10 relative rouded-full">
              <Image
                src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fcomponents%2Ftrading%2Fprofile.png&w=96&q=75"
                alt="person"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
