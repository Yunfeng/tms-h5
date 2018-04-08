import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Assume we have a universal API that returns Promises
// and ignore the implementation details
import { fetchItem } from '../api'
import axios from 'axios'

export function createStore () {
  return new Vuex.Store({
    state: {
      items: {},
      airports: []
    },
    actions: {
      fetchItem ({ commit }, id) {
        // return the Promise via `store.dispatch()`   so that we know
        // when the data has been fetched
        console.log(fetchItem)
        return fetchItem(id).then(item => {
          commit('setItem', { id, item })
        })
      },
      getAirports ({ commit }, id) {
        // console.log(1 + '1 ')
        console.log('getAirports')
        axios.get('/api/data/airports').then(v => {
          commit('setAirports', v.data.dataList)
        }).catch(function(error) {
          console.log('error')
          console.log(error)
        })
      },
    },
    mutations: {
      setItem (state, { id, item }) {
        Vue.set(state.items, id, item)
        console.log('setItem')
      },
      setAirports (state, airports) {
        // Vue.set(state.airports, airports)
        state.airports = airports
        console.log('setAirports: ' + airports.length)

      }
    }
  })
}