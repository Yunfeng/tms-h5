import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('../pages/Home.vue')},
      { path: '/about', component: () => import('../pages/About.vue')},
      { path: '/item/:id', component: () => import('../pages/Item.vue')},
      { path: '/login', component: () => import('../pages/Login.vue')},
      { path: '/airports', component: () => import('../pages/Airports.vue')},

      { path: '/orders', component: () => import('../pages/Orders.vue')},
      { path: '/order/:id', component: () => import('../pages/Order-detail.vue')},

      { path: '/search', component: () => import('../pages/FlightSearchForm.vue')},
      { path: '/searchResult', component: () => import('../pages/FlightSearchResult.vue')}

    ]
  });
}