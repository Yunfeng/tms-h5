import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function login(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/login'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function logout(cbDone) {
  const url = APP_FLIGHT_PATH + '/my/logout'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchPrivileges(cbDone) {
  const url = APP_FLIGHT_PATH + '/privileges'
  callService(url, {
    cbDone: cbDone
  })
}












export function searchUsers(cbDone) {
  const url = APP_FLIGHT_PATH + '/employees'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchUsers2(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/employees'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function updatePassword(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/updatePassword.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function validateWwUser(params, done) {
  const url = APP_FLIGHT_PATH + '/public/validateWwUser'
  callService(url, {
    data: params,
    cbDone: done
  })
}

export function checkLoginStatus(cbDone) {
  const url = APP_FLIGHT_PATH + '/checkLoginStatus'
  callService(url, {
    cbDone: cbDone
  })
}


// 删除机票订单中指定的额外服务
export function deleteExtraService(id, extraId, cbDone) {
  const url = APP_FLIGHT_PATH + '/order/flight/' + id + '/extra/' + extraId + '/delete'
  callService(url, {
    cbDone: cbDone
  })
}


export function saveFlightFixedCommission(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/saveFixedChargePolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function searchFlightFixedCommissions(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchFixedChargePolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function incPoints(params, cbDone, fail, cbAlways) {
  const url = APP_FLIGHT_PATH + '/user/customer/points'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function checkIn(done) {
  callService(APP_FLIGHT_PATH + '/userCheckIn.do', {'cbDone': done})
}



export function searchTmcPolicies(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchTmcPolicy.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function getZmxyInfo(done) {
  const url = APP_FLIGHT_PATH + '/getZmxyInfo.do'
  callService(url, {
    cbDone: cbDone
  })  
}


export function authQueryZmxy(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/authQueryZmxy.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//查询当前账户的余额
export function searchBalance(cbDone) {
  const url = APP_FLIGHT_PATH + '/searchEntBalance.do'
  callService(url, {
    cbDone: cbDone
  })
}

export function buyPoints(cbDone) {
  const url = APP_FLIGHT_PATH + '/buyPoints.do'
  callService(url, {
    cbDone: cbDone
  })
}

export function recharge(amount, cbDone) {
  const url = APP_FLIGHT_PATH + '/recharge.do'
  callService(url, {
    data: { 'amount': amount },
    cbDone: cbDone
  })
}

export function processPnrDetail(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/processPnrDetail.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchPriceByRoute(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchFlightPrice.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchFlightFixedCommission(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/fixedCommission'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function createDepartment(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/department'
  callService(url, {
    data: params,
    contentType: 'application/json',
    cbDone: cbDone
  })
}

export function searchDepartments(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/departments'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function createPsg(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/passenger'
  callService(url, {
    data: params,
    contentType: 'application/json',
    cbDone: cbDone
  })
}

export function searchPassengers(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/passengers'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchPassengerById(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/passenger/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function deletePsgById(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/passenger/' + id + '/delete'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchFlightTicket(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchFlightTicket.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function createFlightBill(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/createFlightTicketBill.do'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function searchBillSum(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/searchBillSum'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}







export function searchCustomerBalances(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/customerBalances'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function saveEntCreditLimit(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/saveEntCreditLimit.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function saveEntCashBalance(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/updateEntCashBalance.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function searchSoftProducts(cbDone) {
  const url = APP_FLIGHT_PATH + '/soft-products'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchSoftProductBuyInfo(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/soft-product-buy-info'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function buySoftProduct(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/buy-soft-product'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 发送短信验证码
export function sendSmsVerifyCode(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/sendResetPasswordSms.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

//重置密码
export function resetPassword(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/resetPassword.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}
