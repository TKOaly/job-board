import { autoUpdate, offset, shift, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { produce } from 'immer';
import { ChangeEventHandler, useState } from 'react';
import { Input } from './Input';

export type Props = {
  component?: React.JSXElementConstructor<any>
  value?: Record<string, string>,
  onValueChange?: (value: Record<string, string>) => void,
}

const LANGUAGES = {
  xx: 'Unknown',
  fi: 'Finnish',
  en: 'English',
}

export const MultiLanguageInput = ({
  value: pValue,
  onValueChange,
  component: InputComponent = Input,
}: Props) => {
  const value = pValue
    ? Object.fromEntries(Object.entries(pValue).filter(([key, value]) => value && value.length > 0))
    : {};

  const [open, setOpen] = useState(true);
  const [language, setLanguage] = useState('xx');

  const languageValue = value?.[language] ?? ''; 

  const setLanguageValue = (langValue: string) => {
    const newValue = produce(value ?? {}, (value) => {
      value[language] = langValue;
    });

    onValueChange?.(newValue);
  }

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: 'top-end',
    strategy: 'absolute',
    middleware: [
      offset({
        mainAxis: -5,
        crossAxis: -10,
      }),
      shift(),
    ],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context, { })
  ])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setLanguageValue(evt.target.value);
  };

  return (
    <div>
      <InputComponent
        ref={refs.setReference}
        value={languageValue}
        onChange={handleChange}
        {...getReferenceProps({
          onFocus: () => setOpen(true),
        })}
      />
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="px-1 text-sm rounded-full border shadow-sm flex divide-x bg-white"
          {...getFloatingProps({})}>
          {
            Object.entries(LANGUAGES)
              .filter(([key]) => key !== 'xx' || Object.values(value ?? {}).every((v) => v.length === 0) || value?.xx !== undefined)
              .map(([key, label]) => (
                <div className={`py-1 px-2 cursor-pointer ${key === language ? 'font-semibold' : ''}`} onClick={() => setLanguage(key)}>{label}</div>
              ))
          }
        </div>
      )}
    </div>
  );
}
