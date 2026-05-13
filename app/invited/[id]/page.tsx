import { AuthMarketingPanel } from "@/components/shared/auth-marketing-panel"
import { InvitedAcceptancePanel } from "@/components/screens/invited-acceptance-panel"

export default function InvitedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div className="container relative mx-auto flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthMarketingPanel />
      <InvitedAcceptancePanel params={params} />
    </div>
  )
}
