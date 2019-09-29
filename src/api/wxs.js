import { APP_FLIGHT_PATH, callService } from '../common/common.js'

// 微信服务号 自定义菜单
export function searchCustomMenus(cbDone, cbAlways, cbFail) {
  const url = APP_FLIGHT_PATH + '/admin/wxs/menus'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

export function deleteCustomMenu(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/wxs/menu/' + id + '/delete'
  callService(url, {
  	type: 'post',
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}

export function createCustomMenu(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/wxs/menu/create'
  callService(url, {
  	type: 'post',
  	data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}


export function uploadCustomMenu(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/admin/wxs/menus/upload'
  callService(url, {
    type: 'post',
    cbDone: cbDone,
    cbAlways: cbAlways
  })  
}
