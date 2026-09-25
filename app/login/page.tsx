import { Suspense } from "react"
import Link from "next/link"
import { AuthForm } from "@/components/forms/auth-form"
import { AuthMarketingPanel } from "@/components/shared/auth-marketing-panel"
import { ClearSessionOnLogin } from "@/components/clear-session-on-login"

export default function LoginPage() {
  return (
    <div className="container mx-auto relative flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-0">
      <AuthMarketingPanel />
      <div className="w-full lg:p-8">
        <Suspense fallback={null}>
          <ClearSessionOnLogin />
        </Suspense>
        <div className="mx-auto flex w-full max-w-120 flex-col justify-center space-y-6 md:max-w-160">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Access Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your company's compliance framework and assessments</p>
          </div>
          <AuthForm />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/about" className="underline underline-offset-4 hover:text-primary">
              Learn more about us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
