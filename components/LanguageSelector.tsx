import { LanguageIcon } from "@heroicons/react/24/solid";
import { useParams, useRouter } from "next/navigation";
import { useSelectedLayoutSegments } from "next/navigation";
import { fallbackLang } from "@/app/i18n/settings";

export const LanguageSelector = () => {
  const segments = useSelectedLayoutSegments();
  const router = useRouter();
  const params = useParams();
  const language = params?.lang ?? fallbackLang;

  const options = [
    { key: 'fi', label: 'Suomi' },
    { key: 'en', label: 'English' },
  ]

  const { label, key } = options[(options.findIndex(({ key }) => key === language) + 1) % options.length];

  const onChange = () => {
    router.replace(`/${key}/${segments.join('/')}`)
  };

  return (
    <div className="flex items-center gap-2 hover:bg-black/10 p-2 rounded cursor-pointer" onClick={onChange}>
      <LanguageIcon className="h-5 w-5" />{' '}
      <span>{label}</span>
    </div>
  );
};
