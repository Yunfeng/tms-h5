<template>
  <table id="flight-refund-list" class="table table-sm table-striped table-hover">
    <thead>
      <tr>
        <th>单号</th>
        <th>票号</th>
        <th colspan="3" class="bg-info text-center text-white">行程变化</th>
        <th></th>
      </tr>                        
    </thead>
    <tbody>
      <tr v-for="(info, index) in dataList" v-bind:class="{'success text-white': info.bePaid === '1'}"  @click.stop="showDetail(info.id)">
        <td>{{info.changeOrderNo}}</td>
        <td>
          {{info.balanceCode}}-{{info.ticketNo}}
          <span class="text-primary" v-if="info.changeCount !== undefined && info.changeCount > 0">*{{info.changeCount+1}}</span>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span v-if="flt.flightType === 1" class="text-success">新:</span>
            <span v-else-if="flt.flightType === 0" class="text-danger">原:</span>
            {{flt.flight.departureAirport}}
            <template v-if="index < info.flights.length - 1 "><br/></template>
          </template>
        </td>
        <td>
            <template v-for="(flt, index) in info.flights">
              {{flt.flight.arrivalAirport}}
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
  import { showChangeOrderStatus } from '../api/flight-change.js'
  import { showCustomerName } from '../common/common.js'
  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      showDetail: function (id) {
        this.$router.push(`/h5/flt/change/order/` + id)
      },
      getStatus: function (status) {
        return showChangeOrderStatus(status)
      },
      showCustomerName: function (info) {
        return showCustomerName(info)
      }
    }
  }
</script>