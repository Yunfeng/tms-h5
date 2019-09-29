<template>
  <div id="flight-refund-order-detail">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item"><router-link to='/flt/refund/orders'>退票单</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped small mb-0">
          <thead>
              <tr>
                  <th>退票单号</th>
                  <th class="text-center">票号</th>
                  <th>编码</th>
                  <th>退废</th>
                  <th></th>
                  <th class="text-center">乘客</th>
                  <th class="text-center">证件号</th>
                  
                  <th class="text-right">销售价</th>
                  <th class="text-right">税</th>
                  <th class="text-right">成本</th>
                  <th class="text-right">实收</th>
                  <th class="text-right">退票费</th>
                  <th class="text-right">服务费</th>
                  <th>操作员</th>
                  <th>状态</th>
                  <th class="text-right">航司预退</th>
                  <th class="text-right">航司实退</th>
                  <th class="text-right">实退客人</th>
                  <th class="text-right">利润</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.refundOrderNo}}</td>
                  <td>{{detail.balanceCode}}-{{detail.ticketNo}}</td>
                  <td>{{detail.pnrNo}}</td>
                  <td :class="{'text-danger': detail.reasonCode === 4}">{{getReasonCodeDesc(detail.reasonCode)}}</td>
                  <td>
                    <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                    <span v-else>国内</span>
                  </td>
                  <td>{{detail.psgName}}</td>
                  <td>{{detail.idNo}}</td>
                  <td class="text-right">{{detail.parvalue}}</td>
                  <td class="text-right">{{detail.tax}}</td>
                  <td class="text-right">{{detail.cost}}</td>
                  <td class="text-right">{{detail.ticketAmount}}</td>
                  <td class="text-right">{{detail.airRefundCharge}}</td>
                  <td class="text-right">{{detail.serviceCharge}}</td>
                  <td>{{detail.operator}}</td>                
                  <td>
                    {{showRefundOrderStatus(detail.status)}}
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>                
                  <td class="text-right">
                    <template v-if="detail.airlineRefundAmount === null">
                      <span class="text-danger">预退</span> {{airAmount0}}
                    </template>
                    <template v-else>
                      <strong>{{detail.airlineRefundAmount}}</strong>
                    </template>
                                        
                    <template v-if="detail.status === 2 || detail.status === 16">
                      <a href="javascript:void(0)" @click.stop="setRefundAirlineAmount()">修改</a>
                    </template>
                  </td>
                  <td class="text-right">
                    <template v-if="detail.airRefundStatus === 1">
                      {{detail.airlineRefundAmountFinal}}  
                    </template>
                    <template v-else>
                      <span class="small text-danger">未退</span>
                    </template>
                  </td>
                  <td class="text-right">
                    <template v-if="detail.passengerRefundAmount === null">
                      <span class="text-danger">预退</span>  {{psgAmount0}}
                    </template>
                    <template v-else>
                      <strong>{{detail.passengerRefundAmount}}</strong>
                    </template>
                    
                    <template v-if="detail.status === 2 || detail.status === 8">
                      <a href="javascript:void(0)" @click.stop="setRefundPsgAmount()">修改</a>
                    </template>
                  </td>
                  <td class="text-right">
                    <template v-if="detail.passengerRefundAmount > 0 && detail.airlineRefundAmount >0">
                      <strong>{{calcProfit2(detail.airlineRefundAmount, detail.passengerRefundAmount)}}</strong>
                    </template>
                    <template v-else>
                      {{calcProfit(detail)}}
                    </template>  
                  </td>
              </tr>

          </tbody>
        </table>
        <table class="table table-sm table-striped small">
          <thead>
              <tr>
                  <th>原订单号</th>
                  <th>公司名称</th>
                  <th>收款方式</th>
                  <th>收款备注</th>
                  <th>供应商</th>
                  <th>支付方式</th>
                  <th>提交航司</th>
                  <th>航司退款日期</th>
                  <th>退给乘客日期</th>
                  <th class="text-right">提交时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.orderNo}}</td>
                  <td>
                    <template v-if="detail.customerType === 0">散客</template>
                    <template v-else-if="detail.customer !== null">{{detail.customer.vipName}}</template>
                  </td>
                  <td>{{showPayType(detail.payType)}}</td>
                  <td>{{detail.payRemark}}</td>
                  <td>
                    <template v-if="detail.supplier !== null">{{detail.supplier.name}}</template>
                  </td>
                  <td>
                    <template v-if="detail.paymentMethod !== null">{{detail.paymentMethod.name}}</template>
                  </td>
                  <td>{{detail.submitDate}}</td>
                  <td>{{detail.airlineRefundDate}}</td>
                  <td>{{detail.psgRefundDate}}</td>
                  <td class="text-right">{{detail.createTime}}</td>

              </tr>

          </tbody>
        </table>
        <div class="card-body bg-info py-0">航班信息</div>    
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>出发</th>
                    <th>到达</th>
                    <th>出发日期</th>
                    <th>航班号</th>
                    <th>出发时间</th>
                    <th>到达时间</th>
                    <th>舱位</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.flights" :key="index">   
                    <td>
                        {{info.flight.departureAirportName}} 
                        <small>{{info.flight.departureAirport}} {{info.flight.departureTerminal}}</small>
                    </td>                             
                    <td>
                        {{info.flight.arrivalAirportName}}
                        <small>{{info.flight.arrivalAirport}}  {{info.flight.arrivaleTerminal}}</small>
                    </td>
                    <td>{{info.flight.departureDate}}</td>
                    <td>{{info.flight.flightNo}}</td>
                    <td>{{info.flight.departureTime}}</td>
                    <td>{{info.flight.arrivalTime}}</td>
                    <td>{{info.flight.subclass}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body">
            备注: {{detail.remark}}
        </div>
        <div class="card-footer d-flex flex-row  justify-content-around">
          <template v-if="detail.status === 0">
            <button class="btn btn-warning btn-sm mr-2" @click.stop="updateTicketNo()" v-if="isAdmin">
              修改票号
            </button>
            <button class="btn btn-danger btn-sm mr-auto" @click.stop="cancelRefund()">取消</button>
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editPrice()">修改价格</button>
            <button class="btn btn-sm btn-primary" @click.stop="processRefund(detail.id)">我来处理</button>
          </template>
          <template v-else-if="detail.status === 1">
            <button class="btn btn-danger btn-sm" @click.stop="cancelRefund()">取消</button>
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editRemark()">修改备注</button>
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editPrice()">修改价格</button>
            <button class="btn btn-sm btn-primary" @click.stop="setRefundSubmitted(detail.id)">已提交</button>
          </template>
          <template v-else-if="detail.status === 2">
            <button class="btn btn-danger btn-sm" @click.stop="cancelRefund()">取消</button>
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editRemark()">修改备注</button>
            <button class="btn btn-sm btn-danger ml-auto mr-auto" @click.stop="setRefundAirlineDone()">航司预退</button>
            <button class="btn btn-sm btn-danger ml-auto mr-auto" @click.stop="setRefundPassengerDone()">已退客人</button>
          </template>
          <template v-else-if="detail.status === 4">
            <button class="btn btn-danger btn-sm ml-2" @click.stop="reopenRefund()" v-if="isAdmin">
              重新打开
            </button>
          </template>
          <template v-else-if="detail.status === 8">
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editRemark()">修改备注</button>
            <button class="btn btn-sm btn-danger ml-auto mr-auto" @click.stop="setRefundPassengerDone()">已退客人</button>
          </template>
          <template v-else-if="detail.status === 16">
            <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="editRemark()">修改备注</button>
            <button class="btn btn-sm btn-danger ml-auto mr-auto" @click.stop="setRefundAirlineDone()">航司预退</button>
          </template>
          <template v-if="detail.status === 32">
            <button class="btn btn-danger btn-sm ml-2" @click.stop="rollbackStatus()" v-if="isAdmin && detail.payStatus !== 2">
                回滚
              </button>
          </template>
          <template v-if="detail.airRefundStatus !== 1 && detail.status === 32">
            <button class="btn btn-sm btn-danger ml-auto mr-auto" @click.stop="setRefundFinalAirlineDone()">航司已退</button>
          </template>

          <button class="btn btn-info btn-sm ml-auto mr-auto" @click.stop="sendSms()">短信</button>
        </div>
      </div>
      <div class="card">
          <div class="card-header">
            <template v-if="detail.status === 32">
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

    <my-modal-refund-ticket-update ref="updateRefundModal">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-refund-ticket-update>
    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-price-update ref="modalUpdatePrice">
      <span slot="title">{{modalTitle}}</span>
      <span slot="price1Title">{{price1Title}}</span>
      <span slot="price2Title">{{price2Title}}</span>
    </my-modal-price-update>
    <my-modal-sms ref="modalSms" :orderType="orderType">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-sms>
  </div>
  
</template>

<script>
  import { searchRefundOrderDetail, showRefundOrderStatus, showReasonCodeDesc, searchRefundOrderHistory, searchRefundOrderDetailByOrderNo, outputFlightRefundOrder2Bill } from '../api/flight-refund.js'
  import { processRefund, cancelRefund, reopenRefund, submitRefund, setAirRefundAmount, setRefundAirlineRefunded, setPsgRefundAmount, setRefundPassengerRefunded, updateRefundOrderPrice, updateRefundOrderRemark, setAirFinalyRefunded, updateRefundOrderTicketNo } from '../api/flight-refund.js'
  import { rollbackRefundOrderStatus } from '../api/admin.js'
  import { showPayType } from '../common/common.js'
  import { ORDER_FLIGHT_REFUND } from '../common/const.js'
  import { sendOrderSmsContent } from '../api/sms.js'
  import MyModalRefundTicketUpdate from '../components/my-modal-refund-ticket-update.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalPriceUpdate from '../components/my-modal-price-update.vue'
  import MyModalSms from '../components/my-modal-sms.vue'

  export default {
    components: {
      MyModalPrompt,
      MyModalRefundTicketUpdate,
      MyModalPriceUpdate,
      MyModalSms
    },
    data () {
      return {
        detail: null,
        id: 0,
        refundOrderNo: '',
        histories: [],

        modalTitle: '',
        price1Title: '',
        price2Title: ''
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      orderType() { return ORDER_FLIGHT_REFUND },
      airAmount0: function () {
        if (this.detail.airlineRefundAmount !== null) {
          return this.detail.airlineRefundAmount
        } else {
          return this.calcAirRefund(this.detail)
        }
      },
      psgAmount0: function () {
        if (this.detail.passengerRefundAmount > 0) {
          return this.detail.passengerRefundAmount
        } else {
          return this.calcPsgRefund(this.detail)
        }
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      if (this.id === 0) {
        this.refundOrderNo = this.$route.query.orderNo
      }

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
        // searchRefundOrderDetail(this.id, (val) => { this.detail = val })
        if (this.id > 0) {
          searchRefundOrderDetail(this.id, (val) => { this.detail = val })
        } else {
          searchRefundOrderDetailByOrderNo(this.refundOrderNo, v => {
            this.detail = v
            this.id = this.detail.id
          })
        }
      },
      searchHistories: function () {
        searchRefundOrderHistory(this.id, v => { this.histories = v })
      },
      showRefundOrderStatus: function (val) {
        return showRefundOrderStatus(val)
      },
      getReasonCodeDesc: function (val) {
        return showReasonCodeDesc(val)
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
      outputBillInfo: function () {
        outputFlightRefundOrder2Bill(this.id, v => this.commonShowMessage(v))
      },
      processRefund: function (id) {
        processRefund(id, v => this.commonShowMessage(v))
      },
      setRefundSubmitted: function (id) {
        submitRefund(id, v => this.commonShowMessage(v))
      },
      setRefundAirlineAmount: function () {
        this.modalTitle = '航司预计退款金额'
        const info = this.detail
        const ticketNo = info.balanceCode + '-' + info.ticketNo
        const psgName = info.psgName
        const id = info.id

        this.$refs.updateRefundModal.modal(ticketNo, psgName, this.airAmount0).then((info) => {
          setAirRefundAmount(id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      setRefundAirlineDone: function () {
        if (this.detail.airlineRefundAmount === null) {
          this.showErrMsg('请先填写航司预计实退金额', 'danger')
          return
        }
        this.modalTitle = '确认状态更改为 航司预退 嘛？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          setRefundAirlineRefunded(this.id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      setRefundFinalAirlineDone: function () {
        // 航司实际退款
        this.modalTitle = '航司实际退款金额'
        const info = this.detail
        const ticketNo = info.balanceCode + '-' + info.ticketNo
        const psgName = info.psgName
        const id = info.id

        this.$refs.updateRefundModal.modal(ticketNo, psgName, info.airlineRefundAmount).then((info) => {
          console.log(info)
          setAirFinalyRefunded(id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      setRefundPsgAmount: function () {
        this.modalTitle = '实际退客户金额'
        const info = this.detail
        const ticketNo = info.balanceCode + '-' + info.ticketNo
        const psgName = info.psgName
        const id = info.id

        this.$refs.updateRefundModal.modal(ticketNo, psgName, this.psgAmount0).then((info) => {
          setPsgRefundAmount(id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      setRefundPassengerDone: function () {
        if (this.detail.passengerRefundAmount === null) {
          this.showErrMsg('请先填写实退乘客金额', 'danger')
          return
        }

        this.modalTitle = '确认状态更改为 已退客户 嘛？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          setRefundPassengerRefunded(this.id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      cancelRefund: function () {
        this.modalTitle = '确定取消退票单吗？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          cancelRefund(this.id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      reopenRefund: function () {
        this.modalTitle = '确定重新打开该退票单吗？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          reopenRefund(this.id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      calcAirRefund: function (info) {
        return info.cost - info.airRefundCharge
      },
      calcPsgRefund: function (info) {
        return info.ticketAmount - info.airRefundCharge - info.serviceCharge
      },
      calcProfit: function (info) {
        const profit = this.calcAirRefund(info) - this.calcPsgRefund(info)
        return Math.round(profit * 100) / 100
      },
      calcProfit2: function (t1, t2) {
        return Math.round((t1 - t2) * 100) / 100
      },
      showPayType: function (val) {
        return showPayType(val)
      },
      editPrice: function () {
        this.modalTitle = '修改价格'
        this.price1Title = '航司退票费'
        this.price2Title = '我司服务费'
        this.$refs.modalUpdatePrice.modal(this.detail.airRefundCharge, this.detail.serviceCharge)
          .then(v => this.doUpdatePrice(v))
          .catch(() => {})
      },
      doUpdatePrice: function (v) {
        const params = {
          'airRefundCharge': v.price1,
          'serviceCharge': v.price2
        }

        updateRefundOrderPrice(this.id, params, v => this.commonShowMessage(v))
      },
      editRemark: function () {
        this.modalTitle = '请输入新的备注：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            return
          }
          updateRefundOrderRemark(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((r) => { })
      },
      rollbackStatus: function () {
        this.modalTitle = '确定回滚订单吗？请输入理由：'

        this.$refs.modalPrompt.modal().then((remark) => {
          rollbackRefundOrderStatus(this.id, 
            { remark }, 
            v => this.commonShowMessage(v)
          )
        }).catch((ex) => { console.log(ex) })
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
      updateTicketNo: function () {
        this.modalTitle = '修改退票票号：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((ticketNo) => {
          // 点击确定按钮的回调处理
          if (ticketNo === '') {
            return
          }
          updateRefundOrderTicketNo(this.id, { ticketNo }, v => this.commonShowMessage(v))
        }).catch((r) => { })
      }
    }
  }
  // 315
</script>