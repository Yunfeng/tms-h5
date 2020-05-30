import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function showTicketOrderStatus (status) {
  switch (status) {
    case 0: return '未提交，待支付'
    case 1: return '已提交，待处理'
    case 2: return '处理中'
    case 8: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}

export function searchAttractions(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attractions'
  callService(url, {
  	type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function searchAttractionPrices(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/' + id + '/prices'
  callService(url, {
  	type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchTicketOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/orders'
  callService(url, {
    type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getTicketOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/order/' + id
  callService(url, {
    type: 'get',
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}



export function saveAttraction(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function deleteAttractionPrice(attractionId, priceId, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/' + attractionId + '/price/' +priceId
  callService(url, {
    type: 'delete',
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function saveAttractionPrice(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/' + id + '/price'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createAttractionOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/order'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function cancelTicketOrder(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/order/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function payTicketOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/order/' + id + '/pay'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getAttraction(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/' + id
  callService(url, {
    type: 'get',
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 上传门票订单
export function uploadTicketOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/attraction/ticket/order/upload'
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