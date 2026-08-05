import type { InfluencerFormState } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

export type InfluencerFormErrors = Partial<Record<keyof InfluencerFormState, string>>;

/**
 * Per-step client validation for the "Next" button — a UX convenience only. The server
 * (lib/influencer/validate.ts) is the source of truth and re-checks everything on submit, so
 * this only needs to cover the same required set closely enough to avoid a round-trip failure.
 */
export function validateStep(step: number, data: InfluencerFormState): InfluencerFormErrors {
  const errors: InfluencerFormErrors = {};

  switch (step) {
    case 0:
      if (!data.fullName.trim()) errors.fullName = "Please enter your full name.";
      if (!data.contactNumber.trim() || !PHONE_RE.test(data.contactNumber)) {
        errors.contactNumber = "Please enter a valid contact number.";
      }
      if (!data.email.trim() || !EMAIL_RE.test(data.email)) {
        errors.email = "Please enter a valid email address.";
      }
      break;
    case 1:
      if (!data.primaryCategory) errors.primaryCategory = "Please select a primary category.";
      if (!data.creatorType) errors.creatorType = "Please select the type of creator you are.";
      break;
    case 3:
      if (!data.instagram.trim()) errors.instagram = "Please enter your Instagram profile.";
      break;
    case 4:
      if (!data.averageLast5VideoViews.trim()) {
        errors.averageLast5VideoViews = "Please enter your average views across your last 5 videos.";
      }
      break;
    case 5:
      if (!data.commercialReel.trim()) errors.commercialReel = "Please enter your price for one reel.";
      if (!data.commercialStory.trim()) errors.commercialStory = "Please enter your price for one story.";
      if (!data.previousBrandCollaborations.trim()) {
        errors.previousBrandCollaborations = 'Please share your previous brand collaborations (or write "None").';
      }
      if (!data.contentLanguage.trim()) errors.contentLanguage = "Please enter your content language.";
      break;
    case 7:
      if (!data.termsAccepted) errors.termsAccepted = "Required.";
      if (!data.privacyAccepted) errors.privacyAccepted = "Required.";
      break;
    default:
      break;
  }

  return errors;
}

export function validateAllSteps(data: InfluencerFormState): InfluencerFormErrors {
  let errors: InfluencerFormErrors = {};
  for (let step = 0; step < 8; step += 1) {
    errors = { ...errors, ...validateStep(step, data) };
  }
  return errors;
}
