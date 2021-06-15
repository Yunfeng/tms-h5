import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchFlightOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/flight/orders'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchFlightOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/flight/order/' + id
  callService(url, {
    type: 'GET',
    cbDone: cbDone
  })
}

export function searchFlightOrderByAuthCode(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/self-service/flight/order/' + id
  callService(url, {
    type: 'GET',
    data: params,
    cbDone: cbDone
  })
}

export function createFlightOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/flight/order'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function payForFlightOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/flight/order/' + id + '/pay'
  callService(url, {
    cbDone: cbDone
  })
}

export function submitFlightOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/flight/order/' + id + '/ticketing'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function approveFlightOrder(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/flight/order/' + id + '/approve'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}











export function searchFlightOrdersToPrint(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flights/print'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchFlightOrdersToDelivery(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flights/delivery'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function searchFlightOrderDetailByOrderNo(orderNo, cbDone) {
  const url = APP_FLIGHT_PATH + '/flight/order/orderNo/' + orderNo
  callService(url, {
    cbDone: cbDone
  })
}

export function searchFlightOrderHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}



export function updateFlightOrderPrice(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/price'
  callService(url, {
    data: params,
    contentType: 'application/json',
    cbDone: cbDone
  })

}

export function updateFlightOrderPassenger(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/passenger'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderPnr(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/pnr'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function incFlightOrderPrintCount(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/print'
  callService(url, {
    cbDone: cbDone
  })
}

export function cancelFlightOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/status/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function setFlightOrderPaid(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/status/paid'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}




export function toticketFlightOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/toticket'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function finishFlightOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/finish'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function outputFlightOrder2Bill(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/convertFlightOrder2Bill'
  callService(url, {
    data: { id: id },
    cbDone: cbDone
  })
}

export function updateFlightOrderCustomer(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/customer'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderIntl(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/intlTicket'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderDeliveryDate(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/deliveryDate'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderTicketer(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/ticketer'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderSupplier(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderPaymentMethod(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/paymentMethod'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateFlightOrderTicket(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/ticket'
  callService(url, {
    data: params,
    contentType: 'application/json',
    cbDone: cbDone
  })
}

export function agreeFlightOrderCancelRequest(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/agreeCancelRequest'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function denyFlightOrderCancelRequest(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/denyCancelRequest'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 机票订单的行程单已邮寄
export function finishFlightOrderDelivery(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/delivery/finished'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchTpr(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/tprs'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function saveTprContent(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/tpr/content'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function statFlightOrderStatus(cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/statStatus'
  callService(url, {
    cbDone: cbDone
  })
}

export function rav(params, done, fail, always) {
  const url = '/api/gds/rav'
  callService(url, {
    timeout: 10000,
    data: params,
    cbDone: done,
    cbFail: fail,
    cbAlways: always
  })
}

export function searchStopover(params, done, fail, always) {
  const url = '/api/gds/eterm/ff'
  callService(url, {
    type: 'get',
    timeout: 10000,
    data: params,
    cbDone: done,
    cbFail: fail,
    cbAlways: always
  })
}

export function searchOne(params, done, fail, always) {
  const url = '/api/gds/searchOne'
  callService(url, {
    timeout: 10000,
    data: params,
    cbDone: done,
    cbFail: fail,
    cbAlways: always
  })
}


export function searchTgq(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: '/Flight/flights/tgq',
    timeout: 3000,
    data: params,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    // always()
  })
}