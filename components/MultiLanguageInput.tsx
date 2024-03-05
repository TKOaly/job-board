import {
  autoUpdate,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { produce } from 'immer';
import {
  ChangeEventHandler,
  MutableRefObject,
  RefCallback,
  useRef,
  useState,
} from 'react';
import { Input } from './Input';

export type Props = {
  component?: React.JSXElementConstructor<any>;
  value?: Record<string, string>;
  onValueChange?: (value: Record<string, string>) => void;
  open?: boolean;
};

const LANGUAGES = {
  xx: 'Unknown',
  fi: 'Finnish',
  en: 'English',
};

// https://phuoc.ng/collection/react-ref/merge-different-refs/
function mergeRefs<T>(
  refs: Array<MutableRefObject<T> | React.LegacyRef<T> | null>,
): RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const MultiLanguageInput = ({
  value: pValue,
  onValueChange,
  component: InputComponent = Input,
  open: pOpen = false,
}: Props) => {
  const value = pValue
    ? Object.fromEntries(
        Object.entries(pValue).filter(
          ([key, value]) => value && value.length > 0,
        ),
      )
    : {};

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(pOpen);
  const [language, setLanguage] = useState(Object.keys(value)[0] ?? 'xx');
  const setSelectedLanguage = (lang: string) => {
    setLanguage(lang);
    inputRef.current?.focus();
  };

  const languageValue = value?.[language] ?? '';

  const setLanguageValue = (langValue: string) => {
    const newValue = produce(value ?? {}, value => {
      value[language] = langValue;
    });

    onValueChange?.(newValue);
  };

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
    useDismiss(context, {}),
  ]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = evt => {
    setLanguageValue(evt.target.value);
  };

  const mergedInputRef = mergeRefs([inputRef, refs.setReference]);

  return (
    <div>
      <InputComponent
        ref={mergedInputRef}
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
          {...getFloatingProps({})}
        >
          {Object.entries(LANGUAGES)
            .filter(
              ([key]) =>
                key !== 'xx' ||
                Object.values(value ?? {}).every(v => v.length === 0) ||
                value?.xx !== undefined,
            )
            .map(([key, label]) => (
              <div
                key={key}
                className={`py-1 px-2 cursor-pointer ${
                  key === language ? 'font-semibold' : ''
                }`}
                onClick={() => setSelectedLanguage(key)}
              >
                {label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
