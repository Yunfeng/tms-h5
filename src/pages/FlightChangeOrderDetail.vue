<template>
  <div id="flight-refund-order-detail">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item"><router-link to='/flt/change/orders'>改签单</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped">
          <thead>
              <tr>
                  <th>改签单号</th>
                  <th class="text-center">票号</th>
                  <th>原编码</th>
                  <th>乘客</th>
                  <th class="text-center">证件号</th>
                  <th class="text-right">销售价</th>
                  <th class="text-right">税</th>
                  <th class="text-right">航司改签费</th>
                  <th class="text-right">我司服务费</th>
                  <th>操作员</th>
                  <th>处理人</th>
                  <th>新编码</th>
                  <th>新票号</th>
                  <th>状态</th>
                  <th>提交时间</th>                  
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.changeOrderNo}}</td>
                  <td class="text-center">{{detail.balanceCode}}-{{detail.ticketNo}}</td>
                  <td>{{detail.oldPnrNo}}</td>
                  <td>{{detail.psgName}}</td>
                  <td class="text-center">{{detail.idNo}}</td>
                  <td class="text-right">{{detail.parvalue}}</td>
                  <td class="text-right">{{detail.tax}}</td>
                  <td class="text-right">{{detail.airChangeCharge}}</td>
                  <td class="text-right">{{detail.serviceCharge}}</td>
                  <td>{{detail.operator}}</td>                
                  <td>{{detail.ticketer}}</td>                
                  <td>{{detail.newPnrNo}}</td>
                  <td>{{detail.newTicketNo}}
                  </td>
                  <td>
                    {{getStatus(detail.status)}}
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>                
                  <td>{{detail.createTime}}</td>                  
              </tr>
          </tbody>
        </table>
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>公司名称</th>
              <th>原订单号</th>
              <th>国际?</th>
              <th>付款方式</th>
              <th>付款备注</th>
              <th>供应商</th>
              <th>支付方式</th>
              <th>修改时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <template v-if="detail.customerType === 0">散客</template>
                <template v-if="detail.customer !== null">{{detail.customer.vipName}}</template>
                <!--  -->
              </td>
              <td>
                {{detail.orderNo}}
                <span class="small" v-if="detail.parentChangeOrderNo !== null && detail.parentChangeOrderNo.length > 0">
                  ({{detail.parentChangeOrderNo}})
                </span>
              </td>
              <td>
                <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                <span v-else>国内</span>
              </td>

              <td>{{showPayType(detail.payType)}}</td>
              <td>{{detail.payRemark}}</td>
              <td>
                <template v-if="detail.supplier !== null">
                  {{detail.supplier.name}}
                </template>
              </td>                             
              <td>
                <template v-if="detail.paymentMethod !== null">
                  {{detail.paymentMethod.name}}
                </template>
              </td>
              <td>{{detail.lastUpdate}}</td>                 
            </tr>
          </tbody>
        </table>
        <div class="card-body">
            <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 0">
              <button class="btn btn-warning btn-sm mr-2" @click.stop="updateTicketNo()" v-if="isAdmin">
                修改票号
              </button>
              <button class="btn btn-danger btn-sm mr-auto" @click.stop="cancelChange(detail.id)">取消</button>
              <button class="btn btn-sm btn-primary" @click.stop="processChange(detail.id)">我来处理</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-else-if="detail.status === 1">
              <button class="btn btn-danger btn-sm mr-auto" @click.stop="cancelChange(detail.id)">取消</button>
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editPrice()">修改价格</button>
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editTicketSupplier()">更改供应商</button>
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editTicketPayment()">更改支付方式</button>
              <button class="btn btn-success btn-sm ml-auto mr-auto" @click.stop="finishChangeOrder(detail.id)">处理完毕</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-else-if="detail.status === 4">
              <button class="btn btn-danger btn-sm ml-2" @click.stop="reopenChange(detail.id)" v-if="isAdmin">
                重新打开
              </button>
            </div>

            <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 2">
              <button class="btn btn-danger btn-sm ml-2" @click.stop="rollbackStatus()" v-if="isAdmin && detail.payStatus !== 2">
                回滚
              </button>
              <button class="btn btn-warning ml-auto mr-auto" @click.stop="changeTicket()">改签</button>
              <button class="btn btn-danger ml-auto mr-auto" @click.stop="refundTicket()" v-if="detail.newTicketNo.length === 14">退票</button>
              <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="sendSms()">短信</button>
            </div>

        </div>
        <div class="card-body bg-info py-0">航班信息</div>    
        <table class="table table-striped table-hover table-sm">
            <thead>
                <tr>
                    <th>出发</th>
                    <th>到达</th>
                    <th>航班号</th>
                    <th>舱位</th>
                    <th>出发日期</th>
                    <th>出发时间</th>
                    <th>到达时间</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.flights" :key="index">   
                    <td>
                      <span v-if="info.flightType === 1" class="text-success">新:</span>
                      <span v-if="info.flightType === 0" class="text-danger">原:</span>
                        {{info.flight.departureAirportName}} 
                        <small>{{info.flight.departureAirport}} {{info.flight.departureTerminal}}</small>
                    </td>                             
                    <td>
                        {{info.flight.arrivalAirportName}}
                        <small>{{info.flight.arrivalAirport}} {{info.flight.arrivalTerminal}}</small>
                    </td>
                    <td>{{info.flight.flightNo}}</td>
                    <td>{{info.flight.subclass}}</td>
                    <td>{{info.flight.departureDate}}</td>
                    <td>{{info.flight.departureTime}}</td>
                    <td>{{info.flight.arrivalTime}}</td>
                    <td>
                      <button type="button" class="btn btn-sm btn-secondary" v-if="info.flightType === 1 && (detail.status === 0 || detail.status === 1)" @click.stop="updateFlightInfo(info)">修改</button>
                    </td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body">
            备注: {{detail.remark}}
            <template v-if="detail.status !== 2 && detail.status !== 4">
              <a href="javascript:void(0)" @click.stop="editRemark()" class="small float-right" title="修改备注">修改</a>
            </template>
        </div>
      </div>
      <div class="card">
          <div class="card-header">
            <template v-if="detail.status === 2">
              <button class="btn btn-success btn-sm ml-auto" @click.stop="outputBillInfo()">输出为账单</button>
            </template>         

              <button type="button" class="btn btn-info btn-sm float-right" @click.stop="searchHistories()">查看操作记录</button>
          </div>
          <table class="table table-sm table-striped small">
            <tr>
              <th>时间</th><th>内容</th><th>操作人</th>
            </tr>
            <tr v-for="info in histories" :key="info.id">
              <td>{{info.createTime}}</td>
              <td>{{info.content}}</td>
              <td>{{info.operator}}</td>
            </tr>
          </table>
      </div>
    </template>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-change-ticket-finished ref="modalFinishChange">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-change-ticket-finished>   
    <my-modal-supplier-update ref="updateSupplierModal"></my-modal-supplier-update> 
    <my-modal-pay-method-update ref="updatePayMethodModal"></my-modal-pay-method-update>
    <my-modal-price-update ref="updateChangeOrderPriceModal">
      <span slot="title">{{modalTitle}}</span>
      <span slot="price1Title">{{price1Title}}</span>
      <span slot="price2Title">{{price2Title}}</span>
    </my-modal-price-update>
    <my-modal-change-ticket ref="changeTicketModal"></my-modal-change-ticket>
    <my-modal-refund-ticket ref="refundTicketModal"></my-modal-refund-ticket>
    <my-modal-flight-update ref="modalFlightUpdate"></my-modal-flight-update>
    <my-modal-sms ref="modalSms" :orderType="orderType">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-sms>
  </div>
