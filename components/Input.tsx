import * as React from "react"
import { twMerge } from 'tailwind-merge';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          "flex h-10 w-full rounded-md border border-input bg-background dark:bg-[#25231f] dark:text-[#e8e4da] dark:border-[#35322b] px-3 py-2 text-sm ring-offset-background dark:ring-offset-[#35322b] file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-[#e8e4da] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-[#b7962e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
