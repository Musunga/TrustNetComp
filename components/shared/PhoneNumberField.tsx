"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useCountries } from "@/hooks/use-countries"
import { cn } from "@/lib/utils"

export function PhoneNumberField({
  id,
  dialCode,
  onDialCodeChange,
  number,
  onNumberChange,
  autoComplete = "off",
}: {
  id: string
  dialCode: string
  onDialCodeChange: (code: string) => void
  number: string
  onNumberChange: (value: string) => void
  autoComplete?: string
}) {
  const { countries, loading } = useCountries()
  const [open, setOpen] = React.useState(false)
  const selected = countries.find((c) => c.dialCode === dialCode)

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select country dial code"
            className="w-28 shrink-0 justify-between px-2 font-normal"
            disabled={loading}
          >
            <span className="flex items-center gap-1 truncate">
              {selected ? (
                <>
                  <span aria-hidden>{selected.emoji}</span>
                  <span className="truncate">{selected.dialCode}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Code</span>
              )}
            </span>
            <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country or code..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={`${c.name} ${c.dialCode}`}
                    onSelect={() => {
                      onDialCodeChange(c.dialCode)
                      setOpen(false)
                    }}
                  >
                    <span className="mr-1" aria-hidden>
                      {c.emoji}
                    </span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-muted-foreground">{c.dialCode}</span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        dialCode === c.dialCode ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        name={id}
        value={number}
        onChange={(e) => onNumberChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder="771234567"
        className="flex-1"
      />
    </div>
  )
}
