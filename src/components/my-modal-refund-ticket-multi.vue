<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h6 class="modal-title">
              <span :class="{'text-warning': reasonCode === 4}">{{modalTitle}}</span>
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body py-0">
          <div class="card py-0">
            <table class="table table-sm table-striped mb-0">
              <thead>
                <tr>
                  <th>票号</th>
                  <th>姓名</th>
                  <th>证件号</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(psg, index) of psgList" :key="index">
                  <td>
                    <input type="checkbox" v-model="psg.selected" />
                  {{psg.ticketNo}}</td>
                  <td>{{psg.name}}</td>
                  <td>{{psg.idNo}}</td>
                </tr>
                
              </tbody>
            </table>
            <table class="table table-sm table-striped mb-0">
              <thead>
                <tr class="bg-info text-white">
                  <th>销售价</th>
                  <th>税</th>
                  <th>成本</th>
                  <th>实收</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="parvalue" /></td>
                  <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="tax" /></td>
                  <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="cost" /></td>
                  <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="amount" /></td>
                </tr>
              </tbody>
            </table>            
            <div class="card-body bg-info py-0 text-white">
              需要退票的航段
            </div>
            <table class="table table-sm table-striped mb-1">
              <thead>
                <tr>
                  <th class="px-1 text-center">出发机场</th>
                  <th class="px-1 text-center">到达机场</th>
                  <th class="px-1 text-center">出发日期</th>
                  <th class="px-1 text-center">航班号</th>
                  <th class="px-1 text-center">舱位</th>
                  <th class="px-1 text-center">出发时间</th>
                  <th class="px-1 text-center">到达时间</th>
                  <th>退？</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(flt, index) in flights" :key="index">
                  <td class="text-center">{{flt.dport}}</td>
                  <td class="text-center">{{flt.aport}}</td>
                  <td class="text-center">{{flt.ddate}}</td>
                  <td class="text-center">{{flt.flightNo}}</td>
                  <td class="text-center">{{flt.subclass}}</td>
                  <td class="text-center">{{flt.dtime}}</td>
                  <td class="text-center">{{flt.atime}}</td>
                  <td>
                      <input type="checkbox" v-model="flt.selected">
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="card-body py-0">
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      类型    
                  </label>
                  <div class="col-8">
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="0" v-model.number="reasonCode">
                      <label class="form-check-label">自愿</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="1" v-model.number="reasonCode">
                      <label class="form-check-label">非自愿</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="4" v-model.number="reasonCode">
                      <label class="form-check-label">废</label>
                    </div>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      {{labelReasonDesc}}    
                  </label>
                  <div class="col-8">
                    <input type="text" class="form-control form-control-sm" v-model.trim="reasonDesc" />
                  </div>
              </div>
              <div class="form-group row mb-1" v-if="reasonCode !== 4">
                  <label class="col-form-label col-4 text-right">
                      航司退票费率（%）    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model.number="airRefundFeeRate" />
                      <span class="text-muted small">退票费率，用于计算退票费</span>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      {{labelAirFee}}    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control" v-model.number="airRefundFee" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      我司服务费    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model.number="serviceCharge" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      实收客户   
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control" v-model.number="total" />
                      <span class="text-muted small">实收客户金额，用于计算我司服务费</span>
                  </div>
              </div>                            
              <div class="form-group row mb-1">
                  <label class="col-form-label col-4 text-right">
                      备注    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model="remark" />
                  </div>
              </div>
            </div> 
            <table class="table table-sm table-striped mb-0">
              <thead>
              <tr>
                <th class="text-center">预退客户</th>
                <th class="text-center">航司预退</th>
                <th class="text-center">利润</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{psgRefund}}</td>
                  <td class="text-center">{{airRefund}}</td>
                  <td class="text-center">
                    <template v-if="profit > 0">
                      {{profit}}  
                    </template>
                    <template v-else>
                      <span class="text-danger">{{profit}}</span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click.stop="cancel()">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="ok()">确定</button>
        </div>
      </div>
    </div>                    
  </div>
</template>

