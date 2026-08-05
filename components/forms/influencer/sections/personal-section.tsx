import { GENDER_OPTIONS } from "@/lib/influencer/options";
import { Field, SelectInput, TagsInput, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function PersonalSection({
  data,
  update,
  errors,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
  errors: Partial<Record<keyof InfluencerFormState, string>>;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Full Name" required error={errors.fullName}>
        <TextInput value={data.fullName} onChange={(value) => update("fullName", value)} invalid={!!errors.fullName} />
      </Field>
      <Field label="Contact Number" required error={errors.contactNumber}>
        <TextInput
          type="tel"
          value={data.contactNumber}
          onChange={(value) => update("contactNumber", value)}
          invalid={!!errors.contactNumber}
        />
      </Field>
      <Field label="Alternative Contact Number">
        <TextInput type="tel" value={data.alternativeContact} onChange={(value) => update("alternativeContact", value)} />
      </Field>
      <Field label="Email" required error={errors.email}>
        <TextInput type="email" value={data.email} onChange={(value) => update("email", value)} invalid={!!errors.email} />
      </Field>
      <Field label="Gender">
        <SelectInput value={data.gender} onChange={(value) => update("gender", value)} options={GENDER_OPTIONS} />
      </Field>
      <Field label="Age">
        <TextInput type="number" value={data.age} onChange={(value) => update("age", value)} />
      </Field>
      <Field label="Languages Known" hint="Press Enter to add a language.">
        <TagsInput value={data.languages} onChange={(value) => update("languages", value)} placeholder="e.g. English, Hindi" />
      </Field>
    </div>
  );
}
