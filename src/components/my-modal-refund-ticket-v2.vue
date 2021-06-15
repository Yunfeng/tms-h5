<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              申请退(废）票
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body py-0">
          <div class="card py-0">
            <dl class="row mb-0">
              <dt class="col-4 text-right">票号</dt>
              <dd class="col-8">
                <input type="text" v-model.trim="ticketNo" />
                <select v-model.number="intlTicket">
                  <option value="0">国内</option>
                  <option value="1">国际</option>
                </select>
              </dd>
              <dt class="col-4 text-right">乘客姓名</dt>
              <dd class="col-8">
                <input type="text" v-model.trim="psgName" />
              </dd>
              <dt class="col-4 text-right">证件号码</dt>
              <dd class="col-8">
                <input type="text" v-model.trim="idNo" />
              </dd>
            </dl>
            <table class="table table-sm table-striped small mb-0">
              <tr>
                <th>销售价</th>
                <th>税</th>
                <th>成本</th>
                <th>实收</th>
              </tr>
              <tr>
                <td class="text-center"><input type="text" class="form-control form-control-sm"v-model.number="parvalue" /></td>
                <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="tax" /></td>
                <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.number="cost" /></td>
                <td class="text-center"><input type="text" class="form-control form-control-sm" v-model.amount="amount" /></td>
              </tr>
            </table>
            <div class="card-body">
              <div class=" row mb-0 mt-1">
                <label>客户</label>
                <my-select-customer :customerId.sync="customerId"></my-select-customer>
              </div>
              <div class=" row mb-0 mt-1">
                <label>供应商</label>
                <my-select-supplier :supplierId.sync="supplierId"></my-select-supplier>
              </div>
              <div class=" row mb-0 mt-1">
                <label>支付方式</label>
                <my-select-payment :paymentId.sync="paymentId"></my-select-payment>
              </div>

            </div>
            <div class="card-body bg-info py-0 text-white">
              需要退票的航段
            </div>
            <table class="table table-sm table-striped small">
              <tr>
                <th>出发机场</th>
                <th>到达机场</th>
                <th>出发日期</th>
                <th>航班号</th>
                <th>舱位</th>
                <th>出发时间</th>
                <th>到达时间</th>
                <th>退？</th>
              </tr>
              <tr v-for="flt in flights">
                <td>{{flt.dport}}</td>
                <td>{{flt.aport}}</td>
                <td>{{flt.ddate}}</td>
                <td>{{flt.flightNo}}</td>
                <td>{{flt.subclass}}</td>
                <td>{{flt.dtime}}</td>
                <td>{{flt.atime}}</td>
                <td>
                  <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="flt.selected">
                  </label>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <input type="text" class="form-control form-control-sm" placeholder="快速录入" v-model.trim="quickInput" />
                  <span class="text-muted small">请sd后复制相应的航段信息，从第一个数字开始复制整行</span>
                </td>
              </tr>
            </table>
            <div class="card-body py-0">
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      退（废）票类型    
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
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      退(废）票备注    
                  </label>
                  <div class="col-md-6">
                    <input type="text" class="form-control form-control-sm" v-model.trim="reasonDesc" />
                  </div>
              </div>
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      航司退票费率（%）    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control form-control-sm" v-model.number="airRefundFeeRate" />
                      <span class="text-muted small">退票费率，用于计算退票费</span>
                  </div>
              </div>
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      航司退(废）票费    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control form-control-sm" v-model.number="airRefundFee" />
                  </div>
              </div>
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      代理服务费    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control form-control-sm" v-model.number="serviceCharge" />
                  </div>
              </div>
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      备注    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control form-control-sm" v-model="remark" />
                  </div>
              </div>
            </div> 
            <table class="table table-sm table-striped small mb-0">
              <tr>
                <th class="text-center">预退客户</th>
                <th class="text-center">航司预退</th>
                <th class="text-center">利润</th>
              </tr>
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
import MySelectCustomer from '../components/my-select2-customer.vue'
import MySelectSupplier from '../components/my-select-supplier.vue'
import MySelectPayment from '../components/my-select-payment.vue'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  components: {
    MySelectCustomer,
    MySelectSupplier,
    MySelectPayment
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      customerId: 0,
      supplierId: 0,
      paymentId: 0,
      ticketNo: '',
      psgName: '',
      idNo: '',
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

      quickInput: ''
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
    quickInput: function (newVal, oldVal) {
      this.processQuickInput()
    },
    customerId: function () {
      console.log(this.customerId)
    }
  },
  methods: {
    ok: function () {
      const refundFlights = []
      let count = 0
      for (const flt of this.flights) {
        if (flt.selected) {
          count++
          // console.log(flt)
          refundFlights.push(flt)
        }
      }

      if (count === 0) return

      $(this.$el).modal('hide')
      this.resolve({
        customerId: this.customerId,
        supplierId: this.supplierId,
        paymentId: this.paymentId,
        ticketNo: this.ticketNo,
        name: this.psgName,
        idNo: this.idNo,
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
    modal: function (ticketNo, psgName, idNo, orderId, orderNo, flights, intlTicket, amount, cost, parvalue, tax) {
      this.reset()
      this.ticketNo = ticketNo
      this.psgName = psgName
      this.idNo = idNo

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
          aport: flt.flight.arrivalAirport,
          aportName: flt.flight.arrivalAirportName,
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
    },
    processQuickInput: function () {
      if (this.quickInput.length < 6) {
        return
      }
      const idx = this.quickInput.indexOf('.')
      // console.log(idx)
      if (idx > 0) {
        processPnrFlightContent({ content: this.quickInput }, v => {
          if (v !== null && v.flight !== null) {
            console.log(v)
            this.quickInput = ''
            this.flights.push({
              dport: v.flight.departureAirport,
              dportName: v.flight.departureAirportName,
              aport: v.flight.arrivalAirport,
              aportName: v.flight.arrivalAirportName,
              ddate: v.flight.departureDate,
              flightNo: v.flight.flightNo,
              dtime: v.flight.departureTime,
              atime: v.flight.arrivalTime,
              subclass: v.flight.subclass,
              selected: true
            })
          }
        })
      }
    }
  }
}
</script>
