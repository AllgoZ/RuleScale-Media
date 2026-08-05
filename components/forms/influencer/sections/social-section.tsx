"use client";

import {
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Ghost,
  type LucideIcon,
  Play,
  Plus,
  ThumbsUp,
  X as XIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CREATOR_FACE_TYPE_OPTIONS } from "@/lib/influencer/options";
import { cn } from "@/lib/utils";
import { FileUploadField } from "../file-upload-field";
import { Field, PillGroup, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

type Update = <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;

function PlatformCard({
  icon: Icon,
  label,
  required,
  expanded,
  onToggle,
  urlValue,
  onUrlChange,
  urlPlaceholder,
  followersValue,
  onFollowersChange,
  urlError,
  children,
}: {
  icon: LucideIcon;
  label: string;
  required?: boolean;
  expanded: boolean;
  onToggle: () => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  urlPlaceholder?: string;
  followersValue: string;
  onFollowersChange: (value: string) => void;
  urlError?: string;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <button
        type="button"
        onClick={required ? undefined : onToggle}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center gap-3 p-4 text-left",
          required ? "cursor-default" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
            expanded ? "border-accent-solid bg-accent-solid text-white" : "border-hairline bg-paper"
          )}
        >
          {expanded ? <Check size={14} /> : null}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-solid/10 text-accent-solid">
          <Icon size={17} />
        </span>
        <span className="flex-1 font-medium text-ink">{label}</span>
        {required ? (
          <span className="rounded-full bg-accent-solid/10 px-2.5 py-1 text-xs font-medium text-accent-solid">
            Required
          </span>
        ) : (
          <span className="text-xs text-ink-soft">Optional</span>
        )}
        {required ? null : (
          <ChevronDown
            size={16}
            className={cn("shrink-0 text-ink-soft transition-transform", expanded && "rotate-180")}
          />
        )}
      </button>
      {expanded ? (
        <div className="flex flex-col gap-4 border-t border-hairline p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Profile URL" error={urlError}>
              <TextInput
                value={urlValue}
                onChange={onUrlChange}
                placeholder={urlPlaceholder}
                invalid={!!urlError}
              />
            </Field>
            <Field label="Followers">
              <TextInput
                type="number"
                value={followersValue}
                onChange={onFollowersChange}
                placeholder="e.g. 25000"
              />
            </Field>
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function SocialSection({
  data,
  update,
  errors,
  onUploadingChange,
}: {
  data: InfluencerFormState;
  update: Update;
  errors: Partial<Record<keyof InfluencerFormState, string>>;
  onUploadingChange: (kind: "mediaKit" | "rateCard", uploading: boolean) => void;
}) {
  const [showSecondInstagram, setShowSecondInstagram] = useState(() => Boolean(data.secondInstagram));
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({
    youtube: Boolean(data.youtube),
    snapchat: Boolean(data.snapchat),
    facebook: Boolean(data.facebook),
    twitter: Boolean(data.twitter),
    linkedin: Boolean(data.linkedin),
  }));

  function toggle(key: string) {
    setExpanded((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <PlatformCard
          icon={Camera}
          label="Instagram"
          required
          expanded
          onToggle={() => {}}
          urlValue={data.instagram}
          onUrlChange={(value) => update("instagram", value)}
          urlPlaceholder="https://instagram.com/yourhandle"
          followersValue={data.instagramFollowers}
          onFollowersChange={(value) => update("instagramFollowers", value)}
          urlError={errors.instagram}
        >
          <Field label="Creator Type">
            <PillGroup
              value={data.creatorFaceType}
              onChange={(value) => update("creatorFaceType", value)}
              options={CREATOR_FACE_TYPE_OPTIONS}
              multi
            />
          </Field>
        </PlatformCard>

        {showSecondInstagram ? (
          <PlatformCard
            icon={Camera}
            label="Second Instagram"
            expanded
            onToggle={() => setShowSecondInstagram(false)}
            urlValue={data.secondInstagram}
            onUrlChange={(value) => update("secondInstagram", value)}
            urlPlaceholder="https://instagram.com/yourhandle"
            followersValue={data.secondInstagramFollowers}
            onFollowersChange={(value) => update("secondInstagramFollowers", value)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowSecondInstagram(true)}
            className="flex items-center gap-2 self-start text-sm font-medium text-accent-solid"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-solid/10">
              <Plus size={14} />
            </span>
            Have a second Instagram account? Add it
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <PlatformCard
          icon={Play}
          label="YouTube"
          expanded={expanded.youtube}
          onToggle={() => toggle("youtube")}
          urlValue={data.youtube}
          onUrlChange={(value) => update("youtube", value)}
          urlPlaceholder="https://youtube.com/@yourchannel"
          followersValue={data.youtubeFollowers}
          onFollowersChange={(value) => update("youtubeFollowers", value)}
        />
        <PlatformCard
          icon={Ghost}
          label="Snapchat"
          expanded={expanded.snapchat}
          onToggle={() => toggle("snapchat")}
          urlValue={data.snapchat}
          onUrlChange={(value) => update("snapchat", value)}
          urlPlaceholder="https://snapchat.com/add/yourhandle"
          followersValue={data.snapchatFollowers}
          onFollowersChange={(value) => update("snapchatFollowers", value)}
        />
        <PlatformCard
          icon={ThumbsUp}
          label="Facebook"
          expanded={expanded.facebook}
          onToggle={() => toggle("facebook")}
          urlValue={data.facebook}
          onUrlChange={(value) => update("facebook", value)}
          urlPlaceholder="https://facebook.com/yourpage"
          followersValue={data.facebookFollowers}
          onFollowersChange={(value) => update("facebookFollowers", value)}
        />
        <PlatformCard
          icon={XIcon}
          label="X (Twitter)"
          expanded={expanded.twitter}
          onToggle={() => toggle("twitter")}
          urlValue={data.twitter}
          onUrlChange={(value) => update("twitter", value)}
          urlPlaceholder="https://x.com/yourhandle"
          followersValue={data.twitterFollowers}
          onFollowersChange={(value) => update("twitterFollowers", value)}
        />
        <PlatformCard
          icon={Briefcase}
          label="LinkedIn"
          expanded={expanded.linkedin}
          onToggle={() => toggle("linkedin")}
          urlValue={data.linkedin}
          onUrlChange={(value) => update("linkedin", value)}
          urlPlaceholder="https://linkedin.com/in/yourprofile"
          followersValue={data.linkedinFollowers}
          onFollowersChange={(value) => update("linkedinFollowers", value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Other Platforms">
          <TextInput value={data.otherPlatforms} onChange={(value) => update("otherPlatforms", value)} />
        </Field>
        <Field label="Drive Portfolio Link">
          <TextInput
            value={data.portfolioLink}
            onChange={(value) => update("portfolioLink", value)}
            placeholder="https://"
          />
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
