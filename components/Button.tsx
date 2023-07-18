import { cva } from "class-variance-authority";
import React from "react";
import { ReactNode } from "react";

const buttonCva = cva([
  'py-1',
  'px-2',
  'duration-[50ms]',
  'pl-3',
  'rounded',
  'border-b-4',
  'flex',
  'items-center',
  'gap-2',
  'shadow-sm',
  'relative',
  'top-0',
  'active:top-[2px]',
  'active:border-b-[2px]',
  'active:shadow-none',
], {
  variants: {
    secondary: {
      true: [
        'bg-gray-100',
        'border-gray-300',
      ],
      false: [
        'bg-yellow-300',
        'border-yellow-400',
      ],
    },
  },
});

export type Props = React.PropsWithChildren<{
  icon?: ReactNode
  secondary?: boolean
}> & React.HTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement>(({ children, secondary = false, icon = null, ...rest }: Props, ref) => (
  <div>
    <button {...rest} className={buttonCva({ secondary, class: rest.className })} ref={ref}>
      {children}
      {icon}
    </button>
  </div>
));