</template>

<script>
  import { processChangeOrder, finishChangeOrder, cancelChangeOrder, reopenChangeOrder } from '../api/flight-change.js'
  import { updateChangeOrderSupplier, updateChangeOrderPayment, updateChangeOrderRemark, updateChangeOrderPrice, updateChangeOrderFlightInfo, updateChangeOrderTicketNo } from '../api/flight-change.js'
  import { searchChangeOrderDetail, searchChangeOrderHistory, showChangeOrderStatus, outputFlightChangeOrder2Bill } from '../api/flight-change.js'
  import { createChangeOrder } from '../api/flight-change.js'
  import { createRefundOrder } from '../api/flight-refund.js'
  import { showPayType } from '../common/common.js'
  import { ORDER_FLIGHT_CHANGE } from '../common/const.js'
  import { sendOrderSmsContent } from '../api/sms.js'
  import { rollbackChangeOrderStatus } from '../api/admin.js'
  import MyModalChangeTicketFinished from '../components/my-modal-change-ticket-finished.vue'
  import MyModalSupplierUpdate from '../components/my-modal-supplier-update.vue'
  import MyModalPayMethodUpdate from '../components/my-modal-pay-method-update.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalPriceUpdate from '../components/my-modal-price-update.vue'
  import MyModalChangeTicket from '../components/my-modal-change-ticket.vue'
  import MyModalRefundTicket from '../components/my-modal-refund-ticket.vue'
  import MyModalFlightUpdate from '../components/my-modal-flight-update.vue'
  import MyModalSms from '../components/my-modal-sms.vue'

  export default {
    components: {
      MyModalChangeTicketFinished,
      MyModalSupplierUpdate,
      MyModalPayMethodUpdate,
      MyModalPrompt,
      MyModalPriceUpdate,
      MyModalChangeTicket,
      MyModalRefundTicket,
      MyModalFlightUpdate,
      MyModalSms
    },
    data () {
      return {
        detail: null,
        id: 0,
        histories: [],

        modalTitle: '',
        modalNullable: true,
        price1Title: '',
        price2Title: ''
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      orderType() { return ORDER_FLIGHT_CHANGE }
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
      search: function () {
        searchChangeOrderDetail(this.id, (val) => { this.detail = val })
      },
      searchHistories: function () {
        searchChangeOrderHistory(this.id, v => { this.histories = v })
      },
      getStatus: function (val) {
        return showChangeOrderStatus(val)
      },
      outputBillInfo: function () {
        outputFlightChangeOrder2Bill(this.id, v => this.commonShowMessage(v))
      },
      processChange: function (id) {
        processChangeOrder(id, v => this.commonShowMessage(v))
      },
      cancelChange: function (id) {
        this.modalTitle = '确定取消改签单吗？'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          cancelChangeOrder(id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      reopenChange: function (id) {
        this.modalTitle = '确定重开改签单吗？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          reopenChangeOrder(id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      finishChangeOrder: function (id) {
        this.$refs.modalFinishChange.modal().then((info) => {
          finishChangeOrder(id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      editTicketSupplier: function () {
        const promise = this.$refs.updateSupplierModal.modal(this.supplierId)
        promise.then((info) => {
          updateChangeOrderSupplier(this.id, { 'supplierId': info.supplierId }, v => this.commonShowMessage(v))
        }).catch(() => {})
      },
      editTicketPayment: function () {
        this.$refs.updatePayMethodModal.modal(this.payMethodId).then((info) => {
          updateChangeOrderPayment(this.id, { 'paymentMethodId': info.payMethodId }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editRemark: function () {
        this.modalTitle = '请输入新的备注：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            return
          }
          updateChangeOrderRemark(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((r) => { })
      },
      updateTicketNo: function () {
        this.modalTitle = '修改改签票号：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((ticketNo) => {
          // 点击确定按钮的回调处理
          if (ticketNo === '') {
            return
          }
          updateChangeOrderTicketNo(this.id, { ticketNo }, v => this.commonShowMessage(v))
        }).catch((r) => { })
      },
      editPrice: function () {
        this.modalTitle = '修改价格'
        this.price1Title = '航司改签费'
        this.price2Title = '我司服务费'
        this.$refs.updateChangeOrderPriceModal.modal(this.detail.airChangeCharge, this.detail.serviceCharge)
          .then(v => this.doUpdatePrice(v))
          .catch(() => {})
      },
      doUpdatePrice: function (v) {
        const params = {
          'airChangeCharge': v.price1,
          'serviceCharge': v.price2
        }

        updateChangeOrderPrice(this.id, params, v => this.commonShowMessage(v))
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('失败：' + jsonResult.errmsg, 'danger')
        } else {
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
          this.search()
        }
      },
      showPayType: function (val) {
        return showPayType(val)
      },
      changeTicket: function () {
        let changeTicketNo = this.detail.newTicketNo
        if (changeTicketNo.length !== 14) {
          changeTicketNo = this.detail.balanceCode + "-" + this.detail.ticketNo
        }

        const params = {
          'ticketNo': changeTicketNo,
          'changeCount': this.detail.changeCount + 1,
          'psgName': this.detail.psgName,
          'idNo': this.detail.idNo,
          'orderId': this.detail.orderId,
          'orderNo': this.detail.orderNo,
          'parentChangeOrderNo': this.detail.changeOrderNo,
          'intlTicket': this.detail.intlTicket,
          'oldPnrNo': this.detail.newPnrNo,
          'amount': 0,
          'cost': 0,
          'parvalue': this.detail.parvalue,
          'tax': this.detail.tax,
          'flights': this.detail.flights
        }
        this.$refs.changeTicketModal.modal(params).then(v => this.doCreateChangeOrder(v)).catch(ex => {})
      },
      doCreateChangeOrder: function (info) {
        createChangeOrder(JSON.stringify(info), (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            this.showErrMsg('创建成功')
            this.$router.replace('/flt/change/order/' + jsonResult.returnCode)
          }
        })
      },
      refundTicket: function () {
        const amount = this.detail.parvalue + this.detail.tax
        const cost = amount
        this.$refs.refundTicketModal.modal(this.detail.newTicketNo, this.detail.psgName, this.detail.idNo, 0, this.detail.orderNo, this.detail.flights, this.detail.intlTicket, amount, cost, this.detail.parvalue, this.detail.tax).then((info) => {
          this.doCreateRefundOrder(info)
        }).catch(ex => {})
      },
      doCreateRefundOrder: function (info) {
        createRefundOrder(JSON.stringify(info), (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            // console.log(jsonResult)
            this.$router.push('/flt/refund/order/' + jsonResult.returnCode)
          }
        })
      },
      rollbackStatus: function () {
        this.modalTitle = '确定将订单回滚吗？请输入理由：'

        this.$refs.modalPrompt.modal().then((remark) => {
          rollbackChangeOrderStatus(this.id,
            { remark },
            v => this.commonShowMessage(v)
          )
        }).catch((ex) => { console.log(ex) })
      },
      updateFlightInfo: function (info) {
        //修改改签订单中的航班信息
        this.$refs.modalFlightUpdate.modal(info.id, info.flight).then(fltInfo => {
          //执行修改
          fltInfo.orderId = this.id
          // console.log(fltInfo)
          updateChangeOrderFlightInfo(this.id, fltInfo, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg, 'danger')
            } else {
              this.showErrMsg('修改成功')
              this.search()
            }
          })
        }).catch(ex => {})
      },
      sendSms: function () {
        this.modalTitle = '请输入接收短信的手机号：'
        this.$refs.modalSms.modal(2, this.id, 0).then(v => {
          const params = {
            'orderType': this.orderType,
            'orderId': this.id,
            'mobileNo': v.mobile,
            'smsContent': v.smsContent,
            'smsFormat': v.smsFormat
          }
          sendOrderSmsContent(params, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
    }
  }
  // 250
</script>