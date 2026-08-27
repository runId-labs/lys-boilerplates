import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import InputElement from './index'

const meta = {
  title: 'Elements/InputElement',
  component: InputElement,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    as: {
      control: 'select',
      options: ['input', 'textarea'],
    },
    isFloatingLabel: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
    showCharacterCount: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof InputElement>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'default-input',
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
}

export const FloatingLabel: Story = {
  args: {
    id: 'floating-input',
    label: 'Floating Label',
    isFloatingLabel: true,
    placeholder: 'Enter text...',
  },
}

export const WithError: Story = {
  args: {
    id: 'error-input',
    label: 'Email',
    placeholder: 'email@example.com',
    type: 'email',
    error: 'Please enter a valid email address',
  },
}

export const WithHelperText: Story = {
  args: {
    id: 'helper-input',
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Must be at least 3 characters',
  },
}

export const WithLeftIcon: Story = {
  args: {
    id: 'icon-input',
    label: 'Search',
    placeholder: 'Search...',
    type: 'search',
    leftIcon: <i className="bi bi-search" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    id: 'icon-right-input',
    label: 'Email',
    placeholder: 'email@example.com',
    type: 'email',
    rightIcon: <i className="bi bi-envelope" />,
  },
}

export const WithClearButton: Story = {
  args: {
    id: 'clear-input',
    label: 'Input with Clear Button',
  },
  render: () => {
    const [value, setValue] = useState('Some text to clear')
    return (
      <InputElement
        id="clear-input"
        label="Input with Clear Button"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        showClearButton
        onClear={() => setValue('')}
      />
    )
  },
}

export const WithCharacterCount: Story = {
  args: {
    id: 'count-input',
    label: 'Character Count',
  },
  render: () => {
    const [value, setValue] = useState('')
    return (
      <InputElement
        id="count-input"
        label="Bio"
        as="textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={100}
        showCharacterCount
        helperText="Tell us about yourself"
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    label: 'Disabled Input',
    value: 'Cannot edit',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    id: 'required-input',
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
}

export const Textarea: Story = {
  args: {
    id: 'textarea-input',
    label: 'Description',
    as: 'textarea',
    placeholder: 'Enter description...',
  },
}

export const PasswordType: Story = {
  args: {
    id: 'password-input',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const NumberType: Story = {
  args: {
    id: 'number-input',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age',
    min: 0,
    max: 120,
  },
}

export const CompleteExample: Story = {
  args: {
    id: 'complete-input',
    label: 'Complete Example',
  },
  render: () => {
    const [value, setValue] = useState('')
    return (
      <InputElement
        id="complete-input"
        label="Complete Example"
        isFloatingLabel
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftIcon={<i className="bi bi-person" />}
        showClearButton
        onClear={() => setValue('')}
        maxLength={50}
        showCharacterCount
        helperText="Enter your full name"
        required
      />
    )
  },
}
