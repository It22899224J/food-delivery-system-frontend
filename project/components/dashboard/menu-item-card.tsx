"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Trash2, Star } from "lucide-react";
import { MenuItem } from "@/types";
import { EditMenuItemDialog } from "./menu-item-form";
import { ConfirmDialog } from "./confirm-dialog";

interface MenuItemCardProps {
  item: MenuItem;
  onToggleAvailability: (id: string) => void;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

export const MenuItemCard = ({
  item,
  onToggleAvailability,
  onUpdateItem,
  onDeleteItem,
}: MenuItemCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSaveItem = (updatedItem: MenuItem) => {
    onUpdateItem(updatedItem);
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
        <div className="relative aspect-video">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {item.popular && (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-white border-none gap-1 px-2 py-1">
              <Star className="h-3 w-3 fill-current" /> Popular
            </Badge>
          )}
        </div>

        <CardHeader className="p-5 pb-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="font-bold text-lg text-primary">
              ${item.price.toFixed(2)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-3 flex-grow">
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.allergies.map((allergy) => (
              <Badge
                key={allergy}
                variant="outline"
                className="text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
              >
                {allergy}
              </Badge>
            ))}
            {item.dietary.map((diet) => (
              <Badge
                key={diet}
                variant="outline"
                className="text-xs bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              >
                {diet}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-3 flex items-center justify-between border-t mt-auto">
          <div className="flex items-center gap-2">
            <Switch
              checked={item.available}
              onCheckedChange={() => onToggleAvailability(item.id)}
              id={`available-${item.id}`}
              className="data-[state=checked]:bg-green-600"
            />
            <label
              htmlFor={`available-${item.id}`}
              className={`text-sm font-medium ${
                item.available ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {item.available ? "Available" : "Unavailable"}
            </label>
          </div>

          <div className="flex gap-2">
            <ConfirmDialog
              title="Edit this item?"
              description="Are you sure you want to edit this menu item?"
              confirmText="Edit"
              onConfirm={() => setIsEditDialogOpen(true)}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <PencilLine className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            </ConfirmDialog>

            {onDeleteItem && (
              <ConfirmDialog
                title="Delete this item?"
                description="This action cannot be undone. Are you sure you want to delete it?"
                confirmText="Delete"
                onConfirm={() => onDeleteItem(item.id)}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove
                </Button>
              </ConfirmDialog>
            )}
          </div>
        </CardFooter>
      </Card>

      <EditMenuItemDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        item={item}
        onSave={handleSaveItem}
      />
    </>
  );
};
