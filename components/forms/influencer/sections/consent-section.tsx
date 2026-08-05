import type { InfluencerFormState } from "../types";

function ConsentCheckbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-hairline bg-paper p-4 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent-solid"
      />
      <span>
        {children}
        {error ? <span className="mt-1 block text-xs text-accent-solid">{error}</span> : null}
      </span>
    </label>
  );
}

export function ConsentSection({
  data,
  update,
  errors,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
  errors: Partial<Record<keyof InfluencerFormState, string>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ConsentCheckbox
        checked={data.termsAccepted}
        onChange={(checked) => update("termsAccepted", checked)}
        error={errors.termsAccepted}
      >
        I confirm all information provided is accurate, and I agree to RuleScale Media storing my
        information for collaboration opportunities, per the Terms. <span className="text-accent-solid">*</span>
      </ConsentCheckbox>
      <ConsentCheckbox
        checked={data.privacyAccepted}
        onChange={(checked) => update("privacyAccepted", checked)}
        error={errors.privacyAccepted}
      >
        I agree to the Privacy Policy. <span className="text-accent-solid">*</span>
      </ConsentCheckbox>
    </div>
  );
}
