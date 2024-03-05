'use client';

import {
  ArrowPathIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { Company } from '@prisma/client';
import { useState } from 'react';
import { Button } from './Button';
import { useCommandState } from 'cmdk';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './Command';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { twMerge } from 'tailwind-merge';
import { PlusIcon, SparklesIcon } from '@heroicons/react/20/solid';
import { useMultiLang } from '@/lib/multilang';

export type Props = {
  value: number | null;
  companies: Company[];
  onChange: (value: number | null) => void;
  className?: string;
};

const CreateCompanyCommandItem = ({
  onCreated,
  companies,
}: {
  companies: Company[];
  onCreated: (company: Company) => void;
}) => {
  const [state, setState] = useState('idle');
  const search = useCommandState(state => state.search);
  const getMultiLangValue = useMultiLang();

  if (
    search === '' ||
    companies.some(
      company =>
        getMultiLangValue(company.name).toLowerCase() === search.toLowerCase(),
    )
  ) {
    return null;
  }

  const handleCreate = async () => {
    setState('loading');

    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: {
          xx: search,
        },
      }),
    });

    if (!response.ok) {
      setState('error');
      return;
    }

    const { payload: company } = await response.json();
    onCreated(company);
    setState('idle');
  };

  return (
    <CommandItem value="create" onSelect={handleCreate}>
      {state === 'idle' && <PlusIcon className="h-4 w-4 mr-2" />}
      {state === 'loading' && (
        <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
      )}
      Create company &quot;{search}&quot;
    </CommandItem>
  );
};

export const CompanySelect = ({
  value,
  onChange,
  companies,
  className,
}: Props) => {
  const getMultiLangValue = useMultiLang();
  const [open, setOpen] = useState(false);
  const [allCompanies, setAllCompanies] = useState(companies);

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
            ? getMultiLangValue(
                allCompanies.find(company => company.id === value)?.name,
              )
            : 'Select company...'}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80ch] p-0">
        <Command
          filter={(value, search) => {
            if (value === 'create') {
              return 2;
            }

            const id = parseInt(value, 10);
            const company = allCompanies.find(c => c.id === id);

            if (
              company &&
              getMultiLangValue(company.name)
                .toLowerCase()
                .includes(search.toLowerCase())
            ) {
              return 1;
            }

            return 0;
          }}
        >
          <CommandInput placeholder="Search companies or create a new one" />
          <CommandEmpty>No company found.</CommandEmpty>
          <CommandGroup className="max-h-[40em] overflow-y-scroll">
            {allCompanies.map(company => (
              <CommandItem
                key={company.id}
                value={company.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(parseInt(currentValue, 10));
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={twMerge(
                    'mr-2 h-4 w-4',
                    value === company.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {getMultiLangValue(company.name)}
                {company.partner && (
                  <span className="text-sm rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-600 inline-flex items-center ml-2">
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup>
            <CreateCompanyCommandItem
              companies={companies}
              onCreated={company => {
                setAllCompanies([...allCompanies, company]);
                onChange(company.id);
                setOpen(false);
              }}
            />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
