import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Component from '@/pages/Users.vue'

import $ from 'jquery'


const localVue = createLocalVue()
localVue.use(Vuex)


describe('Users.vue', () => {
  let wrapper
  const routePath = '/admin/users'

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
    // const wrapper = shallowMount(Users)
    // expect(vm.$el).toMatchSnapshot()
    // expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('mount users', () => {
  	// const $route = {
  	// 	path: '/admin/users'
   //  }
    
   //  const wrapper = shallowMount(Users, {
   //  	mocks: {
   //  		$route
   //  	}
   //  })

    expect(wrapper.vm.$route.path).toBe(routePath)
    expect(wrapper.isVueInstance()).toBeTruthy()
  });


  it('has the expected html structure', () => {
    // const wrapper = shallowMount(Users)

    expect(wrapper.find('#users').exists()).toBeTruthy()
    expect(wrapper.find('table tbody tr').length).toBeUndefined()
  })

  it('show modal', () => {
    // const wrapper = shallowMount(Users)

    // console.log(wrapper.html())

    // console.log(wrapper.find('#btnNewUser').html())
    // const buttonWrapper = wrapper.find('#btnNewUser')
    // buttonWrapper.trigger('click')

    // console.log(wrapper.html())

    // expect(wrapper.find('.btn')).toBeUndefined()
  })

})
