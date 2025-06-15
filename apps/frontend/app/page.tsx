"use client";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="w-screen h-screen bg-[#F3F3F3] pt-1">
      {session && session.user && (
        <>
          <div className="mt-[20vh]">{JSON.stringify(session.user)}</div>
        </>
      )}
    </div>
  );
}
