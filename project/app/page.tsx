'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ForkKnifeCrossedIcon } from 'lucide-react';
import { restaurantApi } from '@/lib/api-service';
import { setRestaurantId } from '@/lib/utils';

export default function Home() {
  const params = new URLSearchParams(window.location.search);
    const token = params.get("token")
    const role = params.get("role")||"RESTAURANT_ADMIN"

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    }
  useEffect(() => {
    
    const fetchRestaurantData = async () => {
      try {
        if (!token) {
          console.error("Owner ID is missing.");
          return;
        }
        const data = await restaurantApi.getByOwnerId(token);
        setRestaurantId(data.id); 
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };
    fetchRestaurantData();
      // Clean the URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">FoodHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="http://localhost:5173/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-muted/50 to-muted">
        <div className="container max-w-6xl px-4 py-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Restaurant Management Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Manage your restaurant profile, menu items, and orders all in one
            place.
          </p>
          <Button size="lg" asChild className="m-2">
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" asChild className="m-2 bg-yellow-500 text-white hover:bg-yellow-600">
            <Link href="/register">
              Register Restaurant
              <ForkKnifeCrossedIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FoodHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
