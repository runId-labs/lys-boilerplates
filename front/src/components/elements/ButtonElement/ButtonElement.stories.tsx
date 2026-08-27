import type { Meta, StoryObj } from '@storybook/react'
import ButtonElement from './index'

const meta = {
  title: 'Elements/ButtonElement',
  component: ButtonElement,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-light', 'outline-dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ButtonElement>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    isLoading: true,
  },
}

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    children: 'With Left Icon',
    leftIcon: <i className="bi bi-plus-circle" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    children: 'With Right Icon',
    rightIcon: <i className="bi bi-arrow-right" />,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

export const SmallSize: Story = {
  args: {
    variant: 'primary',
    children: 'Small Button',
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    variant: 'primary',
    children: 'Large Button',
    size: 'lg',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-2">
      <ButtonElement variant="primary">Primary</ButtonElement>
      <ButtonElement variant="secondary">Secondary</ButtonElement>
      <ButtonElement variant="success">Success</ButtonElement>
      <ButtonElement variant="danger">Danger</ButtonElement>
      <ButtonElement variant="warning">Warning</ButtonElement>
      <ButtonElement variant="info">Info</ButtonElement>
      <ButtonElement variant="light">Light</ButtonElement>
      <ButtonElement variant="dark">Dark</ButtonElement>
    </div>
  ),
}

export const AllOutlineVariants: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-2">
      <ButtonElement variant="outline-primary">Primary</ButtonElement>
      <ButtonElement variant="outline-secondary">Secondary</ButtonElement>
      <ButtonElement variant="outline-success">Success</ButtonElement>
      <ButtonElement variant="outline-danger">Danger</ButtonElement>
      <ButtonElement variant="outline-warning">Warning</ButtonElement>
      <ButtonElement variant="outline-info">Info</ButtonElement>
      <ButtonElement variant="outline-light">Light</ButtonElement>
      <ButtonElement variant="outline-dark">Dark</ButtonElement>
    </div>
  ),
}
