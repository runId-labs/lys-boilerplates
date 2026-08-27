import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import OffCanvasElement from './index'
import { OffCanvasElementRefInterface } from './types'
import ButtonElement from '../ButtonElement'

const meta = {
  title: 'Elements/OffCanvasElement',
  component: OffCanvasElement,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['start', 'end', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof OffCanvasElement>

export default meta
type Story = StoryObj<typeof meta>

export const PlacementEnd: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open OffCanvas (End)
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-end"
          title="OffCanvas Title"
          placement="end"
          body={
            <div>
              <p>This is the offcanvas content on the right side.</p>
              <p>You can put any content here.</p>
              <ButtonElement onClick={() => ref.current?.hide()}>
                Close
              </ButtonElement>
            </div>
          }
        />
      </div>
    )
  },
}

export const PlacementStart: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open OffCanvas (Start)
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-start"
          title="Left Side Menu"
          placement="start"
          body={
            <div>
              <p>This is the offcanvas content on the left side.</p>
              <ul>
                <li>Menu Item 1</li>
                <li>Menu Item 2</li>
                <li>Menu Item 3</li>
              </ul>
            </div>
          }
        />
      </div>
    )
  },
}

export const PlacementTop: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open OffCanvas (Top)
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-top"
          title="Top Notification"
          placement="top"
          body={
            <div>
              <p>This is the offcanvas content at the top.</p>
              <p>Good for notifications or alerts.</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const PlacementBottom: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open OffCanvas (Bottom)
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-bottom"
          title="Bottom Sheet"
          placement="bottom"
          body={
            <div>
              <p>This is the offcanvas content at the bottom.</p>
              <p>Similar to a mobile bottom sheet.</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const SizeSmall: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open Small OffCanvas
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-sm"
          title="Small OffCanvas"
          placement="end"
          size="sm"
          body={
            <div>
              <p>This is a small offcanvas (300px wide).</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const SizeMedium: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open Medium OffCanvas
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-md"
          title="Medium OffCanvas"
          placement="end"
          size="md"
          body={
            <div>
              <p>This is a medium offcanvas (400px wide).</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const SizeLarge: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open Large OffCanvas
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-lg"
          title="Large OffCanvas"
          placement="end"
          size="lg"
          body={
            <div>
              <p>This is a large offcanvas (600px wide).</p>
              <p>Good for forms or detailed content.</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const SizeExtraLarge: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open XL OffCanvas
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-xl"
          title="Extra Large OffCanvas"
          placement="end"
          size="xl"
          body={
            <div>
              <p>This is an extra large offcanvas (800px wide).</p>
              <p>Good for detailed views or complex forms.</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const WithForm: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open Form OffCanvas
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-form"
          title="Edit Profile"
          placement="end"
          size="lg"
          body={
            <div>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea className="form-control" id="bio" rows={4}></textarea>
                </div>
                <div className="d-flex gap-2">
                  <ButtonElement variant="primary" type="submit">
                    Save Changes
                  </ButtonElement>
                  <ButtonElement variant="secondary" onClick={() => ref.current?.hide()}>
                    Cancel
                  </ButtonElement>
                </div>
              </form>
            </div>
          }
        />
      </div>
    )
  },
}

export const WithBackdrop: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open with Backdrop
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-backdrop"
          title="OffCanvas with Backdrop"
          placement="end"
          backdrop={true}
          body={
            <div>
              <p>This offcanvas has a backdrop.</p>
              <p>Click outside to close.</p>
            </div>
          }
        />
      </div>
    )
  },
}

export const WithoutBackdrop: Story = {
  render: () => {
    const ref = useRef<OffCanvasElementRefInterface>(null)

    return (
      <div>
        <ButtonElement onClick={() => ref.current?.show()}>
          Open without Backdrop
        </ButtonElement>
        <OffCanvasElement
          ref={ref}
          id="offcanvas-no-backdrop"
          title="OffCanvas without Backdrop"
          placement="end"
          backdrop={false}
          body={
            <div>
              <p>This offcanvas has no backdrop.</p>
              <p>You can still interact with the page behind it.</p>
              <ButtonElement onClick={() => ref.current?.hide()}>
                Close
              </ButtonElement>
            </div>
          }
        />
      </div>
    )
  },
}
