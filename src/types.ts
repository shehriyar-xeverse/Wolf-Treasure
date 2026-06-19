export interface BonusCard {
  id: string;
  casinoName: string;
  bonusText: string;
  freeSpins: number;
  highlightText: string;
  ratingStars: number;
  logoGlow: string;
}

export interface GameStat {
  label: string;
  value: string;
  description: string;
  iconName: string;
}

export interface FeatureBlock {
  title: string;
  tagline: string;
  description: string;
  badge: string;
  visualType: 'spins' | 'hold' | 'wild' | 'giant' | 'jackpot';
  color: string;
}

export interface PaytableItem {
  name: string;
  type: 'High' | 'Low' | 'Special';
  payout5: string;
  payout4: string;
  payout3: string;
  color: string;
  iconText: string;
  symbolColor: string;
  imageSrc?: string;
}

export interface PlayStep {
  number: number;
  title: string;
  description: string;
  stat?: string;
}

export interface PaymentGateway {
  name: string;
  type: string;
  limitMin: string;
  limitMax: string;
  speed: string;
  logoText: string;
  glowColor: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Slot game simulation types
export interface SlotSymbol {
  id: string;
  name: string;
  imageText: string;
  symbolColor: string;
  textColor: string;
  value5: number;
  value4: number;
  value3: number;
  isSpecial?: boolean;
}
