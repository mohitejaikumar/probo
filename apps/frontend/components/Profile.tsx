"use client";

import { useBalance } from "../hooks/use-balance";
import { BookPlus, BriefcaseBusiness, House, Wallet } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { createOrder } from "@/actions/order";

interface NavItem {
  title: string;
  link: string;
  svg: React.ReactNode;
}

export const Profile = () => {
  const { balance, loading, error } = useBalance();
  const { data } = useSession();
  const router = useRouter();
  const [cashfree, setCashfree] = useState();
  useEffect(() => {
    (async () => {
      let cashfree_sdk = await load({
        mode: "production",
      });
      setCashfree(cashfree_sdk);
    })();
  }, []);

  const menuItems: NavItem[] = [
    {
      title: "Home",
      link: "/",
      svg: <House size={20} className="text-neutral-600" />,
    },
    {
      title: "Portfolio",
      link: "/portfolio",
      svg: <BriefcaseBusiness size={20} className="text-neutral-600" />,
    },
    {
      title: "Event+",
      link: "/create-event",
      svg: <BookPlus size={20} className="text-neutral-600" />,
    },
  ];

  async function handleRecharge() {
    try {
      if (cashfree) {
        const response = await createOrder(5, data!.user.id);
        console.log(response);
        // @ts-ignore
        cashfree.checkout({
          paymentSessionId: response,
          redirectTarget: "_self",
        });
      } else {
        console.log("cashfree not loaded!");
      }
    } catch (err) {
      console.log("error: from button click", err);
    }
  }

  return (
    <div className="flex gap-6 items-center">
      {data?.user && (
        <>
          <nav className="hidden md:flex gap-10">
            {menuItems.map((item, index) => (
              <NavBar
                title={item.title}
                link={item.link}
                key={index}
                svg={item.svg}
              />
            ))}
          </nav>
          <button
            onClick={handleRecharge}
            className=" text-black border-neutral-200 border-1 rounded px-4  py-2 flex items-center space-x-6 cursor-pointer">
            <Wallet className="h-3 w-3 " />
            <span className="font-mono text-sm">₹{balance}</span>
          </button>
        </>
      )}
      <div className="flex items-center gap-4">
        {
          <Button
            onClick={() => router.push("/events")}
            className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm pr-5 pl-5 border-neutral-300 border-1">
            Trade
          </Button>
        }
        {data?.user && (
          <Button
            onClick={() => signOut()}
            className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm pr-5 pl-5 border-neutral-300 border-1">
            Sign Out
          </Button>
        )}
        {!data?.user && (
          <Button
            onClick={() => router.push("/auth/signin")}
            className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm pr-5 pl-5 border-neutral-300 border-1">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export const NavBar = ({ title, link, svg }: NavItem) => {
  return (
    <Link className=" text-xl flex items-center flex-col " href={link}>
      {svg}
      <h1 className=" text-sm">{title}</h1>
    </Link>
  );
};
