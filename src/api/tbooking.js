import { APP_FLIGHT_PATH, callService } from '../common/common.js'


export function searchTbookingOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbookings'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchTbookingTickets(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/tickets'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchTbookingOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/' + id
  callService(url, {
    cbDone: cbDone
  })
}

// 认领出票单
export function assignTbookingOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/' + id + '/assign'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

//取消认领
export function cancelAssignTbookingOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/' + id + '/cancel-assign'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 出票单自动出票
export function printTbookingOrderTicket(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/' + id + '/auto-print-ticket'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

export function updateTicketPurchasePrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/ticket/' + id + '/purchasePrice'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateTicketOperator(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/ticket/' + id + '/operator'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateTicketTicketingAgency(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/ticket/' + id + '/ticketAgency'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function refreshBottomPrice(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/tbooking/refreshBottomPrice'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function searchSpecialPolicies(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/searchSpecialPolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function startMonitorPolicy(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/startMonitorPolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function stopMonitorPolicy(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/stopMonitorPolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function syncPolicy(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/syncCtripPolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function localDeletePolicy(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/localDeleteCtripPolicy'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function deleteAllLocalPolicy(cbDone) {
  const url = APP_FLIGHT_PATH + '/deleteAllLocalCtripPolicy'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchPolicyBottomPrices(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/policy/bottom-prices'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createPolicyBottomPrice(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/policy/bottom-price/create'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function deletePolicyBottomPrice(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/policy/bottom-price/delete'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

//查找政策修改价格规则
export function searchPolicyPriceRules(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/policy/ctrip/rules'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createPolicyPriceRule(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/policy/ctrip/rule'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 查找国际单程运价
export function searchIntlOwFares(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/ow'
  callService(url, {
    type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 查找国际往返运价
export function searchIntlRtFares(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/rt'
  callService(url, {
    type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 同步国际运价到本地
export function syncIntlFares(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/ow/sync'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function localDeleteIntlFare(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function startMonitorIntlFare(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/monitor'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function updateIntlFareMonitorParams(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/' + id + '/params'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function updateApiParams(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tbooking/intl/fare/api'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}
