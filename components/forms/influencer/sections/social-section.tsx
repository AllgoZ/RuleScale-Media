import { FileUploadField } from "../file-upload-field";
import { Field, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function SocialSection({
  data,
  update,
  errors,
  onUploadingChange,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
  errors: Partial<Record<keyof InfluencerFormState, string>>;
  onUploadingChange: (kind: "mediaKit" | "rateCard", uploading: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Instagram Profile" required error={errors.instagram}>
          <TextInput
            value={data.instagram}
            onChange={(value) => update("instagram", value)}
            placeholder="@handle or profile URL"
            invalid={!!errors.instagram}
          />
        </Field>
        <Field label="Second Instagram">
          <TextInput value={data.secondInstagram} onChange={(value) => update("secondInstagram", value)} />
        </Field>
        <Field label="YouTube">
          <TextInput value={data.youtube} onChange={(value) => update("youtube", value)} />
        </Field>
        <Field label="Snapchat">
          <TextInput value={data.snapchat} onChange={(value) => update("snapchat", value)} />
        </Field>
        <Field label="Facebook">
          <TextInput value={data.facebook} onChange={(value) => update("facebook", value)} />
        </Field>
        <Field label="X (Twitter)">
          <TextInput value={data.twitter} onChange={(value) => update("twitter", value)} />
        </Field>
        <Field label="LinkedIn">
          <TextInput value={data.linkedin} onChange={(value) => update("linkedin", value)} />
        </Field>
        <Field label="Other Platforms">
          <TextInput value={data.otherPlatforms} onChange={(value) => update("otherPlatforms", value)} />
        </Field>
        <Field label="Drive Portfolio Link">
          <TextInput value={data.portfolioLink} onChange={(value) => update("portfolioLink", value)} placeholder="https://" />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <FileUploadField
          label="Media Kit Upload (PDF)"
          kind="mediaKit"
          url={data.mediaKitUrl}
          fileName={data.mediaKitFileName}
          onUploadingChange={(uploading) => onUploadingChange("mediaKit", uploading)}
          onUploaded={({ url, publicId, fileName }) => {
            update("mediaKitUrl", url);
            update("mediaKitPublicId", publicId);
            update("mediaKitFileName", fileName);
          }}
          onClear={() => {
            update("mediaKitUrl", "");
            update("mediaKitPublicId", "");
            update("mediaKitFileName", "");
          }}
        />
        <FileUploadField
          label="Rate Card Upload (PDF)"
          kind="rateCard"
          url={data.rateCardUrl}
          fileName={data.rateCardFileName}
          onUploadingChange={(uploading) => onUploadingChange("rateCard", uploading)}
          onUploaded={({ url, publicId, fileName }) => {
            update("rateCardUrl", url);
            update("rateCardPublicId", publicId);
            update("rateCardFileName", fileName);
          }}
          onClear={() => {
            update("rateCardUrl", "");
            update("rateCardPublicId", "");
            update("rateCardFileName", "");
          }}
        />
      </div>
    </div>
  );
}
