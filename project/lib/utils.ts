import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setRestaurantId(restaurantId: string): void {
  localStorage.setItem("restaurantId", restaurantId);
}

export function getRestaurantId(): string | null {
  return localStorage.getItem("restaurantId");
}

export function removeRestaurantId(): void {
  localStorage.removeItem("restaurantId");
}