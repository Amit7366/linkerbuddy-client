import { ManageCallContent } from "@/components/forms/manage-call-content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Manage your call",
  noIndex: true,
  path: "/schedule",
});

export default async function ManageCallPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ManageCallContent token={token} />;
}
