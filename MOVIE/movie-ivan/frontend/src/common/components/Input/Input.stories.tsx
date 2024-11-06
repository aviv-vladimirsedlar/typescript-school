import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Input from '.';

const meta = {
  title: 'Common/Components/Input',
  component: Input,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'password', 'email'],
      },
    },
    required: { control: 'boolean' },
    error: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Username', name: 'username', value: '', onChange: fn() },
};

export const Required: Story = {
  args: {
    label: 'Password',
    name: 'password',
    required: true,
    type: 'password',
    value: '',
    onChange: fn(),
  },
};

export const WithError: Story = {
  args: { label: 'Username', name: 'username', value: '', error: 'This field is required', onChange: fn() },
};
