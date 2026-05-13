import { Suspense } from "react"
import { AuthForm } from "@/components/forms/auth-form"
import { AuthMarketingPanel } from "@/components/shared/auth-marketing-panel"
import { ClearSessionOnLogin } from "@/components/clear-session-on-login"

export default function LoginPage() {
  return (
    <div className="container mx-auto relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthMarketingPanel />
      <div className="lg:p-8">
        <Suspense fallback={null}>
          <ClearSessionOnLogin />
        </Suspense>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[480px] md:w-[640px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Access Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your company's compliance framework and assessments</p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
