import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function showDeliveryNoteStatus (status) {
  switch (status) {
    case 0: return '待配送'
    case 1: return '配送中'
    case 2: return '已完成'
    case 4: return '已取消'
    default : return status
  }
}

export function createDeliveryNote(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/delivery/note'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchDeliveryNotes(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/delivery/notes'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchDeliveryNote(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function processDeliveryNote(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id + '/status/processing'
  callService(url, {
    cbDone: cbDone
  })
}

export function finishDeliveryNote(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id + '/status/finished'
  callService(url, {
  	data: params,
    cbDone: cbDone
  })
}

export function cancelDeliveryNote(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id + '/status/canceled'
  callService(url, {
  	data: params,
    cbDone: cbDone
  })
}



export function updateDeliveryDate(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id + '/deliveryDate'
  callService(url, {
  	data: params, 
    cbDone: cbDone
  })
}

export function searchHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/delivery/note/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}



