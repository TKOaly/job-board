import * as React from 'react';
import { format } from 'date-fns';

import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { CalendarIcon } from '@heroicons/react/20/solid';

type Props = {
  className?: string;
  date: Date | null;
  onDateChanged: (newDate: Date) => void;
};

export function DatePicker({ className, date, onDateChanged }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={twMerge(
            'w-[280px] justify-start text-left font-normal',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            'text-sm rounded-md font-medium inline-flex items-center h-10 px-4 py-2',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={onDateChanged}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
