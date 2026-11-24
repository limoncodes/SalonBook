"use client"

import * as React from "react"
import { ImagePlus, Loader2, Save, User } from "lucide-react"
import { toast } from "react-toastify"
import { authClient, useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminProfilePage() {
  const { data: session, isPending } = useSession()
  const [name, setName] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [imagePreview, setImagePreview] = React.useState("")
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (!session?.user) return
    setName(session.user.name || "")
    setImageUrl(session.user.image || "")
    setImagePreview(session.user.image || "")
  }, [session?.user])

  const initials =
    (name || session?.user?.name || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"

  const handleImageChange = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
      return
    }

    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
    setErrors((prev) => ({ ...prev, image: "" }))
    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      const imagebbApi = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`
      const res = await fetch(imagebbApi, {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      const uploadedUrl = result?.data?.url
      if (!res.ok || !uploadedUrl) {
        throw new Error(result?.error?.message || "Failed to upload image")
      }
      setImageUrl(uploadedUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Image upload error:", error)
      setErrors((prev) => ({ ...prev, image: error instanceof Error ? error.message : "Image upload failed" }))
      toast.error("Failed to upload image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    void handleImageChange(e.dataTransfer.files?.[0])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user) return

    const nextErrors: Record<string, string> = {}
    if (!name.trim()) nextErrors.name = "Name is required"
    if (isUploadingImage) nextErrors.image = "Please wait for image upload to finish"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl || undefined,
      })

      if (error) {
        throw new Error(error.message || "Failed to update profile")
      }

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isPending && !session?.user) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center">
          <p className="font-heading text-2xl font-semibold text-foreground">Please sign in</p>
          <p className="mt-2 text-sm text-text-secondary">You need to sign in to manage your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Admin Profile
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            My <span className="text-primary-light">Profile</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Update your profile information and keep your account details up to date.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">Profile Information</CardTitle>
            <CardDescription className="text-text-secondary">Change your name and profile image.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-20 border border-border/70">
                  {imagePreview ? <AvatarImage src={imagePreview} alt={name || "User"} /> : null}
                  <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary-light">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{session?.user?.name || "User"}</p>
                  <p className="text-sm text-text-secondary">{session?.user?.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="profile-name" className="inline-flex items-center gap-2 text-foreground">
                    <User className="size-4 text-primary-light" />
                    Full Name
                  </Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 border-border/80 bg-background/40 text-foreground"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email" className="text-foreground">Email</Label>
                  <Input
                    id="profile-email"
                    value={session?.user?.email || ""}
                    disabled
                    className="h-11 border-border/80 bg-background/40 text-text-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="inline-flex items-center gap-2 text-foreground">
                    <ImagePlus className="size-4 text-primary-light" />
                    Profile Image
                  </Label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`rounded-xl border border-dashed p-5 transition-colors ${
                      isDragging ? "border-primary bg-primary/10" : "border-border/80 bg-background/30"
                    }`}
                  >
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => void handleImageChange(e.target.files?.[0])}
                    />
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-full bg-primary/15 p-3 text-primary-light">
                        <ImagePlus className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Drag & drop your image here</p>
                        <p className="mt-1 text-xs text-text-secondary">or select an image file from your device</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border bg-background/40 text-foreground hover:bg-primary/10 hover:text-primary-light"
                        onClick={() => document.getElementById("profile-image")?.click()}
                        disabled={isUploadingImage}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                  {isUploadingImage && (
                    <p className="inline-flex items-center gap-2 text-sm text-text-secondary">
                      <Loader2 className="size-4 animate-spin" /> Uploading image...
                    </p>
                  )}
                  {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSaving || isUploadingImage || isPending}
                className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
