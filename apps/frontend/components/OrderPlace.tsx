import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SquareMinus, SquarePlus } from "lucide-react";

export default function OrderPlace({
  currentYesBuyPrice,
  currentNoBuyPrice,
  userBalance,
}: {
  currentYesBuyPrice: number;
  currentNoBuyPrice: number;
  userBalance: number;
}) {
  const [buyYesPrice, setBuyYesPrice] = useState(0.5);
  const [buyNoPrice, setBuyNoPrice] = useState(0.5);
  const [buyNoQty, setBuyNoQty] = useState(1);
  const [buyYesQty, setBuyYesQty] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Yes");

  useEffect(() => {
    if (selectedTab == "Yes") {
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
        const selectedPrice = selectedTab == "Yes" ? buyYesPrice : buyNoPrice;
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
      if (selectedTab == "Yes") {
        setBuyYesPrice((prev) => Math.min(prev + 0.5, 10));
      } else {
        setBuyNoPrice((prev) => Math.min(prev + 0.5, 10));
      }
    } else {
      if (selectedTab == "Yes") {
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
      if (selectedTab == "Yes") {
        setBuyYesPrice((prev) => Math.max(prev - 0.5, 0.5));
      } else {
        setBuyNoPrice((prev) => Math.max(prev - 0.5, 0.5));
      }
    } else {
      if (selectedTab == "Yes") {
        setBuyYesQty((prev) => Math.max(prev - 1, 1));
      } else {
        setBuyNoQty((prev) => Math.max(prev - 1, 1));
      }
    }
  }

  return (
    <div className="w-full">
      <div className="flex  rounded-full w-full h-12 border-1 border-neutral-200 select-none">
        <h1
          onClick={() => {
            setSelectedTab(() => "Yes");
          }}
          className={cn(
            selectedTab == "Yes"
              ? "bg-blue-500 text-white"
              : "bg-white text-black",
            "rounded-full basis-[50%] text-center text-sm font-semibold flex items-center justify-center cursor-pointer"
          )}>
          YES
        </h1>
        <h1
          onClick={() => {
            setSelectedTab(() => "No");
          }}
          className={cn(
            selectedTab == "No"
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
          <div className="py-1 px-1 flex justify-between border-2 border-neutral-200 rounded-lg w-[40%]">
            <SquareMinus
              color={getControllerColor(
                "decrement",
                "price",
                selectedTab == "Yes" ? buyYesPrice : buyNoPrice
              )}
              onClick={() => decrement("price")}
              className="shrink-0 cursor-pointer"
            />
            <h1>₹{selectedTab == "Yes" ? buyYesPrice : buyNoPrice}</h1>
            <SquarePlus
              color={getControllerColor(
                "increment",
                "price",
                selectedTab == "Yes" ? buyYesPrice : buyNoPrice
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
          <div className="py-1 px-1 flex justify-between border-2 border-neutral-200 rounded-lg w-[40%]">
            <SquareMinus
              color={getControllerColor(
                "decrement",
                "quantity",
                selectedTab == "Yes" ? buyYesQty : buyNoQty
              )}
              onClick={() => decrement("quantity")}
              className="shrink-0 cursor-pointer"
            />
            <h1>{selectedTab == "Yes" ? buyYesQty : buyNoQty}</h1>
            <SquarePlus
              color={getControllerColor(
                "increment",
                "quantity",
                selectedTab == "Yes" ? buyYesQty : buyNoQty
              )}
              onClick={() => increment("quantity")}
              className="shrink-0 cursor-pointer"
            />
          </div>
        </div>
        {/* GOAL */}
        <div className="flex items-center justify-center gap-12 mt-8">
          <div className="flex flex-col items-center">
            <h1 className="text-black font-semibold text-lg">
              ₹
              {selectedTab == "Yes"
                ? buyYesQty * buyYesPrice
                : buyNoQty * buyNoPrice}
            </h1>
            <h1 className="text-neutral-400 text-md font-sans">You put</h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-green-500 font-semibold text-lg">
              ₹{selectedTab == "Yes" ? buyYesQty * 10 : buyNoQty * 10}
            </h1>
            <h1 className="text-neutral-400 text-md font-sans">You get</h1>
          </div>
        </div>
      </div>
      <div
        className={cn(
          selectedTab == "Yes" ? "bg-blue-500" : "bg-red-400",
          "flex items-center justify-center text-lg text-white rounded-lg py-3 mt-4 cursor-pointer font-sans"
        )}>
        Place Order
      </div>
    </div>
  );
}
