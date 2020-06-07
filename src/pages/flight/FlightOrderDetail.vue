<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item"><router-link to='/flt/orders'>机票订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <ul class="nav nav-tabs nav-bordered mb-3" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="order-tab" data-toggle="tab" href="#orderDetailTab" role="tab" aria-controls="home" aria-selected="true">订单内容</a>
      </li>
      <li class="nav-item" v-if="detail !== null && detail.refunds.length > 0">
        <a class="nav-link" id="refund-tab" data-toggle="tab" href="#refundTab" role="tab" aria-controls="refund" aria-selected="false">退票({{detail.refunds.length}})</a>
      </li>
      <li class="nav-item" v-if="detail !== null && detail.changes.length > 0">
        <a class="nav-link" id="change-tab" data-toggle="tab" href="#changeTab" role="tab" aria-controls="change" aria-selected="false">改签({{detail.changes.length}})</a>
      </li>
      <li class="nav-item" v-if="detail !== null && detail.services.length > 0">
        <a class="nav-link" id="service-tab" data-toggle="tab" href="#serviceTab" role="tab" aria-controls="service" aria-selected="false">服务及保险({{detail.services.length}})</a>
      </li>
      <li class="nav-item" v-if="detail !== null">
        <a class="nav-link" id="comment-tab" data-toggle="tab" href="#commentTab" role="tab" aria-controls="comment" aria-selected="false">留言({{comments.length}})</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="orderDetailTab" role="tabpanel" aria-labelledby="order-tab" v-if="detail !== null">
        <div class="card">
          <div class="card-body bg-info text-white py-0">订单概要</div>      
          <table class="table table-sm table-striped table-hover mb-0">
            <thead>
                <tr>
                    <th>订单号</th>
                    <th>客户</th>
                    <th>成本中心</th>
                    <th>项目名称</th>
                    <th>国际?</th>
                    <th>收款方式</th>
                    <th>发票类型</th>
                    <th>出票日期</th>
                    <th>收款状态</th>
                    <th>订单状态</th>
                </tr>                        
            </thead>
            <tbody>
                <tr>
                  <td>{{detail.orderNo}}</td>
                    <td>
                      {{detail.customer.name}}
                      
                    </td>
                    <td>{{detail.costCenter}}</td>
                    <td>{{detail.projectName}}</td>
                    <td>
                      <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                      <span v-else>国内</span>
                    </td>
                    <td>
                      {{getPayTypeDesc(detail.payType)}}
                      /{{detail.payRemark}}
                    </td>
                    <td>{{showItineraryType(detail.itineraryType)}}</td>
                    <td>{{detail.etdzDate}}</td>
                    <td>
                      <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                      <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                      <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                    </td>
                    <td>
                      {{getStatusDesc(detail.orderStatus)}}
                    </td>
                </tr>
            
            </tbody>
          </table>
          <template v-if="detail.subOrders.length > 0">
            <div class="card-body bg-info text-white py-0">子订单</div> 
            <table class="table table-hover table-sm mb-0">
                <tr>
                  <td>类型</td>
                  <td>订单号</td>
                  <td>状态</td>
                  <td>金额</td>
                  <td></td>
                </tr>
              <template v-for="subOrder of detail.subOrders">
                <tr>
                  <td>{{showOrderType(subOrder.orderType)}}</td>
                  <td>{{subOrder.orderNo}}</td>
                  <td>{{subOrder.orderStatus}}</td>
                  <td>{{subOrder.total}}</td>
                  <td><router-link :to="`/vas/order/` + subOrder.id">查看</router-link></td>
                </tr>
              </template>
            </table>
          </template>
          <div class="card-body bg-info text-white py-0">乘机人信息</div>      
          <table class="table table-hover table-sm mb-0">
              <thead>
                  <tr>
                      <th class="text-right">姓名</th>
                      <th class="text-right">姓</th>
                      <th class="text-right">名</th>
                      <th class="">性别</th>
                      <th>证件</th>
                      <th>常旅客号</th>
                      <th>手机号</th>
                      <th>Email</th>
                      <th>乘客类型</th>
                      <th>票号</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(info, index) in detail.passengers" :key="index" class="bg-white">   
                      <td class="text-right">
                          {{info.name}}
                          <span class="text-danger" v-if="info.vipLevel > 0">VIP-{{info.vipLevel}}</span>
                      </td>
                      <td>{{info.lastName}}</td>                             
                      <td>{{info.firstName}}</td>                             
                      <td>{{showGender(info.gender)}}</td>                           
                      <td>
                        <span class="text-info">{{showIdTypeDesc(info.idType)}}</span> {{info.idNo}}
                      </td>
                      <td>{{info.ffpNo}}</td>
                      <td>{{info.mobile}}</td>
                      <td>{{info.email}}</td>

                      <td>{{showPsgType(info.psgType)}}</td>
                      <td>
                        <template v-if="detail.orderStatus === 16 || detail.orderStatus === 32">
                        {{info.ticketNo}}
                          <template v-if="info.ticketCount > 1"> - {{info.ticketNoEnd}}</template>
                        </template>
                      </td>
                      <td>
                        <template v-if="detail.orderStatus === 32">
                          <a href="javascript:void(0)" @click.stop="multiRefundTicket(index)" class="btn btn-sm btn-outline-danger ml-2">退票</a>                        
                          <a href="javascript:void(0)" @click.stop="changeTicket(index)" class="btn btn-sm btn-warning">改签</a>
                        </template>
                      </td>
                  </tr>                               
              </tbody>
          </table>
          <div class="card-body bg-info text-white py-0">航班信息</div>    
          <table class="table table-striped table-hover table-sm mb-0">
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
                <template v-for="(info, index) in detail.flights">
                  <tr>   
                      <td>
                        <span class="text-success">{{info.dport}}</span>
                          {{info.dportName}} 
                          {{info.dterm}} 
                          
                      </td>                             
                      <td>
                        <span class="text-success">{{info.aport}}</span>
                          {{info.aportName}}
                          {{info.aterm}}
                          
                      </td>
                      <td>{{info.ddate}}</td>
                      <td>{{info.flightNo}}</td>
                      <td>
                        {{info.dtime}}
                      </td>
                      <td>
                        <span class="small text-info" v-if="info.adate !== info.ddate">
                          {{info.adate}}  
                        </span>
                        
                        {{info.atime}}                        
                      </td>
                      <td>{{info.subclass}}</td>
                  </tr>  
                  <tr>
                    <td colspan="8">
                      <strong>改签规则</strong>： {{info.changeRule}}<br/>
                      <strong>退票规则</strong>： {{info.refundRule}}<br/>
                    </td>
                  </tr>
                </template>
                                               
              </tbody>
          </table>
          <div class="card-body bg-info text-white py-0">价格信息</div>          
          <div class="card-body py-0">
            <div class="d-flex flex-row  justify-content-between" v-if="detail.adultCount > 0">
              <div class="p-2 text-nowrap">成人</div>
              <div class="p-2 text-nowrap">票面价: {{this.adultPrice.price}}</div>
              <div class="p-2 text-nowrap">销售价: {{this.adultPrice.parvalue}}</div>
              <div class="p-2 text-nowrap">税: {{this.adultPrice.tax}}</div>
              <div class="p-2 text-nowrap">保险费: {{this.adultPrice.insurance}}</div>
              <div class="p-2 text-nowrap">服务费: {{this.adultPrice.serviceCharge}}</div>
              <div class="p-2 text-nowrap">客户让利: {{this.adultPrice.discount}}</div>
              <div class="p-2 text-nowrap">人数: {{this.adultPrice.ticketCount}}</div>
              <div class="p-2 text-nowrap">应收: {{this.adultPrice.amount}}</div>
            </div>
            <div class="d-flex flex-row  justify-content-between" v-if="detail.childCount > 0">
              <div class="p-2 text-nowrap">儿童</div>
              <div class="p-2 text-nowrap">票面价: {{detail.chdPrice}}</div>
              <div class="p-2 text-nowrap">销售价: {{detail.chdParvalue}}</div>
              <div class="p-2 text-nowrap">税: {{detail.chdTax}}</div>
              <div class="p-2 text-nowrap">保险费: {{detail.chdInsurance}}</div>
              <div class="p-2 text-nowrap">服务费: {{detail.chdServiceCharge}}</div>
              <div class="p-2 text-nowrap">客户让利: {{detail.chdDiscount}}</div>
              <div class="p-2 text-nowrap">人数: {{detail.childCount}}</div>
              <div class="p-2 text-nowrap">应收: {{detail.chdAmount}}</div>
            </div>
            <div class="d-flex flex-row  justify-content-between" v-if="detail.infantCount > 0">
              <div class="p-2 text-nowrap">婴儿</div>
              <div class="p-2 text-nowrap">票面价: {{detail.infPrice}}</div>
              <div class="p-2 text-nowrap">销售价: {{detail.infParvalue}}</div>
              <div class="p-2 text-nowrap">税: {{detail.infTax}}</div>
              <div class="p-2 text-nowrap">保险费: {{detail.infInsurance}}</div>
              <div class="p-2 text-nowrap">服务费: {{detail.infServiceCharge}}</div>
              <div class="p-2 text-nowrap">客户让利: {{detail.infDiscount}}</div>
              <div class="p-2 text-nowrap">人数: {{detail.childCount}}</div>
              <div class="p-2 text-nowrap">应收: {{detail.infAmount}}</div>
            </div>
            <div class="d-flex flex-row  justify-content-between">
              <div class="p-2 text-nowrap text-success">小计: {{detail.subTotal}}</div>
            </div>
          </div>
          <div class="card-body">

            <ul class="list-unstyled">
              <li>联系人：{{detail.linkman}}</li>
              <li>联系电话：{{detail.linkPhone}}</li>
              <li>备注: {{detail.remark}}</li>
            </ul>
            <ul class="list-inline row">
              <li class="list-inline-item mr-auto">价格校验: {{detail.priceCheckedStatus}}, {{detail.priceCheckedTime}}</li>
              <li class="list-inline-item mr-auto">指定审批人: {{detail.specifiedApprover}}</li>
              <li class="list-inline-item mr-auto">审批结果: {{detail.approvalStatus}}, {{detail.approvalDenyReason}}</li>
              <li class="list-inline-item mr-auto">合规性校验: {{detail.violationStatus}}, {{detail.violationReason}}</li>
            </ul>
            <ul class="list-unstyled" v-if="detail.policyCode !== null">
              <li>机票优惠代码：{{detail.policyCode}}</li>
            </ul>
            <ul class="list-unstyled">
              <li>订单总金额: <strong>{{detail.totalAmount}}</strong></li>
            </ul>
          </div>

            <div class="card-body"> 
              <button class="btn btn-sm btn-success ml-2" @click.stop="onlinePay()" v-if="detail.orderStatus === 0 && detail.payType === 1">支付</button>

              <template v-if="detail.orderStatus === 0">
                <button class="btn btn-primary btn-sm ml-2 mr-auto" :disabled="btnDisabled" @click.stop="submitOrder()">申请开票</button>
              </template>
              <template v-if="detail.orderStatus === 1">
                <button class="btn btn-primary btn-sm ml-2 mr-auto" :disabled="btnDisabled" @click.stop="approveOrder()">审批</button>
              </template>

              <button class="btn btn-sm btn-primary ml-2 float-right" @click.stop="addExtraService2()" v-if="detail.orderStatus !== 4">增加机场服务</button>
            </div>
        </div>
      </div>
      <div class="tab-pane fade" id="refundTab" role="tabpanel" aria-labelledby="refund-tab" v-if="detail !== null && detail.refunds.length > 0">
        <flight-refund-list :dataList="detail.refunds"></flight-refund-list>
      </div>
      <div class="tab-pane fade" id="changeTab" role="tabpanel" aria-labelledby="change-tab" v-if="detail !== null && detail.changes.length > 0">
        <flight-change-list :dataList="detail.changes"></flight-change-list>
      </div>
      <div class="tab-pane fade" id="serviceTab" role="tabpanel" aria-labelledby="service-tab" v-if="detail !== null && detail.services.length > 0">
        <vas-order-list :dataList="detail.services"></vas-order-list>
      </div>
      <div class="tab-pane fade" id="commentTab" role="tabpanel" aria-labelledby="comment-tab" v-if="detail !== null">
        <div class="row">
          <div class="col-12">
            <ul class="nav nav-tabs nav-bordered mb-3" role="tablist">
              <li class="nav-item">
                <a class="nav-link" id="detail-tab" data-toggle="tab" href="#newComment">新建留言</a>
              </li>
              <li class="nav-item ">
                <a class="nav-link active" id="login-tab" data-toggle="tab" href="#comments">留言列表</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade show" id="newComment">
                <div class="card">
                  <div class="card-body">
                    <div class="form-group">
                     
                      <textarea class="form-control" rows="3" v-model.trim="commentContent"></textarea>
                    </div>
                    <button class="btn btn-primary" @click.stop="saveComment()">保存</button>
                  </div>
                  <table></table>
                </div>
              </div>
              <div class="tab-pane fade show active" id="comments">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>留言内容</th>
                      <th>留言人</th>
                      <th>留言时间</th>
                    </tr>
                  </thead>
                  <tr v-for="info in comments">
                    <td>{{info.comment}}</td>
                    <td>{{info.username}}</td>
                    <td>{{info.createTime}}</td>
                  </tr>
                </table>
              </div>
            </div>         
          </div>
        </div>
      </div>
    </div>    

    <div id="paymentForm" ></div>

    <my-modal-refund-ticket-multi ref="multiRefundTicketModal"></my-modal-refund-ticket-multi>
    <my-modal-change-ticket ref="changeTicketModal"></my-modal-change-ticket>
    <my-modal-confirm ref="confirmModal"></my-modal-confirm>
  </div>
  
