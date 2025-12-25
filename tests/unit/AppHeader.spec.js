import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'

const localVue = createLocalVue()

describe('AppHeader.vue', () => {
  let router
  let route

  beforeEach(() => {
    router = {
      push: vi.fn()
    }
    // minimal route mock
    route = { path: '/' }
  })

  it('toggles navigation menu when burger is clicked', async () => {
    const wrapper = shallowMount(AppHeader, {
      localVue,
      mocks: { $route: route },
      stubs: { RouterLink: RouterLinkStub, 'b-modal': true }
    })

    expect(wrapper.vm.navToggled).toBe(false)
    expect(wrapper.find('.navbar-menu').classes()).not.toContain('is-active')

    const burger = wrapper.find('.navbar-burger')
    await burger.trigger('click')

    expect(wrapper.vm.navToggled).toBe(true)
    expect(wrapper.find('.navbar-menu').classes()).toContain('is-active')
  })

  it('performs search when enter is pressed', async () => {
    const wrapper = shallowMount(AppHeader, {
      localVue,
      mocks: {
        $router: router,
        $route: route
      },
      stubs: { RouterLink: RouterLinkStub, 'b-modal': true }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('searchterm')

    await input.trigger('keyup.enter')

    expect(router.push).toHaveBeenCalledWith({
      name: 'tokens',
      query: { form: 'searchterm' }
    })
  })

  it('performs search when button is clicked', async () => {
    const wrapper = shallowMount(AppHeader, {
      localVue,
      mocks: {
        $router: router,
        $route: route
      },
      stubs: { RouterLink: RouterLinkStub }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('searchterm_btn')

    const button = wrapper.find('button.button')
    await button.trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'tokens',
      query: { form: 'searchterm_btn' }
    })
  })

  describe('Keyboard shortcuts', () => {
    it('opens modal on ? key', async () => {
      const wrapper = shallowMount(AppHeader, {
        localVue,
        stubs: { RouterLink: RouterLinkStub }
      })
      expect(wrapper.vm.showModal).toBe(false)

      const event = new KeyboardEvent('keydown', { key: '?' })
      document.dispatchEvent(event)

      expect(wrapper.vm.showModal).toBe(true)
    })

    it('opens modal on h key', async () => {
      const wrapper = shallowMount(AppHeader, {
        localVue,
        stubs: { RouterLink: RouterLinkStub }
      })
      expect(wrapper.vm.showModal).toBe(false)

      const event = new KeyboardEvent('keydown', { key: 'h' })
      document.dispatchEvent(event)

      expect(wrapper.vm.showModal).toBe(true)
    })

    it('closes modal on Escape key', async () => {
      const wrapper = shallowMount(AppHeader, {
        localVue,
        stubs: { RouterLink: RouterLinkStub }
      })
      wrapper.setData({ showModal: true })

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(wrapper.vm.showModal).toBe(false)
    })

    it('focuses search input on / key', async () => {
      // We need attachTo: document.body so focus works?
      // Or just check if focus was called on the ref.
      const wrapper = shallowMount(AppHeader, {
        localVue,
        stubs: { RouterLink: RouterLinkStub }
      })

      // Mock the input element's focus method
      const input = wrapper.find('input').element
      input.focus = vi.fn()

      const event = new KeyboardEvent('keydown', { key: '/' })
      document.dispatchEvent(event)

      expect(input.focus).toHaveBeenCalled()
    })
  })
})
