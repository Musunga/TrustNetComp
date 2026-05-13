import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"

/** Left column (logo + testimonial) shared by login, invitation accept, and similar split layouts. */
export function AuthMarketingPanel() {
  return (
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
  )
}
