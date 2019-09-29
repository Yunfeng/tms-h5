<template>
  <table id="flight-order-list" class="table table-sm table-hover">
    <thead>
      <tr>
        <th>订单号</th>
        <th>客户</th>
        <th>编码</th>
        <th>乘机人</th>
        <th colspan="5" class="bg-info text-center text-white">行程</th>
        <th>预定员</th>
        <th>行程单?</th>
        <th>订单日期</th>
        <th class="text-right">金额</th>
        <th class="text-right">成本</th>
        <th class="text-right">利润</th>
        <th>订单状态</th>
        <th></th>
      </tr>                        
    </thead>
    <tbody>
      <template v-for="info in dataList">
        <tr :class="{'table-dark': info.status === 4}" :key="info.id" style="color: black">
          <td>
            {{info.orderNo}}
            <span class="text-danger" v-if="info.intlTicket === 1"><br />国际</span>
          </td>
          <td>
            <template v-if="info.customerType === 0">散客</template>
            <template v-else-if= "info.customer !== null">
              <template v-if="info.customer.enterpriseType === 1">
                <b>{{info.customer.vipName}}</b>
              </template>
              <template v-else>
                {{info.customer.vipName}}
              </template>      
              <br />        
              <span class="text-danger small">{{info.customer.customerCode}}</span>
            </template>
          </td>
          <td>
            <template v-if="info.charterFlightId !== null">
              <router-link :to="`/charter-flight/detail/` + info.charterFlightId">包机</router-link>
            </template>
            <template v-else>
              {{info.pnrNo}}  
            </template>
          </td>
          <td>
              <template v-for="psg in info.passengers">
                <span :key="psg.id">
                  {{psg.name}}
                  <small v-if="isChild(psg.psgType)" class="text-danger small">儿童</small>
                  <span class="text-danger" v-if="psg.vipLevel > 0">VIP{{psg.vipLevel}}</span>
                  <br />
                </span>
              </template>
          </td>
          <td colspan="5">
            <table class="table m-0 p-0 table-borderless small" style="background-color: transparent;">
              <tbody>
                <tr :key="flt.id" v-for="flt in info.flights">
                  <td class="m-0 p-0" width="30%">
                    {{flt.flight.departureAirport}} {{flt.flight.departureAirportName}}
                  </td>
                  <td class="m-0 p-0" width="30%">
                    {{flt.flight.arrivalAirport}} {{flt.flight.arrivalAirportName}}
                  </td>
                  <td class="my-0 py-0" width="20%">{{flt.flight.departureDate}}</td>
                  <td class="my-0 py-0" width="15%">{{flt.flight.flightNo}}</td>
                  <td class="my-0 py-0" width="5%">{{flt.flight.subclass}}</td>
                </tr>
              </tbody>
            </table>
          </td>

         
          <td>{{info.operator}}</td>
          <td>            
            <span :class="{'text-danger': info.itineraryType !== 0 && info.itineraryMailingStatus === 0}">
              {{getItineraryTypeDesc(info.itineraryType)}}
            </span>
          </td>
          <td>
            {{info.createDate.substring(5)}}
          </td>
          <td class="text-right">{{info.totalAmount}}</td>
          <td class="text-right">{{info.totalCost}}</td>
          <td class="text-right">{{info.profit}}</td>
          <td>
            {{getStatusDesc(info.status)}}
            <span class="text-danger small" v-if="info.payStatus === 0">未收</span>
            <span class="text-info small"   v-else-if="info.payStatus === 1">已收</span>
            <span class="text-primary small" v-else-if="info.payStatus === 2">已销</span>
          </td>
          <td class="text-left fa-2">            
            <router-link :to="`/flt/order/` + info.id"><i class="mdi mdi-arrow-right"></i></router-link>  
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
  import { PSG_ADU, PSG_CHD, PSG_INF }from '../common/const.js'
  import { showFlightOrderStatus, showPayType, showItineraryType } from '../common/common.js'

  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getStatusDesc: function (status) {
        return showFlightOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      getItineraryTypeDesc: function (itineraryType) {
        return showItineraryType(itineraryType)
      },
      showDetail: function (id) {
        this.$router.push('/flt/order/' + id)
      },
      isChild: function (psgType) {
        return psgType === PSG_CHD
      }
    }
  }
</script>