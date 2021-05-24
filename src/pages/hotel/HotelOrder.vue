<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/hotel/orders'>酒店订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped table-hover small">
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
        <div class="card-body bg-info text-white py-0">酒店信息</div>      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>房型</th>
                    <th>到店日期</th>
                    <th>离店日期</th>
                    <th>房间数</th>
                    <th>销售价</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>
                        {{detail.hotelName}}
                    </td>                             
                    <td>{{detail.roomType}}</td>
                    <td>{{detail.checkInDate}}</td>
                    <td>{{detail.checkOutDate}}</td>
                    <td>{{detail.roomCount}}</td>
                    <td>{{detail.price}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">客人信息</div>      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>姓名</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>
                        {{detail.passengerName}}
                    </td>                             
                </tr>                               
            </tbody>
        </table>
        <div class="card-body py-0">
            备注: {{detail.remark}}
            <ul class="list-inline row">
              <li class="list-inline-item me-auto">最晚到店时间: {{detail.lastArriveTime}}</li>
              <li class="list-inline-item me-auto">联系人: {{detail.linkman}}</li>
              <li class="list-inline-item me-auto">联系电话: {{detail.contactPhone}}</li>
            </ul>
            <ul class="list-inline row">
              <li class="list-inline-item me-auto">价格校验: {{detail.priceCheckedStatus}}, {{detail.priceCheckedTime}}</li>
              <li class="list-inline-item me-auto">指定审批人: {{detail.specifiedApprover}}</li>
              <li class="list-inline-item me-auto">审批结果: {{detail.approvalStatus}}, {{detail.approvalDenyReason}}</li>
              <li class="list-inline-item me-auto">合规性校验: {{detail.violationStatus}}, {{detail.violationReason}}</li>
            </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-body small"> 
          <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 0">
            <button class="btn btn-danger btn-sm ms-autome-auto" @click.stop="cancelOrder()">取消订单</button>
            <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="submitOrder()">提交订单</button>
          </div>
          <div class="d-flex flex-row  justify-content-around" v-else-if="detail.status === 10">
            <button class="btn btn-danger btn-sm ms-autome-auto" @click.stop="cancelOrder()">取消订单</button>
            <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="approveOrder()">审批订单</button>
          </div>
          <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="onlinePay()">支付订单</button>
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

  import { searchHotelOrder, showHotelOrderStatus, cancelHotelOrder, submitHotelOrder, approveHotelOrder, payForHotelOrder } from '../../api/hotel.js'

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
      	searchHotelOrder(this.id, (val) => { this.detail = val })
      },
      getStatusDesc: function (status) {
        return showHotelOrderStatus(status)
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
          cancelHotelOrder(this.id, { remark }, v => this.commonShowMessage(v))

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
        payForHotelOrder(this.detail.id, v => {
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