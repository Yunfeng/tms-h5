<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/train/orders'>火车票订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped table-hover small mb-0">
          <thead>
              <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>成本中心</th>
                  <th>项目名称</th>
                  <th>预订人</th>
                  <th>收款方式</th>
                  <th>收款备注</th>
                  <th>收款状态</th>
                  <th>服务费</th>
                  <th>总金额</th>
                  <th>订单状态</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                  <td>
                    {{detail.customerName}}
                  </td>
                  <td>{{detail.costCenter}}</td>
                  <td>{{detail.projectName}}</td>
                  <td>{{detail.operator}}</td>
                  <td>
                    {{getPayTypeDesc(detail.payType)}}
                  </td>
                  <td>{{detail.payRemark}}</td>
                  <td>
                    <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                    <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                    <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                  </td>
                  <td>{{detail.serviceCharge}}</td>
                  <td>{{detail.totalAmount}}</td>
                  <td>{{getStatusDesc(detail.status)}}</td>
              </tr>
          
          </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">车次信息</div>      
        <table class="table table-striped table-hover table-sm small mb-0">
            <thead>
                <tr>
                    <th>出发</th>
                    <th>到达</th>
                    <th class="text-center">日期</th>
                    <th>车次</th>
                    <th>等级</th>
                    <th>票价</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>
                        {{detail.dcity}}
                    </td>                             
                    <td>{{detail.acity}}</td>
                    <td  class="text-center">
                      {{detail.ddate}}
                      <span>{{detail.dtime}} - {{detail.atime}}</span>
                    </td>
                    <td>{{detail.trainNo}}</td>
                    <td>{{detail.seatClass}}</td>
                    <td>{{detail.price}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">乘车人信息</div>      
        <template v-if="detail.passengers.length > 0">
          <table class="table table-striped table-hover table-sm small" >
              <thead>
                  <tr>
                      <th>姓名</th>
                      <th>手机号</th>
                      <th>车厢号</th>
                      <th>座位号</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(psg, index) in detail.passengers">   
                      <td>
                          {{psg.name}}
                      </td>    
                      <td>{{psg.mobile}}</td>
                      <td>{{psg.coachNo}}</td>
                      <td>{{psg.seatNo}}</td>
                  </tr>                               
              </tbody>
          </table>          
        </template>
        <template v-else>
          <table class="table table-striped table-hover table-sm small" >
                  <tr>
                      <td>姓名: {{detail.passengerName}}</td>
                      <td>人数: {{detail.psgCount}}</td>
                  </tr>
          </table>                    
        </template>
        <div class="card-body py-0">
            备注: {{detail.remark}}
            <p>
              外部订单号：{{detail.externalOrderNo}}
            </p>
        </div>
      </div>
      
    </template>

  </div>
  
</template>

<script>
  import { APP_FLIGHT_PATH, SUPPLIER_TRAIN, ORDER_TRAIN } from '../../common/const.js'
  import { showPayType, showPsgType } from '../../common/common.js'

  import { searchTrainOrder, showTrainOrderStatus, searchTrainOrderHistory } from '../../api/train.js'
  import { cancelTrainOrder, processTrainOrder, finishTrainOrder } from '../../api/train.js'
  import { updateTrainOrderPassenger, updateTrainOrderSupplier, updateTrainOrderPayment, updateTrainOrderRemark, updateTrainOrderPrice, updateTrainOrderExternalOrderNo } from '../../api/train.js'

  import { sendOrderSmsContent } from '../../api/sms.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0,
        orderNo: ''
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      psgCount: function () {
        if (this.detail !== null) {
          this.priceInfo.ticketCount = this.detail.passengers.length
          return this.priceInfo.ticketCount
        } else {
          this.priceInfo.ticketCount = 1
          return 1
        }
      },
      orderType: function () {
        return ORDER_TRAIN
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },
      search: function () {
      	searchTrainOrder(this.id, (val) => { this.detail = val })
      },
      getStatusDesc: function (status) {
        return showTrainOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },      
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('操作失败：' + jsonResult.errmsg, 'danger')
        } else {
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
          this.search()
        }
      }
    }
  }
</script>