"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  BarChart4,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";
import logoFood from "../../images/logoFood.png";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Restaurant Profile", href: "/dashboard/profile", icon: Store },
    { name: "Menu Management", href: "/dashboard/menu", icon: UtensilsCrossed },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart4 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden border-b py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Image
              src={logoFood}
              alt="FoodHub Logo"
              className="h-16 w-auto ml-5"
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Image
                  src={logoFood}
                  alt="FoodHub Logo"
                  className="h-16 w-auto ml-5"
                  priority
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close Sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r">
          <div className="p-4 flex items-center">
            <div className="flex items-center gap-2">
              <Image
                src={logoFood}
                alt="FoodHub Logo"
                className="h-16 w-auto ml-5"
                priority
              />
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href ||
                    pathname?.startsWith(`${item.href}/`)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <header className="hidden lg:flex border-b py-2 px-6 items-center justify-end gap-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <ModeToggle />
            <div className="flex items-center px-3 py-2 rounded-full text-sm font-medium bg-muted">
              Restaurant Name
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
