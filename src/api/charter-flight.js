import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchCharterFlights(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/charterFlight/list'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function createCharterFlight(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/charterFlight/create'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchCharterFlightDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/charterFlight/detail/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function deleteCharterFlightDetail(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/charterFlight/delete/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function applyCharterOrder(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/charterFlight/' + id + '/status/applying'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getStatusDesc(val) {
  switch (val) {
    case 0: return '等待申请';
    case 1: return '申请中';
    case 2: return '申请成功';
    case 4: return '已取消';
  }
}