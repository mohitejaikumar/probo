"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SquareMinus, SquarePlus } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function OrderPlace({
  currentYesBuyPrice,
  currentNoBuyPrice,
  userBalance,
  eventId,
}: {
  currentYesBuyPrice: number;
  currentNoBuyPrice: number;
  userBalance: number;
  eventId: string;
}) {
  const [buyYesPrice, setBuyYesPrice] = useState(0.5);
  const [buyNoPrice, setBuyNoPrice] = useState(0.5);
  const [buyNoQty, setBuyNoQty] = useState(1);
  const [buyYesQty, setBuyYesQty] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"YES" | "NO">("YES");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (selectedTab == "YES") {
      setBuyYesPrice(currentYesBuyPrice);
    } else {
      setBuyNoPrice(currentNoBuyPrice);
    }
  }, [selectedTab]);

  function getControllerColor(
    type: "increment" | "decrement",
    category: "price" | "quantity",
    currentNumber: number
  ) {
    if (category == "price") {
      if (type == "increment") {
        if (currentNumber >= 10) {
          return "gray";
        }
      } else {
        if (currentNumber <= 0.5) {
          return "gray";
        }
      }
    } else {
      if (type == "increment") {
        const selectedPrice = selectedTab == "YES" ? buyYesPrice : buyNoPrice;
        console.log("price", currentNumber * selectedPrice);
        if (currentNumber * selectedPrice >= userBalance) {
          return "gray";
        }
      } else {
        if (currentNumber <= 1) {
          return "gray";
        }
      }
    }
    return "black";
  }

  function increment(category: "quantity" | "price") {
    if (category == "price") {
      if (selectedTab == "YES") {
        setBuyYesPrice((prev) => Math.min(prev + 0.5, 10));
      } else {
        setBuyNoPrice((prev) => Math.min(prev + 0.5, 10));
      }
    } else {
      if (selectedTab == "YES") {
        setBuyYesQty((prev) => {
          const cost = (prev + 1) * buyYesPrice;
          console.log(cost, userBalance);
          return cost > userBalance ? prev : prev + 1;
        });
      } else {
        setBuyNoQty((prev) => {
          const cost = (prev + 1) * buyNoPrice;
          console.log(cost, userBalance);
          return cost > userBalance ? prev : prev + 1;
        });
      }
    }
  }

  function decrement(category: "quantity" | "price") {
    if (category == "price") {
      if (selectedTab == "YES") {
        setBuyYesPrice((prev) => Math.max(prev - 0.5, 0.5));
      } else {
        setBuyNoPrice((prev) => Math.max(prev - 0.5, 0.5));
      }
    } else {
      if (selectedTab == "YES") {
        setBuyYesQty((prev) => Math.max(prev - 1, 1));
      } else {
        setBuyNoQty((prev) => Math.max(prev - 1, 1));
      }
    }
  }

  async function handlePlaceOrder() {
    console.log("place order");
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/event/initiate`,
        {
          userId: session?.user.id,
          eventId: eventId,
          side: selectedTab,
          quantity: selectedTab == "YES" ? buyYesQty : buyNoQty,
          price: selectedTab == "NO" ? buyNoPrice : buyYesPrice,
        },
        {
          headers: {
            Authorization: "Bearer " + session?.user.jwtToken,
          },
        }
      );
      toast.success("Order Placed Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error while placing order");
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full">
      <div className="flex  rounded-full w-full h-12 border-1 border-neutral-200 select-none">
        <h1
          onClick={() => {
            setSelectedTab(() => "YES");
          }}
          className={cn(
            selectedTab == "YES"
              ? "bg-blue-500 text-white"
              : "bg-white text-black",
            "rounded-full basis-[50%] text-center text-sm font-semibold flex items-center justify-center cursor-pointer"
          )}>
          YES
        </h1>
        <h1
          onClick={() => {
            setSelectedTab(() => "NO");
          }}
          className={cn(
            selectedTab == "NO"
              ? "bg-red-400 text-white"
              : "bg-white text-black",
            "rounded-full basis-[50%] text-center text-sm font-semibold flex items-center justify-center cursor-pointer"
          )}>
          NO
        </h1>
      </div>
      <div className="pt-6 pb-4 px-4 border-1 border-neutral-200 rounded-xl mt-4 select-none">
        {/* Set Price */}
        <div className="flex items-center justify-between">
          <h1 className="text-black text-md font-semibold font-sans">Price</h1>
          <div className="py-1 px-1 flex justify-between border-2 border-neutral-200 rounded-lg xl:w-[40%] w-[150px]">
            <SquareMinus
              color={getControllerColor(
                "decrement",
                "price",
                selectedTab == "YES" ? buyYesPrice : buyNoPrice
              )}
              onClick={() => decrement("price")}
              className="shrink-0 cursor-pointer"
            />
            <h1>₹{selectedTab == "YES" ? buyYesPrice : buyNoPrice}</h1>
            <SquarePlus
              color={getControllerColor(
                "increment",
                "price",
                selectedTab == "YES" ? buyYesPrice : buyNoPrice
              )}
              onClick={() => increment("price")}
              className="shrink-0 cursor-pointer"
            />
          </div>
        </div>
        {/* Set Quantity */}
        <div className="flex items-center justify-between mt-7">
          <h1 className="text-black  font-semibold font-sans text-md">
            Quantity
          </h1>
          <div className="py-1 px-1 flex justify-between border-2 border-neutral-200 rounded-lg xl:w-[40%] w-[150px]">
            <SquareMinus
              color={getControllerColor(
                "decrement",
                "quantity",
                selectedTab == "YES" ? buyYesQty : buyNoQty
              )}
              onClick={() => decrement("quantity")}
              className="shrink-0 cursor-pointer"
            />
            <h1>{selectedTab == "YES" ? buyYesQty : buyNoQty}</h1>
            <SquarePlus
              color={getControllerColor(
                "increment",
                "quantity",
                selectedTab == "YES" ? buyYesQty : buyNoQty
              )}
              onClick={() => increment("quantity")}
              className="shrink-0 cursor-pointer"
            />
          </div>
        </div>
        {/* GOAL */}
        <div className="flex items-center justify-center xl:gap-12 gap-[40%] mt-8">
          <div className="flex flex-col items-center">
            <h1 className="text-black font-semibold text-lg">
              ₹
              {selectedTab == "YES"
                ? buyYesQty * buyYesPrice
                : buyNoQty * buyNoPrice}
            </h1>
            <h1 className="text-neutral-400 text-md font-sans">You put</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-green-500 font-semibold text-lg">
              ₹{selectedTab == "YES" ? buyYesQty * 10 : buyNoQty * 10}
            </h1>
            <h1 className="text-neutral-400 text-md font-sans">You get</h1>
          </div>
        </div>
      </div>
      <button
        className={cn(
          selectedTab == "YES"
            ? isLoading
              ? "bg-blue-300"
              : "bg-blue-500"
            : isLoading
              ? "bg-red-300"
              : "bg-red-400",
          "w-full flex items-center justify-center text-lg text-white rounded-lg py-3 mt-4 cursor-pointer font-sans"
        )}
        onClick={handlePlaceOrder}
        disabled={isLoading}>
        Place Order
      </button>
    </div>
  );
}
