import { shallowMount } from '@vue/test-utils'
import Component from '@/components/flight-order-change-list.vue'

describe('flight-order-refund-list.vue', () => {
  // test方法是it的别名之一
  test('matches snapshot', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // it('slot content test', () => {
  //   const defaultSlotContent = 'content for default slot'
  //   const wrapper = shallowMount(Component, {
  //     slots: {
  //       default: defaultSlotContent,
  //       excelFormatDesc: 'excel format desc from excelFormatDesc slot'
  //     }
  //   })

  //   // console.log(wrapper.html())
  //   expect(wrapper.find('#myModalLabel').text()).toEqual(defaultSlotContent);
  // })

})
