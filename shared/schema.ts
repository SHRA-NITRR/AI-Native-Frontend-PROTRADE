import { z } from "zod";

export const tickerSchema = z.enum(["BTC", "ETH", "SOL"]);
export type Ticker = z.infer<typeof tickerSchema>;

export const orderTypeSchema = z.enum(["BUY", "SELL"]);
export type OrderType = z.infer<typeof orderTypeSchema>;

export const orderSchema = z.object({
  id: z.string(),
  ticker: tickerSchema,
  type: orderTypeSchema,
  amount: z.number(),
  price: z.number(),
  isLimit: z.boolean(),
  status: z.enum(["PENDING", "EXECUTED", "CANCELLED"]),
  timestamp: z.number(),
});
export type Order = z.infer<typeof orderSchema>;

export const portfolioSchema = z.object({
  balance: z.number(),
  holdings: z.record(tickerSchema, z.number()),
});
export type Portfolio = z.infer<typeof portfolioSchema>;

export const priceDataSchema = z.object({
  ticker: tickerSchema,
  price: z.number(),
  change24h: z.number(),
  history: z.array(z.number()),
});
export type PriceData = z.infer<typeof priceDataSchema>;
