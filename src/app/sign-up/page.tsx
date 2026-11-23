"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Eye, EyeOff, ImagePlus, Upload, UserPlus, X } from "lucide-react";
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

export default function SignUpPage() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const passwordRules = [
    { label: "6+ characters", valid: password.length >= 6 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(password) },
  ];

  const allPasswordValid = passwordRules.every((rule) => rule.valid);
  const showPasswordState = password.length > 0;

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const previewSrc = imagePreview || imageUrl;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      imageUrl: formData.get("imageUrl"),
    };

    console.log("Sign up form data:", data);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="hidden lg:block">
              <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
                Join SalonBook
              </p>
              <h1 className="mt-6 font-heading text-5xl font-semibold leading-tight tracking-tight text-foreground">
                Create your account and start your{" "}
                <span className="text-primary-light">beauty journey</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
                Sign up to explore salon services, save your profile, and book
                appointments with trusted professionals.
              </p>
            </div>

            <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary-light">
                  <UserPlus className="size-5" />
                </div>
                <CardTitle className="mt-4 font-heading text-3xl font-semibold text-foreground">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Create your SalonBook account to get started.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 border-border bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:border-primary/60 focus-visible:ring-primary/25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 border-border bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:border-primary/60 focus-visible:ring-primary/25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "h-11 bg-background/40 px-3.5 pr-11 text-foreground placeholder:text-text-secondary focus-visible:ring-3",
                          !showPasswordState &&
                            "border-border focus-visible:border-primary/60 focus-visible:ring-primary/25",
                          showPasswordState &&
                            !allPasswordValid &&
                            "border-amber-500/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
                          showPasswordState &&
                            allPasswordValid &&
                            "border-success/70 focus-visible:border-success focus-visible:ring-success/20",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {passwordRules.map((rule) => (
                        <span
                          key={rule.label}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                            !showPasswordState &&
                              "border-border bg-background/30 text-text-secondary",
                            showPasswordState &&
                              rule.valid &&
                              "border-success/30 bg-success/10 text-success",
                            showPasswordState &&
                              !rule.valid &&
                              "border-amber-500/30 bg-amber-500/10 text-amber-400",
                          )}
                        >
                          {rule.valid ? (
                            <Check className="size-3" />
                          ) : (
                            <X className="size-3" />
                          )}
                          {rule.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">Profile Image</Label>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      className={cn(
                        "rounded-xl border border-dashed p-4 transition-colors",
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background/25 hover:border-primary/40",
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                          {previewSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previewSrc}
                              alt="Profile preview"
                              className="size-full object-cover"
                            />
                          ) : (
                            <ImagePlus className="size-6 text-text-secondary" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            Drag & drop your image here
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            Or select a file from your device.
                          </p>
                          <div className="mt-3">
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
                              className="h-9 rounded-lg border-border bg-surface/40 px-4 text-sm hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="size-4" data-icon="inline-start" />
                              Select Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-sm text-text-secondary">
                        Or paste image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        placeholder="https://example.com/profile-image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="h-11 border-border bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:border-primary/60 focus-visible:ring-primary/25"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
                  >
                    Create Account
                  </Button>

                  <p className="text-center text-sm text-text-secondary">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium text-primary-light hover:text-primary"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
