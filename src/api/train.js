import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function showTrainOrderStatus (status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}

export function searchTrainOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 查找火车票订单
export function searchTrainOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/orders'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createTrainOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/order'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


// 取消订单
export function cancelTrainOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 处理订单
export function processTrainOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/status/processing'
  callService(url, {
    cbDone: cbDone
  })
}

// 订单完成
export function finishTrainOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/status/finished'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchTrainOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })  
}

//更改供应商
export function updateTrainOrderSupplier(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

//更改支出方式
export function updateTrainOrderPayment(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/paymentMethod'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//更改备注
export function updateTrainOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//修改外部订单号
export function updateTrainOrderExternalOrderNo(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/externalOrderNo'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//更改价格
export function updateTrainOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改乘车人信息
export function updateTrainOrderPassenger(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/order/' + id + '/passenger'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


// 上传火车票订单
export function uploadTrainOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/train/orders/upload'
  callService(url, {
    data: params,
    contentType: false,
    cache: false,
    processData: false,
    timeout: 0,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 以下2个为直接创建火车票账单，6个月后删除（2018-10-29）
export function searchTrainTickets(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchTrainTickets.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}