<script>
import $ from 'jquery'
import { processPnrFlightContent } from '../api/flight-change.js'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      psgList: [],
      cost: 0,
      amount: 0,
      parvalue: 0,
      tax: 0,
      orderId: 0,
      orderNo: '',
      airRefundFee: 0,
      serviceCharge: 0,
      remark: '',
      reasonCode: 0,
      reasonDesc: '',
      intlTicket: -1,
      flights: [],

      airRefundFeeRate: 0,
      psgRefund: 0,
      airRefund: 0,
      profit: 0,
      total: 0,

      modalTitle: '申请退票',
      labelReasonDesc: '退票备注',
      labelAirFee: '航司退票费'
    }
  },
  watch: {
    airRefundFeeRate: function () {
      this.calc()
    },
    airRefundFee: function () {
      this.calc()
    },
    serviceCharge: function () {
      this.calc()
    },
    reasonCode: function () {
      this.changeOpMode()
    },
    total: function () {
      this.calc2()
    }
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    ok: function () {
      // 检查是否选择了退票的票号
      let psgCount = 0
      for (const psg of this.psgList) {
        if (psg.selected) {
          psgCount++
        }
      }

      if (psgCount === 0) {
        this.showErrMsg('请选择需要退票的票号', 'danger')
        return
      }

      // 检查是否选择了退票航段
      const refundFlights = []
      let count = 0
      for (const flt of this.flights) {
        if (flt.selected) {
          count++
          refundFlights.push(flt)
        }
      }

      if (count === 0) {
        this.showErrMsg('请选择需要退票的航段', 'danger')
        return
      }

      if (this.airRefundFee === 0 && this.serviceCharge === 0 && this.remark.length === 0) {
        this.showErrMsg('航司退（废）票费和我司服务费都为0时，请备注说明理由', 'danger')
        return 
      }

      $(this.$el).modal('hide')
      this.resolve({
        refundTickets: this.psgList,
        parvalue: this.parvalue,
        tax: this.tax,
        amount: this.amount,
        cost: this.cost,
        airRefundFee: this.airRefundFee,
        serviceCharge: this.serviceCharge,
        orderId: this.orderId,
        orderNo: this.orderNo,
        reasonCode: this.reasonCode,
        reasonDesc: this.reasonDesc,
        remark: this.remark,
        intlTicket: this.intlTicket,
        flights: refundFlights
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    reset: function () {
      this.airRefundFeeRate = 0
      this.airRefundFee = 0
      this.serviceCharge = 0
      this.remark = ''
      this.reasonDesc = ''
    },
    modal: function (psgList, orderId, orderNo, flights, intlTicket, amount, cost, parvalue, tax) {
      this.reset()
      this.psgList.splice(0)
      for (const info of psgList) {
        this.psgList.push(info)
      }

      this.amount = amount
      this.cost = cost
      this.parvalue = parvalue
      this.tax = tax

      this.orderId = orderId
      this.orderNo = orderNo
      this.flights.splice(0)
      this.intlTicket = intlTicket
      for (const flt of flights) {
        // console.log(flt)
        this.flights.push({
          dport: flt.flight.departureAirport,
          dportName: flt.flight.departureAirportName,
          dterm: flt.flight.departureTerminal,
          aport: flt.flight.arrivalAirport,
          aportName: flt.flight.arrivalAirportName,
          aterm: flt.flight.arrivalTerminal,
          ddate: flt.flight.departureDate,
          flightNo: flt.flight.flightNo,
          dtime: flt.flight.departureTime,
          atime: flt.flight.arrivalTime,
          subclass: flt.flight.subclass,
          selected: true
        })
      }

      this.calc()

      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    calc: function () {
      if (this.airRefundFeeRate !== 0) {
        this.airRefundFee = this.parvalue * this.airRefundFeeRate / 100
      }
      this.psgRefund = this.amount - this.airRefundFee - this.serviceCharge
      this.airRefund = this.cost - this.airRefundFee
      this.profit = this.airRefund - this.psgRefund

      this.total = this.airRefundFee + this.serviceCharge
    },
    calc2: function () {
      // 实收客户 - 航司服务费 = 我司服务费
      this.serviceCharge = this.total - this.airRefundFee
    },
    changeOpMode: function () {
      if (this.reasonCode === 0 || this.reasonCode === 1) {
        // 退票
        this.modalTitle = '申请退票'
        this.labelReasonDesc = '退票备注'
        this.labelAirFee = '航司退票费'
      } else if (this.reasonCode === 4) {
        // 废票 
        this.modalTitle = '申请废票'
        this.labelReasonDesc = '废票备注'
        this.labelAirFee = '航司废票费'
      }
    }
  }
}
</script>
