"use client";

import * as React from "react";
import { ImagePlus, PlusCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const serviceCategories = [
  "Haircut",
  "Hair Coloring",
  "Facial",
  "Spa & Massage",
  "Nails",
  "Makeup",
  "Beard & Grooming",
  "Other",
];

export default function AddServicePage() {
  const [serviceImage, setServiceImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setServiceImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, serviceImage: "" }));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      serviceName: String(formData.get("serviceName") || "").trim(),
      serviceCategory: String(formData.get("serviceCategory") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      price: String(formData.get("price") || "").trim(),
      duration: String(formData.get("duration") || "").trim(),
      serviceStatus: String(formData.get("serviceStatus") || "Active").trim(),
      serviceImage,
    };

    const nextErrors: Record<string, string> = {};
    if (!data.serviceName) nextErrors.serviceName = "Service name is required";
    if (!data.serviceCategory) nextErrors.serviceCategory = "Service category is required";
    if (!data.description) nextErrors.description = "Description is required";
    if (!data.price) nextErrors.price = "Price is required";
    else if (Number(data.price) <= 0) nextErrors.price = "Price must be a positive number";
    if (!data.duration) nextErrors.duration = "Duration is required";
    else if (Number(data.duration) <= 0) nextErrors.duration = "Duration must be a positive number";
    if (!serviceImage) nextErrors.serviceImage = "Service image is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    console.log("Add service form data:", data);
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Add New Service
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
            Create a new salon service with complete details, pricing, duration, and a service image for your customers.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary-light">
              <PlusCircle className="size-5" />
            </div>
            <CardTitle className="mt-4 font-heading text-2xl font-semibold text-foreground">
              Service Information
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Fill in all service details below to publish a new offering on SalonBook.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2 xl:col-span-2">
                  <Label htmlFor="serviceName" className="text-foreground">
                    Service Name
                  </Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    type="text"
                    placeholder="Luxury Hair Styling & Blowout"
                    onChange={() => clearError("serviceName")}
                    className={cn(
                      "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                      errors.serviceName
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                        : "border-border focus-visible:border-primary/60",
                    )}
                  />
                  {errors.serviceName && <p className="text-xs text-destructive">{errors.serviceName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceCategory" className="text-foreground">
                    Service Category
                  </Label>
                  <select
                    id="serviceCategory"
                    name="serviceCategory"
                    defaultValue=""
                    onChange={() => clearError("serviceCategory")}
                    className={cn(
                      "h-11 w-full rounded-md bg-background/40 px-3.5 text-sm text-foreground outline-none transition-colors focus:ring-3 focus:ring-primary/25",
                      errors.serviceCategory
                        ? "border border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border border-border focus:border-primary/60",
                    )}
                  >
                    <option value="" disabled className="bg-surface text-text-secondary">
                      Choose a service category
                    </option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category} className="bg-surface text-foreground">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.serviceCategory && <p className="text-xs text-destructive">{errors.serviceCategory}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the service experience, what is included, and the results customers can expect after their appointment."
                  rows={5}
                  onChange={() => clearError("description")}
                  className={cn(
                    "min-h-[140px] w-full rounded-md bg-background/40 px-3.5 py-3 text-sm text-foreground placeholder:text-text-secondary outline-none transition-colors focus:ring-3 focus:ring-primary/25",
                    errors.description
                      ? "border border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "border border-border focus:border-primary/60",
                  )}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-foreground">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="$45.00"
                    onChange={() => clearError("price")}
                    className={cn(
                      "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                      errors.price
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                        : "border-border focus-visible:border-primary/60",
                    )}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-foreground">
                    Estimated Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="60"
                    onChange={() => clearError("duration")}
                    className={cn(
                      "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                      errors.duration
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                        : "border-border focus-visible:border-primary/60",
                    )}
                  />
                  {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
                </div>

                <div className="space-y-2 md:col-span-2 xl:col-span-1">
                  <Label htmlFor="serviceStatus" className="text-foreground">
                    Service Status
                  </Label>
                  <select
                    id="serviceStatus"
                    name="serviceStatus"
                    defaultValue="Active"
                    className="h-11 w-full rounded-md border border-border bg-background/40 px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-3 focus:ring-primary/25"
                  >
                    <option value="Active" className="bg-surface text-foreground">
                      Active - Visible to customers
                    </option>
                    <option value="Inactive" className="bg-surface text-foreground">
                      Inactive - Hidden from customers
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground">Service Image</Label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={cn(
                    "rounded-xl border border-dashed p-5 transition-colors sm:p-6",
                    errors.serviceImage
                      ? "border-destructive bg-destructive/5"
                      : isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background/25 hover:border-primary/40",
                  )}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Service preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="size-8 text-text-secondary" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground sm:text-base">
                        Upload a service image from your device
                      </p>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Drag and drop an image here, or select a file to show customers what this service looks like. Image URL input is not used.
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-lg border-border bg-surface/40 px-4 text-sm hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="size-4" data-icon="inline-start" />
                          Select Image
                        </Button>
                        {serviceImage && (
                          <p className="truncate text-xs text-text-secondary sm:text-sm">
                            Selected file: {serviceImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {errors.serviceImage && <p className="text-xs text-destructive">{errors.serviceImage}</p>}
              </div>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d] sm:w-auto"
                >
                  <PlusCircle className="size-4" data-icon="inline-start" />
                  Add Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
