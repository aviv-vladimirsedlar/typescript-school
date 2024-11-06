import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// import { ButtonProps } from './types';

import Button from '.';

const meta = {
  title: 'Common/Components/Button',
  component: Button,
  parameters: {},

  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Default' },
};

export const Primary: Story = {
  args: { children: 'Primary', className: 'bg-blue-500 text-white' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', className: 'bg-gray-500 text-white' },
};

export const Outline: Story = {
  args: { children: 'Outline', className: 'bg-transparent border border-gray-600 text-gray-600' },
};
