"use client";
import { Order, TimeSlotSummary } from '@/types';
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

interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export function extractUserInfoFromJWT(token: string): UserPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonPayload);

    const { id, name, email } = payload;

    return {
      id: String(id),
      name,
      email,
    };
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
}


export async function getAddressFromCoordinates(address:string): Promise<string | null> {
  try {

     console.error('Invalid coordinates:', address);

    const [lat, lon] = address.split(',').map(coord => coord.trim());
    if (!lat || !lon) {
      console.error('Invalid coordinates:', address);
      return null;
    }
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'OrderLk/1.0 (mithilathilochanaw@gmail.com)',
        },
      }
    );
  
    if (!response.ok) {
      console.error(`Error fetching address: ${response.statusText}`);
      return null;
    }
  
    const data = await response.json();
    console.log('Response from Nominatim:', data);
    return data.display_name || null;
  } catch (error) {
    console.error('Error in getAddressFromCoordinates:', error);
    return null;
  }
}


function aggregateOrdersByTimeSlot(propData: Order[]) {
  const slots: { [key: string]: { revenue: number; orders: number } } = {};

  propData.forEach(order => {
    const date = new Date(order.createdAt);
    const hour = date.getHours();
    const slotStartHour = Math.floor(hour / 3) * 3;
    const slotLabel = `${slotStartHour.toString().padStart(2, '0')}:00`;

    if (!slots[slotLabel]) {
      slots[slotLabel] = { revenue: 0, orders: 0 };
    }

    slots[slotLabel].orders += 1;
    slots[slotLabel].revenue += order.totalAmount ?? 0;
  });

  // Fill missing slots with zeroes for full 24-hour coverage
  const result = Array.from({ length: 8 }, (_, i) => {
    const label = `${(i * 3).toString().padStart(2, '0')}:00`;
    return {
      time: label,
      orders: slots[label]?.orders || 0,
      revenue: slots[label]?.revenue || 0,
    };
  });

  return result;
}
