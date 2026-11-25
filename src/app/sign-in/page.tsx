"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

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

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setGeneralError("");
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setGeneralError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const emailValue = String(formData.get("email") || "").trim();
    const passwordValue = String(formData.get("password") || "");

    const nextErrors: Record<string, string> = {};
    if (!emailValue) nextErrors.email = "Email is required";
    if (!passwordValue) nextErrors.password = "Password is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await authClient.signIn.email({
        email: emailValue,
        password: passwordValue,
        callbackURL: "/",
      });

      if (error) {
        setGeneralError(error.message || "Failed to sign in. Please try again.");
        console.error("Sign in error:", error);
        return;
      }

      console.log("Sign in success:", data);
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
                Welcome Back
              </p>
              <h1 className="mt-6 font-heading text-5xl font-semibold leading-tight tracking-tight text-foreground">
                Sign in to continue your{" "}
                <span className="text-primary-light">SalonBook</span> journey
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
                Access your account, manage appointments, and discover premium
                salon services tailored for you.
              </p>
            </div>

            <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary-light">
                  <LogIn className="size-5" />
                </div>
                <CardTitle className="mt-4 font-heading text-3xl font-semibold text-foreground">
                  Sign In
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
                <form className="space-y-5" onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        className={cn(
                          "h-11 bg-background/40 px-3.5 pr-11 text-foreground placeholder:text-text-secondary focus-visible:ring-primary/25",
                          errors.password
                            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                            : "border-border focus-visible:border-primary/60",
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
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {generalError && (
                    <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {generalError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || isGoogleLoading}
                    className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/70" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-surface px-3 text-text-secondary">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting || isGoogleLoading}
                    onClick={handleGoogleSignIn}
                    className="h-11 w-full rounded-lg border-border bg-background/30 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" data-icon="inline-start">
                        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.4-.2-2H12z" />
                        <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.6-2.5l-3.1-2.4c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H3v2.5C4.7 19.8 8.1 22 12 22z" />
                        <path fill="#4A90E2" d="M6.2 13.7c-.2-.6-.3-1.2-.3-1.7s.1-1.2.3-1.7V7.8H3C2.4 9.1 2 10.5 2 12s.4 2.9 1 4.2l3.2-2.5z" />
                        <path fill="#FBBC05" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.7 4.2 3 7.8l3.2 2.5c.8-2.5 3.1-4.4 5.8-4.4z" />
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <p className="text-center text-sm text-text-secondary">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium text-primary-light hover:text-primary"
                    >
                      Sign Up
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
