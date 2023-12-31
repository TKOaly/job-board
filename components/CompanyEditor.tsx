import { Company } from '@prisma/client';
import { Input } from '@/components/Input';
import { produce } from 'immer';
import { Checkbox } from './Checkbox';
import { MultiLanguageInput } from './MultiLanguageInput';
import { toMultiLangStringSet } from '@/lib/multilang';

type EditorCompany = Partial<Pick<Company, 'name' | 'partner' | 'website'> & { logo: File }>;

export type Props = {
  company: EditorCompany;
  onChange: (newCompany: EditorCompany) => void;
};

const CompanyEditor = ({ company, onChange }: Props) => {
  const setField = <K extends keyof EditorCompany>(
    field: K,
    value: EditorCompany[K],
  ) => {
    onChange(
      produce(company, draft => {
        draft[field] = value;
      }),
    );
  };

  return (
    <div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">
          Name
        </div>
        <MultiLanguageInput
          value={toMultiLangStringSet(company.name)}
          onValueChange={value => setField('name', value)}
        />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">
          Website
        </div>
        <Input
          value={company.website ?? undefined}
          onChange={evt => {
            if (evt.target.value === '') {
              setField('website', null);
            } else {
              setField('website', evt.target.value);
            }
          }}
        />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">
          Logo
        </div>
        <Input
          type="file"
          onChange={evt => setField('logo', evt.target.files?.[0])}
        />
      </div>
      <div className="mt-5 flex items-center space-x-2">
        <Checkbox
          checked={company.partner === true}
          id="partner"
          onCheckedChange={e => setField('partner', !!e)}
        />
        <label htmlFor="partner">Is partner?</label>
      </div>
    </div>
  );
};

export default CompanyEditor;
