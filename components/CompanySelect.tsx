'use client';

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Company } from "@prisma/client";
import { useState } from "react";
import { Button } from "./Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { twMerge } from "tailwind-merge";
import { SparklesIcon } from "@heroicons/react/20/solid";

export type Props = {
  value: number | null
  companies: Company[]
  onChange: (value: number | null) => void
  className?: string
}

export const CompanySelect = ({ value, onChange, companies, className }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          outline
          role="combobox"
          aria-expanded={open}
          className={twMerge('w-[200px] justify-between', className)}
        >
          {value
            ? companies.find((comapny) => comapny.id === value)?.name
            : "Select company..."}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[30em] p-0">
        <Command>
          <CommandInput placeholder="Search company..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup className="max-h-[40em] overflow-y-scroll">
            {companies.map((company) => (
              <CommandItem
                key={company.id}
                value={String(company.id)}
                onSelect={(currentValue: string) => {
                  onChange(parseInt(currentValue, 10))
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={twMerge(
                    "mr-2 h-4 w-4",
                    value === company.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {company.name}
                {company.partner && (
                  <span className="text-sm rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-600 inline-flex items-center ml-2">
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
