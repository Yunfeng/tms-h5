<template>
  <table class="table table-sm table-striped table-hover" id="flight-refund-list">
      <thead>
          <tr>
              <th>单号</th>
              <th>票号</th>
              <th colspan="3" class="bg-info text-center text-white">所退行程</th>
              <th></th>
          </tr>                        
      </thead>
      <tbody>
          <tr v-for="(info, index) in dataList" v-bind:class="{'success text-white': info.bePaid === '1'}" @click.stop="showDetail(info.id)">
              <td>{{info.refundOrderNo}}</td>
              <td>
                <span class="text-success" v-if="info.status === 32">{{info.balanceCode}}-{{info.ticketNo}}</span>
                <span class="text-white-50 bg-dark" v-else-if="info.status === 4">{{info.balanceCode}}-{{info.ticketNo}}</span>
                <span v-else>{{info.balanceCode}}-{{info.ticketNo}}</span>
                
              </td>
              <td>
                <template v-for="(flt, index) in info.flights">
                  <span class="text-success">{{flt.flight.departureAirport}}</span>
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <span class="text-success">{{flt.flight.arrivalAirport}}</span>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.flight.flightNo}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <i class="fas fa-angle-right fa-2"></i>
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
      showDetail: function (id) {
        this.$router.push(`/h5/flt/refund/order/` + id)
      },
      getStatus: function (status) {
        return showRefundOrderStatus(status)
      },
      getReasonCodeDesc: function (status) {
        return showReasonCodeDesc(status)
      },
      showCustomerName: function (info) {
        return showCustomerName(info)
      },
      calcAirRefund: function (info) {
        const ar = info.cost - info.airRefundCharge
        return Math.round(ar * 100) / 100
      },
      calcPsgRefund: function (info) {
        const pr = info.ticketAmount - info.airRefundCharge - info.serviceCharge
        return Math.round(pr * 100) / 100
      },
      calcProfit: function (info) {
        const profit = this.calcAirRefund(info) - this.calcPsgRefund(info)
        return Math.round(profit * 100) / 100
      },
      calcProfit2: function (t1, t2) {
        const profit = t1 - t2
        return Math.round(profit * 100) / 100
      }
    }
  }
</script>