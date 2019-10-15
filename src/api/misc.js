import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchFdRequests(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchPriceRequest.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchFdResults(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchFdResult.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteFdRequest(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/deleteFdRequest.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteAllFdRequest(cbDone) {
  const url = APP_FLIGHT_PATH + '/deleteAllFdRequest.do'
  callService(url, {
    cbDone: cbDone
  })
}

export function deleteAllFdResults(cbDone) {
  const url = APP_FLIGHT_PATH + '/deleteFdResults'
  callService(url, {
    cbDone: cbDone
  })
}

export function createFdRequest(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/createPriceRequest.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function uploadFdRequest(params, cbDone, cbAlways, cbFail) {
  const url = APP_FLIGHT_PATH + '/fd-request/excel'
  callService(url, {
    data: params,
    contentType: false,
    cache: false,
    processData: false,
    timeout: 0,
    cbDone: cbDone,
    cbAlways: cbAlways,
    cbFail: cbFail
  })
}

export function searchDetrResults(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/detrs'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function refreshDetrInfo(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/detr/refresh'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function uploadDetrRequest(params, cbDone, cbAlways, cbFail) {
  const url = APP_FLIGHT_PATH + '/detr-request/excel'
  callService(url, {
    data: params,
    contentType: false,
    cache: false,
    processData: false,
    timeout: 0,
    cbDone: cbDone,
    cbAlways: cbAlways,
    cbFail: cbFail
  })
}

export function searchSms(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/sms/'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchPnr(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/pnr/list'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchPnrUsed(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/pnr/listUsed'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getPnr(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/pnr/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function createPnrMonitor(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/pnr/monitor'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}
