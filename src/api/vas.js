import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchVasOrders(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/vas/orders'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchInsuranceOrders(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/insurance/orders'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function showVasOrderStatus (status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}





export function createVasOrder(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/new'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function searchVasOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function searchVasOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

// 取消订单
export function cancelVasOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 开始处理订单
export function processVasOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/status/processing'
  callService(url, {
    cbDone: cbDone
  })
}

// 订单处理完毕
export function finishVasOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/status/finished'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改订单备注
export function updateVasOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改订单供应商
export function updateVasOrderSupplier(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改订单的客人信息
export function updateVasOrderPassenger(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/passenger'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改订单为已付款
export function updateVasOrderPaid(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/paid'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateVasOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateVasOrderPayment(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/vas/' + id + '/payment'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function outputVasOrder2Bill(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/convertVasOrder2Bill'
  callService(url, {
    data: { id: id },
    cbDone: cbDone
  })
} 
