import { shallowMount } from '@vue/test-utils'
import Component from '@/pages/FlightChangeOrderDetail.vue'
import sinon from 'sinon'

describe('FlightChangeOrderDetail.vue', () => {
	const $route = {
		path: '/flt/change/order/123',
		params: {
			id: 123
		}
	}

	test('matches snapshot', () => {
    const wrapper = shallowMount(Component, {
    	mocks: {
    		$route
			},
			stubs: ['router-link']
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('mount flight change order detail', () => {

    const wrapper = shallowMount(Component, {
    	mocks: {
    		$route
			},
			stubs: ['router-link']
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
