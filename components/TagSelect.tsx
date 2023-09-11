'use client';

import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import * as R from 'ramda';
import { Company, Tag } from '@prisma/client';
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
import { SparklesIcon } from '@heroicons/react/20/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export type Props = {
  tags: Tag[];
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  className?: string;
};
const CreateTagCommandItem = ({
  onCreated,
  tags,
}: {
  tags: Tag[];
  onCreated: (tag: Tag) => void;
}) => {
  const [state, setState] = useState('idle');
  const search = useCommandState(state => state.search);

  if (
    search === '' ||
    tags.find(t => t.name.toLowerCase() == search.toLowerCase())
  ) {
    return null;
  }

  const handleCreate = async () => {
    setState('loading');

    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: search,
      }),
    });

    if (!response.ok) {
      setState('idle');
      return;
    }

    const json = await response.json();

    setState('idle');
    onCreated(json.payload);
  };

  return (
    <CommandItem value="create" onSelect={handleCreate}>
      {state === 'idle' && <PlusIcon className="h-4 w-4 mr-2" />}
      {state === 'loading' && (
        <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
      )}
      Create tag &quot;{search}&quot;
    </CommandItem>
  );
};

export const TagSelect = ({ value, onChange, tags, className }: Props) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const allTags = R.uniqBy(R.prop('id'), [...value, ...tags]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          outline
          role="combobox"
          aria-expanded={open}
          className={twMerge(
            'w-[200px] min-h-10 h-auto justify-between',
            className,
          )}
        >
          {!value?.length && 'Select tags...'}
          {!!value?.length && (
            <div className="flex flex-wrap gap-1">
              {value.map(({ name, id }) => (
                <span
                  className="text-sm rounded py-0.5 px-1.5 bg-gray-100 text-gray-700 inline-flex items-center gap-1"
                  key={id}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[30em] p-0">
        <Command
          filter={(value, search) => {
            if (value === 'create') {
              return 2;
            }

            const tag = allTags.find(t => t.id == value);

            if (!tag) {
              return 0;
            }

            if (tag.name.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }

            return 0;
          }}
        >
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder="Search tags or create a new one"
          />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            <CreateTagCommandItem
              tags={allTags}
              onCreated={tag => {
                onChange([...value, tag]);
                setInputValue('');
              }}
            />
          </CommandGroup>
          <CommandGroup className="max-h-[40em] overflow-y-scroll">
            {allTags.map(tag => (
              <CommandItem
                key={tag.id}
                value={String(tag.id)}
                onSelect={(currentValue: string) => {
                  const newValue = [...value];
                  const existingIndex = newValue.findIndex(
                    t => t.id == parseInt(currentValue, 10),
                  );

                  if (existingIndex !== -1) {
                    newValue.splice(existingIndex, 1);
                  } else {
                    const tag = tags.find(
                      t => t.id == parseInt(currentValue, 10),
                    );

                    if (!tag) {
                      return;
                    }

                    newValue.push(tag);
                  }

                  onChange(newValue);
                }}
              >
                <CheckIcon
                  className={twMerge(
                    'mr-2 h-4 w-4',
                    value.find(t => t.id == tag.id)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {tag.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
