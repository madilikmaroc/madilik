"use client";

import { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadProductImageAction } from "@/app/admin/(dashboard)/products/actions";

interface ProductImageManagerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

function ImageThumbnail({ url }: { url: string }) {
  const [error, setError] = useState(false);
  const isRelative = url.startsWith("/");

  return (
    <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
      {url && !error ? (
        <img
          src={isRelative ? url : url}
          alt=""
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground/50">
          <span className="text-lg">?</span>
        </div>
      )}
    </div>
  );
}

export function ProductImageManager({ value, onChange }: ProductImageManagerProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const urls = value.length > 0 ? value : [""];

  function addImage() {
    onChange([...urls.filter(Boolean), ""]);
  }

  function removeImage(index: number) {
    const next = urls.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  }

  function updateUrl(index: number, url: string) {
    const next = [...urls];
    next[index] = url;
    onChange(next);
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    const next = [...urls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index >= urls.length - 1) return;
    const next = [...urls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  async function handleUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadingIndex(index);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProductImageAction(formData);

    setUploadingIndex(null);
    e.target.value = "";

    if (result.error) {
      setUploadError(result.error);
      return;
    }
    if (result.url) {
      updateUrl(index, result.url);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload images from your computer. You can add multiple images and reorder with the arrows. Pasting a URL is optional.
      </p>
      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}
      <div className="space-y-3">
        {urls.map((url, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3"
          >
            <ImageThumbnail url={url} />
            <div className="min-w-0 flex-1 space-y-1">
              {/* Always submit current URL so upload-only works without manual input */}
              <input type="hidden" name="imageUrls" value={url} />
              {url ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate rounded bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground" title={url}>
                    {url}
                  </span>
                  <span className="text-xs text-muted-foreground">Uploaded</span>
                </div>
              ) : (
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="Optional: paste image URL"
                  className="font-mono text-sm"
                />
              )}
              <div className="flex flex-wrap items-center gap-1">
                <input
                  id={`product-image-upload-${i}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleUpload(i, e)}
                  disabled={uploadingIndex !== null}
                />
                <label
                  htmlFor={`product-image-upload-${i}`}
                  className={`inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                    uploadingIndex !== null ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <Upload className="size-3.5" />
                  {uploadingIndex === i ? "Uploading…" : url ? "Replace" : "Upload"}
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={i === 0}
                  onClick={() => moveUp(i)}
                  title="Move up"
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={i === urls.length - 1}
                  onClick={() => moveDown(i)}
                  title="Move down"
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <Plus className="size-4" />
          Add image
        </Button>
      </div>
    </div>
  );
}
