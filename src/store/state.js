import { menus } from './menus.js'

export const state = {
  menus: menus,

  workMode: '',
  bottomTabBarShowed: true,
  initialized: false,
  isRoot: false,
  logined: false,
  username: '',
  fullname: '',
  sid: '458559',
  redmineUrl: '',
  userInfo: {
    freeBalance: 0,
    cashBalance: 0,
    frozenBalance: 0,
    creditLimit: 0
  },
  searchParams: {
    dcity: '',
    dcityName: '',
    acity: '',
    acityName: '',
    ddate: '',
    sortBy: 0,
    onlyCarrier: '',
  },
  order: {
    flights: [],
    psgs: [],
    pnrNo: '',
    pnrDetail: '',
    policyId: 0
  },
  historyStep: 0,
  orderId: 0,
  orderDetail: null,
  policyDetail: null,
  pnrDetail: null,

  errAlert: false,
  errMsg: '',
  errMsgType: 'warning',
  
  loading: false,
  loadingText: '数据加载中',

  wxInfo: {
    code: '',
    state: '',
    openid: '',
    nickname: '',
    headimgurl: '',
    subscribe: 0
  },
  // 申请退票信息
  refundInfo: {
    ticketNo: '',
    psgName: '',
    orderId: 0
  },
  // 申请改期信息
  changeInfo: {
    ticketNo: '',
    psgName: '',
    orderId: 0
  },
  refundOrderInfo: null,
  changeOrderInfo: null,
  privileges: [],
  roles: [],
  customers: [],

  printMode: 0
}


