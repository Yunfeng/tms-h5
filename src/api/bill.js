import { BILL_FLIGHT, BILL_HOTEL, BILL_TRAIN, BILL_REFUND, BILL_VAS, BILL_CHANGE } from '../common/const.js'
import { APP_FLIGHT_PATH, callService } from '../common/common.js'


export function searchBills(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/searchMyBillInfo.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchBillDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/my/bill/' + id
  callService(url, {
    cbDone: cbDone
  })
}


// 查找结算单
export function searchSettlements(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/my/settlements'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getSettlementReport(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/my/settlement/' + id + '/report'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}







export function searchUnreviewedBills(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/unreviewed'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchBillsToSettle(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/toSettle'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function changeBillCustomer(billId, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + billId + '/customer'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function updateBillFlightTicketPrice(billId, jsonStr, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + billId + '/flight/price'
  callService(url, {
    contentType: 'application/json',
    data: jsonStr,
    cbDone: cbDone
  })
}

export function auditBill(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/audit/passed'
  callService(url, {
    cbDone: cbDone
  })
}

export function auditBillByBillNum(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bill/audited'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function cancelBillAudited(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/audit/canceled'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function deleteBill(billId, cbDone) {
  const url = APP_FLIGHT_PATH + '/deleteBillInfo.do'
  callService(url, {
    data: { id: billId },
    cbDone: cbDone
  })
}

// 批量审核账单
export function reviewBillInfoPassed(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bills/review/passed'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 创建结算单
export function createSettlement(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bills/settlement/create'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function batchCreateSettlement(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bills/settlement/batchCreate'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function searchSettlementDetail(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id
  callService(url, {
    cbDone: cbDone
  })
}


export function searchUnpaidSettlements(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlements/unpaid'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function delSettlementNo(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/settlement/removed'
  callService(url, {
    cbDone: cbDone
  })
}

export function updateSettlementName(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/name'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}



export function getBillTypeDesc(billType) {
  switch (billType) {
    case BILL_FLIGHT: return '机票'
    case BILL_HOTEL: return '酒店'
    case BILL_TRAIN: return '火车票'
    case BILL_REFUND: return '退票'
    case BILL_VAS: return '服务'
    case BILL_CHANGE: return '改签'
    default: 
      return billType
  }
}

// 账单销账
export function writeOffBill(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/writeOffBillInfo.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 单张账单直接销账 
export function writeOffSingleBill(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/writeOff'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

// 账单销账撤销
export function undoWriteOffBill(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/undo/writeOff/bill'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function writeOffSettlement(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/writeOff/settlement'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 撤销结算单销账
export function undoWriteOffSettlement(params, cbDone) {
  const url = APP_FLIGHT_PATH + '/undoWriteOff/settlement'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}


export function removeBillOfSettlement(id, billNo, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/remove/' + billNo
  callService(url, {
    cbDone: cbDone
  })
}

// 查找结算单日志
export function searchSettlementHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

// 查找结算单包含的账单
export function searchSettlementBills(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 调整结算单金额（纠错用）
export function adjustSettlementAmount(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/adjustAmount'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 查询某客户的交易记录
export function searchCustomerTrans(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/customer/' + id + '/trans'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 查找账单日志
export function searchBillInfoHistory(id, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/history'
  callService(url, {
    cbDone: cbDone
  })
}

// 修改账单的供应商
export function updateBillInfoSupplier(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/supplier'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

// 修改账单的支付方式
export function updateBillInfoPaymentMethod(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/paymentMethod'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateBillInfoEtdzDate(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/etdzDate'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateBillInfoOpDate(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/opDate'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}



export function updateBillInfoOp1(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/op1'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateBillInfoRemark(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/remark'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function updateBillInfoPayType(id, params, cbDone) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/payType'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function autoReviewBillInfo(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/autoReview'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function checkPayStatus(cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/checkFlightOrderPayStatus'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchUnreviewedTickets(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/unreviewed/flights'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchUnpaidTickets(params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bills/unpaid/flights'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementTickets(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/tickets'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementRefunds(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/refunds'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementChanges(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/changes'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementVases(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/vas'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementHotels(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/hotel'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function searchSettlementTrains(id, params, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/settlement/' + id + '/bills/train'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}



// 单张账单已支付 
export function finishBillPayment(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/paid'
  callService(url, {
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function undoFinishBillPayment(id, cbDone, cbAlways) {
  const url = APP_FLIGHT_PATH + '/bill/' + id + '/unpaid'
  callService(url, {
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
