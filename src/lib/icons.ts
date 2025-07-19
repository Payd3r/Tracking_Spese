import {
  Home, ShoppingCart, Car, Utensils, Gamepad2, Heart, GraduationCap, Briefcase,
  Plane, Trophy, Sparkles, Gift, Zap, Shield, Receipt, PiggyBank, TrendingUp, Circle,
  CreditCard, Wallet, BarChart3, Calendar, Settings, Plus, X, Check, Edit, Trash2, 
  ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Calculator, DollarSign, Banknote
} from "lucide-react";

// Icone per i tipi di transazione
export const transactionTypeIcons = {
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  transfer: ArrowRightLeft,
};

// Icone per i conti (aggiornate per corrispondere ai nomi usati nell'app)
export const accountIcons = {
  Revolut: CreditCard,
  Contanti: Banknote,
  Banca: CreditCard,
  PayPal: Wallet,
  cash: Wallet,
  bank: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

// Icone per le azioni
export const actionIcons = {
  calculator: Calculator,
  add: ArrowUpRight,
  remove: ArrowDownLeft,
};

// Pacchetto di 20 icone per le categorie (riutilizzabili)
export const categoryIcons = {
  home: Home,
  shopping: ShoppingCart,
  transport: Car,
  food: Utensils,
  entertainment: Gamepad2,
  health: Heart,
  education: GraduationCap,
  work: Briefcase,
  travel: Plane,
  sports: Trophy,
  beauty: Sparkles,
  pets: Heart,
  gifts: Gift,
  utilities: Zap,
  insurance: Shield,
  taxes: Receipt,
  savings: PiggyBank,
  investment: TrendingUp,
  charity: Heart,
  other: Circle,
};

// Mappa delle icone per le categorie del database (per compatibilità)
export const iconMap: Record<string, React.ComponentType<any>> = {
  'shopping-cart': ShoppingCart,
  'car': Car,
  'gamepad-2': Gamepad2,
  'heart': Heart,
  'home': Home,
  'shopping-bag': ShoppingCart,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'gift': Gift,
  'credit-card': CreditCard,
  'banknote': Banknote,
  'wallet': Wallet,
  'utensils': Utensils,
  'graduation-cap': GraduationCap,
  'briefcase': Briefcase,
  'plane': Plane,
  'trophy': Trophy,
  'sparkles': Sparkles,
  'zap': Zap,
  'shield': Shield,
  'receipt': Receipt,
  'piggy-bank': PiggyBank,
  'circle': Circle,
};

export const getIcon = (iconName: string) => {
  return categoryIcons[iconName as keyof typeof categoryIcons] || 
         iconMap[iconName] || 
         Circle;
};

// Esporta tutte le icone per uso diretto
export {
  Home, ShoppingCart, Car, Utensils, Gamepad2, Heart, GraduationCap, Briefcase,
  Plane, Trophy, Sparkles, Gift, Zap, Shield, Receipt, PiggyBank, TrendingUp, Circle,
  CreditCard, Wallet, BarChart3, Calendar, Settings, Plus, X, Check, Edit, Trash2, 
  ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Calculator, DollarSign, Banknote
};