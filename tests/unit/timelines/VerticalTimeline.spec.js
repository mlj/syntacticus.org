import { shallowMount } from '@vue/test-utils'
import VerticalTimeline from '@/components/timelines/VerticalTimeline.vue'

describe('VerticalTimeline.vue', () => {
  const events = [
    { label: 'Event 1', date: new Date(2000, 0, 1) },
    { label: 'Event 2', date: new Date(2001, 0, 1) }
  ]

  // Mock getBBox since JSDOM doesn't support it
  beforeAll(() => {
    window.SVGElement.prototype.getBBox = () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 20
    })
  })

  afterAll(() => {
    delete window.SVGElement.prototype.getBBox
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(VerticalTimeline, {
      propsData: { events }
    })
    expect(wrapper.exists()).toBe(true)
    // Check if svg exists
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
