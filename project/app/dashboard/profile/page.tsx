"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { restaurantApi } from "@/lib/api-service";
import { extractUserInfoFromJWT, setRestaurantId } from "@/lib/utils";

// Load MapPicker dynamically
const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
  ssr: false,
});

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  position: z
    .object({
      lat: z.number().refine((value) => !isNaN(value), {
        message: "Latitude must be a valid number",
      }),
      lng: z.number().refine((value) => !isNaN(value), {
        message: "Longitude must be a valid number",
      }),
    })
    .refine((data) => !isNaN(data.lat) && !isNaN(data.lng), {
      message: "Position coordinates are required.",
    }),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  isActive: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [newCuisine, setNewCuisine] = useState("");
  const token = localStorage.getItem("token"); 
  const ownerId = token ? extractUserInfoFromJWT(token)?.id : undefined;
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 6.9271,
    lng: 79.8585,
  });

  // Fetch restaurant data
  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        if (!ownerId) {
          console.error("Owner ID is missing.");
          return;
        }
        const data = await restaurantApi.getByOwnerId(ownerId);
        setRestaurantId(data.id); 
        setRestaurantId(data.id);
        form.reset(data); 
        form.setValue(
          "position",
          data.position || { lat: 6.9271, lng: 79.8585 }
        );
        form.setValue("address", data.address || "");
        form.setValue("name", data.name || "");
        form.setValue("description", data.description || "");
        form.setValue("phone", data.phone || "");
        form.setValue("email", data.email || "");
        form.setValue("isActive", data.isActive || true);
        setCuisineTypes(data.cuisineTypes || []);
        setPosition(data.position || { lat: 6.9271, lng: 79.8585 });
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    }

    fetchRestaurantData();
  }, [ownerId]);

  async function fetchAddressFromCoords(lat: number, lng: number) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return data.display_name as string;
  }

  const handlePositionChange = async (newPos: { lat: number; lng: number }) => {
    setPosition(newPos);
    form.setValue("position", newPos);
    const address = await fetchAddressFromCoords(newPos.lat, newPos.lng);
    form.setValue("address", address);
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Submitted profile data:", {
      ...data,
      cuisineTypes,
      location: position,
    });
    if (restaurantId) {
      restaurantApi.update(restaurantId, data);
    } else {
      console.error("Cannot update: restaurantId is null.");
    }
  }

  const addCuisine = () => {
    if (newCuisine && !cuisineTypes.includes(newCuisine)) {
      setCuisineTypes([...cuisineTypes, newCuisine]);
      setNewCuisine("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    setCuisineTypes(cuisineTypes.filter((c) => c !== cuisine));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Restaurant Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your restaurant information and settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none min-h-[100px]"
                        placeholder="Tell customers about your restaurant..."
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your public profile and in
                      search results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map Location */}
              <div>
                <Label htmlFor="location">Restaurant Location</Label>

                <div className="mt-2">
                  <MapPicker
                    position={position}
                    setPosition={handlePositionChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Click or drag the marker to set your restaurant's location.
                </p>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <Separator />

              <Separator />

              {/* Active Switch */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Restaurant Availability
                      </FormLabel>
                      <FormDescription>
                        When disabled, your restaurant will not receive new
                        orders.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
