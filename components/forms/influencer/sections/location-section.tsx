import { Field, TextInput } from "../field";
import type { InfluencerFormState } from "../types";

export function LocationSection({
  data,
  update,
}: {
  data: InfluencerFormState;
  update: <K extends keyof InfluencerFormState>(key: K, value: InfluencerFormState[K]) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Country">
        <TextInput value={data.country} onChange={(value) => update("country", value)} />
      </Field>
      <Field label="State">
        <TextInput value={data.state} onChange={(value) => update("state", value)} />
      </Field>
      <Field label="City">
        <TextInput value={data.city} onChange={(value) => update("city", value)} />
      </Field>
      <Field label="District">
        <TextInput value={data.district} onChange={(value) => update("district", value)} />
      </Field>
      <Field label="Area">
        <TextInput value={data.area} onChange={(value) => update("area", value)} />
      </Field>
      <Field label="House / Flat Number">
        <TextInput value={data.houseNumber} onChange={(value) => update("houseNumber", value)} />
      </Field>
      <Field label="Landmark">
        <TextInput value={data.landmark} onChange={(value) => update("landmark", value)} />
      </Field>
      <Field label="Address Line 1">
        <TextInput value={data.addressLine1} onChange={(value) => update("addressLine1", value)} />
      </Field>
      <Field label="Address Line 2">
        <TextInput value={data.addressLine2} onChange={(value) => update("addressLine2", value)} />
      </Field>
      <Field label="Pincode">
        <TextInput value={data.pincode} onChange={(value) => update("pincode", value)} />
      </Field>
    </div>
  );
}
