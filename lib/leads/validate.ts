import { SERVICES } from "@/lib/constants";

const BUDGET_VALUES = ["under-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure"] as const;

const SERVICE_VALUES = new Set(
  SERVICES.map((service) =>
    service.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  )
);

export type ContactFormInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  website?: unknown;
  budget?: unknown;
  servicesInterested?: unknown;
  message?: unknown;
  honeypot?: unknown;
};

export type ValidatedContactForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  budget: string;
  servicesInterested: string[];
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 200;
const MAX_MESSAGE = 5000;

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateContactForm(
  input: ContactFormInput
): { ok: true; data: ValidatedContactForm } | { ok: false; error: string } {
  // Honeypot: a real visitor never sees or fills this field (hidden via CSS, not `type="hidden"`,
  // so basic bots that only skip hidden inputs still fall for it). Any value means reject.
  if (text(input.honeypot, MAX_FIELD) !== "") {
    return { ok: false, error: "Submission rejected." };
  }

  const name = text(input.name, MAX_FIELD);
  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }

  const email = text(input.email, MAX_FIELD);
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const servicesInterested = Array.isArray(input.servicesInterested)
    ? input.servicesInterested.filter(
        (value): value is string => typeof value === "string" && SERVICE_VALUES.has(value)
      )
    : [];

  const budgetInput = text(input.budget, MAX_FIELD);
  const budget = (BUDGET_VALUES as readonly string[]).includes(budgetInput) ? budgetInput : "";

  return {
    ok: true,
    data: {
      name,
      email,
      phone: text(input.phone, MAX_FIELD),
      company: text(input.company, MAX_FIELD),
      website: text(input.website, MAX_FIELD),
      budget,
      servicesInterested,
      message: text(input.message, MAX_MESSAGE),
    },
  };
}
