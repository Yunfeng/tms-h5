<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="title">
              酒店预订录入
            </slot>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    企业*    
                </label>
                <div class="col-9">
                    <my-select-customer :minId="0" :status="1" :customerId.sync="customerId"></my-select-customer>
                </div>
            </div>
            <div class=" row  mb-1" v-if="costCenters.length > 0">
              <label class="col-3 control-label text-right">成本中心</label>
              <div class="col-9">
                <select class="form-control" v-model="costCenter">
                  <option value="">请选择</option>
                  <option :value="info.name" v-for="info in costCenters">{{info.name}}</option>
                </select>
              </div>
            </div>
            <div class=" row  mb-1" v-if="projectNames.length > 0">
              <label class="col-3 control-label text-right">项目名称</label>
              <div class="col-9">
                <select class="form-control" v-model="projectName">
                  <option value="">请选择</option>
                  <option :value="info.name" v-for="info in projectNames">{{info.name}}</option>
                </select>
              </div>
            </div>

            <div class=" row mb-1">
              <label class="control-label col-3 text-right">
                  入住人*    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="psgName" />
              </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    酒店名称*    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="hotelName" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    房型*    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="roomType" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    房间数量*    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="roomCount" />
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    入住日期*    
                </label>
                <div class="col-9">
                  <my-date-picker id="ddate" v-model="ddate" sizing="sm"></my-date-picker>
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    离店日期*    
                </label>
                <div class="col-9">
                  <my-date-picker id="leaveDate" v-model="leaveDate" sizing="sm"></my-date-picker>
                </div>
            </div>
            
            <div class=" row  mb-1">
              <label class="control-label col-3 text-right">供应商*</label>
              <div class="col-9">
                <my-select-supplier :supplierId.sync="supplierId"></my-select-supplier>
              </div>
            </div>
            <div class=" row mb-1">
              <label class="control-label col-3 text-right">支出方式*</label>
              <div class="col-9">
                <my-select-payment :paymentId.sync="paymentId"></my-select-payment>
                <span class="small text-muted">成本支出方式</span>
              </div>
            </div>
            <div class=" row  mb-1">
              <label class="col-3 control-label text-right">收款方式*</label>
              <div class="col-9">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="1" v-model.number="payType">
                  <label class="form-check-label">现金</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="2" v-model.number="payType">
                  <label class="form-check-label">信用卡</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="4" v-model.number="payType">
                  <label class="form-check-label">支票</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="8" v-model.number="payType">
                  <label class="form-check-label">账单</label>
                </div>
              </div>
            </div>
            <div class=" row  mb-1">
              <label class="col-3 control-label text-right">收款备注</label>
              <div class="col-9">
                <my-select-income :incomeRemark.sync="payRemark"></my-select-income>
                <span class="small text-muted">客户付款的具体途径</span>
              </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    销售价/间夜    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="price" />
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    底价/间夜    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="bottomPrice" />
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    服务费    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="serviceCharge" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right mb-0">
                    间夜数    
                </label>
                <div class="col-9">
                    {{count}}
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right mb-0">
                    实收总额    
                </label>
                <div class="col-9">
                    {{totalAmount}}
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right mb-0">
                    总成本    
                </label>
                <div class="col-9">
                    {{totalCost}}
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right mb-0">
                    利润    
                </label>
                <div class="col-9">
                    {{profit}}
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    备注    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="remark" />
                </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click.stop="cancel()">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="createTicket($event.target)">保存</button>
        </div>
      </div>
    </div>                    
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import { createHotelBill } from '../api/hotel.js'
import { searchNotesByCustomer } from '../api/customer.js'
import MySelectCustomer from '../components/my-select-customer.vue'
import MyDatePicker from '../components/my-datepicker.vue'
import MySelectSupplier from '../components/my-select2-supplier.vue'
import MySelectPayment from '../components/my-select-payment.vue'
import MySelectIncome from '../components/my-select-income.vue'

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
    MySelectPayment,
    MyDatePicker,
    MySelectIncome
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      costCenters: [],
      projectNames: [],

      supplierId: 0,
      paymentId: 0,

      customerId: 0,
      costCenter: '',
      projectName: '',
      psgName: '',
      hotelName: '',
      roomType: '',
      roomCount: 1,
      ddate: '',
      leaveDate: '',
      price: 0,
      bottomPrice: 0,
      serviceCharge: 0,
      remark: '',
      payType: 8,
      payRemark: '',
      count: 0,
      totalAmount: 0,
      totalCost: 0,
      profit: 0
    }
  },
  watch: {
    customerId: function (newVal) {
      this.getCostCenters()
    },
    serviceCharge: function () {
      this.calc()
    },
    price: function () {
      this.calc()
    },
    bottomPrice: function () {
      this.calc()
    },
    ddate: function () {
      this.calc()
    },
    leaveDate: function () {
      this.calc()
    },
    roomCount: function () {
      this.calc()
    }
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    ok: function (v) {
      $(this.$el).modal('hide')
      this.resolve(v)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    createTicket: function (btn) {
      $(btn).attr('disabled', true)
      const params = {
        'customerId': this.customerId,
        'costCenter': this.costCenter,
        'projectName': this.projectName,
        'psgName': this.psgName,
        'hotelName': this.hotelName,
        'roomType': this.roomType,
        'roomCount': this.roomCount,
        'ddate': this.ddate,
        'leaveDate': this.leaveDate,
        'price': this.price,
        'bottomPrice': this.bottomPrice,
        'serviceCharge': this.serviceCharge,
        'remark': this.remark,
        'supplierId': this.supplierId,
        'paymentId': this.paymentId,
        'payType': this.payType,
        'payRemark': this.payRemark,
        'count': this.count,
        'totalAmount': this.totalAmount,
        'totalCost': this.totalCost,
        'profit': this.profit
      }

      createHotelBill(params,
        (v) => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.ok(v)
          }
        },
        () => { $(btn).attr('disabled', false) }
      )
    },
    reset: function () {
      this.customerId = 0
      this.costCenter = ''
      this.projectName = ''
      this.psgName = ''
      this.hotelName = ''
      this.roomType = ''
      this.roomCount = 1
      this.ddate = ''
      this.leaveDate = ''
      this.price = 0
      this.serviceCharge = 0
      this.remark = ''
      this.payType = 0
      this.payRemark = ''
    },
    getCostCenters: function () {
      this.costCenter = ''
      this.projectName = ''
      this.costCenters.splice(0)
      this.projectNames.splice(0)
      if (this.customerId < 1) return

      searchNotesByCustomer(this.customerId, (jsonResult) => {
        for (const info of jsonResult) {
          if (info.noteType === 100) {
            this.costCenters.push(info)
          } else if (info.noteType === 200) {
            this.projectNames.push(info)
          }
        }
      })
    },
    calc: function () {
      if (isNaN(this.roomCount) || !moment(this.ddate).isValid() || !moment(this.leaveDate).isValid) {
        console.error(this.roomCount + ', ' + this.ddate + ', ' + this.leaveDate)
        return
      }

      const days = moment(this.leaveDate).diff(moment(this.ddate), 'days')
      if (isNaN(days) || days < 1) {
        return
      }

      this.count = this.roomCount * days
      this.totalAmount = this.count * this.price + this.serviceCharge
      this.totalCost = this.bottomPrice * this.count
      this.profit = this.totalAmount - this.totalCost
    },
    modal: function () {
      this.reset()

      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
