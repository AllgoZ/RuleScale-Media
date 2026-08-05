import { CREATOR_TYPE_OPTIONS, PRIMARY_CATEGORY_OPTIONS } from "@/lib/influencer/options";
import { Field, SelectInput, TextAreaInput, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function CreatorSection({
  data,
  update,
  errors,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
  errors: Partial<Record<keyof InfluencerFormState, string>>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Primary Category" required error={errors.primaryCategory}>
          <SelectInput
            value={data.primaryCategory}
            onChange={(value) => update("primaryCategory", value)}
            options={PRIMARY_CATEGORY_OPTIONS}
            invalid={!!errors.primaryCategory}
          />
        </Field>
        <Field label="Sub Category">
          <TextInput value={data.subcategory} onChange={(value) => update("subcategory", value)} />
        </Field>
        <Field label="Type of Creator" required error={errors.creatorType}>
          <SelectInput
            value={data.creatorType}
            onChange={(value) => update("creatorType", value)}
            options={CREATOR_TYPE_OPTIONS}
            invalid={!!errors.creatorType}
          />
        </Field>
        <Field label="Years as Creator">
          <TextInput type="number" value={data.yearsAsCreator} onChange={(value) => update("yearsAsCreator", value)} />
        </Field>
        <Field label="Current Occupation">
          <TextInput value={data.currentOccupation} onChange={(value) => update("currentOccupation", value)} />
        </Field>
      </div>
      <Field label="Bio / Tell us about yourself">
        <TextAreaInput value={data.bio} onChange={(value) => update("bio", value)} />
      </Field>
    </div>
  );
}
