import type { Meta, StoryObj } from '@storybook/react'
import LoginFeature from './index'
import { IntlProvider } from 'react-intl'
import { loginFeatureConfig } from './translations'
import { generateI18nMessage } from 'lys-front/tools'

const messages = generateI18nMessage(["en", "fr"], loginFeatureConfig.translation)

const meta = {
  title: 'Features/LoginFeature',
  component: LoginFeature,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <IntlProvider locale="en" messages={messages.en}>
        <div style={{ width: '400px', maxWidth: '100%' }}>
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
} satisfies Meta<typeof LoginFeature>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (email: string, password: string) => {
      console.log('Login submitted:', { email, password })
      alert(`Login submitted:\nEmail: ${email}\nPassword: ${password}`)
    },
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    onSubmit: (email: string, password: string) => {
      console.log('Login submitted:', { email, password })
    },
    isLoading: true,
  },
}

export const CustomStyling: Story = {
  args: {
    onSubmit: (email: string, password: string) => {
      console.log('Login submitted:', { email, password })
    },
    className: 'border-primary border-2',
  },
}

export const French: Story = {
  args: {
    onSubmit: (email: string, password: string) => {
      console.log('Login submitted:', { email, password })
      alert(`Connexion soumise:\nEmail: ${email}\nMot de passe: ${password}`)
    },
    isLoading: false,
  },
  decorators: [
    (Story) => (
      <IntlProvider locale="fr" messages={messages.fr}>
        <div style={{ width: '400px', maxWidth: '100%' }}>
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
}
