"use client";

import Link from "next/link";
import { Profile } from "./Profile";
import Image from "next/image";

export default function Appbar() {
  return (
    <nav className="bg-[#F3F3F3] md:inset-x-16 inset-x-0 backdrop-blur-2xl z-[1000] border-b-1 border-neutral-200  fixed">
      <div className="w-full mx-auto px-4 md:px-0">
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <div className="w-[80px] md:w-[8vw] h-[60px] relative bg-[#F3F3F3]">
              <Image
                src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Flogo-sm.webp&w=128&q=75"
                alt="probo logo"
                fill
                unoptimized
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </Link>
          <div className="flex items-center justify-between gap-10">
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
}
