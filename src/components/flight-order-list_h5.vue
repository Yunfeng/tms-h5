<template>
  <table id="flight-order-list" class="table table-response table-sm table-striped small">
    <thead>
      <tr>
        <th>订单号</th>
        <th>乘机人</th>
        <th colspan="3" class="bg-info text-center text-white">行程</th>
        <th></th>
      </tr>                        
    </thead>
    <tbody>
      <template v-for="(info, index) in dataList">
        <tr :class="{'text-muted': info.status === 4}" :key="info.id" @click.stop="showDetail(info.id)">
          <td>{{info.orderNo}}</td>
          <td>
              <template v-for="(psg, index) in info.passengers">
                {{psg.name}} 
                <template v-if="index < info.passengers.length - 1 "><br/></template>
              </template>
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
                {{flt.flight.departureDate.substring(5)}}
                <template v-if="index < info.flights.length - 1 "><br/></template>
              </template>
          </td>
          <td>            
            <i class="fas fa-angle-right fa-2"></i>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
  import { showFlightOrderStatus, showPayType, showItineraryType } from '../common/common.js'

  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      showDetail: function (id) {
        this.$router.push('/h5/flt/order/' + id)
      },
      getStatusDesc: function (status) {
        return showFlightOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      getItineraryTypeDesc: function (itineraryType) {
        return showItineraryType(itineraryType)
      }
    }
  }
</script>