<template>
  <div id="settlement-report">
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-striped table-sm small">
            <thead>
                <tr>
                    <th>结算单号</th>
                    <th>名称</th>
                    <th>客户名称</th>
                    <th>客户编号</th>
                    <th>金额</th>
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
                      <template v-if="detail.customer !== null">
                        {{detail.customer.customerCode}}  
                      </template>                    
                    </td>
                    <td>
                        {{detail.amount}}
                    </td>
                </tr>
            </tbody>
        </table>   
      </div>
      <div class="card">
        <table class="table table-striped table-sm small">
          <thead>
              <tr>
                  <th>订单日期</th>
                  <th>乘机人</th>
                  <th>出发</th>
                  <th>到达</th>
                  <th>航班号</th>
                  <th>起飞日期</th>
                  <th>起飞时间</th>
                  <th class="text-right">销售价</th>
                  <th class="text-right">税收</th>
                  <th class="text-right">应付</th>
                  <th>票号</th>
                  <th>备注</th>
              </tr>                        
          </thead>
          <tbody>
            <template v-for="info in detail.tickets">
              <template v-for="(flt, index) in info.details">
                <tr v-if="index === 0">
                  <td>{{info.orderDate}}</td>
                  <td>{{info.passengerName}}</td>
                  <td>{{flt.dportName}}</td>
                  <td>{{flt.aportName}}</td>
                  <td>
                    <span class="small" v-if="info.ticketType === 2 && flt.flightType === 0">原</span>
                    <span class="small" v-if="info.ticketType === 2 && flt.flightType === 1">新</span>
                    {{flt.flight}}
                  </td>
                  <td>{{flt.ddate}} </td>
                  <td>{{flt.dtime}}</td>
                  <td class="text-right">
                    {{info.showParvalue}}
                  </td>
                  <td class="text-right">{{info.tax}}</td>
                  <td class="text-right">{{info.amount}}</td>
                  <td>
                    <template v-if="info.ticketType === 0">
                      {{info.balanceCode}}-{{info.ticketNo}}
                      <template v-if="info.ticketCount > 1">
                        -{{info.ticketNoEnd}}
                      </template>                      
                    </template>
                    <template v-if="info.ticketType === 1">
                      {{info.balanceCode}}-{{info.ticketNo}}
                      <span class="text-danger small">退</span>
                    </template>
                    <template v-if="info.ticketType === 2">
                      {{info.showTicketNo}}
                      <span class="text-warning small">改</span>
                    </template>                                      
                  </td>
                  <td>
                    <span class="text-danger" v-if="info.ticketType === 1">退票</span>
                    <span class="text-warning" v-if="info.ticketType === 2">
                      改签
                    </span>                    
                  </td>
                </tr>
                <tr v-else>
                  <td class="text-center" colspan="2"></td>
                  <td>{{flt.dportName}}</td>
                  <td>{{flt.aportName}}</td>
                  <td>
                    <span class="small" v-if="info.ticketType === 2 && flt.flightType === 0">原</span>
                    <span class="small" v-if="info.ticketType === 2 && flt.flightType === 1">新</span>
                    {{flt.flight}}
                  </td>
                  <td>{{flt.ddate}}</td>
                  <td>{{flt.dtime}}</td>
                  <td class="text-center" colspan="8"></td>                  
                </tr>
              </template>
            </template>

            <!-- refund -->
            <template v-for="info in detail.refunds">
                <template v-for="(flt, index) in info.details">
                  <tr v-if="index === 0">
                    <td>{{info.orderDate}}</td>
                    <td>{{info.passengerName}}</td>
                    <td>{{flt.dportName}}</td>
                    <td>{{flt.aportName}}</td>
                    <td>{{flt.flight}}</td>
                    <td>{{flt.ddate}}</td>
                    <td>{{flt.dtime}}</td>
                    <td class="text-right">{{info.amount}}</td>
                    <td class="text-right"></td>
                    <td class="text-right">{{info.amount}}</td>
                    <td>
                      {{info.balanceCode}}-{{info.ticketNo}}
                    </td>
                    <td>退票</td>
                  </tr>
                  <tr v-else>
                    <td colspan="2"></td>
                    <td>{{flt.dportName}}</td>
                    <td>{{flt.aportName}}</td>
                    <td>{{flt.flight}}</td>
                    <td>{{flt.ddate}}</td>
                    <td>{{flt.dtime}}</td>
                    <td colspan="7"></td>
                  </tr>

                </template>
            </template>

            <!-- change -->
            <template v-for="info in detail.changes">
              <template v-for="(flt, index) in info.details">
                <tr v-if="index === 0">
                  <td>{{info.orderDate}}</td>
                  <td>{{info.passengerName}}</td>
                  
                  <td>{{flt.dportName}}</td>
                  <td>{{flt.aportName}}</td>
                  <td>
                    <span class="small" v-if="flt.flightType === 0">原</span>
                    <span class="small" v-if="flt.flightType === 1">新</span>
                    {{flt.flight}}
                  </td>
                  <td>{{flt.ddate}}</td>
                  <td>{{flt.dtime}}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                  <td class="text-right">{{info.amount}}</td>
                  <td>{{info.showTicketNo}}</td>                  
                  <td>改签</td>
                </tr>
                <tr v-else>
                  <td class="text-center" colspan="2"></td>
                  <td>{{flt.dportName}}</td>
                  <td>{{flt.aportName}}</td>
                  <td>
                    <span class="small" v-if="flt.flightType === 0">原</span>
                    <span class="small" v-if="flt.flightType === 1">新</span>
                    {{flt.flight}}
                  </td>
                  <td>{{flt.ddate}}</td>
                  <td>{{flt.dtime}}</td>
                  <td colspan="8"></td>
                </tr>
              </template>
            </template>

            <!-- vas order -->
            <template v-for="info in detail.vasOrders">
              <template v-if="info.details.length > 0">
                <template v-for="(flt, index) in info.details">
                  <tr v-if="index === 0">
                    <td>{{info.orderDate}}</td>
                    <td>{{info.passengerName}}</td>
                    <td>{{flt.dportName}}</td>
                    <td>{{flt.aportName}}</td>
                    <td>{{flt.flight}}</td>
                    <td>{{flt.ddate}}</td>
                    <td>{{flt.dtime}}</td>
                    <td class="text-right">{{info.total}}</td>
                    <td></td>
                    <td class="text-right">{{info.total}}</td>
                    <td></td>
                    <td>{{info.productName}}</td>
                  </tr>
                  <tr v-else>
                    <td></td>
                    <td></td>
                    <td>{{flt.dportName}}</td>
                    <td>{{flt.aportName}}</td>
                    <td>{{flt.flight}}</td>
                    <td>{{flt.ddate}}</td>
                    <td>{{flt.dtime}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                      <td class="text-center"></td>
                      <td class="text-right"></td>
                    
                  </tr>
                </template>                
              </template>
              <template v-else>
                <tr>
                    <td>{{info.orderDate}}</td>
                    <td>{{info.productName}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right">{{info.total}}</td>
                    <td></td>
                    <td class="text-right">{{info.total}}</td>
                    <td></td>
                    <td>{{info.productName}}</td>
                  </tr>                
              </template>
            </template>

            <!-- hotel -->
            <template v-if="detail.hotels.length > 0">
              <tr v-for="info in detail.hotels">
                    <td>{{info.saleDate}}</td>
                    <td>{{info.passengerName}}</td>
                    <td></td>
                    <td></td>
                    <td>{{info.hotelName}}</td>
                    <td>{{info.ddate}}</td>
                    <td>{{info.leaveDate}}</td>
                    <td class="text-right">{{info.totalAmount}}</td>
                    <td>&nbsp;</td>
                    <td class="text-right">{{info.totalAmount}}</td>
                    <td></td>
                    <td>酒店</td>
                </tr>
            </template>

            <!-- train -->
            <template v-if="detail.trains.length > 0">
              <tr v-for="info in detail.trains">
                    <td>{{info.saleDate}}</td>
                    <td>{{info.passengerName}}</td>
                    <td>{{info.dcity}}</td>
                    <td>{{info.acity}}</td>
                    <td>{{info.trainNo}}</td>
                    <td>{{info.ddate}}</td>
                    <td></td>
                    <td class="text-right">{{info.total}}</td>
                    <td>&nbsp;</td>
                    <td class="text-right">{{info.totalCost}}</td>
                    <td></td>
                    <td>火车票</td>
                </tr>
            </template>

          </tbody>
        </table>        
      </div>

    </template>  
  </div>  
</template>

<script>
  import { getSettlementReport } from '../api/bill.js'

  export default {
    data () {
      return {
        id: 0,
        detail: null,
        totalTicket: 0,
        totalVas: 0,
        totalChange: 0,
        totalRefund: 0,
        totalHotel: 0,
        totalTrain: 0,
        total: 0,

        showSubTotal: true
      }
    },
    mounted: function () {
      this.$store.commit('setPrintMode', 1)

      this.id = this.$route.params.id
      this.refresh()
      this.showErrMsg('此功能还在调试中...', 'danger')
    },
    methods: {
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
        this.showLoading()
        getSettlementReport(this.id, 
          v => {
            this.detail = v
            this.calcTotal()
          },
          () => this.hideLoading()
        )
      },
      calcTotal: function () {
        this.totalTicket = 0
        this.detail.tickets.forEach( x => this.totalTicket += x.amount)

        // 退票
        this.totalRefund = 0
        this.detail.refunds.forEach( x => this.totalRefund += x.amount)        

        //改签
        this.totalChange = 0
        this.detail.changes.forEach( x => this.totalChange += x.amount)

        //酒店
        this.totalHotel = 0
        this.detail.hotels.forEach( x => this.totalHotel += x.totalAmount)

        //火车票
        this.totalTrain = 0
        this.detail.trains.forEach( x => this.totalTrain += x.total)

        // 服务单
        this.totalVas = 0
        this.detail.vasOrders.forEach( x => this.totalVas += x.total)

        this.total = this.totalTicket + this.totalRefund + this.totalChange + this.totalHotel + this.totalTrain + this.totalVas
        if (this.total != this.detail.amount) this.showErrMsg('总计金额与结算单金额不相符')
      }
    }
  }
</script>