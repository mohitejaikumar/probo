"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PriceContextType {
  yesPrice: number;
  noPrice: number;
  setLMSRPrices: (yesQty: number, noQty: number, b: number) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

interface PriceProviderProps {
  children: ReactNode;
}

export function PriceProvider({ children }: PriceProviderProps) {
  const [yesPrice, setYesPrice] = useState<number>(0);
  const [noPrice, setNoPrice] = useState<number>(0);

  function setLMSRPrices(yesQty: number, noQty: number, b: number) {
    // Calculate exponentials
    const expYES = Math.exp(yesQty / b);
    const expNO = Math.exp(noQty / b);

    // Normalize to get prices
    const priceYES = expYES / (expYES + expNO);
    const priceNO = expNO / (expYES + expNO);

    setYesPrice(Math.round(priceNO * 10 * 2) / 2);
    setNoPrice(Math.round(priceYES * 10 * 2) / 2);
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
