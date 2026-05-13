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
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BrandLogo } from "@/components/brand-logo"
import { HexagonPatternLeft } from "@/components/shared/HexagonPatternLeft"
import { activeCompanyAtom, authSessionAtom } from "@/lib/store/auth"
import { authSessionIsTechnicalAdmin, formatCreditBalance, formatZmwAmount, getWalletCreditBalance } from "@/lib/constants/functions"
import { fetchCompanyWallet } from "@/lib/actions/wallet"
import type { CompanyWalletResponse } from "@/lib/types/wallet"
import { useAtomValue } from "jotai"

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

const technicalAdminSidebarItems: SidebarItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Technical Review", href: "/dashboard/technical-review", icon: Search },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const authSession = useAtomValue(authSessionAtom)
  const activeCompany = useAtomValue(activeCompanyAtom)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [wallet, setWallet] = React.useState<CompanyWalletResponse | null>(null)
  const [walletLoading, setWalletLoading] = React.useState(false)
  const isTechnicalAdmin = authSessionIsTechnicalAdmin(authSession)
  const showCompanyWallet = mounted && !isTechnicalAdmin
  const navItems = isTechnicalAdmin ? technicalAdminSidebarItems : sidebarItems
  const user = authSession?.user
  const userName = user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Admin User"
  const userEmail = user?.email || "admin@acme.inc"
  const avatarFallback = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD"
  const creditBalance = getWalletCreditBalance(wallet)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!showCompanyWallet || !activeCompany?.id) {
      setWallet(null)
      setWalletLoading(false)
      return
    }

    let ignore = false
    setWalletLoading(true)
    fetchCompanyWallet(activeCompany.id)
      .then((data) => {
        if (!ignore) setWallet(data)
      })
      .catch(() => {
        if (!ignore) setWallet(null)
      })
      .finally(() => {
        if (!ignore) setWalletLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [activeCompany?.id, showCompanyWallet])

  return (
    <div className="relative flex min-h-screen flex-col min-w-0">
      <HexagonPatternLeft width="20%" className="top-14 h-[calc(100vh-3.5rem)] hidden sm:block" />
      <header className="sticky top-0 z-40 w-full shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 min-h-14 w-full items-center justify-between gap-4 px-2 sm:px-4 lg:px-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Dashboard home"
            >
              <BrandLogo width={480} height={128} priority />
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navItems.map((item) => (
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
                    <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,85vw)] max-w-xs">
                <SheetHeader>
                  <SheetTitle>{userName}</SheetTitle>
                  <SheetDescription>{userEmail}</SheetDescription>
                </SheetHeader>
                {showCompanyWallet ? (
                  <Link
                    href="/dashboard/wallet"
                    className="mx-4 mt-4 block rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                          Credit Balance
                        </p>
                        <div className="mt-1 text-2xl font-bold">
                          {walletLoading ? (
                            <Skeleton className="h-8 w-32 bg-blue-200 dark:bg-blue-900/70" />
                          ) : (
                            `${formatCreditBalance(creditBalance)} credits`
                          )}
                        </div>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/70">
                        <CreditCard className="h-5 w-5 text-blue-700 dark:text-blue-200" />
                      </span>
                    </div>
                    {walletLoading ? (
                      <Skeleton className="mt-2 h-4 w-36 bg-blue-200 dark:bg-blue-900/70" />
                    ) : (
                      <p className="mt-2 truncate text-xs text-blue-700 dark:text-blue-300">
                        {activeCompany?.name ?? "Select a company to view credits"}
                      </p>
                    )}
                    {walletLoading ? (
                      <Skeleton className="mt-1 h-4 w-48 bg-blue-200 dark:bg-blue-900/70" />
                    ) : wallet ? (
                      <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                        {formatZmwAmount(wallet.balanceZmwEquivalent)} equivalent · 1 credit ={" "}
                        {formatZmwAmount(wallet.zmwPerCredit)}
                      </p>
                    ) : null}
                  </Link>
                ) : null}
                {showCompanyWallet ? <Separator className="my-2" /> : <Separator className="my-2 mt-4" />}
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <Link href="/dashboard/profile" className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <span className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </span>
                          Profile
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                    {showCompanyWallet ? (
                      <li>
                        <Link
                          href="/dashboard/wallet"
                          className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          <span className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </span>
                            Wallet
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ) : null}
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
              {navItems.map((item) => (
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
