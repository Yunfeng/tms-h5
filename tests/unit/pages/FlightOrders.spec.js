import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import FlightOrders from '@/pages/FlightOrders.vue'
import sinon from 'sinon'


describe('FlightOrders.vue', () => {
  it('mount flight orders', () => {
	const $route = {
		path: '/flt/orders'
	}
	const wrapper = shallowMount(FlightOrders, {
		mocks: {
			$route
		},
		stubs: ['router-link', 'router-view']
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
