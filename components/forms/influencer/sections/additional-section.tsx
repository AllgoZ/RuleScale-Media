import { HEARD_ABOUT_US_OPTIONS } from "@/lib/influencer/options";
import { Field, SelectInput, TextAreaInput } from "../field";
import type { InfluencerFormState } from "../types";

export function AdditionalSection({
  data,
  update,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="How did you hear about RuleScale Media?">
        <SelectInput
          value={data.heardAboutUs}
          onChange={(value) => update("heardAboutUs", value)}
          options={HEARD_ABOUT_US_OPTIONS}
        />
      </Field>
      <Field label="Any additional information">
        <TextAreaInput value={data.additionalInfo} onChange={(value) => update("additionalInfo", value)} />
      </Field>
    </div>
  );
}
