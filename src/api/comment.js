import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function saveComment(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/comment'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchComments(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/comments'
  callService(url, {
  	type: 'get',
    data: params,
    cbDone: cbDone
  })
}

