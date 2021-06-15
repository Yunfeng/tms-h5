<template>
  <div id="hotel-order-new">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/hotel/orders'>酒店订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>       
    
    <div class="card">
      <div class="card-body bg-info text-white py-1">
        酒店信息
      </div>                  
      <table class="table table-sm mb-0">
        <thead>
          <tr class="small">
              <th>酒店名称</th>
              <th>房型</th>
              <th>房间数量</th>
              <th>入住日期</th>
              <th>离店日期</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="form-control" v-model="hotelName" /></td>
            <td><input type="text" class="form-control" v-model="roomType" /></td>
            <td><input type="text" class="form-control" v-model.number="roomCount" /></td>
            <td><my-date-picker id="checkInDate" v-model="checkInDate"></my-date-picker></td>
            <td><my-date-picker id="checkOutDate" v-model="checkOutDate"></my-date-picker></td>
          </tr>
        </tbody>
      </table>
      <div class="card-body bg-info text-white py-1">
        入住人信息        
      </div>                  
      <table class="table table-sm mb-0">
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in passengers">
            <td><input type="text" class="form-control" v-model="info.name" /></td>
            <td><input type="text" class="form-control" v-model="info.mobile" /></td>
            <th>
              <a href="javascript:void(0);" @click.stop="addPsg()" class="btn btn-sm btn-success" v-if="index ===0">增加</a>
              <a href="javascript:void(0);" @click.stop="delPsg(index)" class="btn btn-sm btn-danger" v-if="index > 0">移除</a>
            </th>
          </tr>
        </tbody>
      </table>
      <div class="card-body bg-info text-white py-1">
        价格信息        
      </div>                  
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>销售价/间夜<input type="text" class="form-control" v-model.number="price" /></td>
            <td>底价/间夜<input type="text" class="form-control" v-model.number="bottomPrice" /></td>
            <td>服务费 <input type="text" class="form-control" v-model.number="serviceCharge" /></td>
          </tr>
          <tr>
            <td>实收总额: <big class="text-success">{{totalAmount}}</big></td>
            <td>总成本: {{totalCost}}</td>
            <td>利润: <big class="text-danger">{{profit}}</big></td>            
          </tr>
        </tbody>
      </table>  
      <div class="card-body py-2">
        <select-customer 
          :customerId.sync="customerId"
          :costCenter.sync="costCenter"
          :projectName.sync="projectName"
        >          
        </select-customer>        
      </div>
      <div class="card-body py-2">
          <div class=" row  mb-1">
            <label class="control-label col-3 text-right">供应商*</label>
            <div class="col-9">
              <my-select-supplier :supplierId.sync="supplierId" :supplierType="supplierType"></my-select-supplier>
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
                  备注    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="remark" />
              </div>
          </div>
      </div>
      <div class="card-footer text-center">
        <button type="button" class="btn btn-success btn-lg" @click.stop="save($event.target)">保存</button>
        <button type="button" class="btn btn-secondary btn-sm ml-5" @click.stop="cancel()">取消</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import moment from 'moment'
  import { SUPPLIER_HOTEL } from '../../common/const.js'
  import { createHotelOrder } from '../../api/hotel.js'
  import { searchNotesByCustomer } from '../../api/customer.js'

  import MyDatePicker from '../../components/my-datepicker.vue'
  import MySelectSupplier from '../../components/my-select-supplier.vue'
  import MySelectPayment from '../../components/my-select-payment.vue'
  import MySelectIncome from '../../components/my-select-income.vue'

  import SelectCustomer from '../../components/select-customer-costcenter.vue'

  export default {
    props: {
      id: {
        type: String,
        default: 'modalPrompt'
      }
    },
    components: {
      MySelectSupplier,
      MySelectPayment,
      MyDatePicker,
      MySelectIncome,

      SelectCustomer
    },
    data () {
      return {
        supplierId: 0,
        paymentId: 0,

        customerId: 0,
        costCenter: '',
        projectName: '',
        passengers: [],
        hotelName: '',
        roomType: '',
        roomCount: 1,
        checkInDate: '',
        checkOutDate: '',
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
    computed: {
      supplierType: function () {
        return SUPPLIER_HOTEL
      },
      psgCount: function () { return this.passengers.length }
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
      checkInDate: function () {
        this.calc()
      },
      checkOutDate: function () {
        this.calc()
      },
      roomCount: function () {
        this.calc()
      }
    },
    mounted: function () {
      // console.log('mounted')
      // this.init()
      this.addPsg()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      init: function () {
        this.customerId = 0
        this.hotelName = '上海便宜酒店'
        this.passengerName = '张三'
        this.checkInDate = '2018-12-28'
        this.checkOutDate = '2018-12-31'
        this.roomType = "标准间"

        this.calc()
      },
      addPsg: function () {
        this.passengers.push({
          'name': '',
          'mobile': '',
          'coachNo': '',
          'seatNo': ''
        })
      },
      delPsg: function (index) {
        this.passengers.splice(index, 1)
      },
      save: function (btn) {
        $(btn).attr('disabled', true)
        const params = {
          'customerId': this.customerId,
          'costCenter': this.costCenter,
          'projectName': this.projectName,
          // 'passengerName': this.passengerName,
          'hotelName': this.hotelName,
          'roomType': this.roomType,
          'roomCount': this.roomCount,
          'checkInDate': this.checkInDate,
          'checkOutDate': this.checkOutDate,
          'price': this.price,
          'bottomPrice': this.bottomPrice,
          'serviceCharge': this.serviceCharge,
          'remark': this.remark,
          'supplierId': this.supplierId,
          'paymentMethodId': this.paymentId,
          'payType': this.payType,
          'payRemark': this.payRemark,
          'count': this.count,
          'totalAmount': this.totalAmount,
          'totalCost': this.totalCost,
          'profit': this.profit,
          'passengers': this.passengers
        }

        createHotelOrder(JSON.stringify(params),
          (v) => {
            console.log(v)
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('创建成功')
              const url = '/hotel/order/' + v.returnCode
              console.log(url)
              this.$router.push(url)
            }
          },
          () => { $(btn).attr('disabled', false) }
        )
      },
      reset: function () {
        this.customerId = 0
        this.costCenter = ''
        this.projectName = ''
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
      calc: function () {
        console.log('calc')
        if (isNaN(this.roomCount) || !moment(this.checkInDate).isValid() || !moment(this.checkOutDate).isValid) {
          console.error(this.roomCount + ', ' + this.checkInDate + ', ' + this.checkOutDate)
          return
        }

        const days = moment(this.checkOutDate).diff(moment(this.checkInDate), 'days')
        if (isNaN(days) || days < 1) {
          return
        }

        this.count = this.roomCount * days
        
        this.totalAmount = this.count * this.price + this.serviceCharge
        this.totalAmount = Math.round(this.totalAmount * 100) / 100

        this.totalCost = this.bottomPrice * this.count
        this.totalCost = Math.round(this.totalCost * 100) / 100

        this.profit = this.totalAmount - this.totalCost
        this.profit = Math.round(this.profit * 100) / 100
      }
    }
  }
</script>
