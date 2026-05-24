import {
  Utensils, ShoppingCart, Car, GraduationCap, Gamepad2, HeartPulse, Tv, Home, Wallet, MoreHorizontal, Tag,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  car: Car,
  "graduation-cap": GraduationCap,
  "gamepad-2": Gamepad2,
  "heart-pulse": HeartPulse,
  tv: Tv,
  home: Home,
  wallet: Wallet,
  ellipsis: MoreHorizontal,
  tag: Tag,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Tag;
}

export const availableIcons = Object.keys(iconMap);
