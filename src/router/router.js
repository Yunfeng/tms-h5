import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('../pages/Nav.vue')},
      { path: '/home', redirect: '/my/page'},
      { path: '/my/page', component: () => import('../pages/Workbench.vue'), meta: { keepAlive: true }},


      {path: '/login',         component: () => import('../pages/Login.vue') , name: 'login'},
      {path: '/logout',         component: () => import('../pages/Logout.vue') , name: 'logout'},

      {path: '/admin/users',         component: () => import('../pages/Users.vue') },
      {path: '/admin/depts',         component: () => import('../pages/Departments.vue') },
      {path: '/admin/groups',         component: () => import('../pages/Groups.vue') },
      {path: '/admin/role/privileges',         component: () => import('../pages/RolePrivileges.vue') },
      {path: '/admin/members',         component: () => import('../pages/Members.vue'), meta: { keepAlive: true } },
      {path: '/admin/member/:id',         component: () => import('../pages/Member.vue') },
      {path: '/admin/member/enterprise/:id',         component: () => import('../pages/MemberEnterprise.vue') },
      {path: '/admin/patcodes',         component: () => import('../pages/settings/PatCodes.vue') },

      {path: '/flt/search',         component: () => import('../pages/FlightSearchForm.vue')},
      {path: '/flt/search-result',         component: () => import('../pages/FlightSearchResult.vue')},
      {path: '/flt/booking',         component: () => import('../pages/FlightBookingForm.vue')},
      {path: '/flt/orders',         component: () => import('../pages/FlightOrders.vue'), meta: { keepAlive: true }},
      {path: '/flt/orders/delivery',         component: () => import('../pages/FlightOrdersToDelivery.vue') , meta: { keepAlive: true }},  
      
      {path: '/flt/order/:id', component: () => import('../pages/FlightOrderDetail.vue'), name: 'flightOrderDetail' },
      {path: '/flt/order/:id/history',         component: () => import('../pages/FlightOrderHistory.vue') , name: 'flightOrderHistory'},
      {path: '/new/flt/order',         component: () => import('../pages/NewFlightOrder.vue') },
      
      {path: '/flt/refund/orders',         component: () => import('../pages/FlightRefundOrders.vue') , meta: { keepAlive: true }},
      {path: '/flt/refund/order/:id',         component: () => import('../pages/FlightRefundOrderDetail.vue') },
      {path: '/flt/change/orders',         component: () => import('../pages/FlightChangeOrders.vue') , meta: { keepAlive: true }},
      {path: '/flt/change/order/:id',         component: () => import('../pages/FlightChangeOrderDetail.vue') },

      {path: '/vas/orders',         component: () => import('../pages/VasOrders.vue') },
      {path: '/new/vas/order',         component: () => import('../pages/NewVasOrder.vue') },
      {path: '/vas/order/:id',         component: () => import('../pages/VasOrderDetail.vue') },

      {path: '/vaas/orders',         component: () => import('../pages/vaas/VaasOrders.vue') },
      {path: '/vaas/order',         component: () => import('../pages/vaas/VaasOrderNew.vue') },
      {path: '/vaas/order/:id',         component: () => import('../pages/vaas/VaasOrderDetail.vue') },

      {path: '/insurance/orders',         component: () => import('../pages/InsuranceOrders.vue') },


      {path: '/hotel/orders',         component: () => import('../pages/hotel/HotelOrders.vue'), meta: { keepAlive: true }},
      {path: '/hotel/order/:id',         component: () => import('../pages/hotel/HotelOrder.vue')},
      {path: '/hotel/order',         component: () => import('../pages/hotel/HotelOrderNew.vue')},

      {path: '/train/orders',         component: () => import('../pages/train/TrainOrders.vue'), meta: { keepAlive: true }},
      {path: '/train/order/:id',         component: () => import('../pages/train/TrainOrder.vue')},
      {path: '/train/order',         component: () => import('../pages/train/TrainOrderNew.vue')},

      {path: '/delivery/notes',         component: () => import('../pages/delivery/DeliveryNotes.vue'), meta: { keepAlive: true }},
      {path: '/delivery/note/:id',         component: () => import('../pages/delivery/DeliveryNote.vue')},
      {path: '/delivery/note',         component: () => import('../pages/delivery/DeliveryNoteNew.vue')},

      {path: '/bills',         component: () => import('../pages/Bills.vue') , meta: { keepAlive: true }},
      {path: '/bills/unreviewed',         component: () => import('../pages/BillsToReview.vue') },
      {path: '/bills/toSettle',         component: () => import('../pages/BillsToSettle.vue') },
      
      {path: '/bill/detail/:id',         component: () => import('../pages/BillDetail.vue') },
      
      {path: '/flt/tickets',         component: () => import('../pages/BillFlightTickets.vue') , meta: { keepAlive: true }},
      
      {path: '/flt/refunds',         component: () => import('../pages/BillFlightRefundTickets.vue') },

      {path: '/train/tickets',         component: () => import('../pages/BillTrainTickets.vue') },

      {path: '/hotel/bills',         component: () => import('../pages/BillHotels.vue') },

      {path: '/ent/receipts',         component: () => import('../pages/EntReceipts.vue') , meta: { keepAlive: true }},
      {path: '/ent/receipt/:id/history',         component: () => import('../pages/EntReceiptHistory.vue') },
      
      {path: '/ent/receipt/:id/writeoff',         component: () => import('../pages/EntReceiptWriteOff.vue') },
      {path: '/ent/settlements',         component: () => import('../pages/EntSettlements.vue') , meta: { keepAlive: true }},
      {path: '/ent/settlement/:id',         component: () => import('../pages/EntSettlementDetail.vue') },
      {path: '/ent/settlement/:id/report',         component: () => import('../pages/EntSettlementReport.vue') },


      {path: '/customers',         component: () => import('../pages/Customers.vue'), meta: { keepAlive: true } },
      {path: '/customer',         component: () => import('../pages/CustomerNew.vue') },
      {path: '/customer/departments',         component: () => import('../pages/CustomerDepartments.vue') },
      {path: '/customer/cost-centers',         component: () => import('../pages/CustomerCostCenters.vue') },
      {path: '/customer/:id',         component: () => import('../pages/CustomerDetail.vue') },
      {path: '/customer/:id/trans',         component: () => import('../pages/EntAmountHistory.vue') },
      {path: '/passengers',         component: () => import('../pages/Passengers.vue'), meta: { keepAlive: true } },
      {path: '/passenger/:id',         component: () => import('../pages/PassengerDetail.vue') },
      {path: '/passenger',         component: () => import('../pages/Passenger.vue') },
      
      {path: '/ent/balances',         component: () => import('../pages/EntBalances.vue'), meta: { keepAlive: true } },
      {path: '/flt/commissions/fixed',         component: () => import('../pages/FlightFixedCommissions.vue') },
      {path: '/setting/bill-templates',         component: () => import('../pages/settings/BillTemplates.vue') },

      {path: '/suppliers',         component: () => import('../pages/Suppliers.vue') },
      {path: '/payments',         component: () => import('../pages/Payments.vue') },
      

      {path: '/tool/sms',         component: () => import('../pages/Sms.vue') },


      {path: '/charter-flights',         component: () => import('../pages/CharterFlights.vue') },
      {path: '/charter-flight/new',         component: () => import('../pages/CharterFlightNew.vue') },
      {path: '/charter-flight/detail/:id',         component: () => import('../pages/CharterFlightDetail.vue') },
      {path: '/charter-flight/order/new',         component: () => import('../pages/CharterFlightOrderNew.vue') },

      {path: '/report/sale/month',         component: () => import('../pages/report/SaleReportMonth.vue') },
      {path: '/report/statistic/monthly',         component:() => import('../pages/report/SaleMonthStatistic.vue') },
      {path: '/report/stat/airlines',         component: () => import('../pages/report/ReportStatByAirlines.vue') },


      {path: '/my/password',         component: () => import('../pages/MyPassword.vue') },
      {path: '/my/histories',         component: () => import('../pages/MyHistories.vue') },
      {path: '/my/worktime',         component: () => import('../pages/MyWorkTime.vue') },

      {path: '/data/airports',         component: () => import('../pages/Airports.vue') },
      {path: '/data/airlines',         component: () => import('../pages/Airlines.vue') }

    ]
  });
}
