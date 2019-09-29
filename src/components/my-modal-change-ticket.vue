<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h6 class="modal-title">
            <slot name="title">
              申请改签
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
              <dd class="col-8">{{ticketNo}}<span class="text-danger" v-if="intlTicket === 1">国际</span></dd>
              <dt class="col-4 text-right">乘客姓名</dt>
              <dd class="col-8">{{psgName}}</dd>
              <dt class="col-4 text-right">证件号码</dt>
              <dd class="col-8">{{idNo}}</dd>
            </dl>
            <table class="table table-sm table-striped small mb-0">
              <thead>
              <tr class="bg-info text-white">
                <th class="text-center">销售价</th>
                <th class="text-center">税</th>
                <th class="text-center">成本</th>
                <th class="text-center">实收</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="text-center">{{parvalue}}</td>
                <td class="text-center">{{tax}}</td>
                <td class="text-center">{{cost}}</td>
                <td class="text-center">{{amount}}</td>
              </tr>
              </tbody>
            </table>
            <div class="card-body bg-info py-0 text-white small">
              原航段
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
                <th>改?</th>
              </tr>
              <tr v-for="flt in oriFlights">
                <td>{{flt.dport}}</td>
                <td>{{flt.aport}}</td>
                <td>{{flt.ddate}}</td>
                <td>{{flt.flightNo}}</td>
                <td>{{flt.subclass}}</td>
                <td>{{flt.dtime}}</td>
                <td>{{flt.atime}}</td>
                <td>
                  <input type="checkbox" v-model="flt.selected">
                </td>
              </tr>
            </table>
            <div class="card-body bg-info py-0 text-white small">
              新航段
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
                <th></th>
              </tr>
              <tr v-for="(flt, index) in newFlights">
                <td>{{flt.dport}}</td>
                <td>{{flt.aport}}</td>
                <td>{{flt.ddate}}</td>
                <td>{{flt.flightNo}}</td>
                <td>{{flt.subclass}}</td>
                <td>{{flt.dtime}}</td>
                <td>{{flt.atime}}</td>
                <td><button class="btn btn-sm btn-danger" @click.stop="removeNewFlights(flt.fltId)">删除</button></td>
              </tr>
              <tr>
                <td colspan="7">
                  <input type="text" class="form-control form-control-sm" placeholder="快速录入" v-model.trim="quickInput" />
                  <span class="text-muted small">请sd后复制相应的航段信息，从第一个数字开始复制整行</span>
                </td>
              </tr>
            </table>
            <div class="card-body py-0 small">
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      改签类型    
                  </label>
                  <div class="col-8">
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="0" v-model.number="reasonCode">
                      <label class="form-check-label">升舱</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="1" v-model.number="reasonCode">
                      <label class="form-check-label">更改</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" value="2" v-model.number="reasonCode">
                      <label class="form-check-label">签转</label>
                    </div>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      航司收费    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model.number="airChangeFee" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      我司服务费    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model.number="serviceCharge" />
                      <span class="text-muted small">我司的利润</span>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      实收客户   
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model.number="total" />
                      <span class="text-muted small">实收客户金额，用于计算我司服务费</span>
                  </div>
              </div>              
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      备注    
                  </label>
                  <div class="col-8">
                      <input type="text" class="form-control form-control-sm" v-model="remark" />
                  </div>
              </div>
            </div> 
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

      ticketNo: '',
      psgName: '',
      oldPnrNo: '',
      idNo: '',
      cost: 0,
      amount: 0,
      parvalue: 0,
      tax: 0,
      orderId: 0,
      orderNo: '',
      parentChangeOrderNo: '',
      airChangeFee: 0,
      serviceCharge: 0,
      total: 0,
      remark: '',
      reasonCode: 0,
      intlTicket: -1,
      flights: [],

      quickInput: '',
      fltId: 0,
      changeCount: 0
    }
  },
  computed: {
    oriFlights: function () {
      return this.flights.filter(flt => { return flt.fltType === 0 })
    },
    newFlights: function () {
      return this.flights.filter(flt => { return flt.fltType === 1 })
    }
  },
  watch: {
    quickInput: function (newVal, oldVal) {
      this.processQuickInput()
    },
    serviceCharge: function () {
      this.calc()
    },
    airChangeFee: function () {
      this.calc()
    },
    total: function () {
      this.calc2()
    }
  },
  methods: {
    newId: function () {
      this.fltId = this.fltId + 1
      return this.fltId
    },
    ok: function () {
      const refundFlights = []
      let count = 0
      let newCount = 0
      for (const flt of this.flights) {
        if (flt.selected === false) continue

        if (flt.fltType === 0) {
          count++
        } else {
          newCount++
        }

        refundFlights.push(flt)
      }

      if (count === 0 || newCount === 0) {
        console.log('count: ' + count + ', newCount: ' + newCount)
        return
      }

      $(this.$el).modal('hide')
      this.resolve({
        ticketNo: this.ticketNo,
        changeCount: this.changeCount,
        name: this.psgName,
        idNo: this.idNo,
        parvalue: this.parvalue,
        tax: this.tax,
        amount: this.amount,
        cost: this.cost,
        airChangeFee: this.airChangeFee,
        serviceCharge: this.serviceCharge,
        orderId: this.orderId,
        orderNo: this.orderNo,
        parentChangeOrderNo: this.parentChangeOrderNo,
        reasonCode: this.reasonCode,
        reasonDesc: this.reasonDesc,
        remark: this.remark,
        intlTicket: this.intlTicket,
        oldPnrNo: this.oldPnrNo,
        flights: refundFlights
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    reset: function () {
      this.airChangeFee = 0
      this.serviceCharge = 0
      this.remark = ''
      this.reasonDesc = ''
    },
    modal: function (v) {
      this.reset()
      this.ticketNo = v.ticketNo
      this.psgName = v.psgName
      this.idNo = v.idNo
      this.oldPnrNo = v.oldPnrNo

      this.amount = v.amount
      this.cost = v.cost
      this.parvalue = v.parvalue
      this.tax = v.tax

      this.orderId = v.orderId
      this.orderNo = v.orderNo
      // console.log(v.parentChangeOrderNo)
      if (v.parentChangeOrderNo !== undefined) {
        this.parentChangeOrderNo = v.parentChangeOrderNo
      }

      if (v.changeCount !== undefined) {
        this.changeCount = v.changeCount
      }

      this.flights.splice(0)
      this.intlTicket = v.intlTicket
      for (const flt of v.flights) {
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
          selected: true,
          fltType: 0,
          fltId: this.newId()
        })
      }

      // this.calc()

      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
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
              dterm: v.flight.departureTerminal,
              aport: v.flight.arrivalAirport,
              aportName: v.flight.arrivalAirportName,
              aterm: v.flight.arrivalTerminal,
              ddate: v.flight.departureDate,
              flightNo: v.flight.flightNo,
              dtime: v.flight.departureTime,
              atime: v.flight.arrivalTime,
              subclass: v.flight.subclass,
              selected: true,
              fltType: 1,
              fltId: this.newId()
            })
          }
        })
      }
    },
    removeNewFlights: function (fltId) {
      for (let i = 0; i < this.flights.length; i++) {
        if (this.flights[i].fltId === fltId) {
          this.flights.splice(i, 1)
          return
        }
      }
    },
    calc: function () {
      this.total = this.airChangeFee + this.serviceCharge
    },
    calc2: function () {
      this.serviceCharge = this.total - this.airChangeFee
    }
  }
}
</script>
