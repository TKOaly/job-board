import { Textarea } from '../components/TextArea';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { MultiLanguageInput } from '../components/MultiLanguageInput';

const meta: Meta<typeof MultiLanguageInput> = {
  component: MultiLanguageInput,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MultiLanguageInput>;

export const TextField: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <MultiLanguageInput {...args} onValueChange={(value) => { setValue(value); args?.onValueChange?.(value) }} value={value} />
  },
  args: {
    open: true
  },
};

export const TextArea: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <MultiLanguageInput {...args} onValueChange={(value) => { setValue(value); args?.onValueChange?.(value) }} value={value} />
  },
  args: {
    component: Textarea,
    open: true,
  },
};
