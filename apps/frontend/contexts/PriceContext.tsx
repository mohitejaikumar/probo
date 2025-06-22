"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PriceContextType {
  yesPrice: number;
  noPrice: number;
  setLMSRPrices: (yPrice: number, nPrice: number) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

interface PriceProviderProps {
  children: ReactNode;
}

export function PriceProvider({ children }: PriceProviderProps) {
  const [yesPrice, setYesPrice] = useState<number>(5);
  const [noPrice, setNoPrice] = useState<number>(5);

  function setLMSRPrices(yPrice: number, nPrice: number) {
    setYesPrice(yPrice);
    setNoPrice(nPrice);
  }

  const value: PriceContextType = {
    yesPrice,
    noPrice,
    setLMSRPrices,
  };

  return (
    <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error("usePrice must be used within a PriceProvider");
  }
  return context;
}
