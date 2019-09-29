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
      { to: '/hotel/orders', caption: '酒店订单', authorized: 0 },
      { to: '/train/orders', caption: '火车票订单', authorized: 0 },
    ]
  },
  {
    caption: '账单',
    submenus: [
      { to: '/bills', caption: '账单', authorized: 1 },      
    ]
  },
  {
    caption: '财务',
    submenus: [
      { to: '/ent/settlements', caption: '结算单', authorized: 1 },
    ]
  },
  {
    caption: '报表',
    submenus: [
      { to: '/report/sale/month', caption: '月报', authorized: 1 },
      { to: '', caption: '' },
      { to: '/report/refund/month', caption: '退票报表', authorized: 1 },
      { to: '', caption: '' },
      { to: '/report/statistic/monthly', caption: '月统计', authorized: 1 },
      { to: '/report/paymentMethod/statistic', caption: '支付方式统计', authorized: 1 },
      { to: '/report/stat/supplier', caption: '供应商统计', authorized: 1 },
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
      { to: '/tool/sms', caption: '短信', authorized: 1 },
      { to: '/data/airports', caption: '机场', authorized: 0},
      { to: '/data/airlines', caption: '航空公司', authorized: 0 },
      { to: '/data/airline/schedules', caption: '航班时刻', authorized: 0 },      
      { to: '/charter-flights', caption: '团队机票', authorized: 0},
    ]
  },
  {
    caption: '设置',
    submenus: [
      { to: '/admin/depts', caption: '部门管理', authorized: 1 },
      { to: '/admin/users', caption: '员工管理', authorized: 1 },
      { to: '/admin/role/privileges', caption: '角色权限', authorized: 1 },
      { to: '/admin/groups', caption: '组管理', authorized: 1 },
    ]
  }
]