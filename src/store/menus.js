export const menus = [
  {
    caption: '订单',
    submenus: [
      { to: '/flt/orders', caption: '机票订单', authorized: 0 },
      { to: '', caption: '' },
      { to: '/flt/refund/orders', caption: '机票退票单', authorized: 0 },
      { to: '/flt/change/orders', caption: '机票改签单', authorized: 0 },
      { to: '', caption: '' },
      { to: '/insurance/orders', caption: '保险订单', authorized: 1 },
      { to: '', caption: '' },
      { to: '/vas/orders', caption: '服务订单', authorized: 1 },
      { to: '/vaas/orders', caption: '机场服务订单', authorized: 0 },
      { to: '', caption: '' },
      { to: '/rental/car', caption: '租车', authorized: 0 },
      { to: '/rental/car/orders', caption: '租车订单', authorized: 0 },
      { to: '', caption: '' },
      { to: '/hotel/orders', caption: '酒店订单', authorized: 0 },
      { to: '/train/orders', caption: '火车票订单', authorized: 0 },
      { to: '/train/refund/orders', caption: '火车退票单', authorized: 0 },
    ]
  },
  {
    caption: '账单',
    submenus: [
      { to: '/bills', caption: '账单', authorized: 1 },   
      { to: '/ent/settlements', caption: '结算单', authorized: 1 }   
    ]
  },
  {
    caption: '报表',
    submenus: [
      { to: '/report/sale/month', caption: '月报', authorized: 1 },
      { to: '/report/statistic/monthly', caption: '月统计', authorized: 1 },
      { to: '/report/stat/airlines', caption: '航空公司统计', authorized: 1 },
    ]
  },
  {
    caption: '客户',
    submenus: [
      { to: '/customer/departments', caption: '企业部门信息', authorized: 1 },
      { to: '/passengers', caption: '企业员工信息', authorized: 1 },
    ]
  },
  {
    caption: '工具',
    submenus: [
      { to: '/tool/pnrs', caption: 'PNR列表', authorized: 1 },
      { to: '/tool/detr/result', caption: 'Detr结果', authorized: 1 },
      { to: '/tprs', caption: 'TPR数据', authorized: 0 }
    ]
  }
]