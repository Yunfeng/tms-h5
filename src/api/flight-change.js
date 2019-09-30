import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchChangeOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/change/orders'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchChangeOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/change/order/' + id
  callService(url, {
    cbDone: cbDone
  })
}






export function createChangeOrder(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/create'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function createChangeOrderMulti(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/createV2'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function processPnrFlightContent(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/processPnrFlight'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}




export function searchChangeOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

export function processChangeOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/status/processed'
  callService(url, {
    cbDone: cbDone
  })
}

export function finishChangeOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/status/finished'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function cancelChangeOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function reopenChangeOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/status/reopened'
  callService(url, {
    cbDone: cbDone
  })
}

export function showChangeOrderStatus(status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '处理完毕'
    case 4: return '已取消'
    default:
      return status
  }
}

export function outputFlightChangeOrder2Bill(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/convertFlightChangeOrder2Bill'
  callService(url, {
    data: { id: id },
    cbDone: cbDone
  })
} 

// 修改订单供应商
export function updateChangeOrderSupplier(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改支付方式
export function updateChangeOrderPayment(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/payment'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateChangeOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateChangeOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

/*
* 修改航班信息
*/
export function updateChangeOrderFlightInfo(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/flight'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

/*
 * 修改改签票号
 */
export function updateChangeOrderTicketNo(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/change/' + id + '/ticket'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}
