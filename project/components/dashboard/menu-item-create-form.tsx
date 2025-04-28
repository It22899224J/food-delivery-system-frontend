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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Undo2, Camera, ImageIcon } from "lucide-react";
import { MenuItem } from "@/types";

interface CreateMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newItem: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => void;
  categoryId?: string;
}

export const CreateMenuItemDialog = ({
  open,
  onOpenChange,
  onSave,
  categoryId,
}: CreateMenuItemDialogProps) => {
  const [formData, setFormData] = useState<
    Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    price: 0,
    image: "",
    categoryId: categoryId || "",
    available: true,
    popular: false,
    allergies: [],
    dietary: [],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newDietary, setNewDietary] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form only when closing
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      // In a real application, you would upload the image to a server
      // and get back a URL. For now, we'll just use the file name.
      setFormData((prev) => ({
        ...prev,
        image: imageUrl, // In production, this would be the URL from your server
      }));
    }
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
    handleOpenChange(false);
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
                $
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

          {/* Allergies section */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2 font-medium">Allergies</Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {formData.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="outline"
                    className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800 gap-1 px-2 py-1"
                  >
                    {allergy}
                    <button
                      onClick={() => removeAllergy(allergy)}
                      className="ml-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 p-0.5"
                      aria-label={`Remove ${allergy}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy..."
                  className="flex-grow"
                  onKeyDown={(e) => handleKeyPress(e, addAllergy)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addAllergy}
                  variant="outline"
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-300 dark:hover:border-red-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dietary section */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2 font-medium">Dietary</Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {formData.dietary.map((diet) => (
                  <Badge
                    key={diet}
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 gap-1 px-2 py-1"
                  >
                    {diet}
                    <button
                      onClick={() => removeDietary(diet)}
                      className="ml-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900 p-0.5"
                      aria-label={`Remove ${diet}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newDietary}
                  onChange={(e) => setNewDietary(e.target.value)}
                  placeholder="Add dietary option..."
                  className="flex-grow"
                  onKeyDown={(e) => handleKeyPress(e, addDietary)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addDietary}
                  variant="outline"
                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-950 dark:hover:text-green-300 dark:hover:border-green-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Options section */}
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right font-medium">Options</div>
            <div className="col-span-3 space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("available", checked)
                  }
                  className="data-[state=checked]:bg-green-600"
                />
                <Label
                  htmlFor="available"
                  className={`font-medium ${
                    formData.available ? "text-green-600" : ""
                  }`}
                >
                  Available for ordering
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("popular", checked)
                  }
                  className="data-[state=checked]:bg-yellow-500"
                />
                <Label
                  htmlFor="popular"
                  className={`font-medium ${
                    formData.popular ? "text-yellow-600" : ""
                  }`}
                >
                  Mark as popular item
                </Label>
              </div>
            </div>
          </div>
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
            disabled={!formData.name}
          >
            <Save className="h-4 w-4" />
            Create Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
