"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Link from "next/link";

// Load MapPicker dynamically
const MapPicker = dynamic(() => import("@/components/ui/map-picker"), {
  ssr: false,
});

const registrationFormSchema = z.object({
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
  ownerId: z.string().min(1, { message: "Owner ID is required." }),
  isActive: z.boolean().default(true),
  logo: z.string().optional(),
  rating: z.number().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function RegisterPage() {
  const [cuisineType, setCuisineType] = useState<string[]>([]);
  const [newCuisine, setNewCuisine] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 6.9271,
    lng: 79.8585,
  });
  const resturantAdminId = localStorage.getItem("userId") || "12345666";

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      position: { lat: 6.9271, lng: 79.8585 },
      phone: "",
      email: "",
      ownerId: resturantAdminId,
      isActive: true,
      rating: 0,
    },
  });

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

  function onSubmit(data: RegistrationFormValues) {
    console.log("Submitted registration data:", {
      ...data,
      cuisineType,
    });

    // Call API to create restaurant
    restaurantApi
      .create({
        ...data,
        cuisineType,
      })
      .then((response) => {
        console.log("Restaurant created:", response);
        window.location.href = "/dashboard";
      })
      .catch((error: any) => {
        console.error("Registration failed:", error);
      });
  }

  const addCuisine = () => {
    if (newCuisine && !cuisineType.includes(newCuisine)) {
      setCuisineType([...cuisineType, newCuisine]);
      setNewCuisine("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    setCuisineType(cuisineType.filter((c) => c !== cuisine));
  };

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <span className="text-xl font-bold">OrderLK</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-6 max-w-6xl mx-auto py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Register Your Restaurant
          </h1>
          <p className="text-muted-foreground">
            Create your restaurant profile and start accepting orders.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>
                  Tell us about your restaurant so customers can find you.
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
                        <Input
                          {...field}
                          placeholder="Enter your restaurant name"
                        />
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

                {/* Cuisine Types */}
                <div className="space-y-2">
                  <Label>Cuisine Types</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {cuisineType.map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {cuisine}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeCuisine(cuisine)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCuisine}
                      onChange={(e) => setNewCuisine(e.target.value)}
                      placeholder="Add cuisine type"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCuisine();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCuisine}
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add the types of cuisine your restaurant serves.
                  </p>
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Restaurant address" />
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
                          <Input
                            {...field}
                            placeholder="Restaurant phone number"
                          />
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
                          <Input
                            {...field}
                            type="email"
                            placeholder="restaurant@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                  Register Restaurant
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}
