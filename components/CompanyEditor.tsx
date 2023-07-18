import { Company } from "@prisma/client";
import { Input } from "@/components/Input";
import { produce } from "immer";
import { Checkbox } from "./Checkbox";

type EditorCompany = Partial<Pick<Company, 'name' | 'partner' | 'website'>>;

export type Props = {
  company: EditorCompany,
  onChange: (newPost: EditorCompany) => void,
}

const CompanyEditor = ({ company, onChange }: Props) => {
  const setField = <K extends keyof EditorCompany>(field: K, value: EditorCompany[K]) => {
    onChange(produce(company, (draft) => {
      draft[field] = value;
    }));
  };

  return (
    <div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Name</div>
        <Input value={company.name} onChange={(evt) => setField('name', evt.target.value)} />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Website</div>
        <Input value={company.website} onChange={(evt) => setField('website', evt.target.value)} />
      </div>
      <div className="mt-5 flex items-center space-x-2">
        <Checkbox checked={company.partner === true} id="partner" onCheckedChange={(e) => setField('partner', !!e)} />
        <label htmlFor="partner">Is partner?</label>
      </div>
    </div>
  );
};

export default CompanyEditor;
