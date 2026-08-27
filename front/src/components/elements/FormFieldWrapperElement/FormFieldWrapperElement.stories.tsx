import type { Meta, StoryObj } from '@storybook/react'
import FormFieldWrapperElement from './index'
import { Form } from 'react-bootstrap'

const meta = {
  title: 'Elements/FormFieldWrapperElement',
  component: FormFieldWrapperElement,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isFloatingLabel: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormFieldWrapperElement>

export default meta
type Story = StoryObj<typeof meta>

export const StandardLabel: Story = {
  args: {
    id: 'standard-field',
    label: 'Email Address',
    children: (
      <Form.Control
        type="email"
        placeholder="email@example.com"
      />
    ),
  },
}

export const FloatingLabel: Story = {
  args: {
    id: 'floating-field',
    label: 'Email Address',
    isFloatingLabel: true,
    children: (
      <Form.Control
        type="email"
        placeholder="email@example.com"
      />
    ),
  },
}

export const WithError: Story = {
  args: {
    id: 'error-field',
    label: 'Email Address',
    error: 'Please enter a valid email address',
    children: (
      <Form.Control
        type="email"
        placeholder="email@example.com"
      />
    ),
  },
}

export const WithHelperText: Story = {
  args: {
    id: 'helper-field',
    label: 'Username',
    helperText: 'Must be at least 3 characters',
    children: (
      <Form.Control
        type="text"
        placeholder="Enter username"
      />
    ),
  },
}

export const Required: Story = {
  args: {
    id: 'required-field',
    label: 'Required Field',
    required: true,
    children: (
      <Form.Control
        type="text"
        placeholder="This field is required"
      />
    ),
  },
}

export const FloatingWithError: Story = {
  args: {
    id: 'floating-error-field',
    label: 'Email Address',
    isFloatingLabel: true,
    error: 'Invalid email format',
    children: (
      <Form.Control
        type="email"
        placeholder="email@example.com"
      />
    ),
  },
}

export const FloatingWithHelperText: Story = {
  args: {
    id: 'floating-helper-field',
    label: 'Password',
    isFloatingLabel: true,
    helperText: 'Must be at least 8 characters',
    children: (
      <Form.Control
        type="password"
        placeholder="Enter password"
      />
    ),
  },
}

export const WithTextarea: Story = {
  args: {
    id: 'textarea-field',
    label: 'Description',
    helperText: 'Enter a brief description',
    children: (
      <Form.Control
        as="textarea"
        rows={4}
        placeholder="Enter description..."
      />
    ),
  },
}

export const FloatingTextarea: Story = {
  args: {
    id: 'floating-textarea-field',
    label: 'Comments',
    isFloatingLabel: true,
    children: (
      <Form.Control
        as="textarea"
        rows={4}
        placeholder="Enter comments..."
      />
    ),
  },
}

export const WithSelect: Story = {
  args: {
    id: 'select-field',
    label: 'Country',
    helperText: 'Select your country',
    children: (
      <Form.Select>
        <option value="">-- Select --</option>
        <option value="fr">France</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
      </Form.Select>
    ),
  },
}

export const CompleteExample: Story = {
  args: {
    id: 'complete-example',
    label: 'Complete Example',
    children: <Form.Control type="text" />,
  },
  render: () => (
    <div className="d-flex flex-column gap-3">
      <FormFieldWrapperElement
        id="example-1"
        label="Email"
        required
        helperText="We'll never share your email"
      >
        <Form.Control type="email" placeholder="email@example.com" />
      </FormFieldWrapperElement>

      <FormFieldWrapperElement
        id="example-2"
        label="Password"
        isFloatingLabel
        required
      >
        <Form.Control type="password" placeholder="Password" />
      </FormFieldWrapperElement>

      <FormFieldWrapperElement
        id="example-3"
        label="Country"
        error="Please select a country"
      >
        <Form.Select>
          <option value="">-- Select --</option>
          <option value="fr">France</option>
          <option value="us">United States</option>
        </Form.Select>
      </FormFieldWrapperElement>
    </div>
  ),
}
