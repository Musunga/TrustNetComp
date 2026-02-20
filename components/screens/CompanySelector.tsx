"use client"

import { authSessionAtom, activeCompanyAtom } from "@/lib/store/auth"
import type { CompanyI } from "@/lib/types"
import { useAtomValue, useSetAtom } from "jotai"
import { Building2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CompanySelector() {
    const authSession = useAtomValue(authSessionAtom)
    const activeCompany = useAtomValue(activeCompanyAtom)
    const setActiveCompany = useSetAtom(activeCompanyAtom)

    function companiesFromMemberships(memberships: { company: CompanyI }[]): CompanyI[] {
        const seen = new Set<string>()
        return memberships
          .map((m) => m.company)
          .filter((c) => {
            if (seen.has(c.id)) return false
            seen.add(c.id)
            return true
          })
      }
      
    const companies = useMemo(
        () => (authSession?.memberships ? companiesFromMemberships(authSession.memberships) : []),
        [authSession?.memberships]
      )
      const showCompanyDropdown = companies.length > 1
    
      useEffect(() => {
        if (companies.length === 0) return
        const activeInList = activeCompany && companies.some((c) => c.id === activeCompany.id)
        if (companies.length === 1 && !activeCompany) {
          setActiveCompany(companies[0])
        } else if (!activeInList) {
          setActiveCompany(companies[0])
        }
      }, [companies, activeCompany, setActiveCompany])
    
      function onCompanyChange(companyId: string) {
        const company = companies.find((c) => c.id === companyId)
        if (company) setActiveCompany(company)
      }
    
  if (!showCompanyDropdown) return null

  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-gry-800 font-bold hidden text-sm sm:inline">Company</span>
      <Select value={activeCompany?.id ?? ""} onValueChange={onCompanyChange}>
        <SelectTrigger
          className="min-w-[200px] gap-2 border-input bg-background shadow-sm transition-colors hover:bg-muted/50 focus:ring-2 focus:ring-ring/20 sm:min-w-[240px]"
          aria-label="Select company"
        >
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent
          className="min-w-(--radix-select-trigger-width) rounded-lg border bg-popover p-1 shadow-lg"
          position="popper"
          sideOffset={4}
          align="end"
        >
          {companies.map((c) => (
            <SelectItem
              key={c.id}
              value={c.id}
              className="cursor-pointer rounded-md py-2.5 pl-3 pr-8 text-sm focus:bg-accent"
            >
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}