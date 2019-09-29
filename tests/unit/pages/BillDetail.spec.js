import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import BillDetail from '@/pages/BillDetail.vue'
import sinon from 'sinon'


describe('BillDetail.vue', () => {
  it('mount bill detail', () => {
		const $route = {
  		path: '/bill/detail/123?print=0',
  		params: {
				id: 123,
				print: 0
			},
			query: {
				print: 0
			}
  	}

		const wrapper = shallowMount(BillDetail, {
    	mocks: {
    		$route
			},
			stubs: ['router-link', 'router-view']
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
