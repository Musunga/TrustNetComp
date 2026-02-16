import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Shield, Zap, BarChart3, Users } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { HeroConnectionBackground } from "@/components/hero-connection"
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon"
import { BrandLogo } from "@/components/brand-logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link className="flex items-center justify-center" href="/">
          <BrandLogo className="h-6 transform origin-left scale-[8]" width={120} height={32} priority />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#frameworks">
            Frameworks
          </Link>
          <ModeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/50">
        <HexagonBackground className="absolute inset-0 flex items-center justify-center rounded-xl" />
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[800px] text-pretty">
                  Experience a better audit and compliance journey first-hand
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Combining easy-to-use software with experts to guide your experience. We eliminate uncertainty by
                  providing a bespoke, streamlined process.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="px-8 h-12">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 h-12 bg-transparent">
                  View Frameworks
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A holistic approach</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We anticipate compliance challenges and your needs by having solutions at the ready.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-stretch md:justify-between md:divide-x divide-border">
              <div className="flex-1 py-6 md:py-0 md:pr-8">
                <div className="mb-3 inline-flex p-2 rounded-lg bg-primary/5">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Automation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Reach goals with accurate timelines, less manual work, and transparent communication.
                </p>
              </div>
              <div className="flex-1 py-6 md:py-0 md:px-8">
                <div className="mb-3 inline-flex p-2 rounded-lg bg-primary/5">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Audits</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Streamlined audit and compliance solutions that deliver better outcomes for your business.
                </p>
              </div>
              <div className="flex-1 py-6 md:py-0 md:px-8">
                <div className="mb-3 inline-flex p-2 rounded-lg bg-primary/5">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Risk Register</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Evaluate and remediate risk all in one platform, linked back to relevant controls.
                </p>
              </div>
              <div className="flex-1 py-6 md:py-0 md:pl-8">
                <div className="mb-3 inline-flex p-2 rounded-lg bg-primary/5">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expertise</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Access to world-class auditors and success teams dedicated to your compliance goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="frameworks" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">One solution, multiple frameworks</h2>
              <p className="max-w-[720px] text-muted-foreground">
                Choose the framework that fits your needs. Each option includes streamlined guidance and
                built‑in evidence tracking to stay audit‑ready.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Bank Of Zambia (BOZ CSF)", desc: "Cybersecurity standard for Zambia’s financial sector" },
                { name: "ISO 27001", desc: "Global ISMS standard focused on information security" },
                { name: "SOC 2", desc: "Trust services criteria for service organizations" },
                { name: "Zambia Data Protection", desc: "Compliance for ZDPA No. 3 of 2021" },
                { name: "PCI DSS", desc: "Security standard for handling cardholder data" },
              ].map((fw) => (
                <FrameworkBadge key={fw.name} name={fw.name} desc={fw.desc} />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to start your journey?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Build trust and get compliant with automation and veteran experts.
                </p>
              </div>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="px-8">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 TrustNetComp, Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FrameworkBadge({ name, desc }: { name: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-accent/5 border rounded-lg">
      <div className="mt-0.5">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        {desc ? <p className="text-xs text-muted-foreground">{desc}</p> : null}
      </div>
    </div>
  )
}
