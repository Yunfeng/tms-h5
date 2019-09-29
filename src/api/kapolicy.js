import { APP_FLIGHT_PATH, callService } from '../common/common.js'

// 查找买家的大客户政策订单
export function searchKaBuyerOrders(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/searchTmcBuyOrder.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })    
}

// 查找卖家订单
export function searchKaSellerOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + "/searchTmcSellOrder.do"
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })    
}

// 接受订单
export function acceptKaOrder(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/acceptTmcTicketSellOrder.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })  
}

// 拒单
export function denyKaOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + "/denyTmcTicketSellOrder.do"
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function twiceConfirmTmcOrderPaid(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/twiceConfirmTmcTicketOrderPaid.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 认领开票
export function toTicketTmcOrder(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/toTicketForTmcOrder.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateKaOrderTicket(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/kaOrder/' + id + '/ticket'
  callService(url, {
    data: params,
    contentType: 'application/json',
    cbDone: cbDone
  })
}

export function updateKaOrderTotalPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/kaOrder/' + id + '/totalPrice'
  callService(url, {
    data: params,
    // contentType: 'application/json',
    cbDone: cbDone
  })
}

export function updateKaOrderAmount(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/kaOrder/' + id + '/amount'
  callService(url, {
    data: params,
    // contentType: 'application/json',
    cbDone: cbDone
  })
}

// 保存政策
export function createKaPolicy(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/createTmcPolicy.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 删除政策
export function deleteKaPolicy(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/deleteTmcPolicy"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 查找政策
export function searchKaPolicies(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/searchTmcPolicy.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchKaPolicy(params, cbDone) {
  const url = APP_FLIGHT_PATH + "/getTmcFlightDetail.do"
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function getPortDesc(val) {
  if (val === '*') {
    return '全国'
  } else if (val.length > 7) {
    return val.substring(0, 7) + '...'
  } else {
    return val
  }
}

export function getStatusDesc(val) {
  if (val === 1) {
    return '启用中'
  } else {
    return '停用'
  }
}

export function getRouteTypeDesc(val) {
  if (val === 1) {
    return '往返'
  } else {
    return '单程'
  }
}

export function getIntlPolicyDesc(val) {
  if (val === 1) {
    return '国际'
  } else {
    return '国内'
  }
}

export function getPolicyTypeDesc(val) {
  if (val === 1) {
    return '特殊-票面低'
  } else if (val === 0) {
    return '普通-票面相符'
  } else {
    return ''
  }
}

export function getIdTypeLimitDesc(val) {
  // console.log(val)
  if (val === '0' || val === null) {
    return '任意'
  } else if (val === '1') {
    return '居民身份证'
  } else {
    return '其它'
  }
}
export function getPayTypeLimitDesc(val) {
  if (val === '0' || val === null) {
    return '无限制'
  } else if (val === '1') {
    return '账户余额'
  } else if (val === '2') {
    return '微信支付'
  } else {
    return ''
  }
}
