import type { Meta, StoryObj } from '@storybook/react'
import LinkElement from './index'
import { BrowserRouter } from 'react-router-dom'

const meta = {
  title: 'Elements/LinkElement',
  component: LinkElement,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-4">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof LinkElement>

export default meta
type Story = StoryObj<typeof meta>

export const SimpleLink: Story = {
  args: {
    to: '/',
    children: 'Home',
  },
}

export const WithCustomChildren: Story = {
  args: {
    to: '/',
    children: (
      <span>
        <i className="bi bi-house-door me-2"></i>
        Go to Home
      </span>
    ),
  },
}

export const WithClassName: Story = {
  args: {
    to: '/about',
    className: 'btn btn-primary',
    children: 'About Us',
  },
}

export const AsButton: Story = {
  args: {
    to: '/',
    className: 'btn btn-success',
    children: (
      <>
        <i className="bi bi-house-door me-2"></i>
        Home
      </>
    ),
  },
}

export const AsNavLink: Story = {
  args: {
    to: '/about',
    className: 'nav-link',
    children: 'About',
  },
}

export const WithIcon: Story = {
  args: {
    to: '/',
    className: 'd-flex align-items-center gap-2',
    children: (
      <>
        <i className="bi bi-house-door"></i>
        <span>Home</span>
      </>
    ),
  },
}

export const MultipleLinks: Story = {
  args: {
    to: '/',
    children: 'Home',
  },
  render: () => (
    <nav className="d-flex flex-column gap-2">
      <LinkElement to="/" className="nav-link">
        <i className="bi bi-house-door me-2"></i>
        Home
      </LinkElement>
      <LinkElement to="/about" className="nav-link">
        <i className="bi bi-info-circle me-2"></i>
        About
      </LinkElement>
      <LinkElement to="/profile/456" className="nav-link">
        <i className="bi bi-person me-2"></i>
        My Profile
      </LinkElement>
    </nav>
  ),
}

export const AsButtonGroup: Story = {
  args: {
    to: '/',
    children: 'Home',
  },
  render: () => (
    <div className="btn-group" role="group">
      <LinkElement to="/" className="btn btn-outline-primary">
        Home
      </LinkElement>
      <LinkElement to="/about" className="btn btn-outline-primary">
        About
      </LinkElement>
      <LinkElement to="/profile/789" className="btn btn-outline-primary">
        Profile
      </LinkElement>
    </div>
  ),
}

export const InBreadcrumb: Story = {
  args: {
    to: '/',
    children: 'Home',
  },
  render: () => (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <LinkElement to="/">Home</LinkElement>
        </li>
        <li className="breadcrumb-item">
          <LinkElement to="/about">About</LinkElement>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Current Page
        </li>
      </ol>
    </nav>
  ),
}

export const WithOnClick: Story = {
  args: {
    to: '/',
    children: 'Link with Click Handler',
    onClick: (e) => {
      console.log('Link clicked:', e)
      alert('Link clicked! Check console for event details.')
    },
  },
}
