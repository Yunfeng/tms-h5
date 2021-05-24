<template>
  <div id="train-ticket-create">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/train/tickets'>火车票</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
      </ol>
    </nav>

    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    企业    
                </label>
                <div class="col-9">
                    <my-select-customer :minId="0" :status="1" :customerId.sync="customerId"></my-select-customer>
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    乘客姓名    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="psgName" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    火车班次    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="trainNo" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    出发地    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="dcity" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    目的地    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="acity" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    日期    
                </label>
                <div class="col-9">
                  <my-date-picker id="ddate" v-model="ddate" sizing="sm"></my-date-picker>
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    座位等级    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="seatClass" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    成本价    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="price" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    服务费    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="serviceCharge" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">
                    实收客户    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.number="amount" />
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">供应商</label>
                <div class="col-9">
                  <my-select-supplier :supplierId.sync="supplierId"></my-select-supplier>
                </div>
              </div>
              <div class="form-group row mb-2">
                <label class="control-label col-3 text-right">支付方式</label>
                <div class="col-9">
                  <my-select-payment :paymentId.sync="paymentId"></my-select-payment>
                </div>
              </div>
            <div class="form-group row mb-2">
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
          <div class="form-check me-auto">
            <input class="form-check-input" type="checkbox" v-model="keepOpening">
            <label class="form-check-label">
              保存成功后继续录入
            </label>
          </div>

            <button type="button" class="btn btn-success btn-lg" @click.stop="createTicket($event.target)">保存</button>
            <button type="button" class="btn btn-secondary btn-sm ml-5" @click.stop="cancel()">取消</button>

        </div>
      </div>
    </div>                    


  </div>	
</template>

<script>
  import $ from 'jquery'
  import MyDatePicker from '../components/my-datepicker.vue'
  
  import MySelectCustomer from '../components/my-select2-customer.vue'

  import { createTrainTicket } from '../api/train.js'
  import MySelectSupplier from '../components/my-select-supplier.vue'
  import MySelectPayment from '../components/my-select-payment.vue'


  export default {
    components: {
      MyDatePicker,
      MySelectCustomer,
      MySelectSupplier,
      MySelectPayment
    },
    data () {
      return {
        customerId: 0,
        psgName: '',
        trainNo: '',
        dcity: '',
        acity: '',
        ddate: '',
        seatClass: '',
        price: 0,
        serviceCharge: 0,
        amount: 0,
        remark: '',
        supplierId: 0,
        paymentId: 0,

        keepOpening: false
      }
    },
    watch: {
      amount: function () {
        this.serviceCharge = this.amount - this.price
      },
      serviceCharge: function () {
        this.amount = this.price + this.serviceCharge
      },
      price: function () {
        this.amount = this.price + this.serviceCharge
      }
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      createTicket: function (btn) {
        $(btn).attr('disabled', true)
        const params = {
          'customerId': this.customerId,
          'psgName': this.psgName,
          'trainNo': this.trainNo,
          'dcity': this.dcity,
          'acity': this.acity,
          'ddate': this.ddate,
          'seatClass': this.seatClass,
          'price': this.price,
          'serviceCharge': this.serviceCharge,
          'remark': this.remark,
          'supplierId': this.supplierId,
          'paymentId': this.paymentId
        }

        createTrainTicket(params,
          (v) => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else if (this.keepOpening === false) {
              this.$router.push('/train/tickets')
            } else {
              this.showErrMsg('保存成功，请继续录入')
              this.psgName = ''
            }
          },
          () => { $(btn).attr('disabled', false) }
        )
      },      
      reset: function () {
        this.customerId = 0
        this.psgName = ''
        this.trainNo = ''
        this.dcity = ''
        this.acity = ''
        this.ddate = ''
        this.seatClass = ''
        this.price = 0
        this.serviceCharge = 0
        this.remark = ''
      },
      cancel: function () {
        this.$router.push('/train/tickets')
      }
    }
  }
</script>