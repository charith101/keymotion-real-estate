"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Currency } from './types';
import { exchangeRates } from './mock-data';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceLKR: number) => string;
  convertPrice: (priceLKR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  LKR: 'Rs.',
  USD: '$',
  EUR: '€',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('LKR');

  const convertPrice = useCallback((priceLKR: number) => {
    return priceLKR * exchangeRates[currency];
  }, [currency]);

 const formatPrice = useCallback((priceLKR: number) => {
    const converted = convertPrice(priceLKR);
    const symbol = currencySymbols[currency];
    
    if (currency === 'LKR') {
      if (converted >= 1000000) {
        const millions = Number((converted / 1000000).toFixed(1));
        return `${symbol} ${millions}M`; 
      }
      return `${symbol} ${converted.toLocaleString()}`;
    }
    
    return `${symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  }, [currency, convertPrice]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
