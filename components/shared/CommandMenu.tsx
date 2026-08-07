"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bot, CreditCard, Search, User } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface QuickLink {
  title: string
  href: string
  icon: React.ElementType
}

export function CommandMenu({
  navItems,
  showWallet,
  onAskTrustNet,
}: {
  navItems: QuickLink[]
  showWallet: boolean
  onAskTrustNet: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function runCommand(action: () => void) {
    setOpen(false)
    action()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="inline-flex h-9 w-full items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent/50 sm:w-56 lg:w-72"
        aria-label="Search"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex-1 truncate text-left">Search...</span>
        <kbd className="hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => runCommand(onAskTrustNet)}>
              <Bot className="text-primary" />
              <span>Ask TrustNet</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick links">
            {navItems.map((item) => (
              <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))}>
                <item.icon className="text-primary" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
            {showWallet ? (
              <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/wallet"))}>
                <CreditCard className="text-primary" />
                <span>Wallet</span>
              </CommandItem>
            ) : null}
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/profile"))}>
              <User className="text-primary" />
              <span>Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
