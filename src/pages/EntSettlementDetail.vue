<template>
  <div id="settlement-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><router-link to='/ent/settlements'>结算单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card mb-0">
        <table class="table table-striped table-sm small mb-0">
            <thead>
                <tr>
                    <th>结算单号</th>
                    <th>名称</th>
                    <th>客户</th>
                    <th>金额</th>
                    <th>收款状态</th>
                    <th>创建时间</th>
                    <th>修改时间</th>
                </tr>                        
            </thead>
            <tbody>
                <tr >
                    <td>{{detail.settlementNo}}</td>
                    <td>{{detail.name}}</td>
                    <td>
                      <template v-if="detail.customerType === 0">
                        散客
                      </template>
                      <template v-else-if="detail.customer !== null">
                        {{detail.customer.name}}  
                      </template>                    
                    </td>
                    <td>
                      <a href="javascript:void(0)" @click.stop="adjustAmount()">
                        {{detail.amount}}
                      </a>
                    </td>
                    <td>
                      <template v-if="detail.paid === 0">
                        <span class="text-danger">未收款</span>
                        <button class="btn btn-sm btn-danger" v-if="detail.amount === 0" @click.stop="writeOff()">销账</button>  
                      </template>
                      <template v-else>
                        <span class="text-success">已收款</span> 
                        <button class="btn btn-sm btn-danger" @click.stop="undoWriteOff()" v-if="isAdmin">撤销</button> 
                      </template>
                    </td>
                    <td>{{detail.createTime}}</td>
                    <td>{{detail.lastUpdate}}</td>
                </tr>
            </tbody>
        </table>        
      </div>
      <ul class="nav nav-tabs nav-bordered mb-3" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="bills-tab" data-toggle="tab" href="#bills" role="tab" aria-controls="bills" aria-selected="true">所有账单</a>
        </li>
        <li class="nav-item" v-if="ticketCount > 0">
          <a class="nav-link" id="flight-tab" data-toggle="tab" href="#flight" role="tab" aria-controls="flight" aria-selected="false">机票 <small>({{ticketCount}},{{totalTicketAmount}})</small></a>
        </li>
        <li class="nav-item" v-if="refundCount > 0">
          <a class="nav-link" id="refund-tab" data-toggle="tab" href="#refund" role="tab" aria-controls="refund" aria-selected="false">退票 <small>({{refundCount}},{{totalRefundAmount}})</small></a>
        </li>
        <li class="nav-item" v-if="changeCount>0">
          <a class="nav-link" id="change-tab" data-toggle="tab" href="#change" role="tab" aria-controls="change" aria-selected="false">改签 <small>({{changeCount}},{{totalChangeAmount}})</small></a>
        </li>
        <li class="nav-item" v-if="vasCount>0">
          <a class="nav-link" id="vas-tab" data-toggle="tab" href="#vas" role="tab" aria-controls="vas" aria-selected="false">服务<small>({{vasCount}},{{totalVasAmount}})</small></a>
        </li>
        <li class="nav-item" v-if="hotelCount>0">
          <a class="nav-link" id="hotel-tab" data-toggle="tab" href="#hotel" role="tab" aria-controls="hotel" aria-selected="false">酒店<small>({{hotelCount}},{{totalHotelAmount}})</small></a>
        </li>
        <li class="nav-item" v-if="trainCount>0">
          <a class="nav-link" id="train-tab" data-toggle="tab" href="#train" role="tab" aria-controls="train" aria-selected="false">火车票<small>({{trainCount}},{{totalTrainAmount}})</small></a>
        </li>

      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="bills" role="tabpanel" aria-labelledby="bills-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <my-date-picker id="billDate0" v-model="billDate0" placeholder="账单日期"></my-date-picker>
                <input type="textfield" class="form-control ml-1" size="6" placeholder="账单号" v-model.trim="billNum">
                <input type="textfield" class="form-control ml-1" size="6" placeholder="订单号" v-model.trim="orderNo">
                <button type="button" class="btn btn-primary ml-1" @click.stop="searchBills()">查找账单</button>
                <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr class="bg-info text-white">
                        <th>账单日期</th>
                        <th>账单号</th>
                        <th>账单类型</th>
                        <th>订单号</th>
                        <th>收款方式</th>
                        <th></th>
                        <th class="text-right">金额</th>
                        <th class="text-right">成本</th>
                        <th class="text-right">利润</th>
                        <th class="text-right"></th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="10">
                    </td>
                    </tr>
                    <tr v-for="(info, index) in detail.bills">   
                        <td>{{info.opDate}}</td>
                        <td>
                          <router-link :to="`/bill/detail/` + info.id">{{(info.billNum)}}</router-link>
                        </td>                             
                        <td>
                            {{getTypeDesc(info.billType)}}
                        </td>
                        <td>{{info.orderNo}}</td>
                        <td>
                            {{info.payTypeNoteDesc}}
                            <template v-if="info.bePaid === '0'">
                                <span class="text-danger small">未收款</span>
                            </template>
                        </td>
                        <td>
                          <table class="table">
                            <tr v-for="t in info.tickets">
                              <td>{{t.balanceCode}}-{{t.ticketNo}}</td>
                              <td>{{t.passengerName}}</td>
                            </tr>
                          </table>
                        </td>
                        <td class="text-right">{{info.billSum}}</td>
                        <td class="text-right">{{info.cost}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="text-right">
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <button class="btn btn-danger btn-sm" @click.stop="removeBill(info.billNum)">移除</button>  
                          </template>                        
                        </td>
                    </tr>
                </tbody>
            </table>          
          </div>
        </div>
        <div class="tab-pane fade" id="flight" role="tabpanel" aria-labelledby="flight-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <input type="textfield" class="form-control" size="10" placeholder="票号" v-model.trim="ticketNo">
                <input type="textfield" class="form-control" size="10" placeholder="姓名" v-model.trim="passengerName">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchTickets()">查找</button>
                  <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset3()">重置</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>票号</th>
                        <th>乘机人</th>
                        <th>出票日期</th>
                        <th colspan="5" class="bg-info text-center text-white">行程</th>
                        <th class="text-center">实收</th>
                        <th class="text-center">成本</th>
                        <th class="text-center">利润</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in tickets" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
                        <td class="">{{info.passengerName}}</td>
                        <td >{{info.etdzDate}}</td>
                        <td>
                          <template v-for="(flt, index) in info.details">
                              {{flt.dport}}{{flt.dportName}}
                            <template v-if="index < info.details.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                          <template v-for="(flt, index) in info.details">
                            {{flt.aport}}{{flt.aportName}}
                            <template v-if="index < info.details.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.ddate}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.flight}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.subclass}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td class="text-right">{{info.accountRecv}}</td>
                        <td class="text-right">{{info.cost}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="refund" role="tabpanel" aria-labelledby="refund-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchRefunds()">查找</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>票号</th>
                        <th>乘机人</th>
                        <th colspan="5" class="bg-info text-center text-white">行程</th>
                        <th class="text-right">实收</th>
                        <th class="text-right">成本</th>
                        <th class="text-right">利润</th>
                        <th class="text-center">订单号</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in refunds" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
                        <td class="">{{info.psgName}}</td>
                        <td>
                          <template v-for="(flt, index) in info.flights">
                              {{flt.departureAirport}}{{flt.dportName}}
                            <template v-if="index < info.flights.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                          <template v-for="(flt, index) in info.flights">
                            {{flt.arrivalAirport}}{{flt.aportName}}
                            <template v-if="index < info.flights.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.departureDate}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.flightNo}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.subclass}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td class="text-right">{{info.passengerRefundAmount}}</td>
                        <td class="text-right">{{info.airlineRefundAmount}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="text-center">{{info.refundOrderNo}}</td>
                        <td>
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="change" role="tabpanel" aria-labelledby="change-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchChanges()">查找</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>票号</th>
                        <th>乘机人</th>
                        <th colspan="5" class="bg-info text-center text-white">行程</th>
                        <th class="text-right">实收</th>
                        <th class="text-right">成本</th>
                        <th class="text-right">利润</th>
                        <td class="text-center">订单号</td>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in changes" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
                        <td class="">{{info.psgName}}</td>
                        <td>
                          <template v-for="(flt, index) in info.flights">
                              {{flt.departureAirport}}{{flt.dportName}}
                            <template v-if="index < info.flights.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                          <template v-for="(flt, index) in info.flights">
                            {{flt.arrivalAirport}}{{flt.aportName}}
                            <template v-if="index < info.flights.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.departureDate}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.flightNo}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.flights">
                              {{flt.subclass}}
                              <template v-if="index < info.flights.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td class="text-right">{{info.airChangeCharge+info.serviceCharge}}</td>
                        <td class="text-right">{{info.airChangeCharge}}</td>
                        <td class="text-right">{{info.serviceCharge}}</td>
                        <td class="text-center">{{info.changeOrderNo}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="vas" role="tabpanel" aria-labelledby="vas-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchVases()">查找</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>服务名称</th>
                        <th>乘机人</th>
                        <th class="text-right">实收</th>
                        <th class="text-right">利润</th>
                        <th class="text-center">订单号</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in vasList" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.productName}}</td>
                        <td class="">{{info.passengerName}}</td>
                      
                        <td class="text-right">{{info.total}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="text-center">{{info.orderNo}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="hotel" role="tabpanel" aria-labelledby="hotel-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchHotels()">查找</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>酒店</th>
                        <th>入住人</th>
                        <th>房型</th>
                        <th>入住日期</th>
                        <th>离店日期</th>
                        <th class="text-right">实收</th>
                        <th class="text-right">成本</th>
                        <th class="text-right">利润</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in hotelList" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.hotelName}}</td>
                        <td class="">{{info.passengerName}}</td>
                        <td class="">{{info.roomType}}</td>
                        <td class="">{{info.ddate}}</td>
                        <td class="">{{info.leaveDate}}</td>                      
                        <td class="text-right">{{info.totalAmount}}</td>
                        <td class="text-right">{{info.totalCost}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="train" role="tabpanel" aria-labelledby="train-tab">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchTrains()">查找</button>
                </div> 
              </form>
            </div>
            <table class="table table-striped table-hover table-sm small">
                <thead>
                    <tr>
                        <th>乘车人</th>
                        <th>出发</th>
                        <th>到达</th>
                        <th>出发日期</th>
                        <th>车次</th>
                        <th>座位</th>
                        <th class="text-right">实收</th>
                        <th class="text-right">成本</th>
                        <th class="text-right">利润</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in trainList" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td class="">{{info.passengerName}}</td>
                        <td >{{info.dcity}}</td>
                        <td class="">{{info.acity}}</td>
                        <td class="">{{info.ddate}}</td>
                        <td class="">{{info.trainNo}}</td>                      
                        <td class="">{{info.seatClass}}</td>                      
                        <td class="text-right">{{info.total}}</td>
                        <td class="text-right">{{info.totalCost}}</td>
                        <td class="text-right">{{info.serviceCharge}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                          <template v-if="detail.paid === 0 || info.bePaid === '0'">
                            <a href="javascript:void(0)" @click.stop.prevent="removeBill(info.billNum)" class="text-danger">移除</a>
                          </template>                                                
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>          
        </div>
      </div>

      <div class="card mt-5">
        <table class="table table-sm table-striped small">
          <thead>
            <tr class="bg-info text-white">
                <td>操作员</td>
                <td>内容</td>
                <td>时间
                  <button class="btn btn-sm btn-primary float-right" @click.stop="searchHistory()">操作记录</button>
                </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in histories">
                <td>{{info.operator}}</td>
                <td>{{info.content}}</td>
                <td>{{info.createTime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  
    <my-modal-price-remark ref="modalAdjustAmount">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-price-remark>
    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
  </div>	
</template>

<script>
  import { removeBillOfSettlement, searchSettlementDetail, getBillTypeDesc, searchSettlementHistory, searchSettlementBills, adjustSettlementAmount, writeOffSettlement , undoWriteOffSettlement} from '../api/bill.js'
  import { searchSettlementTickets, searchSettlementRefunds, searchSettlementChanges, searchSettlementVases, searchSettlementHotels, searchSettlementTrains } from '../api/bill.js'
  import MyModalPriceRemark from '../components/my-modal-price-remark.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyModalPriceRemark,
      MyModalPrompt,
      MyDatePicker
    },
    data () {
      return {
        id: 0,
        detail: null,
        histories: [],

        billNum: '',
        orderNo: '',
        billDate0: '',

        modalTitle: '',
        modalNullable: false,

        passengerName: '',
        ticketNo: '',
        tickets: [],
        ticketCount: 0,
        totalTicketAmount: 0,

        refunds: [],
        refundCount: 0,
        totalRefundAmount: 0,

        changes: [],
        changeCount: 0,
        totalChangeAmount: 0,

        vasList: [],
        vasCount: 0,
        totalVasAmount: 0,

        hotelList: [],
        hotelCount: 0,
        totalHotelAmount: 0,

        trainList: [],
        trainCount: 0,
        totalTrainAmount: 0
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      this.id = this.$route.params.id
      this.refresh()
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
      refresh: function () {
        searchSettlementDetail(this.id, (jsonResult) => {
          this.detail = jsonResult
          
          this.searchTickets()
          this.searchRefunds()
          this.searchChanges()
          this.searchVases()
          this.searchHotels()
          this.searchTrains()
        })
      },
      getTypeDesc: function (v) {
        return getBillTypeDesc(v)
      },
      removeBill: function (billNum) {
        this.showLoading('处理中')
        removeBillOfSettlement(this.id, billNum, v => {
          if (v.status === 'OK') {
            this.refresh()
            this.showErrMsg('操作成功')
          } else {
            this.showErrMsg('操作失败: ' + v.errmsg, 'danger')
          }
          this.hideLoading()
        })
      },
      searchHistory: function () {
        searchSettlementHistory(this.id, v => {
          this.histories = v
        })
      },
      reset: function () {
        this.billNum = ''
        this.orderNo = ''
        this.billDate0 = ''
        this.searchBills()
      },
      searchBills: function () {
        const params = {
          'billNo': this.billNum,
          'orderNo': this.orderNo,
          'billDate': this.billDate0
        }

        this.detail.bills.splice(0)
        searchSettlementBills(this.id, params, (jsonResult) => {
          this.detail.bills = jsonResult
        })
      },
      writeOff: function () {
        this.modalTitle = '确定销账吗？'

        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          const params = {
            'receiptId': 0,
            'settlementId': this.id
          }

          writeOffSettlement(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.refresh()
            }
          })
        }).catch((ex) => {})
      },      
      searchTickets: function () {
        const params = {
          'psgName': this.passengerName,
          'ticketNo': this.ticketNo
        }

        // this.showLoading('加载中')
        searchSettlementTickets(this.id, params,
          v => {
            this.tickets = v
            this.calcTotalTicketAmount()
          },
          () => { this.hideLoading() }
        )
      },
      calcTotalTicketAmount: function () {
        this.totalTicketAmount = 0
        this.ticketCount = this.tickets.length
        for (const info of this.tickets) {
          this.totalTicketAmount += info.accountRecv
        }

        this.totalTicketAmount = Math.round(this.totalTicketAmount * 100) / 100
      },
      searchRefunds: function () {
        const params = {}

        // this.showLoading('加载中')
        searchSettlementRefunds(this.id, params,
          v => {
            this.refunds = v
            this.calcRefunds()
          },
          () => { this.hideLoading() }
        )
      },
      calcRefunds: function () {
        this.totalRefundAmount = 0
        this.refundCount = this.refunds.length
        for (const info of this.refunds) {
          this.totalRefundAmount += info.passengerRefundAmount
        }

        this.totalRefundAmount = Math.round(this.totalRefundAmount * 100) / 100
      },
      searchChanges: function () {
        const params = {}

        // this.showLoading('加载中')
        searchSettlementChanges(this.id, params,
          v => {
            this.changes = v
            this.calcChanges()
          },
          () => { this.hideLoading() }
        )
      },
      calcChanges: function () {
        this.totalChangeAmount = 0
        this.changeCount = this.changes.length
        for (const info of this.changes) {
          this.totalChangeAmount += info.airChangeCharge + info.serviceCharge
        }

        this.totalChangeAmount = Math.round(this.totalChangeAmount * 100) / 100
      },
      searchVases: function () {
        const params = {}

        searchSettlementVases(this.id, params,
          v => {
            this.vasList = v
            this.calcVasList()
          },
          () => { this.hideLoading() }
        )
      },
      calcVasList: function () {
        this.totalVasAmount = 0
        this.vasCount = this.vasList.length
        for (const info of this.vasList) {
          this.totalVasAmount += info.total
        }

        this.totalVasAmount = Math.round(this.totalVasAmount * 100) / 100
      },
      searchHotels: function () {
        const params = {}

        searchSettlementHotels(this.id, params,
          v => {
            this.hotelList = v
            this.calcHotelList()
          },
          () => { this.hideLoading() }
        )
      },
      calcHotelList: function () {
        this.totalHotelAmount = 0
        this.hotelCount = this.hotelList.length
        for (const info of this.hotelList) {
          this.totalHotelAmount += info.totalAmount
        }

        this.totalHotelAmount = Math.round(this.totalHotelAmount * 100) / 100
      },
      searchTrains: function () {
        const params = {}

        searchSettlementTrains(this.id, params,
          v => {
            this.trainList = v
            this.calcTrainList()
          },
          () => { this.hideLoading() }
        )
      },
      calcTrainList: function () {
        this.totalTrainAmount = 0
        this.trainCount = this.trainList.length
        for (const info of this.trainList) {
          this.totalTrainAmount += info.total
        }

        this.totalTrainAmount = Math.round(this.totalTrainAmount * 100) / 100
      },
      adjustAmount: function () {
        this.modalTitle = '请输入调整金额（扣除）及理由'
        this.$refs.modalAdjustAmount.modal(0, '').then(v => {
          const params = {
            'amount': v.price,
            'remark': v.remark
          }
          adjustSettlementAmount(this.id, params, v => {
            if (v.status === 'OK') {
              this.refresh()
              this.showErrMsg('操作成功')
            } else {
              this.showErrMsg('操作失败: ' + v.errmsg, 'danger')
            }
          })
        }).catch(ex => {})
      },
      reset3: function () {
        this.passengerName = ''
        this.ticketNo = ''
      },
      undoWriteOff: function () {
        this.modalTitle = '确定撤销销账吗？请输入 OK'

        this.$refs.modalPrompt.modal('').then((remark) => {
          const params = {
            'settlementId': this.id,
            'remark': remark
          }
          console.log(params)

          undoWriteOffSettlement(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.refresh()
            }
          })
          
        }).catch((ex) => {})        
      }
    }
  }
</script>