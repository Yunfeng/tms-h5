export const mutations = {
  setItem (state, { id, item }) {
    Vue.set(state.items, id, item)
    // console.log('setItem')
  },
  setAirports (state, v) {
    // Vue.set(state.airports, airports)
    // console.log(v)
    state.airports = v.dataList
    state.sc = v.page
  },
  setUsername (state, payload) {
    state.username = payload.username
    state.fullname = payload.fullname
    state.logined = payload.logined
  },
  showLoading(state, payload) {
    state.loading = payload.loading
    if (payload.loadingText === undefined) {
      state.loadingText = '数据加载中...'
    } else {
      state.loadingText = payload.loadingText  
    }
  },
  setOrderDetail(state, payload) {
    state.orderDetail = payload;
    state.orderId = payload.id;
  },
  setDcity(state, payload) {
    state.searchParams.dcity = payload.cityCode;
    state.searchParams.dcityName = payload.cityName;
  },
  setAcity(state, payload) {
    state.searchParams.acity = payload.cityCode;
    state.searchParams.acityName = payload.cityName;
  },
  setDdate(state, payload) {
    state.searchParams.ddate = payload;
  }, 
  switchCity(state) {
    var cityCode = state.searchParams.acity
    var cityName = state.searchParams.acityName

    state.searchParams.acity = state.searchParams.dcity
    state.searchParams.acityName = state.searchParams.dcityName

    state.searchParams.dcity = cityCode
    state.searchParams.dcityName = cityName
  },
  setOnlyCarrier(state, payload) {
    state.searchParams.onlyCarrier = payload
  },
  setSortBy(state, payload) {
    state.searchParams.sortBy = payload
  },
}
