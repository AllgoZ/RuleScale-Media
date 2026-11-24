"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdditionalSection } from "./sections/additional-section";
import { AudienceSection } from "./sections/audience-section";
import { CollaborationSection } from "./sections/collaboration-section";
import { ConsentSection } from "./sections/consent-section";
import { CreatorSection } from "./sections/creator-section";
import { LocationSection } from "./sections/location-section";
import { PersonalSection } from "./sections/personal-section";
import { SocialSection } from "./sections/social-section";
import { ProgressBar } from "./progress-bar";
import {
  DRAFT_STORAGE_KEY,
  INFLUENCER_FORM_SECTIONS,
  INITIAL_INFLUENCER_FORM_STATE,
  type InfluencerFormState,
} from "./types";
import { validateAllSteps, validateStep, type InfluencerFormErrors } from "./validate-step";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function InfluencerForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InfluencerFormState>(INITIAL_INFLUENCER_FORM_STATE);
  const [errors, setErrors] = useState<InfluencerFormErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [uploading, setUploading] = useState({ mediaKit: false, rateCard: false });
  const [state, setState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState("");
  const hydrated = useRef(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const isFirstStepRender = useRef(true);

  // Scroll the form back to its top on every step change (Next/Back, clicking a progress dot,
  // or jumping to the first invalid step on submit) — otherwise the newly-rendered step renders
  // at whatever scroll position the previous, possibly longer, step left the page at.
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Restore an autosaved draft on mount, so a refresh mid-application doesn't lose progress.
  // The read is deferred into a microtask (rather than called synchronously in the effect body)
  // so it reads as "subscribing to an external system" to the set-state-in-effect lint rule,
  // and so the very first client render still matches the server-rendered empty-state markup.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<InfluencerFormState>;
          setData((current) => ({ ...current, ...parsed }));
        }
      } catch {
        // Corrupt/old-shape draft — ignore and start fresh.
      } finally {
        hydrated.current = true;
      }
    });
  }, []);

  // Debounced autosave, skipped until the initial restore above has run so it can't overwrite
  // a real draft with the empty initial state during the first render.
  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      } catch {
        // localStorage unavailable (private browsing, quota) — autosave is best-effort.
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [data]);

  function update<K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function setUploadingKind(kind: "mediaKit" | "rateCard", value: boolean) {
    setUploading((current) => ({ ...current, [kind]: value }));
  }

  function goNext() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((current) => ({ ...current, ...stepErrors }));
      return;
    }
    setStep((current) => Math.min(current + 1, INFLUENCER_FORM_SECTIONS.length - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit() {
    const allErrors = validateAllSteps(data);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstBadStep = [...Array(INFLUENCER_FORM_SECTIONS.length).keys()].find(
        (candidate) => Object.keys(validateStep(candidate, data)).length > 0
      );
      if (firstBadStep !== undefined) setStep(firstBadStep);
      return;
    }

    setState("submitting");
    setSubmitError("");

    try {
      const response = await fetch("/api/influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          age: data.age || undefined,
          yearsAsCreator: data.yearsAsCreator || undefined,
          monthlyReach: data.monthlyReach || undefined,
          monthlyImpressions: data.monthlyImpressions || undefined,
          averageStoryViews: data.averageStoryViews || undefined,
          averageReelViews: data.averageReelViews || undefined,
          averageLast5VideoViews: data.averageLast5VideoViews || undefined,
          engagementRate: data.engagementRate || undefined,
          commercialReel: data.commercialReel || undefined,
          commercialStory: data.commercialStory || undefined,
          monthlyCampaignCapacity: data.monthlyCampaignCapacity || undefined,
          honeypot,
        }),
      });

      const result = (await response.json()) as { status: string; error?: string };
      if (!response.ok || result.status !== "ok") {
        setSubmitError(result.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Best-effort cleanup only.
      }
      setState("success");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 rounded-md border border-hairline bg-paper-2 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        >
          <CheckCircle2 className="text-accent-deep" size={48} />
        </motion.div>
        <h2 className="font-heading text-2xl font-bold text-ink">Application received.</h2>
        <p className="max-w-sm text-ink-soft">
          Thanks for applying to the RuleScale Media creator network — our team will review your
          application and reach out if it&apos;s a fit.
        </p>
        <Button asChild variant="accent" size="lg" className="mt-2">
          <Link href="/">Back to Homepage</Link>
        </Button>
      </motion.div>
    );
  }

  const isUploading = uploading.mediaKit || uploading.rateCard;
  const isLastStep = step === INFLUENCER_FORM_SECTIONS.length - 1;

  return (
    <div ref={formTopRef} className="flex flex-col gap-8 scroll-mt-24">
      <ProgressBar step={step} onStepClick={setStep} />

      <div>
        {step === 0 ? <PersonalSection data={data} update={update} errors={errors} /> : null}
        {step === 1 ? <CreatorSection data={data} update={update} errors={errors} /> : null}
        {step === 2 ? <LocationSection data={data} update={update} /> : null}
        {step === 3 ? (
          <SocialSection data={data} update={update} errors={errors} onUploadingChange={setUploadingKind} />
        ) : null}
        {step === 4 ? <AudienceSection data={data} update={update} errors={errors} /> : null}
        {step === 5 ? <CollaborationSection data={data} update={update} errors={errors} /> : null}
        {step === 6 ? <AdditionalSection data={data} update={update} /> : null}
        {step === 7 ? <ConsentSection data={data} update={update} errors={errors} /> : null}
      </div>

      {/* Honeypot: hidden from real visitors via CSS (not type="hidden", which basic bots skip). */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="influencer-hp-field">Leave this field empty</label>
        <input
          id="influencer-hp-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {submitError ? <p className="text-sm text-accent-deep">{submitError}</p> : null}

      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0}>
          Back
        </Button>
        {isLastStep ? (
          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={handleSubmit}
            disabled={state === "submitting" || isUploading}
          >
            {state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : isUploading ? (
              "Waiting for upload…"
            ) : (
              "Submit Application"
            )}
          </Button>
        ) : (
          <Button type="button" variant="primary" size="lg" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
