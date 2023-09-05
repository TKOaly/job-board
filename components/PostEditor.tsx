import { Company, Post, Tag } from "@prisma/client";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/TextArea";
import { TagSelect } from "./TagSelect";
import { DatePicker } from "@/components/DatePicker";
import { CompanySelect } from "./CompanySelect";
import { produce } from "immer";

type EditorPost = Partial<Pick<Post, 'title' | 'body' | 'employingCompanyId' | 'opensAt' | 'closesAt'> & { tags: Tag[] }>;

export type Props = {
  post: EditorPost,
  onChange: (newPost: EditorPost) => void,
  companies: Company[],
  tags: Tag[],
}

const PostEditor = ({ post, onChange, tags, companies }: Props) => {
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
        <CompanySelect value={post.employingCompanyId ?? null} onChange={(id) => setField('employingCompanyId', id ?? undefined)} companies={companies} className="w-full" />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Tags</div>
        <TagSelect value={post.tags ?? []} onChange={(id) => setField('tags', id)} tags={tags} className="w-full" />
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Content</div>
        <Textarea onChange={(evt) => setField('body', evt.target.value)} value={post.body} className="font-[monospace] min-h-[20em]" />
      </div>
    </div>
  );
};

export default PostEditor;
