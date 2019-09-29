import { shallowMount } from '@vue/test-utils'
import Component from '@/components/my-modal-sms.vue'

describe('my-modal-sms.vue', () => {
  // test方法是it的别名之一
  test('matches snapshot', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('slot content test', () => {
    const titleSlotContent = 'sms format'
    const wrapper = shallowMount(Component, {
      slots: {
        title: titleSlotContent
      }
    })

    // console.log(wrapper.html())
    expect(wrapper.find('.modal-title').text()).toEqual(titleSlotContent);
  })

})
