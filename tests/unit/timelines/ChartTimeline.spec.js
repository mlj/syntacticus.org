import { shallowMount } from '@vue/test-utils'
import ChartTimeline from '@/components/timelines/ChartTimeline.vue'

describe('ChartTimeline.vue', () => {
  const events = [
    { id: '1', n: 10, year: 2000 },
    { id: '2', n: 5, year: 1990 },
    { id: '3', n: 15, year: 2010 },
    { id: '4', n: 0, year: null } // Should be filtered out
  ]

  it('prepares data correctly', () => {
    const wrapper = shallowMount(ChartTimeline, {
      propsData: { events }
    })

    // sorted by year
    expect(wrapper.vm.data.length).toBe(3)
    expect(wrapper.vm.data[0].year).toBe(1990)
    expect(wrapper.vm.data[1].year).toBe(2000)
    expect(wrapper.vm.data[2].year).toBe(2010)
  })

  it('draws bars on mount', async () => {
    const wrapper = shallowMount(ChartTimeline, {
      propsData: { events }
    })

    // Wait for nextTick inside mounted
    await wrapper.vm.$nextTick()
    // D3 transitions/draws might be synchronous here but wrapped in nextTick

    const bars = wrapper.findAll('rect.bar')
    expect(bars.length).toBe(3)
  })

  it('handles negative years (BC)', () => {
    const eventsBC = [{ id: '1', n: 1, year: -500 }]
    const wrapper = shallowMount(ChartTimeline, {
      propsData: { events: eventsBC }
    })

    expect(wrapper.vm.data[0].year).toBe('500 BC')
  })
})
