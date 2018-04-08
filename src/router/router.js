import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import About from '../components/About.vue';
import Item from '../components/Item.vue';
// const Home = () => import('../components/Home.vue');
// const About = () => import('../components/About.vue');

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: Home },
      // { path: '/about', component: About },
      { path: '/about', component: About },
      { path: '/item/:id', component: Item },
      { path: '/login', component: () => System.import('../components/Login.vue')},
      { path: '/airports', component: () => System.import('../components/Airports.vue')}
    ]
  });
}