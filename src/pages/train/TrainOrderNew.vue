<template>
  <div id="train-ticket-create">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/train/orders'>火车票</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card">
      <div class="card-body bg-info text-white py-1">
        车次信息
      </div>                  
      <table class="table table-sm mb-0">
        <thead>
          <tr class="small">
              <th>火车班次</th>
              <th>出发站</th>
              <th>到达站</th>
              <th>出发日期</th>
              <th>开车时间</th>
              <th>到站时间</th>
              <th>座位等级</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="form-control" v-model="trainNo" /></td>
            <td><input type="text" class="form-control" v-model="dcity" /></td>
            <td><input type="text" class="form-control" v-model="acity" /></td>
            <td><my-date-picker id="ddate" v-model="ddate" sizing=""></my-date-picker></td>
            <td><input type="text" class="form-control" v-model="dtime" /></td>
            <td><input type="text" class="form-control" v-model="atime" /></td>
            <td><input type="text" class="form-control" v-model="seatClass" /></td>
          </tr>
        </tbody>
      </table>
      <div class="card-body bg-info text-white py-1">
        乘车人信息        
      </div>                  
      <table class="table table-sm mb-0">
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机</th>
            <th>车厢号</th>
            <th>座位号</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in passengers">
            <td><input type="text" class="form-control" v-model="info.name" /></td>
            <td><input type="text" class="form-control" v-model="info.mobile" /></td>
            <td><input type="text" class="form-control" v-model="info.coachNo" /></td>
            <td><input type="text" class="form-control" v-model="info.seatNo" /></td>
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
            <td>销售价/人 <input type="text" class="form-control" v-model.number="price" /></td>
            <td>成本价/人 <input type="text" class="form-control" v-model.number="cost" /></td>
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
         <form id="frmUser" role="form" class="form-horizontal">
              <div class=" row mb-2">
                <label class="control-label col-3 text-right">供应商</label>
                <div class="col-9">
                  <my-select-supplier :supplierId.sync="supplierId"></my-select-supplier>
                </div>
              </div>
              <div class=" row mb-2">
                <label class="control-label col-3 text-right">支付方式</label>
                <div class="col-9">
                  <my-select-payment :paymentId.sync="paymentId"></my-select-payment>
                </div>
              </div>
            <div class=" row mb-2">
                <label class="control-label col-3 text-right">
                    外部订单号    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="externalOrderNo" />
                </div>
            </div>
            <div class=" row mb-2">
                <label class="control-label col-3 text-right">
                    备注    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="remark" />
                </div>
            </div>
          </form>
      </div>
      <div class="card-footer text-center">
        <div class=" form-check">
          <input type="checkbox" class="form-check-input" v-model="keepOpening">
          <label class="form-check-label">成功后继续录入</label>
        </div>
            <button type="button" class="btn btn-success btn-lg" @click.stop="save($event.target)">保存</button>
            <button type="button" class="btn btn-secondary btn-sm ml-5" @click.stop="cancel()">取消</button>
      </div>
    </div>
  </div>	
</template>

<script>
  import $ from 'jquery'
  import MyDatePicker from '../../components/my-datepicker.vue'
  
  import { createTrainOrder } from '../../api/train.js'
  import MySelectSupplier from '../../components/my-select-supplier.vue'
  import MySelectPayment from '../../components/my-select-payment.vue'

  import SelectCustomer from '../../components/select-customer-costcenter.vue'


  export default {
    components: {
      MyDatePicker,
      MySelectSupplier,
      MySelectPayment,

      SelectCustomer
    },
    data () {
      return {
        customerId: 0,
        costCenter: '',
        projectName: '',

        trainNo: '',
        dcity: '',
        acity: '',
        ddate: '',
        dtime: '',
        atime: '',
        seatClass: '',
        passengers: [],
        price: 0,
        cost: 0,
        serviceCharge: 0,
        totalAmount: 0,
        totalCost: 0,
        profit: 0,
        remark: '',
        externalOrderNo: '',
        supplierId: 0,
        paymentId: 0,

        keepOpening: false
      }
    },
    computed: {
      psgCount: function () { return this.passengers.length }
    },
    watch: {
      cost: function () {
        this.calc()
      },
      serviceCharge: function () {
        this.calc()
      },
      price: function () {
        this.calc()
      },
      psgCount: function () {
        this.calc()
      }
    },
    mounted: function () {
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
        this.trainNo = 'K89'
        this.ddate = '2018-12-28'
        this.dtime = '10:05'
        this.atime = '15:35'
        this.dcity = '上海南'
        this.acity = '北京西'
        this.seatClass = '二'
        this.price = 28
        this.cost = 28
        this.serviceCharge = 5


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
          
          'trainNo': this.trainNo,
          'dcity': this.dcity,
          'acity': this.acity,
          'ddate': this.ddate,
          'dtime': this.dtime,
          'atime': this.atime,
          'seatClass': this.seatClass,
          'price': this.price,
          'cost': this.cost,
          'serviceCharge': this.serviceCharge,
          'supplierId': this.supplierId,
          'paymentId': this.paymentId,
          'totalAmount': this.totalAmount,
          'totalCost': this.totalCost,
          'profit': this.profit,
          'remark': this.remark,
          'externalOrderNo': this.externalOrderNo,
          'passengers': this.passengers
        }

        createTrainOrder(JSON.stringify(params),
          (v) => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else if (this.keepOpening === false) {
              this.$router.push('/train/orders')
            } else {
              this.showErrMsg('保存成功，请继续录入')
            }
          },
          () => { $(btn).attr('disabled', false) }
        )
      },     
      calc: function () {
        this.totalAmount = this.psgCount * this.price + this.serviceCharge
        this.totalCost = this.psgCount * this.cost
        this.profit = this.totalAmount - this.totalCost
      },
      reset: function () {
        this.customerId = 0
        this.trainNo = ''
        this.dcity = ''
        this.acity = ''
        this.ddate = ''
        this.dtime = ''
        this.atime = ''
        this.seatClass = ''
        this.price = 0
        this.serviceCharge = 0
        this.remark = ''
      },
      cancel: function () {
        this.$router.push('/train/orders')
      }
    }
  }
</script>