<template>
  <table class="table table-sm table-striped table-hover" id="flight-refund-list">
      <thead>
          <tr>
              <th>退票单号</th>
              <th>票号</th>
              <th>乘客/公司</th>
              <th colspan="5" class="bg-info text-center text-white">所退行程</th>
              <th>提交时间</th>
              <th>状态</th>
              <th class="text-right">退款金额</th>
              <th></th>
          </tr>                        
      </thead>
      <tbody>
          <tr v-for="(info, index) in dataList" v-bind:class="{'success text-white': info.bePaid === '1'}" :key="index">
              <td>{{info.refundOrderNo}}</td>
              <td>
                <strong>{{info.balanceCode}}-{{info.ticketNo}}</strong><br />
                <i><small>
                  <span class="text-danger " v-if="info.intlTicket === 1">国际</span>
                  <span v-else>国内</span>
                  <span :class="{'text-danger': info.reasonCode === 4}">{{getReasonCodeDesc(info.reasonCode)}}</span>
                </small></i>
              </td>
              <td>
                <strong>{{info.psgName}}</strong><br />
                <small>{{showCustomerName(info)}}</small>
              </td>
              <td>
                <template v-for="(flt, index) in info.flights">
                  <span :key="index">{{flt.flight.departureAirport}} {{flt.flight.departureAirportName}}<br /></span>
                </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <span :key="index">{{flt.flight.arrivalAirport}} {{flt.flight.arrivalAirportName}}<br /></span>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <span :key="index">{{flt.flight.departureDate}}<br /></span>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <span :key="index">{{flt.flight.flightNo}}<br /></span>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <span :key="index">{{flt.flight.subclass}}<br /></span>
                  </template>
              </td>
              <td>{{info.createTime.substring(5, 16)}}</td>
              <td>
                {{getStatus(info.status)}}
                <span class="small text-primary" v-if="info.payStatus === 2">已销</span>
              </td>
              <td class="text-right">
                  <strong>{{info.passengerRefundAmount}}</strong>
              </td>
              <td>
                <router-link :to="`/flt/refund/order/` + info.id" class="small text-info float-right">
                  <template v-if="info.status === 32">详细</template>
                  <template v-else><span class="text-success">处理</span></template>
                </router-link>  
              </td>
          </tr>

      </tbody>
  </table>
</template>

<script>
  import { showRefundOrderStatus, showReasonCodeDesc } from '../api/flight-refund.js'
  import { showCustomerName } from '../common/common.js'

  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getStatus: function (status) {
        return showRefundOrderStatus(status)
      },
      getReasonCodeDesc: function (status) {
        return showReasonCodeDesc(status)
      },
      showCustomerName: function (info) {
        return showCustomerName(info)
      }
    }
  }
</script>