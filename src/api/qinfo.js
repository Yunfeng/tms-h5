import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchQinfoSettings(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/qinfoes/settings'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function saveQinfoSetting(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/qinfoes/settings/save'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function deleteQinfoSetting(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/qinfoes/settings/' + id + '/deleted'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}
