"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Undo2, Camera, ImageIcon } from "lucide-react";
import { MenuItem } from "@/types";

interface CreateMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newItem: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => void;
  categoryId?: string;
  restaurantId: string;
}

export const CreateMenuItemDialog = ({
  open,
  onOpenChange,
  onSave,
  categoryId,
  restaurantId,
}: CreateMenuItemDialogProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    available: boolean;
    popular: boolean;
    allergies: string[];
    dietary: string[];
    restaurantId: string;
  }>({
    name: "",
    description: "",
    price: 0,
    image: "",
    categoryId: categoryId || "",
    available: true,
    popular: false,
    allergies: [],
    dietary: [],
    restaurantId: restaurantId,
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newDietary, setNewDietary] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    { id: "cat1", name: "Burgers" },
    { id: "cat2", name: "Sides" },
    { id: "cat3", name: "Beverages" },
    { id: "cat4", name: "Desserts" },
  ];

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "",
        categoryId: categoryId || "",
        available: true,
        popular: false,
        allergies: [],
        dietary: [],
        restaurantId: restaurantId,
      });
      setNewAllergy("");
      setNewDietary("");
      setImagePreview(null);
    }
    onOpenChange(open);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue = type === "number" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: e.target.value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result as string;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 512; // Set your square size here

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Crop the image to a square from the center
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;

      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

      const base64Image = canvas.toDataURL("image/jpeg", 0.9); 
      setImagePreview(base64Image);
      setFormData((prev) => ({
        ...prev,
        image: base64Image,
      }));
    };
  };

  reader.readAsDataURL(file);
};


  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const addDietary = () => {
    if (newDietary.trim() && !formData.dietary.includes(newDietary.trim())) {
      setFormData((prev) => ({
        ...prev,
        dietary: [...prev.dietary, newDietary.trim()],
      }));
      setNewDietary("");
    }
  };

  const removeDietary = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.filter((d) => d !== diet),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Menu Item
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          {/* Category dropdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryId" className="text-right font-medium">
              Category
            </Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              className="col-span-3 border rounded-md p-2"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image upload section */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2 font-medium">Image</Label>
            <div className="col-span-3">
              <div className="mb-3 flex flex-col items-center">
                {imagePreview ? (
                  <div className="relative mb-3 rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                      src={imagePreview}
                      alt="Menu item preview"
                      className="h-48 w-full object-cover object-center"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-md h-48 w-full bg-gray-50 dark:bg-gray-900">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex items-center justify-center w-full mt-2">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium text-sm"
                  >
                    <Camera className="h-4 w-4" />
                    {imagePreview ? "Change image" : "Upload image"}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the form remains the same */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Item name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right font-medium">
              Price
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2 text-lg font-medium text-muted-foreground">
                LKR 
              </span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="description"
              className="text-right pt-2 font-medium"
            >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="col-span-3 resize-none"
              placeholder="Describe the menu item..."
            />
          </div>

          {/* Allergies and dietary sections remain unchanged */}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex items-center gap-1"
          >
            <Undo2 className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-1 bg-primary hover:bg-primary/90"
            disabled={!formData.name || !formData.categoryId}
          >
            <Save className="h-4 w-4" />
            Create Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
