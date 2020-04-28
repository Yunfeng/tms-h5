<template>
  <div id="vas-order-detail">
    <template v-if="detail !== null">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item">
            <template v-if="detail.productType === 0">
              <router-link to='/insurance/orders'>保险单</router-link>
            </template>
            <template v-else>
              <router-link to='/vas/orders'>服务单</router-link>
            </template>
          </li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>"

      <div class="card">
        <table class="table-sm small" v-if="detail.parentOrder !== undefined">
          <tr>
            <td>上级订单：</td>
            <td>{{detail.parentOrder.orderType}}</td>
            <td>{{detail.parentOrder.orderNo}}</td>
            <td>{{detail.parentOrder.orderStatus}}</td>
            <td><router-link :to="`/flt/order/` + detail.parentOrder.id">查看</router-link></td>
          </tr>
        </table>
        <table class="table table-sm table-striped table-hover small">
          <thead>
            <tr>
              <th>服务单号</th>
              <th>客户</th>
              <th class="text-center">成本中心</th>
              <th class="text-center">项目名称</th>
              <th>产品名称</th>
              <th class="text-right">数量</th>
              <th class="text-right">价格</th>
              <th class="text-right">折扣</th>
              <th class="text-right">总金额</th>
              <th class="text-center">付款方式</th>
              <th>预定人</th>
              <th>状态</th>
            </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                  <td>
                      <template v-if="detail.customer !== null">
                        {{detail.customer.vipName}}
                    </template>
                  </td>
                  <td class="text-center">
                  {{detail.costCenter}}
                </td>
                <td class="text-center">
                  {{detail.projectName}}
                </td>
                  <td>{{detail.productName}}</td>
                  <td class="text-right">{{detail.count}}</td>
                  <td class="text-right">{{detail.price}}</td>
                  <td class="text-right">{{detail.discount}}</td>
                  <td class="text-right">{{detail.totalAmount}}</td>
                  <td class="text-center">
                    {{getPayTypeDesc(detail.payType)}}
                    <template v-if="detail.payType !== 8 && detail.payStatus ===0">
                      <span class="small text-danger">(未付)</span>
                      <button class="btn btn-danger btn-sm" @click.stop="setOrderPaid()">已收款</button>
                    </template>
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>
                  <td>{{detail.operator}}</td>
                  <td>{{getStatusDesc(detail.status)}}</td>
              </tr>
          
          </tbody>
        </table>
        
        
        <div class="card-body bg-info text-white py-0">乘客信息</div>
      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>证件号</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.passengers" :key="info.id">   
                    <td >
                        {{info.name}}
                    </td>                             
                    <td>{{info.idNo}}</td>
                    <td>{{info.remark}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">航班信息</div>    
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
                <tr v-for="info in detail.flights" :key="info.id">   
                    <td>
                      <span class="text-success">{{info.departureAirport}}</span>
                        {{info.departureAirportName}} 
                        {{info.departureTerminal}} 
                        
                    </td>                             
                    <td>
                      <span class="text-success">{{info.arrivalAirport}}</span>
                        {{info.arrivalAirportName}}
                        {{info.arrivalTerminal}}
                        
                    </td>
                    <td>{{info.departureDate}}</td>
                    <td>{{info.flightNo}}</td>
                    <td>{{info.departureTime}}</td>
                    <td>{{info.arrivalTime}}</td>
                    <td>{{info.subclass}}</td>
                </tr>                               
            </tbody>
        </table>
      </div>
      <div class="card">
          <div class="card-header bg-secondary text-white">
              备注
          </div>
          <div class="card-body">
              {{detail.remark}}
          </div>
      </div>
      
    </template>

    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-supplier-update ref="updateSupplierModal"></my-modal-supplier-update>
    <my-modal-pay-method-update ref="updatePayMethodModal"></my-modal-pay-method-update>
    <my-modal-vas-price-update ref="updateVasPriceModal"></my-modal-vas-price-update>
    <modal-update-passenger ref="modalUpdatePassenger"></modal-update-passenger>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { showPayType } from '../common/common.js'
  import { searchVasOrderDetail, searchVasOrderHistory, showVasOrderStatus } from '../api/vas.js'
  import { processVasOrder, cancelVasOrder, finishVasOrder } from '../api/vas.js'
  import { updateVasOrderRemark, updateVasOrderPassenger, updateVasOrderSupplier, updateVasOrderPrice, updateVasOrderPayment, outputVasOrder2Bill } from '../api/vas.js'
  
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalSupplierUpdate from '../components/my-modal-supplier-update-v2.vue'
  import MyModalPayMethodUpdate from '../components/my-modal-pay-method-update.vue'
  import MyModalVasPriceUpdate from '../components/my-modal-vas-price-update.vue'
  import ModalUpdatePassenger from '../components/my-modal-update-passenger.vue'
  import { rollbackVasOrderStatus } from '../api/admin.js'

  export default {
    components: {
      MyModalPrompt,
      MyModalSupplierUpdate,
      MyModalPayMethodUpdate,
      MyModalVasPriceUpdate,
      ModalUpdatePassenger
    },
    data () {
      return {
        detail: null,
        id: 0,
        histories: [],

        remark: '',
        psgId: 0,
        psgName: '',
        psgIdNo: '',
        psgRemark: '',

        modalTitle: ''
      }
    },
    computed: {
      supplierId: function () {
        if (this.detail === null || this.detail.supplier === null) {
          return 0
        } else {
          return this.detail.supplier.id
        }
      },
      payMethodId: function () {
        if (this.detail === null || this.detail.paymentMethod === null) {
          return 0
        } else {
          return this.detail.paymentMethod.id
        }
      },
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      this.id = this.$route.params.id
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
        searchVasOrderDetail(this.id, v => { this.detail = v })
      },
      getStatusDesc: function (status) {
        return showVasOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      editRemark: function () {
        this.modalTitle = '请输入新的备注：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            return
          }
          this.remark = remark
          this.doUpdateRemark()
        }).catch((r) => {
          // console.log('catch: ' + r)
        })
      },
      doUpdateRemark: function () {
        const params = {
          'remark': this.remark
        }

        updateVasOrderRemark(this.id, params,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg('失败：' + jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              this.search()
            }
          }
        )
      },
      editPsg: function (index) {
        this.$refs.modalUpdatePassenger.modal(this.detail.passengers[index]).then((info) => {
          updateVasOrderPassenger(this.id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      cancelOrder: function () {
        this.modalTitle = '请输入取消订单的理由：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            this.showErrMsg('请填写取消订单的理由')
            return
          }
          this.doCancelOrder(remark)
        }).catch((r) => {
          // 点击取消按钮的回调处理
          // console.log('catch: ' + r)
        })
      },
      doCancelOrder: function (remark) {
        const params = {
          'remark': remark
        }
        cancelVasOrder(this.id, params, v => this.commonShowMessage(v))
      },
      editTicketSupplier: function () {
        const promise = this.$refs.updateSupplierModal.modal(this.supplierId, this.payMethodId)
        promise.then((info) => {
          this.doUpdateSupplier(info.supplierId, info.paymentMethodId)
        }).catch(() => {
          // this.showErrMsg('canceled')
        })
      },
      doUpdateSupplier: function (supplierId, paymentMethodId) {
        const params = {
          'supplierId': supplierId,
          'paymentMethodId': paymentMethodId
        }

        updateVasOrderSupplier(this.id, params, v => this.commonShowMessage(v))
      },
      editTicketPayment: function () {
        this.$refs.updatePayMethodModal.modal(this.payMethodId).then((info) => {
          updateVasOrderPayment(this.id, { 'paymentMethodId': info.payMethodId }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editPrice: function () {
        this.$refs.updateVasPriceModal.modal(this.detail.price, this.detail.discount, this.detail.cost)
          .then(v => this.doUpdatePrice(v)).catch(() => {})
      },
      doUpdatePrice: function (v) {
        const params = {
          'price': v.price,
          'discount': v.discount,
          'cost': v.cost
        }

        updateVasOrderPrice(this.id, params, v => this.commonShowMessage(v))
      },
      processOrder: function () {
        processVasOrder(this.id, v => this.commonShowMessage(v))
      },
      finishOrder: function () {
        this.modalTitle = '请输入备注：'
        const promise = this.$refs.modalPrompt.modal()
        promise.then((remark) => {
          if (remark === '') {
            return
          }
          finishVasOrder(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((r) => {})
      },
      viewHistory: function () {
        searchVasOrderHistory(this.id, (jsonResult) => { this.histories = jsonResult })
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
      outputBillInfo: function () {
        outputVasOrder2Bill(this.id, v => this.commonShowMessage(v))
      },
      rollbackStatus: function () {
        this.modalTitle = '确定回滚订单吗？请输入理由：'

        this.$refs.modalPrompt.modal().then((remark) => {
          rollbackVasOrderStatus(this.id,
            { remark },
            v => this.commonShowMessage(v)
          )
        }).catch((ex) => { console.log(ex) })
      }
    }
  }
  // 530
</script>