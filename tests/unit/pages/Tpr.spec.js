import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Tpr from '@/pages/Tpr.vue'

import $ from 'jquery'

describe('Tpr.vue', () => {
  const localVue = createLocalVue()
	localVue.use(Vuex)

	const mutations = {
		showLoading: jest.fn()
	}

	const store = new Vuex.Store({
		mutations
	})

  const $route = {
    path: '/tprs'
  }

  // test方法是it的别名之一
  test('matches snapshot', () => {
    const wrapper = shallowMount(Tpr, {
    	mocks: {
    		$route
      },
      store,
			localVue
    })
    // expect(vm.$el).toMatchSnapshot()
    // expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('mount Tpr', () => {
    
    const wrapper = shallowMount(Tpr, {
    	mocks: {
    		$route
      },
      store,
			localVue
    })

    expect(wrapper.vm.$route.path).toBe($route.path)
    expect(wrapper.isVueInstance()).toBeTruthy()
  });


  it('has the expected html structure', () => {
    const wrapper = shallowMount(Tpr, {
    	mocks: {
    		$route
      },
      store,
			localVue
    })

    expect(wrapper.find('#tpr-list').exists()).toBeTruthy()
    expect(wrapper.find('table tbody tr').length).toBeUndefined()
  })

})
