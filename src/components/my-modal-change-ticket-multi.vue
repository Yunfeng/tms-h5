<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title">
            <slot name="title">
              机票改签
            </slot>
          </h5>
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
                  <th class="text-center">销售价</th>
                  <th class="text-center">税</th>
                  <th class="text-center">实收</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{parValue}}</td>
                  <td class="text-center">{{tax}}</td>
                  <td class="text-center">{{amount}}</td>
                </tr>
              </tbody>
            </table>
            <div class="card-body bg-secondary py-0 text-white">
              改签前
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
                  <th>改?</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(flt, index) in oldFlights" :key="index">
                  <td class="text-center">{{flt.dport}} <span class="small text-primary">{{flt.dterm}}</span></td>
                  <td class="text-center">{{flt.aport}} <span class="small text-primary">{{flt.aterm}}</span></td>
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
            <div class="card-body bg-primary py-0 text-white">
              改签后
            </div>
            <table class="table table-sm table-striped mb-1">
              <thead>
                <tr>
                  <th class="px-0 text-center" colspan="2">出发/到达机场</th>
                  <th class="px-0 text-center">出发日期</th>
                  <th class="px-0 text-center">航班号</th>
                  <th class="px-0 text-center">舱位</th>
                  <th class="px-0 text-center" colspan="2">出发/到达时间</th>
                  <th class="px-0 text-center" colspan="2">出发/到达航站楼</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>                
                <template v-for="(flt, index) in newFlights">
                  <flt-tr v-bind:flight="flt" v-bind:index="index" v-bind:mini="true" v-on:remove="removeNewFlights(index)"></flt-tr>
                </template>
              </tbody>
            </table>
            <div>
              <div class="row mb-2">
                <div class="col-10">
                  <input type="text" class="form-control form-control-sm" placeholder="快速录入" v-model.trim="quickInput" />
                </div>
                <div class="col-2 px-0 small">
                  <button type="button" class="btn btn-sm btn-info" @click.stop="addNew()">+</button>
                </div>
              </div>
              <span class="text-muted">
                请sd后复制相应的航段信息，从第一个数字开始复制整行。示例如下：<br />
                <pre>2.  ZH9502 Y   MO10JUN  PVGSZX HK1   1135 1420          E T2T3</pre>
              </span>
            </div>
            <div class="card-body py-0">
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
import FltTr from '../components/flt-tr.vue'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  components: {
    FltTr
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      oldPnrNo: '',
      cost: 0,
      amount: 0,
      parValue: 0,
      tax: 0,
      orderId: 0,
      orderNo: '',
      parentChangeOrderNo: '',
      remark: '',
      reasonCode: 0,
      intlTicket: -1,
      psgList: [],

      quickInput: '',
      fltId: 0,

      oldFlights: [],
      newFlights: []
    }
  },
  // computed: {
  //   oriFlights: function () {
  //     return this.flights.filter(flt => { return flt.fltType === 0 })
  //   },
  //   newFlights: function () {
  //     return this.flights.filter(flt => { return flt.fltType === 1 })
  //   }
  // },
  watch: {
    quickInput: function (newVal, oldVal) {
      this.processQuickInput()
    }
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    newId: function () {
      this.fltId = this.fltId + 1
      return this.fltId
    },
    ok: function () {
      // 检查是否选择了签转的票号
      let psgCount = 0
      for (const psg of this.psgList) {
        if (psg.selected) {
          psgCount++
        }
      }

      if (psgCount === 0) {
        this.showErrMsg('请选择需要签转的票号', 'danger')
        return
      }

      const changeFlights = []
      let count = 0
      let newCount = 0
      //原有航班
      for (const flt of this.oldFlights) {
        if (flt.selected === false) continue

        if (flt.fltType === 0) {
          count++
        } else {
          newCount++
        }

        changeFlights.push(flt)
      }

      //新航班
      for (const flt of this.newFlights) {
        if (flt.selected === false) continue

        if (flt.fltType === 0) {
          count++
        } else {
          newCount++
        }

        changeFlights.push(flt)
      }

      // if (count === 0 || newCount === 0) {
      //   this.showErrMsg('请填写签转内容', 'danger')
      //   return
      // }

      $(this.$el).modal('hide')
      this.resolve({
        tickets: this.psgList,
        parValue: this.parValue,
        tax: this.tax,
        amount: this.amount,
        orderId: this.orderId,
        orderNo: this.orderNo,
        parentChangeOrderNo: this.parentChangeOrderNo,
        reasonCode: this.reasonCode,
        reasonDesc: this.reasonDesc,
        remark: this.remark,
        intlTicket: this.intlTicket,
        oldPnrNo: this.oldPnrNo,
        flights: changeFlights
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    reset: function () {
      this.remark = ''
      this.reasonDesc = ''
    },
    modal: function (psgList, v) {
      this.reset()

      this.psgList.splice(0)
      for (const info of psgList) {
        this.psgList.push(info)
      }

      this.oldPnrNo = v.oldPnrNo
      this.amount = v.amount
      this.cost = v.cost
      this.parValue = v.parvalue
      this.tax = v.tax

      this.orderId = v.orderId
      this.orderNo = v.orderNo
      // console.log(v.parentChangeOrderNo)
      if (v.parentChangeOrderNo !== undefined) {
        this.parentChangeOrderNo = v.parentChangeOrderNo
      }
      this.oldFlights.splice(0)
      this.newFlights.splice(0)
      this.intlTicket = v.intlTicket
      for (const flt of v.flights) {
        // console.log(flt)
        this.oldFlights.push({
          dport: flt.dport,
          dportName: flt.dportName,
          dterm: flt.dterm,
          aport: flt.aport,
          aportName: flt.aportName,
          aterm: flt.aterm,
          ddate: flt.ddate,
          flightNo: flt.flightNo,
          dtime: flt.dtime,
          atime: flt.atime,
          subclass: flt.subclass,
          selected: true,
          fltType: 0,
          fltId: this.newId()
        })
      }

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
            // console.log(v)
            this.quickInput = ''
            this.newFlights.push({
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
    addNew: function () {
      this.newFlights.push({
        dport: '',
        dportName: '',
        dterm: '',
        aport: '',
        aportName: '',
        aterm: '',
        ddate: '',
        flightNo: '',
        dtime: '',
        atime: '',
        subclass: '',
        selected: true,
        fltType: 1,
        fltId: this.newId()
      })
    },
    removeNewFlights: function (index) {
      this.newFlights.splice(index, 1)
    }
  }
}
</script>
