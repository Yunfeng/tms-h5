import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchEntReceipts(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/searchReceipts'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createEntReceipt(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/createReceipt.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchEntReceipt(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/refreshReceiptInfo.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchReceiptHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/receipt/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

export function deleteReceipt(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/receipt/' + id + '/delete'
  callService(url, {
    cbDone: cbDone
  })
}

export function refundReceipt(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/receipt/' + id + '/refund'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function updateReceiptRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/receipt/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}