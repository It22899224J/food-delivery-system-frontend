"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  MoreVertical,
  PencilLine,
  Trash2,
  ArrowUpDown,
  Filter,
} from "lucide-react";

import { MenuItem, MenuCategory } from "@/types";
import { MenuItemCard } from "@/components/dashboard/menu-item-card";
import { CreateMenuItemDialog } from "@/components/dashboard/menu-item-create-form";

// Sample menu categories and items
const sampleCategories: MenuCategory[] = [
  {
    id: "cat1",
    name: "Burgers",
    description: "Juicy burgers with various toppings",
    order: 1,
  },
  {
    id: "cat2",
    name: "Sides",
    description: "Perfect companions to your main dish",
    order: 2,
  },
  {
    id: "cat3",
    name: "Beverages",
    description: "Refreshing drinks to complement your meal",
    order: 3,
  },
  {
    id: "cat4",
    name: "Desserts",
    description: "Sweet treats to finish your meal",
    order: 4,
  },
];

const sampleMenuItems: MenuItem[] = [
  {
    id: "item1",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
    price: 8.99,
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryId: "cat1",
    available: true,
    popular: true,
    allergies: ["Dairy", "Gluten"],
    dietary: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item2",
    name: "Veggie Burger",
    description: "Plant-based patty with lettuce, tomato, and vegan mayo",
    price: 9.99,
    image:
      "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryId: "cat1",
    available: true,
    popular: false,
    allergies: ["Gluten"],
    dietary: ["Vegetarian"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item3",
    name: "French Fries",
    description: "Crispy golden fries seasoned with salt",
    price: 3.99,
    image:
      "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryId: "cat2",
    available: true,
    popular: true,
    allergies: [],
    dietary: ["Vegetarian"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item4",
    name: "Chocolate Milkshake",
    description: "Creamy chocolate shake topped with whipped cream",
    price: 4.99,
    image:
      "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryId: "cat3",
    available: true,
    popular: false,
    allergies: ["Dairy"],
    dietary: ["Vegetarian"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item5",
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 5.99,
    image:
      "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryId: "cat4",
    available: false,
    popular: true,
    allergies: ["Dairy", "Eggs", "Gluten"],
    dietary: ["Vegetarian"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [categories, setCategories] =
    useState<MenuCategory[]>(sampleCategories);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const filteredItems = menuItems.filter((item) => {
    // First apply text search
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Then apply category/availability filter
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "available") return matchesSearch && item.available;
    if (activeFilter === "unavailable") return matchesSearch && !item.available;
    if (activeFilter === "popular") return matchesSearch && item.popular;

    // Filter by category
    return matchesSearch && item.categoryId === activeFilter;
  });

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Menu Management
            </h1>
            <p className="text-muted-foreground">
              Add, edit and manage your menu items.
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("available")}>
                Available Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("unavailable")}>
                Unavailable Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("popular")}>
                Popular Items
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
              <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
              <DropdownMenuItem>Price (High to Low)</DropdownMenuItem>
              <DropdownMenuItem>Recently Added</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs
          defaultValue="all"
          className="space-y-4"
          onValueChange={setActiveFilter}
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Items</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onToggleAvailability={toggleItemAvailability}
                  onUpdateItem={(updatedItem) => {
                    setMenuItems((items) =>
                      items.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                      )
                    );
                  }}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No menu items found</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </div>
            )}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onToggleAvailability={toggleItemAvailability}
                      onUpdateItem={(updatedItem) => {
                        setMenuItems((items) =>
                          items.map((item) =>
                            item.id === updatedItem.id ? updatedItem : item
                          )
                        );
                      }}
                    />
                  ))}
              </div>

              {filteredItems.filter((item) => item.categoryId === category.id)
                .length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
                  <p className="text-muted-foreground">
                    No items in this category
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Item
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <CreateMenuItemDialog
        open={isCreateDialogOpen}
        onOpenChange={() => setIsCreateDialogOpen(false)}
        onSave={(newItem) => {
          const completeItem: MenuItem = {
            ...newItem,
            id: `item${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setMenuItems((items) => [...items, completeItem]);
          setIsCreateDialogOpen(false);
        }}
      />
    </>
  );
}
