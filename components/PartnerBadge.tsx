import { SparklesIcon } from '@heroicons/react/20/solid';
import { useTranslation } from '@/app/i18n/client';

export const PartnerBadge = () => {
  const { t } = useTranslation();

  return (
    <span className="text-sm rounded py-0.5 px-1.5 bg-yellow-100 dark:bg-[#b7962e] dark:text-black text-yellow-700 inline-flex items-center gap-1">
      <SparklesIcon className="h-4 w-4" />
      {t('partner')}
    </span>
  );
};
