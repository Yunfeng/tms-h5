import { shallowMount } from '@vue/test-utils'
import VasOrderDetail from '@/pages/VasOrderDetail.vue'
import sinon from 'sinon'

describe('VasOrderDetail.vue', () => {
  it('mount vas order detail', () => {
  	const $route = {
  		path: '/vas/order/123?id=123',
  		params: {
  			id: 123
  		}
  	}

    // const spy = sinon.spy(VasOrderDetail, 'search')


    const wrapper = shallowMount(VasOrderDetail, {
    	mocks: {
    		$route
    	}
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
