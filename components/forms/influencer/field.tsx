"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-md border border-ink/30 bg-paper-2 px-4 py-3 text-base text-ink placeholder:text-ink-soft focus:border-ink";

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">
        {label}
        {required ? <span className="text-accent-deep"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-ink-soft">{hint}</span> : null}
      {error ? <span className="text-xs text-accent-deep">{error}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={cn(inputClass, invalid && "border-accent-deep")}
    />
  );
}

export function TextAreaInput({
  value,
  onChange,
  rows = 4,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  invalid?: boolean;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className={cn(inputClass, invalid && "border-accent-deep")}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select",
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(inputClass, invalid && "border-accent-deep")}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Pill toggle group for a fixed option set, single or multi select. */
export function PillGroup({
  value,
  onChange,
  options,
  multi,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  multi?: boolean;
}) {
  function toggle(optionValue: string) {
    if (multi) {
      onChange(
        value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]
      );
    } else {
      onChange(value.includes(optionValue) ? [] : [optionValue]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            aria-pressed={active}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
              active
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 text-ink hover:border-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Free-text chip input — type a value, press Enter or comma to add it as a tag. */
export function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className={cn(inputClass, "flex flex-wrap items-center gap-1.5 py-2")}>
      {value.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1 rounded-full bg-accent-deep/10 px-2.5 py-1 text-xs text-accent-deep"
        >
          {item}
          <button
            type="button"
            onClick={() => onChange(value.filter((entry) => entry !== item))}
            aria-label={`Remove ${item}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-[100px] flex-1 border-none bg-transparent p-0 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
      />
    </div>
  );
}
