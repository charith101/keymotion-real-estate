import { createClient } from './supabase/server'

export type ExchangeRates = {
  usd_rate: number
  eur_rate: number
}

/**
 * Fetches the latest exchange rates from the cache table where base = 'LKR'.
 * Returns numbers, falling back to 0 if the row is missing or an error occurs.
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('exchange_rates_cache')
      .select('usd_rate, eur_rate')
      .eq('base', 'LKR')
      .limit(1)

    if (error) {
      // return sensible fallback if the query fails
      return { usd_rate: 0, eur_rate: 0 }
    }

    const row = Array.isArray(data) ? data[0] : data

    if (!row) return { usd_rate: 0, eur_rate: 0 }

    return {
      usd_rate: typeof row.usd_rate === 'number' ? row.usd_rate : Number(row.usd_rate) || 0,
      eur_rate: typeof row.eur_rate === 'number' ? row.eur_rate : Number(row.eur_rate) || 0,
    }
  } catch (err) {
    return { usd_rate: 0, eur_rate: 0 }
  }
}

/**
 * Convert a LKR amount into the requested currency using provided rates.
 * - currency: 'LKR' | 'USD' | 'EUR'
 * - rates: result from getExchangeRates()
 * Returns a number (not formatted).
 */
export function convertPrice(
  priceLkr: number,
  currency: 'LKR' | 'USD' | 'EUR',
  rates: ExchangeRates
): number {
  if (typeof priceLkr !== 'number' || Number.isNaN(priceLkr)) return 0

  switch (currency) {
    case 'LKR':
      return Math.round(priceLkr)
    case 'USD':
      return Math.round(priceLkr * (rates.usd_rate || 0))
    case 'EUR':
      return Math.round(priceLkr * (rates.eur_rate || 0))
    default:
      return Math.round(priceLkr)
  }
}

/**
 * Format a numeric amount for display with currency symbol and separators.
 * Uses simple, predictable formatting:
 * - LKR: "Rs. 45,000,000"
 * - USD: "$139,500"
 * - EUR: "€130,500"
 */
export function formatPrice(amount: number, currency: 'LKR' | 'USD' | 'EUR'): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''

  const rounded = Math.round(amount)

  if (currency === 'LKR') {
    return `Rs. ${rounded.toLocaleString('en-US')}`
  }

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(rounded)
  }

  // EUR
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(rounded)
}

export default { getExchangeRates, convertPrice, formatPrice }
