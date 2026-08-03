"use client";

import { Button, FieldLabel, TextInput, useField, useFormFields } from "@payloadcms/ui";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

/**
 * Purpose-built for the Portfolio collection's thumbnail: replaces the default text
 * input for `thumbnailUrl` with a file picker + "Upload to Cloudinary" button, while
 * keeping the URL directly editable underneath as a manual-paste fallback (useful
 * before CLOUDINARY_* env vars are configured). On a successful upload, writes the
 * returned metadata into the sibling `thumbnailPublicId`/`thumbnailWidth`/
 * `thumbnailHeight`/`thumbnailFormat` fields, which are hidden in the admin UI.
 */
export function CloudinaryUploadField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path });
  const dispatch = useFormFields(([, dispatchFields]) => dispatchFields);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      setValue(result.secureUrl);
      dispatch({ type: "UPDATE", path: "thumbnailPublicId", value: result.publicId });
      dispatch({ type: "UPDATE", path: "thumbnailWidth", value: result.width });
      dispatch({ type: "UPDATE", path: "thumbnailHeight", value: result.height });
      dispatch({ type: "UPDATE", path: "thumbnailFormat", value: result.format });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <FieldLabel label="Thumbnail" path={path} />

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Thumbnail preview"
          style={{
            display: "block",
            maxWidth: 240,
            maxHeight: 160,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 8,
            border: "1px solid var(--theme-elevation-150)",
          }}
        />
      ) : null}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFileSelected(file);
            event.target.value = "";
          }}
        />
        <Button
          buttonStyle="secondary"
          size="small"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload to Cloudinary"}
        </Button>
      </div>

      {error ? (
        <p style={{ color: "var(--theme-error-500)", fontSize: 13, marginBottom: 8 }}>{error}</p>
      ) : null}

      <TextInput
        path={path}
        value={value || ""}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        placeholder="Or paste a Cloudinary URL directly"
      />
    </div>
  );
}
