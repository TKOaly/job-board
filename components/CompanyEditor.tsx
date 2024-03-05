import { Company } from '@prisma/client';
import { Input } from '@/components/Input';
import { produce } from 'immer';
import { Checkbox } from './Checkbox';
import { MultiLanguageInput } from './MultiLanguageInput';
import { toMultiLangStringSet } from '@/lib/multilang';
import { EditField } from './EditField';
import { Button } from './Button';

type EditorCompany = Partial<
  Pick<Company, 'name' | 'partner' | 'website'> & { logo: File }
>;

export type Props = {
  company: EditorCompany;
  onChange: (newCompany: EditorCompany) => void;
  errors?: Record<string, string>;
};

const CompanyEditor = ({ company, onChange, errors = {} }: Props) => {
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
      <EditField label="Name" error={errors.name}>
        <MultiLanguageInput
          value={toMultiLangStringSet(company.name)}
          onValueChange={value => setField('name', value)}
        />
      </EditField>
      <EditField label="Website" error={errors.website}>
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
      </EditField>
      <EditField label="Logo" error={errors.logo}>
        <div className="flex mt-5 gap-2">
          <Input
            type="file"
            onChange={evt => setField('logo', evt.target.files?.[0])}
          />
          <Button
            disabled={!company.logo}
            onClick={() => setField('logo', undefined)}
            className="h-full"
          >
            Clear
          </Button>
        </div>
      </EditField>
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
