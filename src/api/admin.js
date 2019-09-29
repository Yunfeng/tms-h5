import { APP_FLIGHT_PATH, callService } from '../common/common.js'

// 此处的方法都需要管理员权限

export function syncTbookingOrders(syncMode, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/tbooking/syncIssueBills/' + syncMode
  callService(url, {
    cbDone: cbDone
  })
}

export function searchUsers(params, cbDone, cbAlways, cbFail) {  
  const url = APP_FLIGHT_PATH + '/admin/users'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways,
    cbFail: cbFail
  })
}

export function searchMembers(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/members'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function createUser(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/user'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

//从企业微信获取部门成员
export function syncDeptUsers(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/ent/department/' + id + '/users'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function syncDepts(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/ent/departments/sync'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 删除企业微信用户
export function deleteWwUser(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/deleteWwUser'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 同步企业微信成员信息
export function syncWwUser(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/syncWwUser'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchDepartments(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/ent/departments'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function createDepartment(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/createDept'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteDepartment(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/deleteDept'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


// 回滚机票订单状态到上一步
export function rollbackFlightOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/flight/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 回滚退票单到上一步
export function rollbackRefundOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/refund/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 回滚改签单到上一步
export function rollbackChangeOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/change/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 回滚服务单到上一步
export function rollbackVasOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/vas/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 回滚酒店订单到上一步
export function rollbackHotelOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/hotel/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 回滚火车票订单到上一步
export function rollbackTrainOrderStatus(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/train/order/' + id + '/status/rollback'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function saveFakedTicket(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/fakedTicket/create'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}           

export function searchFakedTickets(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/fakedTickets'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 查找旅行代码
export function searchTourCodes(cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/tourCodes'
  callService(url, {
    cbDone: cbDone
  })
}

// 创建或修改 旅行代码
export function createTourCode(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/tourCode'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchEntConfig(cbDone) {
  const url = APP_FLIGHT_PATH + '/enterprise/configs'
  callService(url, {
    type: 'get',
    cbDone: cbDone
  })  
}

export function saveEntConfig(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/enterprise/configs'
  callService(url, {
    type: 'post',
    data: params,
    cbDone: cbDone
  })  
}

// 查找企业的eterm参数设置
export function searchEntEtermConfig(cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/config/eterm'
  callService(url, {
    type: 'GET',
    cbDone: cbDone
  })  
}

// 保存eterm参数
export function saveEntEtermConfig(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/config/eterm'
  callService(url, {
    type: 'POST',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

// 查找企业的sms参数设置
export function searchEntSmsConfig(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/config/sms'
  callService(url, {
    type: 'GET',
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

// 保存sms参数
export function saveEntSmsConfig(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/config/sms'
  callService(url, {
    type: 'POST',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}


// 重置用户密码
export function resetUserPassword(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/user/password'
  callService(url, {
    type: 'POST',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

export function searchDataFields(cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/dataFields'
  callService(url, {
    cbDone: cbDone,
  })  
}

export function createDataTemplate(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/dataTemplate'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchDataTemplates(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/dataTemplates'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function deleteDataTemplates(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/dataTemplate/' + id + '/delete'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 查找企业的vaas参数设置
export function searchEntVaasConfig(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/config/vaas'
  callService(url, {
    type: 'GET',
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

// 保存vaas参数
export function saveEntVaasConfig(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/config/vaas'
  callService(url, {
    type: 'POST',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}
