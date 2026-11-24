"use client";

import { CheckCircle2, FileText, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Field } from "./field";

type UploadState = "idle" | "uploading" | "done" | "error";

export function FileUploadField({
  label,
  hint,
  kind,
  fileName,
  url,
  onUploaded,
  onClear,
  onUploadingChange,
}: {
  label: string;
  hint?: string;
  kind: "mediaKit" | "rateCard";
  fileName: string;
  url: string;
  onUploaded: (result: { url: string; publicId: string; fileName: string }) => void;
  onClear: () => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [state, setState] = useState<UploadState>(url ? "done" : "idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      setState("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is larger than 10MB.");
      setState("error");
      return;
    }

    setError("");
    setState("uploading");
    setProgress(0);
    onUploadingChange(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/influencer/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      onUploadingChange(false);
      try {
        const result = JSON.parse(xhr.responseText) as {
          secureUrl?: string;
          publicId?: string;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && result.secureUrl) {
          setState("done");
          onUploaded({ url: result.secureUrl, publicId: result.publicId || "", fileName: file.name });
        } else {
          setError(result.error || "Upload failed.");
          setState("error");
        }
      } catch {
        setError("Upload failed.");
        setState("error");
      }
    };
    xhr.onerror = () => {
      onUploadingChange(false);
      setError("Upload failed. Please check your connection.");
      setState("error");
    };
    xhr.send(formData);
  }

  return (
    <Field label={label} hint={hint}>
      {state === "done" && url ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-hairline bg-paper px-4 py-2.5 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-ink">
            <CheckCircle2 className="shrink-0 text-accent-deep" size={16} />
            <span className="truncate">{fileName || "Uploaded"}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              onClear();
            }}
            className="shrink-0 text-ink-soft hover:text-ink"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-ink/30 bg-paper-2 px-4 py-3 text-sm text-ink-soft hover:border-ink">
          <span className="flex items-center gap-2">
            {state === "uploading" ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <FileText size={16} />
            )}
            {state === "uploading" ? `Uploading… ${progress}%` : "Choose a PDF file"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={state === "uploading"}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
      )}
      {error ? <span className="text-xs text-accent-deep">{error}</span> : null}
    </Field>
  );
}
