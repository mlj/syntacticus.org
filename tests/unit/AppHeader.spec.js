import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'

const localVue = createLocalVue()
// Mock v-shortkey directive
localVue.directive('shortkey', {})

describe('AppHeader.vue', () => {
  let router
  let route

  beforeEach(() => {
    router = {
      push: jest.fn()
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
      stubs: { RouterLink: RouterLinkStub, 'b-modal': true }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('searchterm_btn')

    const button = wrapper.find('button.button') // assumes only one button with class button inside field
    await button.trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'tokens',
      query: { form: 'searchterm_btn' }
    })
  })
})
