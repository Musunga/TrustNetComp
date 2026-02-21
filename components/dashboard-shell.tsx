"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_SESSION_STORAGE_KEY,
  ACTIVE_COMPANY_STORAGE_KEY,
} from "@/lib/constants/variables"
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  CheckSquare,
  CreditCard,
  LogOut,
  Menu,
  X,
  LifeBuoy,
  ChevronRight,
  User,
  Headset,
  Phone,
  Mail,
  MessageCircle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BrandLogo } from "@/components/brand-logo"
import { HexagonPatternLeft } from "@/components/shared/HexagonPatternLeft"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Assessments", href: "/dashboard/assessments", icon: Shield },
  { title: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { title: "Team", href: "/dashboard/team", icon: Users },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="relative flex min-h-screen flex-col min-w-0">
      <HexagonPatternLeft width="20%" className="top-14 h-[calc(100vh-3.5rem)] hidden sm:block" />
      <header className="sticky top-0 z-40 w-full shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Dashboard home"
            >
              <BrandLogo className="h-40 w-auto" width={120} height={32} priority />
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 transition-colors min-h-9",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full sm:h-8 sm:w-8"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-8 w-8 sm:h-7 sm:w-7">
                    <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,85vw)] max-w-xs">
                <SheetHeader>
                  <SheetTitle>Admin User</SheetTitle>
                  <SheetDescription>admin@acme.inc</SheetDescription>
                </SheetHeader>
                <Separator className="my-2" />
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <Link href="/dashboard/settings" className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <span className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </span>
                          Profile
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/billing" className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <span className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                          </span>
                          Billing
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                    <li className="pt-2">
                      <a href="mailto:support@trustnetcomp.com" className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <span className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                          </span>
                          Contact Support
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="mt-auto p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME)
                      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
                      localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY)
                      window.location.href = "/api/auth/clear-session?redirect=/login"
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 min-h-9 min-w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/50 backdrop-sm md:hidden"
            aria-hidden
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className="fixed inset-x-2 top-14 z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-background md:hidden"
            role="dialog"
            aria-label="Main navigation"
          >
            <nav className="flex flex-col p-4 pb-[env(safe-area-inset-bottom)] space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-base font-medium",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      <main className="relative z-0 min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 md:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
            size="icon"
            aria-label="Contact support"
          >
            <Headset className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-56 mr-2">
          <div className="flex flex-col">
            <a
              href="tel:+0000000000"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </span>
                Call
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="mailto:support@trustnetcomp.com"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </span>
                Email
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://wa.me/0000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </span>
                WhatsApp
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
