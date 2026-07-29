"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS = [
  { label: "Under $5k", value: "under-5k" },
  { label: "$5k – $15k", value: "5k-15k" },
  { label: "$15k – $50k", value: "15k-50k" },
  { label: "$50k+", value: "50k-plus" },
  { label: "Not sure yet", value: "not-sure" },
];

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string;
    };
  }
}

function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "cf-turnstile-script";

    function renderWidget() {
      if (containerRef.current && window.turnstile) {
        window.turnstile.render(containerRef.current, { sitekey: siteKey, callback: onToken });
      }
    }

    if (window.turnstile) {
      renderWidget();
      return;
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", renderWidget);
    return () => script?.removeEventListener("load", renderWidget);
  }, [siteKey, onToken]);

  return <div ref={containerRef} className="mt-2" />;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  services,
  turnstileSiteKey,
}: {
  services: string[];
  turnstileSiteKey: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState("");
  const [servicesInterested, setServicesInterested] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  function toggleService(service: string) {
    setServicesInterested((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service]
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          website,
          budget,
          servicesInterested,
          message,
          honeypot,
          turnstileToken,
          referrer: document.referrer,
          landingPage: window.location.pathname,
          utmSource: new URLSearchParams(window.location.search).get("utm_source") || "",
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || "",
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
          utmTerm: new URLSearchParams(window.location.search).get("utm_term") || "",
          utmContent: new URLSearchParams(window.location.search).get("utm_content") || "",
        }),
      });

      const result = (await response.json()) as { status: string; error?: string };
      if (!response.ok || result.status !== "ok") {
        setError(result.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setState("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-hairline bg-paper py-16 text-center">
        <CheckCircle2 className="text-accent" size={40} />
        <h2 className="font-heading text-2xl font-bold text-ink">Message sent.</h2>
        <p className="max-w-sm text-ink-soft">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Company">
          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Website">
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <Field label="Budget">
          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className={inputClass}
          >
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Services you're interested in">
        <div className="flex flex-wrap gap-2">
          {services.map((service) => {
            const active = servicesInterested.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-hairline text-ink-soft hover:border-ink/30 hover:text-ink"
                )}
              >
                {service}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Message">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className={inputClass}
        />
      </Field>

      {/* Honeypot: hidden from real visitors via CSS (not type="hidden", which basic bots skip). */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="hp-field">Leave this field empty</label>
        <input
          id="hp-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {turnstileSiteKey ? (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      ) : null}

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <Button type="submit" variant="accent" size="lg" disabled={state === "submitting"} className="self-start">
        {state === "submitting" ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent/40 focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
