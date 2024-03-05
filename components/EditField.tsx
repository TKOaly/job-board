import { twMerge } from 'tailwind-merge';

export const EditField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-5">
      <div
        className={twMerge(
          'text-xs mb-2 tracking-wide text-gray-600',
          error && 'text-red-500',
        )}
      >
        <span className="uppercase font-bold">{label}</span>
        <span className="ml-2">{error}</span>
      </div>
      {children}
    </div>
  );
};
