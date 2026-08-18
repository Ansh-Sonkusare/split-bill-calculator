import type { Currency } from "./stellar";

export interface BillTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  defaultCurrency: Currency;
  suggestedSplits: number;
}

export const templates: BillTemplate[] = [
  {
    id: "dinner",
    name: "Dinner",
    emoji: "🍽️",
    description: "Split a restaurant bill",
    defaultCurrency: "XLM",
    suggestedSplits: 4,
  },
  {
    id: "groceries",
    name: "Groceries",
    emoji: "🛒",
    description: "Shared grocery run",
    defaultCurrency: "XLM",
    suggestedSplits: 2,
  },
  {
    id: "rent",
    name: "Rent",
    emoji: "🏠",
    description: "Monthly rent or utilities",
    defaultCurrency: "USDC",
    suggestedSplits: 3,
  },
  {
    id: "travel",
    name: "Travel",
    emoji: "✈️",
    description: "Flights, hotels, transport",
    defaultCurrency: "USDC",
    suggestedSplits: 3,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    emoji: "📺",
    description: "Shared streaming or software",
    defaultCurrency: "USDC",
    suggestedSplits: 3,
  },
  {
    id: "custom",
    name: "Custom",
    emoji: "✏️",
    description: "Start from scratch",
    defaultCurrency: "XLM",
    suggestedSplits: 2,
  },
];
