import { APP_FLIGHT_PATH, callService } from '../common/common.js'


export function searchRefundOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/refund/orders'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}





export function createRefundOrder(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/create'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function createRefundOrderMulti(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/createV2'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

// old method
export function createFlightRefund(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/createFlightRefundTicket.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}




export function searchRefundOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function searchRefundOrderDetailByOrderNo(refundOrderNo, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/refundOrderNo/' + refundOrderNo
  callService(url, {
    cbDone: cbDone
  })
}

export function searchRefundOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

export function processRefund(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/processed'
  callService(url, {
    cbDone: cbDone
  })
}

export function cancelRefund(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/canceled'
  callService(url, {
    cbDone: cbDone
  })
}

export function reopenRefund(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/reopened'
  callService(url, {
    cbDone: cbDone
  })
}

export function submitRefund(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/submitted'
  callService(url, {
    cbDone: cbDone
  })
}

export function setAirRefundAmount(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/airlineRefundAmount'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateRefundOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function setRefundAirlineRefunded(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/airlineRefunded'
  callService(url, {
    cbDone: cbDone
  })
}

// 航司最终实退的状态和金额
export function setAirFinalyRefunded(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/finallyAirRefunded'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function setPsgRefundAmount(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/passengerRefundedAmount'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function setRefundPassengerRefunded(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/status/passengerRefunded'
  callService(url, {
    cbDone: cbDone
  })
}

export function updateRefundOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function showRefundOrderStatus(status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '已提交'
    case 4: return '已取消'
    case 8: return '航司已退'
    case 16: return '已退客户'
    case 32: return '已完成'
    default:
      return status
  }
}

export function showReasonCodeDesc(status) {
  switch (status) {
    case 0: return '自愿'
    case 1: return '非自愿'
    case 4: return '废'
    default:
      return status
  }
}


export function searchBillRefundTickets(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/flight/refund/tickets'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function outputFlightRefundOrder2Bill(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/convertFlightRefundOrder2Bill'
  callService(url, {
    data: { id: id },
    cbDone: cbDone
  })
} 

/*
 * 修改改签票号
 */
export function updateRefundOrderTicketNo(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/refund/' + id + '/ticket'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}