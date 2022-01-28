import { RouterLinkStub } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Lemma from '@/components/Lemma'

// TODO: move these filters out into a module. Their global defs
// are in main.js.
import Vue from 'vue'
import { languages } from '@/shared'
import schema from '@/data/schema.json'
Vue.filter('language', v => (languages[v] || 'Unknown language'))
Vue.filter('partOfSpeech', v => schema.part_of_speech[v] || '')

// TODO: There is another way than this, isn't there?
import Buefy from 'buefy';
Vue.use(Buefy)

describe('Lemma.vue', () => {
  it('renders the tabs', () => {
    const wrapper = shallowMount(Lemma, {
      propsData: { gid: 'syntacticus:20180920:lat:dico:V-' },
      stubs: { RouterLink: RouterLinkStub }
    })
    expect(wrapper.text()).toMatch('dico (verb, Latin)')
  })
})
