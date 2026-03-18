"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Loader2, Upload } from "lucide-react";
import Image from "next/image";

import type { HomepageContent } from "@/lib/data/site-content";
import { saveHomepageContentAction, uploadHomepageImageAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  content: HomepageContent;
}

type FieldType = "text" | "textarea" | "toggle";

interface FieldDef {
  name: keyof HomepageContent;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
}

const SECTIONS: { title: string; description: string; fields: FieldDef[] }[] = [
  {
    title: "Announcement Bar",
    description: "Banner displayed at the top of every page.",
    fields: [
      { name: "announcementBarVisible", label: "Show announcement bar", type: "toggle" },
      { name: "announcementBar", label: "Announcement text", type: "text" },
    ],
  },
  {
    title: "Homepage Banner",
    description: "Main wide banner image on the homepage.",
    fields: [
      { name: "bannerVisible", label: "Show homepage banner", type: "toggle" },
      {
        name: "bannerImage",
        label: "Banner image path",
        type: "text",
        placeholder: "/homepage/banner.jpg",
        hint: "Upload an image below or paste a path manually.",
      },
      {
        name: "bannerLink",
        label: "Banner link (optional)",
        type: "text",
        placeholder: "/shop",
        hint: "Where the banner links to, e.g. /shop, /shop?category=bags",
      },
    ],
  },
  {
    title: "Featured Products Section",
    description: "Section heading for the featured products grid.",
    fields: [
      { name: "featuredProductsVisible", label: "Show featured products", type: "toggle" },
      { name: "featuredTitle", label: "Section title", type: "text", placeholder: "Featured Products" },
      { name: "featuredSubtitle", label: "Section subtitle", type: "text", placeholder: "Handpicked favorites…" },
    ],
  },
  {
    title: "Newsletter Section",
    description: "Newsletter signup area at the bottom of the homepage.",
    fields: [
      { name: "newsletterSectionVisible", label: "Show newsletter section", type: "toggle" },
      { name: "newsletterTitle", label: "Section title", type: "text", placeholder: "Stay in the Loop" },
      { name: "newsletterSubtitle", label: "Section subtitle", type: "textarea" },
    ],
  },
];

export function HomepageContentForm({ content }: Props) {
  const [values, setValues] = useState<HomepageContent>({ ...content });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function updateField(name: keyof HomepageContent, value: string | boolean) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    const formData = new FormData();
    for (const [key, val] of Object.entries(values)) {
      if (typeof val === "boolean") {
        if (val) formData.set(key, "on");
      } else {
        formData.set(key, val);
      }
    }

    startTransition(async () => {
      try {
        const result = await saveHomepageContentAction(formData);
        if (result.success) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  };

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadHomepageImageAction(fd);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if (result.url) {
        updateField("bannerImage", result.url);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {SECTIONS.map((section, idx) => (
        <div key={section.title}>
          {idx > 0 && <Separator className="mb-8" />}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => {
              if (field.type === "toggle") {
                return (
                  <div key={field.name} className="flex items-center gap-3 sm:col-span-2">
                    <input
                      type="checkbox"
                      id={field.name}
                      checked={values[field.name] as boolean}
                      onChange={(e) => updateField(field.name, e.target.checked)}
                      className="size-4 rounded border-input accent-primary"
                    />
                    <label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                    </label>
                  </div>
                );
              }

              return (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "sm:col-span-2" : ""}
                >
                  <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      value={values[field.name] as string}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      rows={3}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  ) : (
                    <input
                      id={field.name}
                      type="text"
                      value={values[field.name] as string}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                    />
                  )}
                  {field.hint && (
                    <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
                  )}

                  {/* Banner image upload widget */}
                  {field.name === "bannerImage" && (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleBannerUpload}
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Uploading…
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 size-4" />
                              Upload banner image
                            </>
                          )}
                        </Button>
                      </div>
                      {(values.bannerImage as string) && (
                        <div className="relative aspect-[21/7] w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={values.bannerImage as string}
                            alt="Banner preview"
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Separator />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <Check className="size-4" />
            Saved successfully
          </span>
        )}
        {error && (
          <span className="text-sm font-medium text-destructive">{error}</span>
        )}
      </div>
    </form>
  );
}
