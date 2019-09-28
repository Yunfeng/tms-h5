import axios from 'axios'

export const actions = {
  fetchItem ({ commit }, id) {
    // return the Promise via `store.dispatch()`   so that we know
    // when the data has been fetched
    // console.log(fetchItem)
    return fetchItem(id).then(item => {
      commit('setItem', { id, item })
    })
  },
  getAirports ({ commit }, sc) {
    // console.log(1 + '1 ')
    // console.log('getAirports')
    // console.log(sc)
    axios.get('/api/data/airports', {
      params: sc
    }).then(v => {
      commit('setAirports', v.data)
    }).catch(function(error) {
      console.log('error')
      console.log(error)
    })
  },
  showAlertMsg(context, payload) {
    if (payload.errMsgType === undefined) {
      context.state.errMsgType = 'warning'
    } else {
      context.state.errMsgType = payload.errMsgType
    }

    context.state.errMsg = payload.errMsg
    context.state.errAlert = true

    var timeout = payload.timeout
    if (timeout === undefined || timeout === null) {
      if (payload.errMsgType === 'danger') {
        timeout = 5000
      } else {
        timeout = 2500  
      }      
    }

    setTimeout(() => { context.state.errAlert = false }, timeout)
  }
}
