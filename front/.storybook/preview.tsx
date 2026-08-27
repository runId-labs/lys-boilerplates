import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { lysMessages } from '../src/services/i18n/messages'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../src/styles/main.scss'

// Force light mode by default in Storybook
if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('data-theme', 'light');
}

const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'fr', title: 'Français' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = (context.globals.locale as string) ?? 'en'
      return (
        <IntlProvider locale={locale} messages={lysMessages[locale] ?? {}}>
          <Story />
        </IntlProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          // TODO: Update to match your design tokens
          value: '#F6E1BD',
        },
        {
          name: 'dark',
          value: '#2C2C2C',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
      ],
    },
  },
};

export default preview;
