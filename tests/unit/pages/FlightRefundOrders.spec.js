import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Component from '@/pages/FlightRefundOrders.vue'
import sinon from 'sinon'


describe('FlightRefundOrders.vue', () => {
	const localVue = createLocalVue()
	localVue.use(Vuex)

	const mutations = {
		showLoading: jest.fn()
	}

	const store = new Vuex.Store({
		mutations
	})

	it('mount flight refund orders', () => {
		const $route = {
			path: '/flt/refund/orders'
		}
		const wrapper = shallowMount(Component, {
			mocks: {
				$route
			},
			stubs: ['router-link', 'router-view'],
			store,
			localVue
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
	})
	
	test('matches snapshot', () => {
		
    const wrapper = shallowMount(Component, {
			stubs: ['router-link', 'router-view'],
			localVue,
			store
    })

		expect(wrapper.html()).toMatchSnapshot()
  })
})
