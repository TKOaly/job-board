import { Company, Post, Tag } from '@prisma/client';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/TextArea';
import { TagSelect } from './TagSelect';
import { DatePicker } from '@/components/DatePicker';
import { CompanySelect } from './CompanySelect';
import { produce } from 'immer';
import { MultiLanguageInput } from './MultiLanguageInput';
import { twMerge } from 'tailwind-merge';

type EditorPost = Partial<
  Pick<
    Post,
    | 'title'
    | 'body'
    | 'employingCompanyId'
    | 'opensAt'
    | 'closesAt'
    | 'applicationLink'
  > & { tags: Tag[] }
>;

export type Props = {
  post: EditorPost;
  onChange: (newPost: EditorPost) => void;
  companies: Company[];
  tags: Tag[];
  errors: Record<string, string>;
};

const Field = ({
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
      <Field label="Title" error={errors.title}>
        <MultiLanguageInput
          value={post.title}
          onValueChange={value => setField('title', value)}
        />
      </Field>
      <div className="flex mt-5 gap-10">
        <div className="grow basis-1">
          <Field label="Opens at" error={errors.opensAt}>
            <DatePicker
              className="w-full"
              date={post.opensAt ?? null}
              onDateChanged={value => setField('opensAt', value)}
            />
          </Field>
        </div>
        <div className="grow basis-1">
          <Field label="Closes at" error={errors.closesAt}>
            <DatePicker
              calendarProps={{ fromDate: post.opensAt ?? undefined }}
              className="w-full"
              date={post.closesAt ?? null}
              onDateChanged={value => setField('closesAt', value)}
            />
          </Field>
        </div>
      </div>
      <Field label="Company" error={errors.employingCompanyId}>
        <CompanySelect
          value={post.employingCompanyId ?? null}
          onChange={id => setField('employingCompanyId', id ?? undefined)}
          companies={companies}
          className="w-full"
        />
      </Field>
      <Field label="Tags" error={errors.tags}>
        <TagSelect
          value={post.tags ?? []}
          onChange={id => setField('tags', id)}
          tags={tags}
          className="w-full"
        />
      </Field>
      <Field label="Application link" error={errors.applicationLink}>
        <Input
          value={post.applicationLink}
          onChange={evt => setField('applicationLink', evt.target.value)}
        />
      </Field>
      <Field label="Content" error={errors.body}>
        <MultiLanguageInput
          component={Textarea}
          onValueChange={value => setField('body', value)}
          value={post.body}
          className="font-[monospace] min-h-[20em]"
        />
      </Field>
    </div>
  );
};

export default PostEditor;