</template>

<script>
  import $ from 'jquery'
  import { APP_FLIGHT_PATH, SUPPLIER_FLIGHT } from '../../common/const.js'
  import { updateFlightOrderPrice, updateFlightOrderPassenger, updateFlightOrderRemark, updateFlightOrderSupplier, updateFlightOrderTicket, cancelFlightOrder, toticketFlightOrder, agreeFlightOrderCancelRequest, denyFlightOrderCancelRequest, finishFlightOrderDelivery, updateFlightOrderPaymentMethod, updateFlightOrderPnr, updateFlightOrderCustomer, finishFlightOrder, updateFlightOrderIntl, updateFlightOrderDeliveryDate, updateFlightOrderTicketer, setFlightOrderPaid } from '../../api/flight.js'
  import { searchFlightOrder, outputFlightOrder2Bill, searchFlightOrderDetailByOrderNo } from '../../api/flight.js'
  import { payForFlightOrder, submitFlightOrder, approveFlightOrder } from '../../api/flight.js'
  import { showFlightOrderStatus, showPayType, showPsgType, showIdTypeDesc, showOrderTypeDesc, showItineraryType } from '../../common/common.js'
  import { createRefundOrderMulti } from '../../api/flight-refund.js'
  import { createChangeOrderMulti } from '../../api/flight-change.js'
  import { sendFlightOrderSms, sendFlightOrderApprovalSms } from '../../api/sms.js'
  import { saveComment, searchComments } from '../../api/comment.js'
  import { rollbackFlightOrderStatus } from '../../api/admin.js'

  import PriceInfo from '../../common/PriceInfo.js'
  
  import MyModalConfirm from '../../components/my-modal-prompt-confirm.vue'
  import FlightRefundList from '../../components/flight-order-refund-list.vue'
  import FlightChangeList from '../../components/flight-order-change-list.vue'
  import VasOrderList from '../../components/vas-order-list.vue'
  import MyModalRefundTicketMulti from '../../components/my-modal-refund-ticket-multi.vue'
  import MyModalChangeTicket from '../../components/my-modal-change-ticket-multi.vue'

  export default {
    components: {
      MyModalConfirm,
      FlightRefundList,
      FlightChangeList,
      VasOrderList,
      MyModalRefundTicketMulti,
      MyModalChangeTicket
    },
    data () {
      return {
        detail: null,
        id: 0,
        orderNo: '',

        adultPrice: new PriceInfo(),
        childPrice: new PriceInfo(),
        infantPrice: new PriceInfo(),

        priceEditing: 0,
        remark: '',
        commentContent: '',
        comments: [],
        extras: [],
        modalTitle: '',
        modalTitle2: '',
        modalNullable: false,

        btnDisabled: false
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
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      // console.log(this.id)
      // console.log(this.$route)
      if (this.id === 0) {
        this.orderNo = this.$route.query.orderNo
        // console.log(this.orderNo)
      }
      this.searchOrderDetail()
      this.searchComments()
    },
    updated: function () {
      $('[data-toggle="tooltip"]').tooltip()
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
      searchOrderDetail: function () {
        if (this.id > 0) {
          searchFlightOrder(this.id, (val) => { 
            this.detail = val 
            this.setAdultPrice()
          })
        } else {
          searchFlightOrderDetailByOrderNo(this.orderNo, v => {
            this.detail = v
            this.id = this.detail.id
          })
        }
      },
      getStatusDesc: function (status) {
        return showFlightOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      showPsgType: function (psgType) {
        return showPsgType(psgType)
      },
      showGender: function (val) {
        switch (val) {
          case 1: return '男'
          case 2: return '女'
          default: return ''
        }
      },
      showIdTypeDesc: function (idType) {
        return showIdTypeDesc(idType)
      },
      showItineraryType: function (itineraryType) {
        return showItineraryType(itineraryType)
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
          this.searchOrderDetail()
        }
      },
      printItinerary: function () {
        const url = '/' + APP_FLIGHT_PATH + '/order/flight/' + this.id + '/itinerary'
        window.open(url)
      },
      multiRefundTicket: function (index) {
        // 多人同时退废
        const psgInfo = this.detail.passengers[index]
        const psgType = psgInfo.psgType

        let psgPrice
        if (psgType === 0) {
          this.setAdultPrice()
          psgPrice = this.adultPrice
        } else if (psgType === 1) {
          this.setChildPrice()
          psgPrice = this.childPrice
        } else if (psgType === 2) {
          this.setInfantPrice()
          psgPrice = this.infantPrice
        }

        // 找到同类型的乘机人：成人，儿童，婴儿
        const psgList = []
        for (const info of this.detail.passengers) {
          if (info.psgType === psgType) {
            psgList.push({
              'ticketNo': info.ticketNo,
              'name': info.name,
              'idNo': info.idNo,
              'selected': false
            })
          }
        }

        this.$refs.multiRefundTicketModal.modal(psgList, this.id, this.detail.orderNo, this.detail.flights, this.detail.intlTicket, psgPrice.amount, psgPrice.cost, psgPrice.parvalue, psgPrice.tax).then((info) => {
          this.doCreateRefundOrderMulti(info)
        }).catch(ex => {})
      },
      doCreateRefundOrderMulti: function (info) {
        createRefundOrderMulti(JSON.stringify(info), (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.$router.push('/flt/refund/order/' + jsonResult.returnCode)
          }
        })
      },
      changeTicket: function (index) {
        // 多人同时签转
        const psgInfo = this.detail.passengers[index]
        const psgType = psgInfo.psgType

        let psgPrice
        if (psgType === 0) {
          this.setAdultPrice()
          psgPrice = this.adultPrice
        } else if (psgType === 1) {
          this.setChildPrice()
          psgPrice = this.childPrice
        } else if (psgType === 2) {
          this.setInfantPrice()
          psgPrice = this.infantPrice
        }

        // 找到同类型的乘机人：成人，儿童，婴儿
        const psgList = []
        let onlyOneTicketAllowed = false
        for (const info of this.detail.passengers) {
          if (info.psgType === psgType) {
            if (info.ticketNos.length == 0) {
              psgList.push({
                'ticketNo': info.ticketNo,
                'name': info.name,
                'idNo': info.idNo,
                'selected': false
              })
            } else {
              onlyOneTicketAllowed = true
              for (const ticketNo of info.ticketNos) {
                psgList.push({
                  'ticketNo': ticketNo,
                  'name': info.name,
                  'idNo': info.idNo,
                  'selected': false
                })
              }
            }
          }
        }

        const params = {
          'orderId': this.id,
          'orderNo': this.detail.orderNo,
          'intlTicket': this.detail.intlTicket,
          'oldPnrNo': this.detail.pnrNo,
          'amount': psgPrice.amount,
          'cost': psgPrice.cost,
          'parvalue': psgPrice.parvalue,
          'tax': psgPrice.tax,
          'flights': this.detail.flights,
          'onlyOneTicketAllowed': onlyOneTicketAllowed
        }
        this.$refs.changeTicketModal.modal(psgList, params).then(v => this.doCreateChangeOrder(v)).catch(ex => {})
      },
      doCreateChangeOrder: function (info) {
        createChangeOrderMulti(JSON.stringify(info), (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.$router.push('/flt/change/order/' + jsonResult.returnCode)
          }
        })
      },
      setAdultPrice: function () {
        let priceInfo = null;
        console.log(this.detail.prices)
        for(let i = 0; i < this.detail.prices.length; i++) {
          if (this.detail.prices[i].priceType === 0) {
            priceInfo = this.detail.prices[i]
            break
          }
        }

        console.log(priceInfo)

        if (priceInfo === null) {
          return
        }

        this.adultPrice.price = priceInfo.price
        this.adultPrice.parvalue = priceInfo.parValue
        this.adultPrice.tax = priceInfo.tax
        this.adultPrice.insurance = priceInfo.insurance
        this.adultPrice.serviceCharge = priceInfo.serviceCharge
        this.adultPrice.commRate = 0
        this.adultPrice.commission = priceInfo.commission
        this.adultPrice.discountRate = 0
        this.adultPrice.discount = priceInfo.discount
        this.adultPrice.amount = priceInfo.amount
        this.adultPrice.cost = priceInfo.cost
        this.adultPrice.ticketCount = this.detail.adultCount

        console.log(this.adultPrice)
      },
      setChildPrice: function () {
        this.childPrice.price = this.detail.chdPrice
        this.childPrice.parvalue = this.detail.chdParvalue
        this.childPrice.tax = this.detail.chdTax
        this.childPrice.insurance = this.detail.chdInsurance
        this.childPrice.serviceCharge = this.detail.chdServiceCharge
        this.childPrice.commRate = 0
        this.childPrice.commission = this.detail.chdCommission
        this.childPrice.discountRate = 0
        this.childPrice.discount = this.detail.chdDiscount
        this.childPrice.amount = this.detail.chdAmount
        this.childPrice.cost = this.detail.chdCost
        this.childPrice.ticketCount = this.detail.childCount
      },
      setInfantPrice: function () {
        this.infantPrice.price = this.detail.infPrice
        this.infantPrice.parvalue = this.detail.infParvalue
        this.infantPrice.tax = this.detail.infTax
        this.infantPrice.insurance = this.detail.infInsurance
        this.infantPrice.serviceCharge = this.detail.infServiceCharge
        this.infantPrice.commRate = 0
        this.infantPrice.commission = this.detail.infCommission
        this.infantPrice.discountRate = 0
        this.infantPrice.discount = this.detail.infDiscount
        this.infantPrice.amount = this.detail.infAmount
        this.infantPrice.cost = this.detail.infCost
        this.infantPrice.ticketCount = this.detail.infantCount
      },
      addExtraService2: function () {
        this.$router.push({ path: '/vaas/order', query: { flightOrderId: this.id }})
      },
      showOrderType: function (orderType) {
        return showOrderTypeDesc(orderType)
      },
      onlinePay: function () {
        payForFlightOrder(this.detail.id, 
        v => {
          if (v.status === 'OK') {
            this.showErrMsg('如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。', 'info')
            console.log(v.url)
            $('#paymentForm').empty().html(v.url)
            document.forms['alipaysubmit'].submit()            
          } else {
            this.showErrMsg(v.errmsg, 'danger')
          }
        }

        )
      },
      submitOrder: function () {
        // this.btnDisabled = true
        this.showLoading('处理中')
        submitFlightOrder(this.id, v => this.commonShowMessage(v), () => {
          // this.btnDisabled = false
          this.hideLoading()
        })
      },
      approveOrder: function () {
        this.$refs.confirmModal.modal('机票订单审批')
          .then(v => {
              this.showLoading('处理中')
              const params = {
                'denyCode': v.denyCode,
                'denyReason': v.denyReason
              }
              approveFlightOrder(this.id, params, v => this.commonShowMessage(v), () => this.hideLoading())
          })
          .catch(ex => {})

      },
      saveComment: function () {
        const params = {
          'orderType': 1000,
          'orderId': this.id,
          'content': this.commentContent
        }
        saveComment(params, v => {
          this.commonShowMessage(v)
          if (v.status === 'OK') {
            //刷新评论
            this.searchComments()
          }
        })
      },
      searchComments: function () {
        const params = {
          'orderType': 1000,
          'orderId': this.id
        }
        searchComments(params, v => {
          this.comments = v
        })        
      }
    }
  }
  // 874
</script>