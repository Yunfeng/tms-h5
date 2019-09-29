import { APP_FLIGHT_PATH, callService } from '../common/common.js'


export function searchCustomers(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/customers'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchCustomerDetails(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/customer-details'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchCustomerDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function searchTodoCustomer(cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/todos'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchPossibleCustomers(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/possibleCustomers'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone
  })
}

export function searchEnterpriseById(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/enterprise/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function searchCustomerByEnterpriseId(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/enterprise/' + id + '/customer'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchDepartmentsByCustomerId(customerId, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/' + customerId + '/departments'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchCustomerNotes(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/notes'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchNotesByCustomer(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/' + id + '/notes'
  callService(url, {
    cbDone: cbDone
  })
}

export function createCustomerNote(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/note/create'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteCustomerNote(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/note/' + id + '/delete'
  callService(url, {
    cbDone: cbDone
  })
}

export function createCustomer(params, cbDone, cbAlways, cbFail) {
  const url = APP_FLIGHT_PATH + '/customer'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways,
    cbFail: cbFail
  })
}

export function generateCustomerByEnterpriseId(id, cbDone, cbAlways, cbFail) {
  const url = APP_FLIGHT_PATH + '/customer/enterprise/' + id
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways,
    cbFail: cbFail
  })
}

export function getSettlementTypeDesc(val) {
  switch (val) {
    case 1: return '次日结'
    case 2: return '周结'
    case 3: return '月结'
    case 0: return '(待定)'
    default: return val
  }
}

export function getApprovalTypeDesc (val) {
  switch (val) {
    case 1: return '电话'
    case 2: return '短信'
    case 3: return '邮件'
    case 4: return '微信'
    default: return val
  }
}

export function getItineraryTypeDesc(val) {
  switch (val) {
    case 0: return '不'
    case 1: return '行程单'
    case 2: return '发票'
    case 3: return '信息单'
    default: return val
  }
}

