"use client";

import { useEffect, useState } from "react";
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
import { foodItemApi, restaurantApi } from "@/lib/api-service";
import { getRestaurantId } from "@/lib/utils";

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const restaurantId = localStorage.getItem("restaurantId");
  const [categories, setCategories] =
    useState<MenuCategory[]>(sampleCategories);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        if (!restaurantId) {
          throw new Error("No restaurantId found in localStorage");
        }
        const items = await restaurantApi.getById(restaurantId);
        setMenuItems(items.menuItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      // Assuming categories are fetched from a separate API endpoint
      // Replace with actual API call when available
      setCategories([
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
      ]);
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "available") return matchesSearch && item.available;
    if (activeFilter === "unavailable") return matchesSearch && !item.available;
    if (activeFilter === "popular") return matchesSearch && item.popular;

    return matchesSearch && item.categoryId === activeFilter;
  });

  const toggleItemAvailability = async (itemId: string) => {
    const item = menuItems.find((item) => item.id === itemId);
    if (!item) return;

    try {
      // Create FormData for the update API call
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("price", item.price.toString());
      formData.append("categoryId", item.categoryId);
      formData.append("available", (!item.available).toString());
      formData.append("popular", item.popular.toString());
      formData.append("restaurantId", (restaurantId ?? "").toString());

      if (item.allergies) {
        item.allergies.forEach((allergy) => {
          formData.append("allergies", allergy);
        });
      }

      if (item.dietary) {
        item.dietary.forEach((diet) => {
          formData.append("dietary", diet);
        });
      }

      // Don't append the image if we're just toggling availability
      // unless the API requires it every time

      const updatedItem = await foodItemApi.update(itemId, formData);

      setMenuItems((items) =>
        items.map((i) => (i.id === itemId ? updatedItem : i))
      );
    } catch (error) {
      console.error("Failed to update item availability:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await foodItemApi.delete(itemId);
      setMenuItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  const handleCreateItem = async (newItemData: any) => {
    try {
      // Convert the new item data to FormData
      const formData = new FormData();
      Object.entries(newItemData).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const createdItem = await foodItemApi.create(formData);
      setMenuItems((items) => [...items, createdItem]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create menu item:", error);
    }
  };

  const handleUpdateItem = async (updatedItem: MenuItem) => {

    console.log("Updated item:", updatedItem);
  try {
            const formData = new FormData();
            Object.entries(updatedItem).forEach(([key, value]) => {
              if (key === "image" && value instanceof File) {
                formData.append("image", value);
              } else if (Array.isArray(value)) {
                value.forEach((item) => {
                  formData.append(key, item);
                });
              } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
              }
            });
    const savedItem = await foodItemApi.update(updatedItem.id, formData);

    setMenuItems((items) =>
      items.map((item) => (item.id === savedItem.id ? savedItem : item))
    );
  } catch (error) {
    console.error("Failed to update menu item:", error);
  }
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
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
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
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
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
        restaurantId={getRestaurantId() || restaurantId || ""}
        onSave={async (newItem) => {
          try {
            const formData = new FormData();
            Object.entries(newItem).forEach(([key, value]) => {
              if (key === "image" && value instanceof File) {
                formData.append("image", value);
              } else if (Array.isArray(value)) {
                value.forEach((item) => {
                  formData.append(key, item);
                });
              } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
              }
            });
            const createdItem = await foodItemApi.create(formData);
            setMenuItems((items) => [...items, createdItem]);
            setIsCreateDialogOpen(false);
          } catch (error) {
            console.error("Failed to create menu item:", error);
          }
        }}
      />
    </>
  );
}
