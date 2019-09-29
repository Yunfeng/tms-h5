import Component from '@/pages/Customers.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

import $ from 'jquery'


const localVue = createLocalVue()
localVue.use(Vuex)


describe('Customers.vue', () => {

  let wrapper
  const routePath = '/customers'

  let actions
  let store

  beforeEach(() => {

    actions = {
      showLoading: jest.fn()
    }

    store = new Vuex.Store({
      actions
    })
    
    const $route = {
  		path: routePath
    }

    wrapper = shallowMount(Component, {
      store,
      localVue,
    	mocks: {
    		$route
      },
      stubs: ['router-link', 'router-view']
    })
  });

  // test方法是it的别名之一
  test('matches snapshot', () => {
    // wrapper = shallowMount(Component, {
    //   stubs: ['router-link', 'router-view']
    // })
  //   // expect(vm.$el).toMatchSnapshot()
  //   // expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('mount users', () => {
    expect(wrapper.vm.$route.path).toBe(routePath)
    expect(wrapper.isVueInstance()).toBeTruthy()
  });


  it('has the expected html structure', () => {
    // const wrapper = shallowMount(Component)

    expect(wrapper.find('#customers').exists()).toBeTruthy()
    expect(wrapper.find('table tbody tr').length).toBeUndefined()
  })

})
