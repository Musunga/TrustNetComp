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
import { useCities } from "@/hooks/use-cities"
import { cn } from "@/lib/utils"

export function CitySelect({
  id,
  countryId,
  value,
  onChange,
  placeholder = "Select city (optional)",
}: {
  id?: string
  countryId: number | null
  value: string
  onChange: (city: string) => void
  placeholder?: string
}) {
  const { cities, loading } = useCities(countryId)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const trimmedQuery = query.trim()
  const hasExactMatch = cities.some(
    (c) => c.name.toLowerCase() === trimmedQuery.toLowerCase()
  )
  const disabled = loading || countryId == null

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
          disabled={disabled}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground">
                {loading
                  ? "Loading cities..."
                  : countryId == null
                    ? "Select a country first"
                    : placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter>
          <CommandInput
            placeholder="Search city..."
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
              {cities.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  onSelect={() => {
                    onChange(c.name)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <span className="flex-1 truncate">{c.name}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === c.name ? "opacity-100" : "opacity-0"
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
