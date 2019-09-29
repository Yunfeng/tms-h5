import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function saveSupplier(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/supplier/create'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 设置为默认供应商
export function updateDefaultSupplier(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/supplier/' + id + '/default'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 设置为BSP开票供应商
export function updateBspSupplier(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/supplier/' + id + '/bsp'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSuppliers(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/suppliers'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function savePaymentMethod(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/payment/method/create'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchPaymentMethods(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/payment/methods'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}





export function saveIncomeMethod(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/income/method/create'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchIncomeMethods(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/income/methods'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}



export function searchAirports(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/airports'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function createAirport(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/airport'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchAirlines(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/airlines'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function createAirline(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/airline'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchAirlineSchedules(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/airline/schedules'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchFuelSurcharge(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/fuelSurcharges'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function createFuelSurcharge(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/fuelSurcharge'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteFuelSurcharge(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/data/fuelSurcharge/' + id
  callService(url, {
    type: 'delete',
    cbDone: cbDone
  })
}