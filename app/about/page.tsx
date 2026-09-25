import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Zap, BarChart3, Shield, Users, MapPin } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

export const metadata: Metadata = {
  title: "About Us | TrustNetComp",
  description: "Learn about TrustNetComp, a product of Velora Solutions.",
}

const FEATURES = [
  {
    icon: Zap,
    title: "Automation",
    desc: "Reach goals with accurate timelines, less manual work, and transparent communication.",
  },
  {
    icon: BarChart3,
    title: "Audits",
    desc: "Streamlined audit and compliance solutions that deliver better outcomes for your business.",
  },
  {
    icon: Shield,
    title: "Risk Register",
    desc: "Evaluate and remediate risk all in one platform, linked back to relevant controls.",
  },
  {
    icon: Users,
    title: "Expertise",
    desc: "Access to world-class auditors and success teams dedicated to your compliance goals.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center border-b px-4 sm:h-20 sm:px-6">
        <Link href="/" className="flex items-center justify-center">
          <BrandLogo width={372} height={120} priority className="h-10 sm:h-12" />
        </Link>
        <Link
          href="/login"
          className="ml-auto flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </header>

      <main className="flex-1">
        <section className="w-full px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <BrandLogo width={372} height={120} priority className="mb-4 h-16 sm:h-20" />
            {/* <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">TrustNetComp</h1> */}
            <p className="mt-2 text-lg font-medium text-primary">Compliance, Audit &amp; Risk Management, Simplified</p>
            <p className="mt-4 text-pretty text-muted-foreground">
              TrustNetComp brings clarity and structure to audit and compliance work. We help organizations
              map their controls to the frameworks that matter, track evidence in one place, and close out
              risk with confidence, replacing scattered spreadsheets with a single source of truth.
            </p>
          </div>
        </section>

        <section className="w-full bg-muted/50 px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What we do</h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              TrustNetComp is a platform for managing compliance across the frameworks that govern your
              industry, including Bank of Zambia CSF, ISO 27001, SOC 2, the Zambia Data Protection Act, and
              PCI DSS. Teams can track controls, gather evidence, run audits, and maintain a live risk
              register, all with a built-in AI assistant that explains what each requirement actually means.
            </p>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Our goal is to replace guesswork and manual tracking with a reliable, auditable record that
              your whole team can trust, so compliance becomes a routine part of how you work, not a
              once-a-year scramble.
            </p>
          </div>
        </section>

        <section className="w-full px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Features</h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-lg border bg-card p-6">
                  <div className="mb-3 inline-flex rounded-lg bg-primary/5 p-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-muted/50 px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our office</h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            <div className="mt-4 flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                <span className="block font-medium text-foreground">Velora Solutions</span>
                477 Central Street, Chudleigh, Lusaka, Zambia
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-foreground">© 2026 Velora Solutions. TrustNetComp is a product of Velora Solutions.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="/">
            Home
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="/login">
            Login
          </Link>
        </nav>
      </footer>
    </div>
  )
}
