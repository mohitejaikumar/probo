"use client";

import Link from "next/link";
import { Profile } from "./Profile";
import { House, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  link: string;
  svg: React.ReactNode;
}

export default function Appbar() {
  const menuItems: NavItem[] = [
    {
      title: "Home",
      link: "/home",
      svg: <House />,
    },
    {
      title: "Portfolio",
      link: "/portfolio",
      svg: <BriefcaseBusiness />,
    },
  ];
  return (
    <nav className=" inset-x-0 top-0 backdrop-blur-2xl z-50 border-y-2 border-neutral-300 shadow-md fixed">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          <Link
            className="flex items-center md:text-3xl text-xl font-bold text-black group hover:text-neutral-700"
            href={"/"}>
            <span>OpinionTrade</span>
          </Link>
          <div className="flex items-center justify-between gap-10">
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
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
}

export const NavBar = ({ title, link, svg }: NavItem) => {
  return (
    <Link
      onClick={() => {}}
      className=" text-xl flex items-center flex-col "
      href={link}>
      {svg}
      <h1 className="text-neutral-700">{title}</h1>
    </Link>
  );
};
