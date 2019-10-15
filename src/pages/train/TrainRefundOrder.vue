<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/train/refund/orders'>火车票退票</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
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
                  <th>处理人</th>
                  <th>收款方式</th>
                  <th>收款备注</th>
                  <th>供应商</th>
                  <th>支付方式</th>
                  <th>收款状态</th>
                  <th>服务费</th>
                  <th>总金额</th>
                  <th>总成本</th>
                  <th>利润</th>
                  <th>订单状态</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                  <td>
                    {{detail.customerName}}
                    <span class="text-danger small">{{detail.customerCode}}</span>
                  </td>
                  <td>{{detail.costCenter}}</td>
                  <td>{{detail.projectName}}</td>
                  <td>{{detail.operator}}</td>
                  <td>{{detail.ticketer}}</td>
                  <td>
                    {{getPayTypeDesc(detail.payType)}}
                  </td>
                  <td>{{detail.payRemark}}</td>
                  <td>
                      {{detail.supplierName}}
                  </td>
                  <td>
                      {{detail.paymentMethodName}}
                  </td>
                  <td>
                    <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                    <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                    <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                  </td>
                  <td>{{detail.serviceCharge}}</td>
                  <td>{{detail.totalAmount}}</td>
                  <td>{{detail.totalCost}}</td>
                  <td>{{detail.profit}}</td>
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
                    <th>实退金额</th>
                    <th>退客金额</th>
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
                    <td>{{detail.cost}}</td>
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
            <template v-if="detail.status !== 2 && detail.status !== 4">
              <a href="javascript:void(0)" @click.stop="editRemark()" class="ml-2" title="修改备注">修改</a>
            </template>
            <p>
              外部订单号：{{detail.externalOrderNo}}
              <template v-if="detail.status !== 2 && detail.status !== 4">
                <a href="javascript:void(0)" @click.stop="editExternalOrderNo()" class="ml-2" title="修改外部订单号">修改</a>
              </template>
            </p>
        </div>
      </div>
      <div class="card">
        <div class="card-body small"> 
          <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 0">
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editPrice()">修改价格</button>
              <button class="btn btn-primary btn-sm ml-auto mr-auto" @click.stop="processOrder()">处理订单</button>
              <button class="btn btn-danger btn-sm ml-automr-auto" @click.stop="cancelOrder()">取消订单</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-else-if="detail.status === 1">
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editPrice()">修改价格</button>
              <button class="btn btn-primary btn-sm ml-auto mr-auto" @click.stop="finishOrder()">处理完毕</button>
              <button class="btn btn-danger btn-sm ml-auto mr-auto" @click.stop="cancelOrder()">取消订单</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 2 && detail.payStatus !== 2">
              <button class="btn btn-danger btn-sm ml-2" @click.stop="rollbackStatus()" v-if="isAdmin">
                回滚
              </button>
            </div>
        </div>
      </div>
      <div class="card">
          <div class="card-header small">
              <a href="javascript:void(0)" class="float-right" @click.stop="viewHistory()">查看历史记录</a>
          </div>
          <table class="table table-sm table-striped small">
              <tr>
                  <td>操作员</td>
                  <td>内容</td>
                  <td>时间</td>
              </tr>
              <tr v-for="info in histories" :key="info.id">
                  <td>{{info.operator}}</td>
                  <td>{{info.content}}</td>
                  <td>{{info.createTime}}</td>
              </tr>
          </table>
      </div>
    </template>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <hotel-update-price-modal ref="hotelUpdatePriceModal"></hotel-update-price-modal>
    
    <modal-common-update ref="modalUpdatePsg">
      <span slot="title">修改</span>
      <span slot="label1">姓名</span>
      <span slot="label2">手机号</span>
      <span slot="label3">车厢号</span>
      <span slot="label4">座位号</span>
    </modal-common-update>
  </div>
  
</template>

<script>
  import { APP_FLIGHT_PATH, SUPPLIER_TRAIN, ORDER_TRAIN } from '../../common/const.js'
  import { showPayType, showPsgType } from '../../common/common.js'

  import { searchTrainRefundOrder, showTrainOrderStatus } from '../../api/train.js'
  import MyModalPrompt from '../../components/my-modal-prompt.vue'

  export default {
    components: {
      MyModalPrompt
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
      	searchTrainRefundOrder(this.id, (val) => { this.detail = val })
      },
      getStatusDesc: function (status) {
        return showTrainOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      editRemark: function () {
        this.modalTitle = '请输入新的备注：'
        this.$refs.modalPrompt.modal().then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            return
          }
          updateTrainRefundOrderRemark(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((r) => {})
      },
      editExternalOrderNo: function () {
        this.modalTitle = '请输入新的外部订单号：'
        this.$refs.modalPrompt.modal().then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            return
          }
          updateTrainRefundOrderExternalOrderNo(this.id, { 'externalOrderNo': remark }, v => this.commonShowMessage(v))
        }).catch((r) => {})
      },
      cancelOrder: function () {
        this.modalTitle = '请输入取消订单的理由：'
        this.$refs.modalPrompt.modal().then(remark => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            this.showErrMsg('请填写取消订单的理由')
            return
          }
          cancelTrainRefundOrder(this.id, { remark }, v => this.commonShowMessage(v))

        }).catch((r) => {})
      },
      editPrice: function () {
        this.$refs.hotelUpdatePriceModal.modal(this.detail.price, this.detail.cost, this.detail.serviceCharge)
          .then(v => this.doUpdatePrice(v)).catch(() => {})
      },
      doUpdatePrice: function (v) {
        const params = {
          'price': v.price,
          'cost': v.cost,
          'serviceCharge': v.serviceCharge
        }

        updateTrainRefundOrderPrice(this.id, params, v => this.commonShowMessage(v))
      },
      processOrder: function () {
        processTrainRefundOrder(this.id, v => this.commonShowMessage(v))
      },
      finishOrder: function () {
        this.modalTitle = '请输入完成备注：'
        this.$refs.modalPrompt.modal().then(remark => {
          if (remark === '') {
            return
          }
          finishTrainRefundOrder(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((r) => {})
      },
      viewHistory: function () {
        searchTrainRefundOrderHistory(this.id, (jsonResult) => { this.histories = jsonResult })
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
      },
      rollbackStatus: function () {
        this.modalTitle = '确定将订单回滚吗？请输入理由：'

        this.$refs.modalPrompt.modal().then((remark) => {
          rollbackTrainRefundOrderStatus(this.id, 
            { remark }, 
            v => this.commonShowMessage(v)
          )
        }).catch((ex) => { console.log(ex) })
      }      
    }
  }
</script>