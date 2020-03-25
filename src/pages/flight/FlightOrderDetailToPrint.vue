<template>
  <div id="flight-order-detail-print">
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-response table-sm table-striped table-hover">
          <thead>
              <tr>
                  <th>客户名称</th>
                  <th>订单号</th>
                  <th>预订人</th>
                  <th>开票人</th>
                  <th>出票日期</th>
                  <th>支付方式</th>
                  <th>支付备注</th>
                  <th>订单金额</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>
                    <template v-if="detail.customer !== null">
                      {{detail.customer.vipName}}
                  </template>
                </td>
                <td>{{detail.orderNo}}</td>
                <td>{{detail.operator}}</td>
                <td>{{detail.ticketer}}</td>
                <td>{{detail.etdzDate}}</td>
                <td>{{getPayTypeDesc(detail.payType)}}</td>
                <td>{{detail.payRemark}}</td>
                <td>{{detail.totalAmount}}</td>
              </tr>
          
          </tbody>
        </table>
        <div class="card-body bg-info py-0">乘机人</div>      
        <table class="table table-response table-striped table-hover table-sm">
            <thead>
                <tr>
                    <th class="text-right">姓名</th>
                    <th>证件号</th>
                    <th>常旅客号</th>
                    <th>手机号</th>
                    <th>票号</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.passengers">   
                    <td class="text-right">
                        {{info.name}}
                    </td>                             
                    <td>{{info.idNo}}</td>
                    <td>{{info.ffpNo}}</td>
                    <td>{{info.mobile}}</td>
                    <td>
                      <template v-if="detail.status === 16 || detail.status === 32">
                      {{info.ticketNo}}
                      </template>
                    </td>
                    <td>
                    </td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info py-0">航班信息</div>    
        <table class="table table-response table-striped table-hover table-sm">
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
                <tr v-for="(info, index) in detail.flights">   
                    <td>
                        {{info.flight.departureAirportName}} 
                        <small>{{info.flight.departureAirport}}</small>
                    </td>                             
                    <td>
                        {{info.flight.arrivalAirportName}}
                        <small>{{info.flight.arrivalAirport}}</small>
                    </td>
                    <td>{{info.flight.departureDate}}</td>
                    <td>{{info.flight.flightNo}}</td>
                    <td>{{info.flight.departureTime}}</td>
                    <td>{{info.flight.arrivalTime}}</td>
                    <td>{{info.flight.subclass}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info py-0" v-if="showPrice === 1">价格信息</div>          
        <div class="card-body py-0"  v-if="showPrice === 1">
          <div class="d-flex flex-row  justify-content-between">
            <div class="p-2 text-nowrap">销售价: {{detail.parvalue + detail.serviceCharge}}</div>
            <div class="p-2 text-nowrap">税: {{detail.tax}}</div>
            <div class="p-2 text-nowrap">保险费: {{detail.insurance}}</div>
            
          </div>
          <div class="d-flex flex-row  justify-content-between">
            <div class="p-2 text-nowrap">客户让利: {{detail.discount}}</div>
            <div class="p-2 text-nowrap">小计: {{detail.amount}}</div>
            <div class="p-2 text-nowrap text-success">总计: {{detail.totalAmount}}</div>
          </div>
        </div>
      </div>
      <div class="card">
          <div class="card-body py-0">
              <p>联系人：{{detail.linkman}}</p>
              <p>联系电话：{{detail.linkPhone}}</p>
              <p>备注: {{detail.remark}}</p>
          </div>
      </div>
      <template v-if="detail.deliveries.length > 0">
        <table class="table table-response table-striped table-hover table-sm">
            <thead>
                <tr>
                    <th>派送日期</th>
                    <th>收件人</th>
                    <th>联系电话</th>
                    <th>邮寄地址</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="info in detail.deliveries ">   
                    <td>{{info.deliveryDate}}</td>
                    <td>{{info.receiver}}</td>                             
                    <td>{{info.mobile}}</td>                             
                    <td>{{info.address}}</td>                             
                    <td>{{info.remark}}</td>
                </tr>                               
            </tbody>
        </table>
      </template>
      <template v-else-if="detail.itineraryType > 0">
        <table class="table table-response table-striped table-hover table-sm">
            <thead>
                <tr>
                    <th>派送日期</th>
                    <th>收件人</th>
                    <th>联系电话</th>
                    <th>邮寄地址</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>{{detail.deliveryDate}}</td>
                    <td>{{detail.itineraryRecipient}}</td>                             
                    <td>{{detail.itineraryRecipientMobile}}</td>                             
                    <td>{{detail.itineraryMailingAddress}}</td>                             
                    <td>{{detail.itineraryMailingMemo}}</td>
                </tr>                               
            </tbody>
        </table>
      </template>
    </template>

  </div>
  
</template>

<script>
  import { searchFlightOrderDetail, incFlightOrderPrintCount } from '../api/flight.js'
  import { showPayType } from '../common/common.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0,
        showPrice: 0
      }
    },
    mounted: function () {
      this.$store.commit('setPrintMode', 1)
      this.id = this.$route.params.id
      console.log(this.$route)
      // console.log(this.$route.query.showPrice)
      if (this.$route.query.showPrice !== undefined) {
        const x = Number.parseInt(this.$route.query.showPrice)
        if (!isNaN(x)) {
          this.showPrice = x
        }
      }
      // console.log(this.showPrice)
      
      this.searchOrderDetail()
    },
    methods: {
      searchOrderDetail: function () {
        searchFlightOrderDetail(this.id, (val) => {
          this.detail = val
          this.incPrintCount()
        })
      },
      incPrintCount: function () {
        incFlightOrderPrintCount(this.id, () => {})
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      }
    }
  }
  // 874
</script>