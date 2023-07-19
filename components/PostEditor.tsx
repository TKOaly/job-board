import { Company, Post } from "@prisma/client";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Textarea } from "@/components/TextArea";
import { DatePicker } from "@/components/DatePicker";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { CompanySelect } from "./CompanySelect";
import { produce } from "immer";

type EditorPost = Partial<Pick<Post, 'title' | 'body' | 'employingCompanyId' | 'opensAt' | 'closesAt'>>;

export type Props = {
  post: EditorPost,
  onChange: (newPost: EditorPost) => void,
  companies: Company[],
}

const PostEditor = ({ post, onChange, companies }: Props) => {
  const setField = <K extends keyof EditorPost>(field: K, value: EditorPost[K]) => {
    onChange(produce(post, (draft) => {
      draft[field] = value;
    }));
  };

  return (
    <div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Title</div>
        <Input value={post.title} onChange={(evt) => setField('title', evt.target.value)} />
      </div>
      <div className="flex mt-5 gap-10">
        <div className="grow basis-1">
          <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Opens At</div>
          <DatePicker className="w-full" date={post.opensAt ?? null} onDateChanged={(value) => setField('opensAt', value)} />
        </div>
        <div className="grow basis-1">
          <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Closes At</div>
          <DatePicker className="w-full" date={post.closesAt ?? null} onDateChanged={(value) => setField('closesAt', value)} />
        </div>
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Company</div>
        <CompanySelect value={post.employingCompanyId} onChange={(id) => setField('employingCompanyId', id)} companies={companies} className="w-full" />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Content</div>
        <Textarea onChange={(evt) => setField('body', evt.target.value)} value={post.body} className="font-[monospace]" />
      </div>
    </div>
  );
};

export default PostEditor;
