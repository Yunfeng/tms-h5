export const mutations = {
  readCookies(state) {
    const workMode = $.cookie('workMode')
    if (workMode !== undefined) {
      state.workMode = workMode
    }

    const username = $.cookie('username')
    if (username !== undefined) {
      state.username = username
      state.logined = true
    }

    const openid = $.cookie('openid')
    if (openid !== undefined) {
      state.wxInfo.openid = openid

      const nickname = $.cookie('nickname')
      if (nickname !== undefined) {
        state.wxInfo.nickname = nickname
      }

      const headimgurl = $.cookie('headimgurl')
      if (headimgurl !== undefined) {
        state.wxInfo.headimgurl = headimgurl
      }
    }

    const sid = $.cookie('sid')
    if (sid !== undefined && sid !== null && sid.length > 0) {
      state.sid = sid
    }
  },
  resetOrderInfo(state) {
    state.order.pnrNo = ''
    state.order.pnrDetail = ''
    state.order.policyId = 0
    state.order.flights.splice(0)
    state.order.psgs.splice(0)
  },
  jumpToLogin(state, router) {
    state.historyStep = -1;
    state.username = "",
      state.logined = false;

    // $.removeCookie('username', { path: '/' }); 
    // $.removeCookie('token', { path: '/' }); 
  },
  logout(state) {
    state.historyStep = -1;
    state.username = ""
    state.logined = false;
    state.privileges.splice(0)
    state.roles.splice(0)

    $.removeCookie('username', { path: '/' });
    $.removeCookie('token', { path: '/' });
  },
  setUsername(state, payload) {
    state.username = payload.username
    state.fullname = payload.fullname
    state.logined = payload.logined
    state.isRoot = payload.enterpriseId === payload.userId
    state.sid = payload.sid
    state.redmineUrl = payload.redmineUrl

    $.cookie('token', payload.token, { expires: 30, path: '/' })
    $.cookie('username', payload.username, { expires: 30, path: '/' })
    $.cookie('fullname', payload.fullname, { expires: 30, path: '/' })
    $.cookie('sid', payload.sid, { expires: 30, path: '/' })
  },
  setUserInfo(state, payload) {
    state.userInfo.freeBalance = payload.balance;
    state.userInfo.cashBalance = payload.cashBalanceYuan;
    state.userInfo.frozenBalance = payload.frozenBalanceYuan;
    state.userInfo.creditLimit = payload.creditLimitYuan;
  },
  setDcity(state, payload) {
    // console.log(payload)
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
  updatePsg(state, p) {
    // console.log(p)
    state.order.psgs[p.index].name = p.name;
    state.order.psgs[p.index].idType = p.idType;
    state.order.psgs[p.index].idNo = p.idNo;
  },
  deleteFlt(state, index) {
    state.order.flights.splice(index, 1);
  },
  setOrderInfo(state, payload) {
    state.order.pnrNo = payload.pnrNo;
    state.order.pnrDetail = payload.pnrDetail;
    state.order.policyId = payload.policyId;
  },
  setOrderId(state, id) {
    state.orderDetail = null;
    state.orderId = id;
  },
  setOrderDetail(state, payload) {
    state.orderDetail = payload;
    state.orderId = payload.id;
  },
  setPolicyDetail(state, payload) {
    state.policyDetail = payload;
  },
  setPnrDetail(state, payload) {
    state.pnrDetail = payload;
  },
  setRefundInfo(state, payload) {
    state.refundInfo.ticketNo = payload.ticketNo
    state.refundInfo.psgName = payload.psgName
    state.refundInfo.orderId = payload.orderId
  },
  setChangeInfo(state, payload) {
    state.changeInfo.ticketNo = payload.ticketNo
    state.changeInfo.psgName = payload.psgName
    state.changeInfo.orderId = payload.orderId
  },
  setRefundOrderInfo(state, payload) {
    state.refundOrderInfo = payload
  },
  setChangeOrderInfo(state, payload) {
    state.changeOrderInfo = payload
  },
  selectPolicy(state, p) {
    state.orderDetail.policyId = p.policyId
    state.orderDetail.policyReturnPoint = p.returnPoint
    state.orderDetail.returnMoney = p.returnMoney

    const price = state.orderDetail.flights[0].price
    const psgCount = state.orderDetail.psgCount

    state.orderDetail.ticketAmount = Math.round((price * (100 - p.returnPoint) / 100 - p.returnMoney + 50) * psgCount)
  },
  hideBottomTabBar(state) {
    state.bottomTabBarShowed = false
  },
  showBottomTabBar(state) {
    state.bottomTabBarShowed = true
  },
  addPrivilege(state, payload) {
    // console.log(payload)
    state.privileges.push({
      type: payload.resType,
      content: payload.resContent
    })

    if (state.roles.indexOf(payload.role) === -1) {
      state.roles.push(payload.role)
    }
  },
  setPrintMode(state, p) {
    state.printMode = p
  },
  setWorkMode(state, p) {
    state.workMode = p
    $.cookie('workMode', p, { expires: 30, path: '/' })
  },
  showLoading(state, payload) {
    // console.log(typeof payload)

    if (payload === undefined) {
      state.loading = true
    } else if (typeof payload === 'string') {
      state.loading = true
      state.loadingText = payload
    } else {
      state.loading = payload.loading
      if (payload.loadingText === undefined) {
        state.loadingText = '数据加载中...'
      } else {
        state.loadingText = payload.loadingText
      }
    }
  },
  hideLoading(state) {
    state.loading = false
    state.loadingText = '数据加载中...'
  },
  setCustomers(state, p) {
    state.customers = p
  }
}
