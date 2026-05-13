import { Suspense } from "react"
import Image from "next/image"
import { AuthForm } from "@/components/forms/auth-form"
import { BrandLogo } from "@/components/brand-logo"
import { ClearSessionOnLogin } from "@/components/clear-session-on-login"

export default function LoginPage() {
  return (
    <div className="container mx-auto relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col overflow-hidden bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          src="/logo-dark.png"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BrandLogo width={880} height={256} priority />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has streamlined our alignment with Zambia&rsquo;s Data Protection Act, making compliance
              management intuitive and organized like a simple todo list.&rdquo;
            </p>
            <footer className="text-sm">Daniel Sitali, CTO, Chuuma</footer>
          </blockquote>
        </div>
      </div>
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
