import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function showHotelOrderStatus (status) {
  switch (status) {
    case 0: return '待处理'
    case 1: return '处理中'
    case 2: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}

export function showMealTypeDesc (type) {
  switch (type) {
    case 0: return '含餐'
    case 1: return '早餐'
    case 2: return '中餐'
    case 3: return '晚餐'
    case 6: return '早+中'
    case 7: return '早+晚'
    case 8: return '全餐'
    case 9: return '中+晚'
    case 10: return '无餐'
    default : return '未知'
  }
}

// 检查酒店是否可定
export function checkHotelAvail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/checkAvail'
  callService(url, {
    cbDone: cbDone
  })
}

//同步代理通酒店订单详情
export function syncHotelOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/syncOrderDetail'
  callService(url, {
    cbDone: cbDone
  })
}

//取消供应商订单
export function cancelSupplierHotelOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/cancelOrder'
  callService(url, {
    cbDone: cbDone
  })
}

//创建供应商订单
export function createSupplierHotelOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id + '/createOrder'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchHotels_old(params, cbDone, cbAlways) {
  const url = '/hotel-proxy/searchHotel'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchHotels(params, cbDone, cbAlways) {
  const url = '/api/hotel/avail'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchRoomPrices_old(params, cbDone, cbAlways) {
  const url = '/hotel-proxy/searchRoomPrices'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchRoomPrices(params, cbDone, cbAlways) {
  const url = '/api/hotel/prices'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getAllCity(cbDone, cbAlways) {
  const url = '/api/hotel/cities'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchHotelOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/order/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchHotelOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/hotel/orders'
  callService(url, {
    data: params,
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