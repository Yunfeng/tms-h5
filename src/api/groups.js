import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function searchGroups(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/groups'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function saveGroup(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/group'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function saveRole(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/group/role'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function addUserToGroup(params, cbDone) {
	const url = APP_FLIGHT_PATH + '/admin/group/user'
	callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function delUserFromGroup(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/group/user/delete'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchRoles(cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/roles'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchPrivileges(cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/privileges'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchRolePrivileges(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/role/privileges'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function addRolePrivilege(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/role/add/privilege'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteRolePrivilege(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/admin/role/privilege/' + id + '/delete'
  callService(url, {
    cbDone: cbDone
  })
}
