import { CAMPAIGN_TYPE_OPTIONS, YES_NO_OPTIONS } from "@/lib/influencer/options";
import { Field, PillGroup, TagsInput, TextAreaInput, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function CollaborationSection({
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
      <Field label="Do you want to participate in E-commerce Campaigns?">
        <PillGroup
          value={data.participateEcommerce ? [data.participateEcommerce] : []}
          onChange={(value) => update("participateEcommerce", value[0] || "")}
          options={YES_NO_OPTIONS}
        />
      </Field>

      <Field label="Interested Campaign Types">
        <PillGroup
          value={data.interestedCampaigns}
          onChange={(value) => update("interestedCampaigns", value)}
          options={CAMPAIGN_TYPE_OPTIONS}
          multi
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Commercial Price for 1 Reel" required error={errors.commercialReel}>
          <TextInput
            type="number"
            value={data.commercialReel}
            onChange={(value) => update("commercialReel", value)}
            invalid={!!errors.commercialReel}
          />
        </Field>
        <Field label="Commercial Price for 1 Story" required error={errors.commercialStory}>
          <TextInput
            type="number"
            value={data.commercialStory}
            onChange={(value) => update("commercialStory", value)}
            invalid={!!errors.commercialStory}
          />
        </Field>
        <Field label="Monthly Campaign Capacity">
          <TextInput
            type="number"
            value={data.monthlyCampaignCapacity}
            onChange={(value) => update("monthlyCampaignCapacity", value)}
          />
        </Field>
        <Field label="Content Language" required error={errors.contentLanguage}>
          <TextInput
            value={data.contentLanguage}
            onChange={(value) => update("contentLanguage", value)}
            invalid={!!errors.contentLanguage}
          />
        </Field>
      </div>

      <Field label="Accepting Collaborations?">
        <PillGroup
          value={data.acceptingCollaborations ? [data.acceptingCollaborations] : []}
          onChange={(value) => update("acceptingCollaborations", value[0] || "")}
          options={YES_NO_OPTIONS}
        />
      </Field>

      <Field label="Available for Travel?">
        <PillGroup
          value={data.availableForTravel ? [data.availableForTravel] : []}
          onChange={(value) => update("availableForTravel", value[0] || "")}
          options={YES_NO_OPTIONS}
        />
      </Field>

      <Field label="Previous Brand Collaborations" required error={errors.previousBrandCollaborations}>
        <TextAreaInput
          value={data.previousBrandCollaborations}
          onChange={(value) => update("previousBrandCollaborations", value)}
          invalid={!!errors.previousBrandCollaborations}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Industries Interested In" hint="Press Enter to add.">
          <TagsInput value={data.industriesInterested} onChange={(value) => update("industriesInterested", value)} />
        </Field>
        <Field label="Industries You Won't Promote" hint="Press Enter to add.">
          <TagsInput value={data.industriesWontPromote} onChange={(value) => update("industriesWontPromote", value)} />
        </Field>
      </div>

      <Field label="Other Platforms You Create Content On">
        <TextInput value={data.contentPlatforms} onChange={(value) => update("contentPlatforms", value)} />
      </Field>
    </div>
  );
}
