import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function checkExpireDate(cbDone) {
  //检查产品的使用期限
  const url = APP_FLIGHT_PATH + '/catch/flight/expireDate'
  callService(url, {
    cbDone: cbDone
  })
}

export function createCatchOrder(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/catch/flight/new'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchCatchOrders(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/catch/flights'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function cancelCatchOrder(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/catch/flight/' + id + '/status/canceled'
  callService(url, {
  	data: params,
    cbDone: cbDone
  })
}

export function monitorCatchOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/catch/flight/' + id + '/status/monitoring'
  callService(url, {
    cbDone: cbDone
  })
}

export function searchOrderDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/catch/flight/' + id
  callService(url, {
    cbDone: cbDone
  })
}

export function deleteOrder(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/catch/flight/' + id + '/removed'
  callService(url, {
    cbDone: cbDone
  })
}



export function showMonitorTypeDesc(m) {
	switch (m) {
		case 0: return '无';
		case 1: return 'HX/NO 提醒';
    case 2: return '追位';
		case 3: return '关舱提醒';
		case 8: return '放位抢位';
		default: return m;
	}
}

export function showOrderStatus(m) {
	switch (m) {
		case 0: return '待处理';
		case 1: return '处理中';
		case 2: return '已完成';
		case 8: return '已取消';
		default: return m;
	}
}
