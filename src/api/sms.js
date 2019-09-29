import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function sendFlightOrderSms(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/sms'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function getFlightOrderSmsContent(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/smsContent'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function sendFlightOrderApprovalSms(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/sendApprovalSms'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function getFlightOrderApprovalSmsContent(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/approvalSmsContent'
  callService(url, {
    cbDone: cbDone
  })
}

export function getOrderSmsContent(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/sms/order/content'
  callService(url, {
    type: 'get',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function sendOrderSmsContent(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/sms/order/content'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}