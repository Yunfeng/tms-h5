import { callService, WEBAPP_PATH } from './common.js'

export function login(params, done) {
  const url = WEBAPP_PATH + '/ajaxLogin.do'
  callService(url, {
    data: params,
    cbDone: done
  })
}