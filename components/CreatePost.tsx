'use client';

import { Company } from "@prisma/client";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Textarea } from "@/components/TextArea";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { formatISO, isBefore } from "date-fns";

export type Props = {
  companies: Company[],
};

export const CreatePost = ({ companies }: Props) => {
  const [title, setTitle] = useState('');
  const [opensAt, setOpensAt] = useState<Date | null>(null);
  const [closesAt, setClosesAt] = useState<Date | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (title.length <= 3) {
      setError('Title must be 4 characters or longer.');
      return;
    }

    if (closesAt && opensAt && isBefore(closesAt, opensAt)) {
      setError('Post cannot close before it opens.');
      return;
    }

    if (companyId === null) {
      setError('Company is required.');
      return;
    }

    const response = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        closesAt: formatISO(closesAt),
        opensAt: formatISO(opensAt),
        company: companyId,
        body,
      })
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message ?? 'Unknown error occurred.');
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Post</h1>
      { error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to create post</h4>
          <p>{error}</p>
        </div>
      )}
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Title</div>
        <Input value={title} onChange={(evt) => setTitle(evt.target.value)} />
      </div>
      <div className="flex mt-5 gap-10">
        <div className="grow basis-1">
          <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Opens At</div>
          <DatePicker className="w-full" date={opensAt} onDateChanged={setOpensAt} />
        </div>
        <div className="grow basis-1">
          <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Closes At</div>
          <DatePicker className="w-full" date={closesAt} onDateChanged={setClosesAt} />
        </div>
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Company</div>
        <Select onValueChange={(id) => setCompanyId(parseInt(id, 10))}>
          <SelectTrigger>
            <SelectValue>{companies.find((c) => c.id === companyId)?.name ?? 'Select company...'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem value={String(company.id)}>
                <div className="flex items-center gap-2">
                  {company.name}
                  {company.partner && (
                    <span className="text-sm rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                      <SparklesIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5">
        <div className="uppercase text-xs font-bold mb-2 tracking-wide text-gray-600">Content</div>
        <Textarea onChange={(evt) => setBody(evt.target.value)} value={body} />
      </div>
      <div className="mt-5">
        <Button onClick={handleSubmit}>Publish</Button>
      </div>
    </div>
  );
};
