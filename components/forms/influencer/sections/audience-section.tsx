import { Field, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function AudienceSection({
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
      <Field label="Primary Audience Country">
        <TextInput value={data.audienceCountry} onChange={(value) => update("audienceCountry", value)} />
      </Field>
      <Field label="Audience Age Group">
        <TextInput value={data.audienceAge} onChange={(value) => update("audienceAge", value)} placeholder="e.g. 18-24" />
      </Field>
      <Field label="Audience Gender">
        <TextInput value={data.audienceGender} onChange={(value) => update("audienceGender", value)} />
      </Field>
      <Field label="Monthly Reach">
        <TextInput type="number" value={data.monthlyReach} onChange={(value) => update("monthlyReach", value)} />
      </Field>
      <Field label="Monthly Impressions">
        <TextInput type="number" value={data.monthlyImpressions} onChange={(value) => update("monthlyImpressions", value)} />
      </Field>
      <Field label="Average Story Views">
        <TextInput type="number" value={data.averageStoryViews} onChange={(value) => update("averageStoryViews", value)} />
      </Field>
      <Field label="Average Reel Views">
        <TextInput type="number" value={data.averageReelViews} onChange={(value) => update("averageReelViews", value)} />
      </Field>
      <Field label="Average Last 5 Video Views" required error={errors.averageLast5VideoViews}>
        <TextInput
          type="number"
          value={data.averageLast5VideoViews}
          onChange={(value) => update("averageLast5VideoViews", value)}
          invalid={!!errors.averageLast5VideoViews}
        />
      </Field>
      <Field label="Average Engagement Rate" hint="Percentage, e.g. 4.5">
        <TextInput type="number" value={data.engagementRate} onChange={(value) => update("engagementRate", value)} />
      </Field>
    </div>
  );
}
