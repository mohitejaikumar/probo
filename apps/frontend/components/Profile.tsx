"use client";

import { useBalance } from "../hooks/use-balance";
import {
  BookPlus,
  BriefcaseBusiness,
  House,
  Wallet,
  Menu,
  X,
} from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavigation = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  return (
    <div className="flex justify-between items-center w-full">
      {/* Desktop Navigation */}
      {data?.user && (
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
      )}

      {/* Mobile Hamburger Menu - Show for both logged in and non-logged in users */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu">
          {isMobileMenuOpen ? (
            <X size={24} className="text-neutral-600" />
          ) : (
            <Menu size={24} className="text-neutral-600" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 h-screen z-50 md:hidden bg-white">
          <div className="fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu">
                <X size={20} className="text-neutral-600" />
              </button>
            </div>

            <div className="p-4 space-y-6 bg-white">
              {/* Navigation Items - Only for logged in users */}
              {data?.user && (
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      {item.svg}
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </nav>
              )}

              {/* Wallet Balance - Only for logged in users */}
              {data?.user && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      handleRecharge();
                      closeMobileMenu();
                    }}
                    className="w-full text-black border-neutral-200 border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-5 w-5" />
                      <span className="text-base font-medium">
                        Wallet Balance
                      </span>
                    </div>
                    <span className="font-mono text-base font-semibold">
                      ₹{balance}
                    </span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4 space-y-3">
                <Button
                  onClick={() => handleMobileNavigation("/events")}
                  className="w-full cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded-lg px-4 py-3 text-base border-neutral-300 border">
                  Trade
                </Button>

                {data?.user && (
                  <Button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="w-full cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded-lg px-4 py-3 text-base border-neutral-300 border">
                    Sign Out
                  </Button>
                )}

                {!data?.user && (
                  <Button
                    onClick={() => handleMobileNavigation("/auth/signin")}
                    className="w-full cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded-lg px-4 py-3 text-base border-neutral-300 border">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Right side content - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        {/* Wallet Balance */}
        {data?.user && (
          <button
            onClick={handleRecharge}
            className="ml-3 text-black border-neutral-200 border-1 rounded px-4 py-2 flex items-center space-x-6 cursor-pointer">
            <Wallet className="h-3 w-3" />
            <span className="font-mono text-sm">₹{balance}</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/events")}
            className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm border-neutral-300 border-1">
            Trade
          </Button>

          {data?.user && (
            <Button
              onClick={() => signOut()}
              className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm border-neutral-300 border-1">
              Sign Out
            </Button>
          )}

          {!data?.user && (
            <Button
              onClick={() => router.push("/auth/signin")}
              className="cursor-pointer justify-center flex items-center whitespace-nowrap transition duration-200 ease-in-out font-medium rounded px-7 py-2 text-sm border-neutral-300 border-1">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NavBar = ({ title, link, svg }: NavItem) => {
  return (
    <Link className="text-xl flex items-center flex-col" href={link}>
      {svg}
      <h1 className="text-sm">{title}</h1>
    </Link>
  );
};
