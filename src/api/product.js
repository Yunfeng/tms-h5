import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function createProduct(params, cbDone, fail, cbAlways) {
  const url = APP_FLIGHT_PATH + '/product'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function searchProducts(params, done, fail, always) {
  callService(APP_FLIGHT_PATH + '/vaas/services', {
    data: params,
    cbDone: done,
    cbAlways: always
  })
}

export function deleteInsurance(id, cbDone, fail, cbAlways) {
  const url = APP_FLIGHT_PATH + '/product/' + id + '/delete'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getServiceProduct(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/product/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function searchInsuranceProducts(params, done, fail, always) {
  callService(APP_FLIGHT_PATH + '/vas/insurances', {
    type: 'get',
    data: params,
    cbDone: done,
    cbAlways: always
  })
}