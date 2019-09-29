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
      <li class="nav-item">
        <a class="nav-link" id="pnr-tab" data-toggle="tab" href="#pnrDetailTab" role="tab" aria-controls="pnr" aria-selected="false">编码内容</a>
      </li>
      <li class="nav-item" v-if="detail !== null && detail.smsDetails.length > 0">
        <a class="nav-link" id="sms-tab" data-toggle="tab" href="#smsDetailTab" role="tab" aria-controls="sms" aria-selected="false">短信({{detail.smsDetails.length}})</a>
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
      <li class="nav-item" v-if="detail !== null && deliveryMode === 1">
        <a class="nav-link" id="delivery-tab" data-toggle="tab" href="#deliveryTab" role="tab" aria-controls="service" aria-selected="false">配送单({{detail.deliveries.length}})</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="orderDetailTab" role="tabpanel" aria-labelledby="order-tab" v-if="detail !== null">
        <div class="card">
          <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="detail.cancelRequest !== null && detail.cancelRequest.status === 0">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            操作员 <strong>{{detail.cancelRequest.operator}}</strong> 
            请求取消此订单，
            因为: <strong>{{detail.cancelRequest.reasonDesc}}</strong>, 
            可以吗？ 
            <button class="btn btn-sm btn-secondary" @click.stop="denyCancelRequest()">不同意</button> 
            <button class="ml-5 btn btn-success" @click.stop="agreeCancelRequest()">同意</button>
          </div>
          <div class="card-body bg-info text-white py-0">订单概要</div>      
          <table class="table table-sm table-striped table-hover mb-0">
            <thead>
                <tr>
                    <th>订单号</th>
                    <th>客户</th>
                    <th>国际?</th>
                    <th>编码</th>
                    <th></th>
                    <th></th>
                    <th>出票时限</th>
                    <th>预订人</th>
                    <th>开票人</th>
                    <th>收款方式</th>
                    <th>供应商</th>
                    <th>付款方式</th>
                    <th>出票日期</th>
                    <th>收款状态</th>
                    <th>订单状态</th>
                </tr>                        
            </thead>
            <tbody>
                <tr>
                  <td>{{detail.orderNo}}</td>
                    <td>
                        <template v-if="detail.customer !== null">
                          {{detail.customer.vipName}}
                          <span class="text-danger small">{{detail.customer.customerCode}}</span>
                      </template>
                      <template v-else>
                          散客
                      </template>
                      /{{detail.costCenter}}
                      /{{detail.projectName}}
                    </td>
                    <td>
                      <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                      <span v-else>国内</span>
                    </td>
                    <td>
                      <template v-if="detail.charterFlightId !== null">
                        <router-link :to="`/charter-flight/detail/` + detail.charterFlightId">包机</router-link>
                      </template>
                      <template v-else>
                        {{detail.pnrNo}}  
                      </template>
                    </td>
                    <td></td>
                    <td></td>
                    <td>{{detail.tktl}}</td>
                    <td>{{detail.operator}}</td>
                    <td>{{detail.ticketer}}</td>
                    <td>
                      {{getPayTypeDesc(detail.payType)}}
                      /{{detail.payRemark}}
                    </td>
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
                    <td>{{detail.etdzDate}}</td>
                    <td>
                      <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                      <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                      <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                    </td>
                    <td>
                      {{getStatusDesc(detail.status)}}
                    </td>
                </tr>
            
            </tbody>
          </table>
          <div class="card-body bg-info text-white py-0">乘机人信息</div>      
          <table class="table table-striped table-hover table-sm mb-0">
              <thead>
                  <tr>
                      <th class="text-right">姓名</th>
                      <th>证件</th>
                      <th>常旅客号</th>
                      <th>手机号</th>
                      <th>乘客类型</th>
                      <th>票号</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(info, index) in detail.passengers" :key="index">   
                      <td class="text-right">
                          {{info.name}}
                          <span class="text-danger" v-if="info.vipLevel > 0">VIP-{{info.vipLevel}}</span>
                      </td>                             
                      <td>
                        <span class="text-info">{{showIdTypeDesc(info.idType)}}</span> {{info.idNo}}
                      </td>
                      <td>{{info.ffpNo}}</td>
                      <td>{{info.mobile}}</td>
                      <td>{{showPsgType(info.psgType)}}</td>
                      <td>
                        <template v-if="detail.status === 16 || detail.status === 32">
                        {{info.ticketNo}}
                          <template v-if="info.ticketCount > 1"> - {{info.ticketNoEnd}}</template>
                        </template>
                      </td>
                      <td>
                        <template v-if="detail.status === 0">
                          <a href="javascript:void(0)" @click.stop="editPsg(index)" class="small">修改</a>
                        </template>
                        <template v-if="detail.status === 32">
                          <a href="javascript:void(0)" @click.stop="changeTicket(index)" class="btn btn-sm btn-warning">改签</a>
                          <a href="javascript:void(0)" @click.stop="multiRefundTicket(index)" class="btn btn-sm btn-outline-danger ml-2">退(废)票</a>                        
                        </template>

                        <a href="javascript:void(0)" @click.stop="sendSms(index)" class="btn btn-sm btn-info float-right" v-if="detail.status !== 4">短信</a>
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
                  <tr v-for="(info, index) in detail.flights" :key="index">   
                      <td>
                        <span class="text-success">{{info.flight.departureAirport}}</span>
                          {{info.flight.departureAirportName}} 
                          {{info.flight.departureTerminal}} 
                          
                      </td>                             
                      <td>
                        <span class="text-success">{{info.flight.arrivalAirport}}</span>
                          {{info.flight.arrivalAirportName}}
                          {{info.flight.arrivalTerminal}}
                          
                      </td>
                      <td>{{info.flight.departureDate}}</td>
                      <td>{{info.flight.flightNo}}</td>
                      <td>
                        {{info.flight.departureTime}}
                      </td>
                      <td>
                        <span class="small text-info" v-if="info.flight.arrivalDate !== info.flight.departureDate">
                          {{info.flight.arrivalDate}}  
                        </span>
                        
                        {{info.flight.arrivalTime}}                        
                      </td>
                      <td>{{info.flight.subclass}}</td>
                  </tr>                               
              </tbody>
          </table>
          <div class="card-body bg-info text-white py-0">价格信息</div>          
            <template v-if="priceEditing === 0">
              <div class="card-body py-0">
                <div class="d-flex flex-row  justify-content-between" v-if="detail.adultCount > 0">
                  <div class="p-2 text-nowrap">成人</div>
                  <div class="p-2 text-nowrap">票面价: {{detail.price}}</div>
                  <div class="p-2 text-nowrap">销售价: {{detail.parvalue}}</div>
                  <div class="p-2 text-nowrap">税: {{detail.tax}}</div>
                  <div class="p-2 text-nowrap">保险费: {{detail.insurance}}</div>
                  <div class="p-2 text-nowrap">代理费: {{detail.commission}}</div>
                  <div class="p-2 text-nowrap">服务费: {{detail.serviceCharge}}</div>
                  <div class="p-2 text-nowrap">客户让利: {{detail.discount}}</div>
                  <div class="p-2 text-nowrap">人数: {{detail.adultCount}}</div>
                  <div class="p-2 text-nowrap">应收: {{detail.amount}}</div>
                  <div class="p-2 text-nowrap">成本: {{detail.cost}}</div>
                </div>
                <div class="d-flex flex-row  justify-content-between" v-if="detail.childCount > 0">
                  <div class="p-2 text-nowrap">儿童</div>
                  <div class="p-2 text-nowrap">票面价: {{detail.chdPrice}}</div>
                  <div class="p-2 text-nowrap">销售价: {{detail.chdParvalue}}</div>
                  <div class="p-2 text-nowrap">税: {{detail.chdTax}}</div>
                  <div class="p-2 text-nowrap">保险费: {{detail.chdInsurance}}</div>
                  <div class="p-2 text-nowrap">代理费: {{detail.chdCommission}}</div>
                  <div class="p-2 text-nowrap">服务费: {{detail.chdServiceCharge}}</div>
                  <div class="p-2 text-nowrap">客户让利: {{detail.chdDiscount}}</div>
                  <div class="p-2 text-nowrap">人数: {{detail.childCount}}</div>
                  <div class="p-2 text-nowrap">应收: {{detail.chdAmount}}</div>
                  <div class="p-2 text-nowrap">成本: {{detail.chdCost}}</div>
                </div>
                <div class="d-flex flex-row  justify-content-between" v-if="detail.infantCount > 0">
                  <div class="p-2 text-nowrap">婴儿</div>
                  <div class="p-2 text-nowrap">票面价: {{detail.infPrice}}</div>
                  <div class="p-2 text-nowrap">销售价: {{detail.infParvalue}}</div>
                  <div class="p-2 text-nowrap">税: {{detail.infTax}}</div>
                  <div class="p-2 text-nowrap">保险费: {{detail.infInsurance}}</div>
                  <div class="p-2 text-nowrap">代理费: {{detail.infCommission}}</div>
                  <div class="p-2 text-nowrap">服务费: {{detail.infServiceCharge}}</div>
                  <div class="p-2 text-nowrap">客户让利: {{detail.infDiscount}}</div>
                  <div class="p-2 text-nowrap">人数: {{detail.childCount}}</div>
                  <div class="p-2 text-nowrap">应收: {{detail.infAmount}}</div>
                  <div class="p-2 text-nowrap">成本: {{detail.infCost}}</div>
                </div>
                <div class="d-flex flex-row  justify-content-between">
                  <div class="p-2 text-nowrap text-success">总计: {{detail.totalAmount}}</div>
                  <div class="p-2 text-nowrap text-success">成本: {{detail.totalCost}}</div>
                  <div class="p-2 text-nowrap text-success">利润: {{detail.profit}}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <my-price-input psgTypeName="成人" key="adultPriceInput" v-bind.sync="adultPrice" v-if="detail.adultCount > 0"></my-price-input>
              
              <my-price-input psgTypeName="儿童" key="childPriceInput" v-bind.sync="childPrice" v-if="detail.childCount > 0"></my-price-input>  

              <my-price-input psgTypeName="婴儿" key="infantPriceInput" v-bind.sync="infantPrice" v-if="detail.infantCount > 0"></my-price-input>  

              <table class="table table-sm">
                <tr>
                  <td class="text-center">
                      <button class="btn btn-primary" @click.stop="saveNewPrice()">保存</button>
                      <button class="btn btn-secondary btn-sm ml-3" @click.stop="cancelEditPrice()">取消</button>
                  </td>
                </tr>
              </table>
            </template>
        </div>
        <ul class="list-unstyled">
          <li>联系人：{{detail.linkman}}</li>
          <li>联系电话：{{detail.linkPhone}}</li>
          <li>备注: {{detail.remark}}</li>
        </ul>
        <table class="table table-striped table-hover table-sm" v-if="deliveryMode === 0">
            <thead>
                <tr>
                  <th></th>
                    <th>派送日期</th>
                    <th>收件人</th>
                    <th>联系电话</th>
                    <th>邮寄地址</th>
                    <th>备注</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr>  
                  <td>{{detail.deliveryNoteNo}}</td> 
                    <td>{{detail.deliveryDate}}</td>
                    <td>{{detail.itineraryRecipient}}</td>                             
                    <td>{{detail.itineraryRecipientMobile}}</td>                             
                    <td>{{detail.itineraryMailingAddress}}</td>                             
                    <td>{{detail.itineraryMailingMemo}}</td>
                    <td>
                      <template v-if="detail.itineraryMailingStatus === 0">
                        未邮寄
                      </template>
                      <template v-else-if="detail.itineraryMailingStatus === 1">
                        已邮寄
                      </template>
                    </td>
                </tr>                               
            </tbody>
        </table>
        <table class="table table-striped table-hover table-sm" v-if="detail.extras.length > 0">
            <thead>
                <tr>
                    <th>服务名称</th>
                    <th>服务单</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.extras" :key="index">   
                    <td>
                        {{info.productName}}
                    </td>                             
                    <td><router-link :to="`/vas/order/` + info.vasOrderId">服务单</router-link></td>
                </tr>                               
            </tbody>
        </table>
        <div class="card">
          <div class="card-body"> 
            <template v-if="!(detail.status === 4 || detail.status === 16 || detail.status === 32)">
              <button class="btn btn-danger btn-sm ml-auto mr-auto" @click.stop="cancelOrder()">取消订单</button>
            </template>

            <template v-if="detail.status === 0">
              <button class="btn btn-primary btn-sm ml-2 mr-auto" :disabled="btnDisabled" @click.stop="submitOrder()">申请开票</button>
              <button class="btn btn-warning btn-sm ml-5 mr-auto" @click.stop="sendApprovalSms()">发短信</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editCustomer()">更改客户</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editIntlTicket()">更改订单类型</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editPrice()">修改价格</button>
            </template>
            <template v-else-if="detail.status === 1">
              <button class="btn btn-success btn-sm ml-auto" @click.stop="approveOrder()">审批通过</button>            
            </template>
            <template v-else-if="detail.status === 2">
              <button class="btn btn-success btn-sm ml-auto mr-5" :disabled="btnDisabled" @click.stop="toTicketOrder()">我来开票</button>
            </template>
            <template v-else-if="detail.status === 8">
              <button class="btn btn-primary btn-sm ml-2 mr-5" @click.stop="fillTicketNo()" >填写票号</button>
              <button class="btn btn-secondary btn-sm" @click.stop="editPrice()">修改价格</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editTicketSupplier()">更改供应商</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editPnrNo()">更改编码</button>
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="changeTicketer()"  v-if="isAdmin">出票人</button>
              
            </template>
            <template v-else-if="detail.status === 16">
              <button class="btn btn-danger btn-sm ml-2" @click.stop="rollbackStatus()" v-if="isAdmin">
                回滚
              </button>

              <button class="btn btn-primary btn-sm ml-auto mr-5" @click.stop="fillTicketNo()" >修改票号</button>
              <button class="btn btn-secondary btn-sm" @click.stop="editPrice()">修改价格</button>
              <button class="btn btn-secondary btn-sm ml-auto mr-auto" @click.stop="editTicketSupplier()">更改供应商</button>
              <button class="btn btn-secondary btn-sm ml-auto mr-auto" @click.stop="editPnrNo()">更改编码</button>
              <button class="btn btn-danger btn-sm" @click.stop="finishOrder()">订单完成</button>
            </template>         
            <template v-else-if="detail.status === 32">
              <button class="btn btn-danger btn-sm ml-2" @click.stop="rollbackStatus()" v-if="isAdmin && detail.payStatus !== 2">
                回滚
              </button>
              <button class="btn btn-success btn-sm ml-2 float-right" @click.stop="outputBillInfo()" v-if="isAdmin">
                输出为账单
              </button>
            </template>         

            <template v-if="detail.status !== 32 && detail.status !== 4">
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="editRemark()" >修改备注</button>
            </template>
            <template v-if="detail.status !== 4 && detail.payStatus === 0 && isAdmin">
              <button class="btn btn-secondary btn-sm ml-2 mr-auto" @click.stop="setFlightOrderPaid()" >已收款</button>
            </template>

            <template v-if="deliveryMode === 0 && detail.itineraryType !== 0 && detail.itineraryMailingStatus === 0">
              <button type="button" class="btn btn-sm btn-info ml-auto mr-auto" @click.stop="updateDeliveryDate()">派送日期</button>
              <button type="button" class="btn btn-sm btn-secondary ml-auto mr-auto" @click.stop="finishDelivery()">行程单已邮寄</button>
            </template>
            
            <button class="btn btn-sm btn-secondary ml-2 float-right" @click.stop="addExtraService()" v-if="detail.status !== 4">增加服务</button>
            <button class="btn btn-sm btn-primary ml-2 float-right" @click.stop="addExtraService2()" v-if="detail.status !== 4">增加机场服务</button>

            <button class="btn btn-sm btn-secondary ml-2 float-right" @click.stop="printItinerary()" v-if="detail.status !== 4">行程单</button>
            <router-link :to="`/flt/order/` + detail.id + `/history`" class="btn btn-info btn-sm float-right">操作记录</router-link>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="pnrDetailTab" role="tabpanel" aria-labelledby="pnr-tab" v-if="detail !== null">
        <div class="card-block bg-faded" v-if="detail.pnrDetail != null " style="padding: 0">
          <div v-html="'<pre>' + detail.pnrDetail + '</pre>'">
          </div>
        </div>    
      </div>
      <div class="tab-pane fade" id="smsDetailTab" role="tabpanel" aria-labelledby="sms-tab" v-if="detail !== null && detail.smsDetails.length > 0">
        <sms-detail-list :dataList="detail.smsDetails"></sms-detail-list>   
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
      <div class="tab-pane fade" id="deliveryTab" role="tabpanel" aria-labelledby="delivery-tab" v-if="detail !== null && deliveryMode === 1">
        <delivery-list :dataList="detail.deliveries"></delivery-list>
        <div class="card">
          <div class="card-body">
            <button class="btn btn-primary" @click.stop="prepareDelivery()" v-if="detail.status !== 4">配送</button>
          </div>
        </div>
      </div>
    </div>    



    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-update-customer ref="updateCustomerModal"></my-modal-update-customer>
    <my-modal-supplier-update ref="updateSupplierModal"></my-modal-supplier-update>
    <my-modal-pay-method-update ref="updatePayMethodModal"></my-modal-pay-method-update>
    <my-modal-fill-ticket-no ref="fillTicketNoModal"></my-modal-fill-ticket-no>
    <my-modal-update-passenger ref="updatePassengerModal"></my-modal-update-passenger>
    <my-modal-refund-ticket-multi ref="multiRefundTicketModal"></my-modal-refund-ticket-multi>
    <my-modal-change-ticket ref="changeTicketModal"></my-modal-change-ticket>
    <my-modal-op2-update ref="updateOp2Modal">
      <span slot="title">{{modalTitle}}</span>
      <span slot="title2">{{modalTitle2}}</span>
    </my-modal-op2-update>
    <my-modal-change-date ref="updateDateModal">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-change-date>
    <my-modal-sms ref="modalSms" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-sms>
  </div>
  
