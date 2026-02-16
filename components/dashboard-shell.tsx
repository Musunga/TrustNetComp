"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BrandLogo } from "@/components/brand-logo"

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
  { title: "Subscription", href: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Sidebar / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center space-x-2 -ml-6 md:-ml-12">
              <BrandLogo className="h-6 transform origin-left scale-[8]" width={120} height={32} priority />
            </Link>
            <nav className="hidden md:flex items-center space-x-4 text-sm font-medium md:ml-[200px]">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-2/3 sm:max-w-xs">
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
                  <Button variant="ghost" className="w-full justify-start text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 container mx-auto py-8">{children}</main>

      {/* Floating Support Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
            aria-label="Contact support"
          >
            <Headset className="h-6 w-6" />
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
