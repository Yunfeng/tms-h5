import { APP_FLIGHT_PATH, callService } from '../common/common.js'


export function searchMonthlyReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly'
  callService(url, {
    type: 'get',
    data: params,
    cbDone: cbDone
  })
}

export function searchMonthlyFlightReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/flight'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 退票账单 - 月报
export function searchMonthRefundReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/refund'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 退票订单 - 月报
export function searchRefundOrderReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/order/refund/monthly'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


// 改签账单
export function searchMonthChangeReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/change'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// VAS账单
export function searchMonthVasReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/vas'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 酒店账单
export function searchMonthHotelReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/hotel'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 火车票
export function searchMonthTrainReport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/report/monthly/train'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchMonthlyStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/monthly'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchDailyStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/daily'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchPaymentMethodStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/paymentMethod/statistic'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchOp1Stats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/op1'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchOp2Stats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/op2'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSalesmanStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/salesman'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSupplierStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/supplier/statistic'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 航空公司统计
export function searchAirlinesStats(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/report/statistic/airlines'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}