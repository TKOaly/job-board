import { twMerge } from 'tailwind-merge';

export const ApplicationOpenBadge = ({ className = '' }) => (
  <span
    className={twMerge(
      'text-sm rounded py-0.5 px-1.5 bg-green-100 dark:bg-green-800 dark:text-green-300 text-green-600 inline-flex items-center gap-1',
      className,
    )}
  >
    <div className="w-1.5 h-1.5 mx-0.5 mt-0.5 relative">
      <div className="absolute animate-ping rounded-full bg-green-400 dark:bg-green-200 w-full h-full"></div>
      <div className="rounded-full bg-green-200 dark:bg-green-600 w-full h-full"></div>
    </div>

    <span>Haku auki</span>
  </span>
);
