import { callService } from './common.js'

export function searchAirports(params, cbDone) {
  const url = 'http://127.0.0.1:8080/Flight/data/airports'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

