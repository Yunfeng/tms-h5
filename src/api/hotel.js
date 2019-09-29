import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchHotelOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/orders'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}





export function showHotelOrderStatus (status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}

export function searchHotelOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function createHotelOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/order'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 取消订单
export function cancelHotelOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 处理订单
export function processHotelOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/status/processing'
  callService(url, {
    cbDone: cbDone
  })
}

// 订单完成
export function finishHotelOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/status/finished'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchHotelOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })  
}

//更改供应商
export function updateHotelOrderSupplier(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

//更改支出方式
export function updateHotelOrderPayment(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/paymentMethod'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//更改备注
export function updateHotelOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//更改价格
export function updateHotelOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



// 以下2个为直接创建酒店账单，6个月后删除（2018-10-29）
export function searchHotelBills(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/searchHotelBookings.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createHotelBill(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/createHotelBooking.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}