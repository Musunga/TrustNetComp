"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const isDark = (resolvedTheme ?? theme ?? "light") === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  const ariaLabel = mounted ? `Use ${isDark ? "light" : "dark"} theme` : "Toggle theme"

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="relative"
      onClick={toggleTheme}
      aria-label={ariaLabel}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden />
    </Button>
  )
}
