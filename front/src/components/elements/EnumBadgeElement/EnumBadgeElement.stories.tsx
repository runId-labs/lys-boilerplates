import type { Meta, StoryObj } from '@storybook/react'
import EnumBadgeElement from './index'

const meta = {
  title: 'Elements/EnumBadgeElement',
  component: EnumBadgeElement,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EnumBadgeElement>

export default meta
type Story = StoryObj<typeof meta>

const statusValues = {
  DRAFT: { variant: 'secondary' as const, label: 'Draft' },
  PENDING: { variant: 'warning' as const, label: 'Pending' },
  IN_PROGRESS: { variant: 'primary' as const, label: 'In progress', description: 'Work has started on this item' },
  COMPLETED: { variant: 'success' as const, label: 'Completed' },
  DISMISSED: { variant: 'danger' as const, label: 'Dismissed' },
}

const priorityValues = {
  HIGH: { variant: 'danger' as const, label: 'High priority', description: 'Requires immediate attention' },
  MEDIUM: { variant: 'warning' as const, label: 'Medium priority' },
  LOW: { variant: 'secondary' as const, label: 'Low priority' },
}

export const Status: Story = {
  args: {
    code: 'IN_PROGRESS',
    values: statusValues,
    tooltipTitle: 'Status',
  },
}

export const StatusAll: Story = {
  args: {
    code: 'DRAFT',
    values: statusValues,
  },
  render: (args) => (
    <div className="d-flex gap-2 flex-wrap">
      {Object.keys(statusValues).map((code) => (
        <EnumBadgeElement key={code} code={code} values={args.values} />
      ))}
    </div>
  ),
}

export const Priority: Story = {
  args: {
    code: 'HIGH',
    values: priorityValues,
  },
}

export const UnknownCode: Story = {
  args: {
    code: 'DEPRECATED_CODE',
    values: statusValues,
  },
}
