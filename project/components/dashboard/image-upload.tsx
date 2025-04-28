"use client"

import { useState } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  imageType: 'logo' | 'banner' | 'food';
  defaultImage?: string;
  aspectRatio?: string;
}

export function ImageUpload({ 
  imageType, 
  defaultImage,
  aspectRatio = "1/1" 
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    setIsUploading(true);
    
    // Create a URL for the file to preview
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        setImage(reader.result as string);
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div 
        style={{ aspectRatio }}
        className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted hover:border-muted-foreground/50 transition-colors"
      >
        <input
          type="file"
          id={`upload-${imageType}`}
          accept="image/*"
          className="sr-only"
          onChange={handleImageChange}
        />
        
        {image ? (
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={`${imageType} image`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" asChild>
                <label htmlFor={`upload-${imageType}`} className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </label>
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={`upload-${imageType}`}
            className="flex flex-col items-center justify-center w-full h-full p-4 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm font-semibold">
                {isUploading ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}