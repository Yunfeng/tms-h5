<template>
  <div id="hotel-order-new">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/delivery/notes'>配送单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>      

    <div class="card">      
      <div class="card-body">
        <form id="frmDelivery" role="form" class="form-horizontal">          
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                   订单号   
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model="deliveredOrderNo" />
                <span class="small text-muted">配送单需要配送的内容</span>
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  配送内容    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="deliveryContent" />
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  配送日期    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="deliveryDate" />
                  <span class="small text-muted">日期格式：2019-08-08</span>
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  收件人    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="receiver" />
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  电话    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="mobile" />
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  地址    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="address" />
              </div>
          </div>          
          <div class="form-group row  mb-1">
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
        <button type="button" class="btn btn-primary" @click.stop="save($event.target)">保存</button>
        <button type="button" class="btn btn-secondary btn-sm ml-5" @click.stop="cancel()">取消</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { createDeliveryNote } from '../../api/delivery.js'

  export default {
    props: {
      id: {
        type: String,
        default: 'modalPrompt'
      }
    },
    data () {
      return {
        deliveredOrderNo: '',
        deliveryContent: '',
        deliveryDate: '',
        receiver: '',
        mobile: '',
        address: '',
        remark: ''
      }
    },
    mounted: function () {
      const orderNo = this.$route.query.orderNo
      if (orderNo !== undefined) {
        this.deliveredOrderNo = orderNo
      }     
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      save: function (btn) {
        $(btn).attr('disabled', true)

        const params = {
          'deliveredOrderNo': this.deliveredOrderNo,
          'deliveryContent': this.deliveryContent,
          'deliveryDate': this.deliveryDate,
          'receiver': this.receiver,
          'mobile': this.mobile,
          'address': this.address,
          'remark': this.remark
        }

        createDeliveryNote(params,
          (v) => {
            console.log(v)
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('创建成功')
              const url = '/delivery/note/' + v.returnCode
              console.log(url)
              this.$router.push(url)
            }
          },
          () => { $(btn).attr('disabled', false) }
        )
      },
      reset: function () {
        this.deliveredOrderNo = ''
        this.deliveryContent = ''
        this.deliveryDate = ''
        this.receiver = ''
        this.mobile = ''
        this.address = ''
        this.remark = ''
      },
    }
  }
</script>
