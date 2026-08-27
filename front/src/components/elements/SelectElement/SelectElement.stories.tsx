import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import SelectElement from './index'
import { SelectOption, SelectOptionGroup } from './types'

const meta = {
  title: 'Elements/SelectElement',
  component: SelectElement,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isFloatingLabel: {
      control: 'boolean',
    },
    nullable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SelectElement>

export default meta
type Story = StoryObj<typeof meta>

const simpleOptions: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

const countryOptions: SelectOption[] = [
  { label: 'France', value: 'fr' },
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'Spain', value: 'es' },
  { label: 'Italy', value: 'it' },
]

const groupedOptions: SelectOptionGroup[] = [
  {
    label: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Orange', value: 'orange' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Spinach', value: 'spinach' },
    ],
  },
]

export const Default: Story = {
  args: {
    id: 'default-select',
    label: 'Select an option',
    options: simpleOptions,
  },
}

export const FloatingLabel: Story = {
  args: {
    id: 'floating-select',
    label: 'Country',
    options: countryOptions,
    isFloatingLabel: true,
  },
}

export const WithNullable: Story = {
  args: {
    id: 'nullable-select',
    label: 'Select Country',
    options: countryOptions,
    nullable: true,
    nullableLabel: '-- Select a country --',
  },
}

export const WithError: Story = {
  args: {
    id: 'error-select',
    label: 'Country',
    options: countryOptions,
    error: 'Please select a country',
  },
}

export const WithHelperText: Story = {
  args: {
    id: 'helper-select',
    label: 'Country',
    options: countryOptions,
    helperText: 'Choose your country of residence',
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled-select',
    label: 'Country',
    options: countryOptions,
    value: 'fr',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    id: 'required-select',
    label: 'Country',
    options: countryOptions,
    required: true,
  },
}

export const WithOptionGroups: Story = {
  args: {
    id: 'grouped-select',
    label: 'Select Food',
    options: groupedOptions,
  },
}

export const Interactive: Story = {
  args: {
    id: 'interactive-select',
    label: 'Country',
    options: countryOptions,
  },
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div>
        <SelectElement
          id="interactive-select"
          label="Country"
          options={countryOptions}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          nullable
          nullableLabel="-- Select --"
          helperText="Your selection will appear below"
        />
        {value && (
          <div className="mt-3">
            <strong>Selected:</strong> {value}
          </div>
        )}
      </div>
    )
  },
}

export const CompleteExample: Story = {
  args: {
    id: 'complete-select',
    label: 'Favorite Food',
    options: groupedOptions,
  },
  render: () => {
    const [value, setValue] = useState('')
    const [error, setError] = useState<string | undefined>()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      if (newValue) {
        setError(undefined)
      } else {
        setError('Please select a food item')
      }
    }

    return (
      <SelectElement
        id="complete-select"
        label="Favorite Food"
        isFloatingLabel
        options={groupedOptions}
        value={value}
        onChange={handleChange}
        nullable
        nullableLabel="-- Choose one --"
        error={error}
        helperText="Select your favorite food"
        required
      />
    )
  },
}
