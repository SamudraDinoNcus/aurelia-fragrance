"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const IMAGE_SIZE = 800;

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = IMAGE_SIZE;
      canvas.height = IMAGE_SIZE;

      const s = Math.max(
        IMAGE_SIZE / img.width,
        IMAGE_SIZE / img.height,
      );
      const w = img.width * s;
      const h = img.height * s;
      const x = (IMAGE_SIZE - w) / 2;
      const y = (IMAGE_SIZE - h) / 2;

      ctx.drawImage(img, x, y, w, h);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        "image/jpeg",
        0.9,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

interface ImageUploadProps {
  productId: string;
  currentImage?: string;
  onUploaded: (url: string) => void;
}

export function ImageUpload({
  productId,
  currentImage,
  onUploaded,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const storagePathRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setUploading(true);
      setError(null);

      let uploadFile: Blob | File;
      try {
        uploadFile = await resizeImage(file);
      } catch {
        uploadFile = file;
      }

      const ext = "jpg";
      const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `${productId}/${Date.now()}-${baseName}.${ext}`;
      storagePathRef.current = filePath;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, uploadFile, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      if (publicUrl) {
        setPreview(publicUrl);
        onUploaded(publicUrl);

        await supabase
          .from("products")
          .update({ images: [publicUrl] })
          .eq("id", productId);
      }

      setUploading(false);
    },
    [productId, supabase, onUploaded],
  );

  return (
    <div>
      {error && (
        <p className="mb-2 font-caption text-caption text-error">{error}</p>
      )}

      <div className="flex items-center gap-6">
        <div
          className="w-24 h-24 bg-surface-neutral border border-dashed border-outline flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors overflow-hidden"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Product"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <Upload className="h-6 w-6 text-text-muted" />
              <span className="text-caption text-text-muted mt-1">
                {uploading ? "Uploading..." : "Upload"}
              </span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        {preview && !uploading && !removing && (
          <button
            onClick={async () => {
              setRemoving(true);
              if (storagePathRef.current) {
                await supabase.storage
                  .from("product-images")
                  .remove([storagePathRef.current]);
              }
              await supabase
                .from("products")
                .update({ images: [] })
                .eq("id", productId);
              setPreview(null);
              storagePathRef.current = null;
              setRemoving(false);
              onUploaded("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-text-muted hover:text-error transition-colors"
          >
            {removing ? (
              <span className="text-caption">...</span>
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        )}

        <div>
          <p className="font-label-md text-label-md">Product Image</p>
          <p className="text-caption text-text-muted mt-1">
            Upload an image. It will be resized to 800x800.
          </p>
        </div>
      </div>
    </div>
  );
}
