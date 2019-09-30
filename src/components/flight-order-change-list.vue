<template>
  <table id="flight-refund-list" class="table table-sm table-striped table-hover">
    <thead>
      <tr>
        <th>改签单号</th>
        <th>票号</th>
        <th></th>
        <th>乘客/公司</th>
        <th colspan="6" class="bg-info text-center text-white">行程</th>
        <th class="text-right">改签费</th>
        <th class="text-right">服务费</th>
        <th>新票号</th>
        <th>提交时间</th>
        <th>状态</th>
        <th></th>
      </tr>                        
    </thead>
    <tbody>
      <tr v-for="(info, index) in dataList" v-bind:class="{'success text-white': info.bePaid === '1'}" :key="index">
        <td>{{info.changeOrderNo}}</td>
        <td>
          <strong>{{info.balanceCode}}-{{info.ticketNo}}</strong>
          <br />
          <i><small>
            <span class="text-danger" v-if="info.intlTicket === 1">国际</span>
            <span v-else>国内</span>  
          </small></i>
        </td>
        <td>
          <span class="text-primary" v-if="info.changeCount > 0">{{info.changeCount+1}}</span>
        </td>
        <td>
          <strong>{{info.psgName}}</strong>
          <br />
          <i><small>{{showCustomerName(info)}}</small></i>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.departureAirport}}
              {{flt.flight.departureAirportName}}
              <br/>
            </span>
          </template>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.arrivalAirport}}
              {{flt.flight.arrivalAirportName}}
              <br/>
            </span>
          </template>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.departureDate.substring(5)}}
              <br/>
            </span>
          </template>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.flightNo}}
              <br/>
            </span>
          </template>
        </td>
        <td>
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.subclass}}
              <br/>
            </span>
          </template>
        </td>
        <td class="text-center">
          <template v-for="(flt, index) in info.flights">
            <span :class="{'font-italic small': flt.flightType === 0}" :key="index">
              {{flt.flight.departureTime}}
              <br/>
            </span>
          </template>
        </td>                
        <td class="text-right">{{info.airChangeCharge}}</td>
        <td class="text-right">{{info.serviceCharge}}</td>
        <td>{{info.newTicketNo}}</td>                
        <td>{{info.createTime.substring(5, 16)}}</td>
        <td>
          {{getStatus(info.status)}}
          <span class="small text-primary" v-if="info.payStatus === 2">已销</span>
        </td>
        <td>
          <router-link :to="`/flt/change/order/` + info.id" class="small text-info float-right">
            <template v-if="info.status === 2">详细</template>
            <template v-else><span class="text-success">处理</span></template>            
          </router-link>  
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
      getStatus: function (status) {
        return showChangeOrderStatus(status)
      },
      showCustomerName: function (info) {
        return showCustomerName(info)
      }
    }
  }
</script>