"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Eye, EyeOff, ImagePlus, Loader2, Upload, UserPlus, X } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const passwordRules = [
    { label: "6+ characters", valid: password.length >= 6 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(password) },
  ];
  const router = useRouter()

  const allPasswordValid = passwordRules.every((rule) => rule.valid);
  const showPasswordState = password.length > 0;

  const handleFile = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setErrors((prev) => ({ ...prev, image: "" }));
    const formdata = new FormData()
    formdata.append("image", file)
    const imagebbApi = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`
    const res = await fetch(imagebbApi, {
      method: "POST",
      body: formdata
    })
    const result = await res.json();
    const imageURL = result.data.url;
    setImageUrl(imageURL)

  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const previewSrc = imagePreview || imageUrl;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const image = String(formData.get("imageUrl") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.fullName = "Full name is required";
    if (!email) nextErrors.email = "Email is required";
    if (!password) nextErrors.password = "Password is required";
    if (!allPasswordValid) nextErrors.password = "Password does not meet requirements";
    if (!imagePreview && !image) nextErrors.image = "Profile image is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const { data } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        callbackURL: "/",
      });

      console.log("Sign up form data:", data);
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
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
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      className={cn(
                        "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                        errors.fullName
                          ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                          : "border-border focus-visible:border-primary/60",
                      )}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={cn(
                        "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                        errors.email
                          ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                          : "border-border focus-visible:border-primary/60",
                      )}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        className={cn(
                          "h-11 bg-background/40 px-3.5 pr-11 text-foreground placeholder:text-text-secondary focus-visible:ring-3",
                          errors.password &&
                          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                          !errors.password &&
                          !showPasswordState &&
                          "border-border focus-visible:border-primary/60 focus-visible:ring-primary/25",
                          !errors.password &&
                          showPasswordState &&
                          !allPasswordValid &&
                          "border-amber-500/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
                          !errors.password &&
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
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
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
                        errors.image
                          ? "border-destructive bg-destructive/5"
                          : isDragging
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
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
                          console.log("Profile image URL:", e.target.value);
                        }}
                        className={cn(
                          "h-11 bg-background/40 px-3.5 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                          errors.image
                            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                            : "border-border focus-visible:border-primary/60",
                        )}
                      />
                    </div>
                    {errors.image && (
                      <p className="text-xs text-destructive">{errors.image}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
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
