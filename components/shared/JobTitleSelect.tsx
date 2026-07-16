"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useJobTitles } from "@/hooks/use-job-titles"
import { cn } from "@/lib/utils"

export function JobTitleSelect({
  id,
  value,
  onChange,
  placeholder = "Select job title",
}: {
  id?: string
  value: string
  onChange: (title: string) => void
  placeholder?: string
}) {
  const { jobTitles, loading } = useJobTitles()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const trimmedQuery = query.trim()
  const hasExactMatch = jobTitles.some(
    (t) => t.title.toLowerCase() === trimmedQuery.toLowerCase()
  )

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={loading}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground">
                {loading ? "Loading job titles..." : placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter>
          <CommandInput
            placeholder="Search job title..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {trimmedQuery && !hasExactMatch && (
              <CommandGroup>
                <CommandItem
                  value={`__custom__${trimmedQuery}`}
                  onSelect={() => {
                    onChange(trimmedQuery)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <span className="flex-1 truncate">Use &ldquo;{trimmedQuery}&rdquo;</span>
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup>
              {jobTitles.map((t) => (
                <CommandItem
                  key={t.id}
                  value={t.title}
                  onSelect={() => {
                    onChange(t.title)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <span className="flex-1 truncate">{t.title}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === t.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
