import { AuthForm } from "@/components/forms/auth-form"
import { BrandLogo } from "@/components/brand-logo"

export default function LoginPage() {
  return (
    <div className="container mx-auto relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BrandLogo lightSrc="/logo-dark.png" darkSrc="/logo-dark.png" className="h-6 transform origin-left scale-[12]" width={140} height={36} priority />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has streamlined our ISO 27001 certification process, making compliance management
              intuitive and organized like a simple todo list.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, CTO</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
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