</template>

<script>
  import $ from 'jquery'
  import { APP_FLIGHT_PATH, SUPPLIER_FLIGHT } from '../common/const.js'
  import { updateFlightOrderPrice, updateFlightOrderPassenger, updateFlightOrderRemark, updateFlightOrderSupplier, updateFlightOrderTicket, cancelFlightOrder, submitFlightOrder, toticketFlightOrder, agreeFlightOrderCancelRequest, denyFlightOrderCancelRequest, finishFlightOrderDelivery, updateFlightOrderPaymentMethod, updateFlightOrderPnr, updateFlightOrderCustomer, finishFlightOrder, updateFlightOrderIntl, updateFlightOrderDeliveryDate, updateFlightOrderTicketer, setFlightOrderPaid } from '../api/flight.js'
  import { searchFlightOrderDetail, outputFlightOrder2Bill, searchFlightOrderDetailByOrderNo } from '../api/flight.js'
  import { approveFlightOrder } from '../api/flight.js'
  import { showFlightOrderStatus, showPayType, showPsgType, showIdTypeDesc } from '../common/common.js'
  import { createRefundOrderMulti } from '../api/flight-refund.js'
  import { createChangeOrderMulti } from '../api/flight-change.js'
  import { sendFlightOrderSms, sendFlightOrderApprovalSms } from '../api/sms.js'
  import { rollbackFlightOrderStatus } from '../api/admin.js'
  import PriceInfo from '../common/PriceInfo.js'
  import MyPriceInput from '../components/flight-price-input.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalSupplierUpdate from '../components/my-modal-supplier-update-v2.vue'
  import MyModalPayMethodUpdate from '../components/my-modal-pay-method-update.vue'
  import MyModalFillTicketNo from '../components/my-modal-fill-ticketno.vue'
  import MyModalUpdatePassenger from '../components/my-modal-update-passenger.vue'
  import MyModalRefundTicketMulti from '../components/my-modal-refund-ticket-multi.vue'
  import MyModalChangeTicket from '../components/my-modal-change-ticket-multi.vue'
  import MyModalUpdateCustomer from '../components/my-modal-customer-update.vue'
  import MyModalOp2Update from '../components/my-modal-op1-update.vue'
  import MyModalChangeDate from '../components/my-modal-change-date.vue'
  import MyModalSms from '../components/my-modal-sms.vue'
  import FlightRefundList from '../components/flight-order-refund-list.vue'
  import FlightChangeList from '../components/flight-order-change-list.vue'
  import VasOrderList from '../components/vas-order-list.vue'
  import SmsDetailList from '../components/list/sms-detail-list.vue'
  import DeliveryList from '../components/list/delivery-list.vue'

  export default {
    components: {
      MyPriceInput,
      MyModalPrompt,
      MyModalUpdateCustomer,
      MyModalSupplierUpdate,
      MyModalPayMethodUpdate,
      MyModalFillTicketNo,
      MyModalUpdatePassenger,
      MyModalRefundTicketMulti,
      MyModalChangeTicket,
      MyModalOp2Update,
      MyModalChangeDate,
      MyModalSms,
      SmsDetailList,
      DeliveryList,
      FlightRefundList,
      FlightChangeList,
      VasOrderList
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
      },
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
      deliveryMode: function () {
        //配送模式 0-原有的，1-新的
        if (this.detail.itineraryType === 0) {
          return 1
        } else if (this.detail.deliveries.length === 0) {
          return 0
        } else {
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
          searchFlightOrderDetail(this.id, (val) => { this.detail = val })
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
      showIdTypeDesc: function (idType) {
        return showIdTypeDesc(idType)
      },
      setAdultPrice: function () {
        this.adultPrice.price = this.detail.price
        this.adultPrice.parvalue = this.detail.parvalue
        this.adultPrice.tax = this.detail.tax
        this.adultPrice.insurance = this.detail.insurance
        this.adultPrice.serviceCharge = this.detail.serviceCharge
        this.adultPrice.commRate = 0
        this.adultPrice.commission = this.detail.commission
        this.adultPrice.discountRate = 0
        this.adultPrice.discount = this.detail.discount
        this.adultPrice.amount = this.detail.amount
        this.adultPrice.cost = this.detail.cost
        this.adultPrice.ticketCount = this.detail.adultCount
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
      editPrice: function () {
        this.setAdultPrice()
        this.setChildPrice()
        this.setInfantPrice()

        this.priceEditing = 1
      },
      cancelEditPrice: function () {
        this.priceEditing = 0
      },
      saveNewPrice: function () {
        const params = {
          'adultCount': this.detail.adultCount,
          'childCount': this.detail.childCount,
          'infantCount': this.detail.infantCount,
          'adultPrice': this.adultPrice,
          'childPrice': this.childPrice,
          'infantPrice': this.infantPrice
        }

        const str = JSON.stringify(params)

        updateFlightOrderPrice(this.id, str,
          (jsonResult) => {
            this.commonShowMessage(jsonResult)
            if (jsonResult.status === 'OK') {
              this.priceEditing = 0
              this.showErrMsg('操作成功')
            } else {
              this.showErrMsg('操作失败', 'danger')
            }
          }
        )
      },
      editPsg: function (index) {
        this.$refs.updatePassengerModal.modal(this.detail.passengers[index]).then((info) => {
          updateFlightOrderPassenger(this.id, info, v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      editRemark: function () {
        this.modalTitle = '请输入新的备注：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          updateFlightOrderRemark(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      cancelOrder: function () {
        this.modalTitle = '请输入取消订单的理由：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          cancelFlightOrder(this.id, { 'reasonDesc': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      submitOrder: function () {
        this.btnDisabled = true
        this.showLoading('处理中')
        submitFlightOrder(this.id, v => this.commonShowMessage(v), () => {
          this.btnDisabled = false
          this.hideLoading()
        })
      },
      setFlightOrderPaid: function () {
        this.modalTitle = '请输入备注：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          setFlightOrderPaid(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      approveOrder: function () {
        this.showLoading('处理中')
        approveFlightOrder(this.id, v => this.commonShowMessage(v), () => this.hideLoading())
      },
      toTicketOrder: function () {
        this.btnDisabled = true
        this.showLoading('处理中')
        toticketFlightOrder(this.id, v => {
          this.commonShowMessage(v)
        }, () => {
          this.btnDisabled = false
          this.hideLoading()
        })
      },
      finishOrder: function () {
        // 此处允许修改出票日期
        this.modalTitle = '请输入出票日期（默认当天)：'
        this.$refs.updateDateModal.modal().then((remark) => {
          finishFlightOrder(this.id, { 'etdzDate': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      outputBillInfo: function () {
        outputFlightOrder2Bill(this.id, v => this.commonShowMessage(v))
      },
      editCustomer: function () {
        this.$refs.updateCustomerModal.modal(this.customerId).then((info) => {
          updateFlightOrderCustomer(this.id, {
            'customerId': info.customerId,
            'costCenter': info.costCenter,
            'projectName': info.projectName
          }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editIntlTicket: function () {
        const intlTicket = this.detail.intlTicket
        let newIntlTicket = 0
        if (intlTicket === 0) {
          this.modalTitle = '确定更改为国际机票订单？'
          newIntlTicket = 1
        } else {
          this.modalTitle = '确定更改为国内机票订单？'
          newIntlTicket = 0
        }

        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          updateFlightOrderIntl(this.id, { 'intlTicket': newIntlTicket }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editTicketSupplier: function () {
        this.$refs.updateSupplierModal.modal(this.supplierId, this.payMethodId, SUPPLIER_FLIGHT).then((info) => {
          const params = {
            'supplierId': info.supplierId,
            'paymentMethodId': info.paymentMethodId,
            'autoTicketing': info.autoTicketing,
            'price': info.price
          }

          updateFlightOrderSupplier(this.id, params, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editPnrNo: function () {
        this.modalTitle = '修改编码：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((pnrNo) => {
          updateFlightOrderPnr(this.id, { 'pnrNo': pnrNo }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      fillTicketNo: function () {
        // console.log(this.detail.passengers)
        this.$refs.fillTicketNoModal.modal(this.detail.passengers).then((info) => {
          updateFlightOrderTicket(this.id, JSON.stringify(info), v => this.commonShowMessage(v))
        }).catch(ex => {})
      },
      addExtraService: function () {
        this.$router.push({ path: '/new/vas/order', query: { flightOrderId: this.id }})
      },
      addExtraService2: function () {
        this.$router.push({ path: '/vaas/order', query: { flightOrderId: this.id }})
      },
      prepareDelivery: function () {
        this.$router.push({ path: '/delivery/note', query: { orderNo: this.detail.orderNo }})
      },
      denyCancelRequest: function () {
        this.modalTitle = '请输入拒绝理由：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          const params = {
            'reasonDesc': remark,
            'requestId': this.detail.cancelRequest.id
          }
          denyFlightOrderCancelRequest(this.id, params, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      agreeCancelRequest: function () {
        const params = { 'requestId': this.detail.cancelRequest.id }
        agreeFlightOrderCancelRequest(this.id, params,
          (jsonResult) => { this.commonShowMessage(jsonResult) }
        )
      },
      finishDelivery: function () {
        this.modalTitle = '请输入派送行程单备注：'
        this.modalNullable = false
        this.$refs.modalPrompt.modal().then((remark) => {
          finishFlightOrderDelivery(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
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

        const params = {
          'orderId': this.id,
          'orderNo': this.detail.orderNo,
          'intlTicket': this.detail.intlTicket,
          'oldPnrNo': this.detail.pnrNo,
          'amount': psgPrice.amount,
          'cost': psgPrice.cost,
          'parvalue': psgPrice.parvalue,
          'tax': psgPrice.tax,
          'flights': this.detail.flights
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
      sendSms: function (index) {
        const psgInfo = this.detail.passengers[index]
        this.modalTitle = '请输入接收短信的手机号（默认使用乘机人号码）：'
        this.modalNullable = true
        this.$refs.modalSms.modal(2, this.id, psgInfo.id).then(v => {
          // console.log(v.mobile, v.smsContent)
          sendFlightOrderSms(this.id, {
            'psgId': psgInfo.id,
            'mobileNo': v.mobile,
            'smsContent': v.smsContent,
            'smsFormat': v.smsFormat }, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
      sendApprovalSms: function (index) {
        this.modalTitle = '请输入接收短信的手机号（默认使用代订人号码）：'
        this.modalNullable = true
        this.$refs.modalSms.modal(0, this.id, 0).then(v => {
          // console.log(v.mobile, v.smsContent)
          sendFlightOrderApprovalSms(this.id, { 'mobileNo': v.mobile, 'smsContent': v.smsContent }, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
      updateDeliveryDate: function () {
        // 此处允许修改出票日期
        this.modalTitle = '请输入派送日期（格式：2017-1-28）：'
        this.$refs.updateDateModal.modal().then((newDate) => {
          updateFlightOrderDeliveryDate(this.id, { 'deliveryDate': newDate }, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
      changeTicketer: function () {
        this.modalTitle = '更改出票人'
        this.modalTitle2 = '出票人'
        this.$refs.updateOp2Modal.modal(this.detail.ticketer).then((info) => {
          // console.log(info)
          updateFlightOrderTicketer(this.id, { 'ticketer': info.op1 }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      rollbackStatus: function () {
        this.modalTitle = '确定将订单状态回滚吗？并请输入理由：'

        this.$refs.modalPrompt.modal().then((remark) => {
          rollbackFlightOrderStatus(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((ex) => { console.log(ex) })
      },
      printItinerary: function () {
        const url = '/' + APP_FLIGHT_PATH + '/order/flight/' + this.id + '/itinerary'
        window.open(url)
      }
    }
  }
  // 874
</script>