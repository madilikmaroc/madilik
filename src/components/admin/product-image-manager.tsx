"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageViaAdminApi } from "@/lib/client/upload-image";

interface ProductImageManagerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

function ImageThumbnail({ url, localPreview }: { url: string; localPreview?: string | null }) {
  const [error, setError] = useState(false);
  const src = localPreview || url;

  return (
    <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg border bg-muted sm:w-28">
      {src && !error ? (
        <img
          src={src}
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
  const [uploadSuccessIndex, setUploadSuccessIndex] = useState<number | null>(null);
  const [localPreview, setLocalPreview] = useState<Record<number, string>>({});
  const [showUrlInputs, setShowUrlInputs] = useState(false);
  const blobUrlsRef = useRef(new Set<string>());

  const urls = value.length > 0 ? value : [""];

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlsRef.current.clear();
    };
  }, []);

  function revokePreview(index: number) {
    setLocalPreview((prev) => {
      const next = { ...prev };
      const blob = next[index];
      if (blob) {
        URL.revokeObjectURL(blob);
        blobUrlsRef.current.delete(blob);
      }
      delete next[index];
      return next;
    });
  }

  function addImage() {
    onChange([...urls.filter(Boolean), ""]);
  }

  function removeImage(index: number) {
    revokePreview(index);
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
    setUploadSuccessIndex(null);

    const blobUrl = URL.createObjectURL(file);
    blobUrlsRef.current.add(blobUrl);
    setLocalPreview((prev) => {
      const next = { ...prev };
      if (next[index]) {
        URL.revokeObjectURL(next[index]);
        blobUrlsRef.current.delete(next[index]);
      }
      next[index] = blobUrl;
      return next;
    });

    setUploadingIndex(index);

    try {
      const result = await uploadImageViaAdminApi(file, "product");
      if ("error" in result) {
        setUploadError(result.error);
        revokePreview(index);
      } else {
        updateUrl(index, result.url);
        revokePreview(index);
        setUploadSuccessIndex(index);
        window.setTimeout(() => setUploadSuccessIndex((cur) => (cur === index ? null : cur)), 3500);
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
      revokePreview(index);
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose images from your device (JPEG, PNG, or WebP, max 5MB). You can add several images and
        reorder them. Images upload immediately and the path is saved when you submit the product
        form.
      </p>
      {uploadError && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {uploadError}
        </p>
      )}
      <div className="space-y-3">
        {urls.map((url, i) => (
          <div
            key={i}
            className="flex flex-wrap items-start gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-nowrap"
          >
            <ImageThumbnail url={url} localPreview={localPreview[i]} />
            <div className="min-w-0 flex-1 space-y-2">
              <input type="hidden" name="imageUrls" value={url} />
              {url ? (
                <div className="space-y-1">
                  <code
                    className="block max-w-full truncate rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
                    title={url}
                  >
                    {url}
                  </code>
                  {uploadSuccessIndex === i && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <Check className="size-3.5" />
                      Uploaded successfully
                    </span>
                  )}
                </div>
              ) : showUrlInputs ? (
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="https://… or /uploads/…"
                  className="font-mono text-sm"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No image yet — use Upload to add one.</p>
              )}
              <div className="flex flex-wrap items-center gap-1">
                <input
                  id={`product-image-upload-${i}`}
                  type="file"
                  accept={ACCEPT_IMAGES}
                  className="hidden"
                  onChange={(e) => handleUpload(i, e)}
                  disabled={uploadingIndex !== null}
                />
                <label
                  htmlFor={`product-image-upload-${i}`}
                  className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                    uploadingIndex !== null ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <Upload className="size-3.5" />
                  {uploadingIndex === i ? "Uploading…" : url ? "Replace image" : "Upload image"}
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
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="size-4" />
            Add image slot
          </Button>
          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            onClick={() => setShowUrlInputs((s) => !s)}
          >
            {showUrlInputs ? "Hide URL entry" : "Advanced: paste image URL"}
          </button>
        </div>
      </div>
    </div>
  );
}
