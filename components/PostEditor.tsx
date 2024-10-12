import { Company, Post, Tag } from '@/lib/db/schema';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/TextArea';
import { TagSelect } from './TagSelect';
import { DatePicker } from '@/components/DatePicker';
import { CompanySelect } from './CompanySelect';
import { produce } from 'immer';
import { MultiLanguageInput } from './MultiLanguageInput';
import { EditField } from './EditField';

type EditorPost = Partial<
  Pick<
    Post,
    | 'title'
    | 'body'
    | 'employingCompanyId'
    | 'opensAt'
    | 'closesAt'
    | 'applicationLink'
  > & { tags?: { tag: Tag }[] }
>;

export type Props = {
  post: EditorPost;
  onChange: (newPost: EditorPost) => void;
  companies: Company[];
  tags: Tag[];
  errors: Record<string, string>;
};

const PostEditor = ({
  post,
  onChange,
  tags,
  companies,
  errors = {},
}: Props) => {
  const setField = <K extends keyof EditorPost>(
    field: K,
    value: EditorPost[K],
  ) => {
    onChange(
      produce(post, draft => {
        draft[field] = value;
      }),
    );
  };

  return (
    <div>
      <EditField label="Title" error={errors.title}>
        <MultiLanguageInput
          value={post.title}
          onValueChange={value => setField('title', value)}
        />
      </EditField>
      <div className="flex mt-5 gap-10">
        <div className="grow basis-1">
          <EditField label="Opens at" error={errors.opensAt}>
            <DatePicker
              className="w-full"
              date={post.opensAt ?? null}
              onDateChanged={value => setField('opensAt', value)}
            />
          </EditField>
        </div>
        <div className="grow basis-1">
          <EditField label="Closes at" error={errors.closesAt}>
            <DatePicker
              calendarProps={{ fromDate: post.opensAt ?? undefined }}
              className="w-full"
              date={post.closesAt ?? null}
              onDateChanged={value => setField('closesAt', value)}
            />
          </EditField>
        </div>
      </div>
      <EditField label="Company" error={errors.employingCompanyId}>
        <CompanySelect
          value={post.employingCompanyId ?? null}
          onChange={id => setField('employingCompanyId', id ?? undefined)}
          companies={companies}
          className="w-full"
        />
      </EditField>
      <EditField label="Tags" error={errors.tags}>
        <TagSelect
          value={(post.tags ?? []).map(join => join.tag)}
          onChange={tags => setField('tags', tags.map(tag => ({ tag })))}
          tags={tags}
          className="w-full"
        />
      </EditField>
      <EditField label="Application link" error={errors.applicationLink}>
        <Input
          value={post.applicationLink ?? ''}
          onChange={evt => setField('applicationLink', evt.target.value)}
        />
      </EditField>
      <EditField label="Content" error={errors.body}>
        <MultiLanguageInput
          component={Textarea}
          onValueChange={value => setField('body', value)}
          value={post.body}
          className="font-[monospace] min-h-[20em]"
        />
      </EditField>
    </div>
  );
};

export default PostEditor;
