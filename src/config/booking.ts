export const CALL_PURPOSES = [
  { value: "AGENCY_PARTNERSHIP", label: "Agency partnership" },
  { value: "CUSTOM_CAMPAIGN", label: "Custom campaign" },
  { value: "BULK_PACKAGE", label: "Bulk / package" },
  { value: "WHITELABEL", label: "White-label" },
  { value: "GENERAL", label: "General question" },
] as const;

export const MONTHLY_BUDGETS = [
  { value: "under_500", label: "Under $500 / month" },
  { value: "500_2k", label: "$500–$2k / month" },
  { value: "2k_5k", label: "$2k–$5k / month" },
  { value: "5k_plus", label: "$5k+ / month" },
] as const;

export const CALL_CHANNELS = [
  { value: "MEET", label: "Google Meet" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Phone" },
] as const;

export type CallPurpose = (typeof CALL_PURPOSES)[number]["value"];
export type MonthlyBudget = (typeof MONTHLY_BUDGETS)[number]["value"];
export type CallChannel = (typeof CALL_CHANNELS)[number]["value"];

export function labelFor(
  list: ReadonlyArray<{ value: string; label: string }>,
  value?: string | null,
) {
  return list.find((item) => item.value === value)?.label ?? value ?? "—";
}
