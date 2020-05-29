<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/attractions/ticket/orders'>门票订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped table-hover small">
          <thead>
              <tr>
                  <th>订单号</th>
                  <th>景点</th>
                  <th>预订人</th>
                  <th>单价</th>
                  <th>张数</th>
                  <th>总金额</th>
                  <th>付款状态</th>
                  <th>订单状态</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                  <td>
                    {{detail.attractionName}}
                  </td>
                  <td>{{detail.operator}}</td>
                  
                  <td>{{detail.price}}</td>
                  <td>{{detail.count}}</td>
                  <td>{{detail.total}}</td>
                  <td>
                    <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                    <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                    <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                  </td>
                  <td>{{getStatusDesc(detail.status)}}</td>
              </tr>
          
          </tbody>
        </table>
       
        <div class="card-body bg-info text-white py-0">游客信息</div>      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>证件号</th>
                    <th>手机</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="info in detail.passengers">   
                    <td>
                        {{info.name}}
                    </td>   
                    <td>
                        {{info.idNo}}
                    </td>   
                    <td>
                        {{info.mobile}}
                    </td>                             
                </tr>                               
            </tbody>
        </table>
        
      </div>

      <div class="card">
        <div class="card-body small"> 
          <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 0">
            <button class="btn btn-danger btn-sm ml-automr-auto" @click.stop="cancelOrder()">取消订单</button>
            <button class="btn btn-primary btn-sm ml-auto mr-auto" @click.stop="onlinePay()">支付订单</button>
          </div>
          
        </div>
      </div>
      
    </template>

    <div id="paymentForm" ></div>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-confirm ref="confirmModal"></my-modal-confirm>

  </div>
  
</template>

<script>
  import MyModalPrompt from '../../components/my-modal-prompt.vue'
  import MyModalConfirm from '../../components/my-modal-prompt-confirm.vue'
  import { APP_FLIGHT_PATH, SUPPLIER_HOTEL } from '../../common/const.js'
  import { showPayType, showPsgType } from '../../common/common.js'

  import { searchTicketOrders, getTicketOrder, showTicketOrderStatus, cancelTicketOrder, payTicketOrder } from '../../api/attraction.js'

  export default {
    components: {
      MyModalPrompt,
      MyModalConfirm
    },
    data () {
      return {
        detail: null,
        id: 0,
        orderNo: '',

        modalTitle: '',
        modalNullable: false,

        histories: []
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
      supplierId: function () {
        return this.detail.supplierId
      },
      payMethodId: function () {
        return this.detail.paymentMethodId
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
      	getTicketOrder(this.id, (val) => { this.detail = val })
      },
      getStatusDesc: function (status) {
        return showTicketOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      cancelOrder: function () {
        this.modalTitle = '请输入取消订单的理由：'
        this.$refs.modalPrompt.modal().then(remark => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            this.showErrMsg('请填写取消订单的理由')
            return
          }
          cancelTicketOrder(this.id, { remark }, v => this.commonShowMessage(v))

        }).catch((r) => {})
      },
      submitOrder: function () {
        submitHotelOrder(this.id, v => this.commonShowMessage(v))
      },
      approveOrder: function () {
        this.$refs.confirmModal.modal('酒店订单审批')
          .then(v => {
              this.showLoading('处理中')
              const params = {
                'denyCode': v.denyCode,
                'denyReason': v.denyReason
              }
              approveHotelOrder(this.id, params, v => this.commonShowMessage(v), () => this.hideLoading())
          })
          .catch(ex => {})
      },
      submitOrder: function () {
        submitHotelOrder(this.id, v => this.commonShowMessage(v))
      },
      onlinePay: function () {
        payTicketOrder(this.detail.id, v => {
          if (v.status === 'OK') {
            this.showErrMsg('如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。', 'info')
            console.log(v.url)
            $('#paymentForm').empty().html(v.url)
            document.forms['alipaysubmit'].submit()            
          } else {
            this.showErrMsg(v.errmsg, 'danger')
          }
        })
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