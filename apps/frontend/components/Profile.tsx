"use client";

import { useBalance } from "../hooks/use-balance";
import { Wallet } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Profile = () => {
  const { balance, loading, error } = useBalance();
  const { data } = useSession();

  return (
    <div className="flex gap-3 items-center">
      {data?.user && (
        <button className=" text-black border-neutral-400  border rounded pr-4 pf-4 pt-2 pb-2 flex items-center space-x-4">
          <Wallet className="h-5 w-5 ml-3" />
          <span className="font-mono">₹{balance}</span>
        </button>
      )}
      <div className="flex items-center gap-4">
        <Link href={!data?.user ? "/api/auth/signin" : "/event"}>
          <Button className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-6 text-xl border-neutral-300 border-1">
            {!data?.user ? "Login" : "Trade Now"}
          </Button>
        </Link>
        {data?.user && (
          <Button
            onClick={() => signOut()}
            className="justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-6 text-xl pr-5 pl-5 bg-red-400">
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};
