<template>
  <table class="table table-response table-sm table-striped table-hover small">
    <thead>
        <tr>
            <th>订单号</th>
            <th>产品名称</th>
            <th>客户</th>
            <th>乘机人</th>
            <th colspan="5" class="bg-info text-center text-white">行程</th>
            <th>付款方式</th>
            <th>预订员</th>
            <th>提交时间</th>
            <th class="text-right">订单金额</th>
            <th class="text-right">成本</th>
            <th class="text-right">利润</th>
            <th>状态</th>
            <th></th>
        </tr>                        
    </thead>
    <tbody>
      <template v-for="info in dataList">
        <tr :class="{'table-dark': info.status === 4}" :key="info.id" style="color: black">
            <td>{{info.orderNo}}</td>              
            <td>{{info.productName}}</td>              
            <td>
              <template v-if="info.customerType === 0">
                散客
              </template>
              <template v-else-if="info.customerType === 1 && info.customer !== null">
                {{info.customer.vipName}}
              </template>
            </td>
            <td>
              <template v-for="(psg, index) in info.passengers">
                <span :key="psg.id">
                {{psg.name}} <b>{{psg.mobile}}</b><template v-if="index < info.passengers.length - 1"><br /></template>
                </span>
              </template>
            </td>
            <td>
              <template v-for="(flt, index) in info.flights">
                <span :key="flt.id">
                  <small class="text-success">{{flt.flight.departureAirport}}</small>
                  {{flt.flight.departureAirportName}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </span>
              </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  <span :key="flt.id">
                    <small class="text-success">{{flt.flight.arrivalAirport}}</small>
                    {{flt.flight.arrivalAirportName}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </span>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  <span :key="flt.id">
                    {{flt.flight.departureDate}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </span>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  <span :key="flt.id">
                    {{flt.flight.flightNo}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </span>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  <span :key="flt.id">
                    {{flt.flight.subclass}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </span>
                </template>
            </td>
            <td>
              {{getPayTypeDesc(info.payType)}}
              <span class="small text-danger" v-if="info.payType !== 8 && info.payStatus ===0">(未付)</span>
              <span class="small text-primary" v-if="info.payStatus === 2">已销</span>
            </td>
            <td>{{info.operator}}</td>
            <td>
              <template v-if="info.createTime !== null">
                {{info.createTime.substring(5)}}  
              </template>
              
            </td>
            <td class="text-right">{{info.totalAmount}}</td>
            <td class="text-right">{{info.totalCost}}</td>
            <td class="text-right">{{info.profit}}</td>
            <td>{{getStatusDesc(info.status)}}</td>

            <td>
              <template v-if="info.orderType ===0">
                <router-link :to="`/vas/order/` + info.id">详细</router-link>  
              </template>
              <template v-else>
                <router-link :to="`/vaas/order/` + info.id">详细</router-link>  
              </template>
            </td>
        </tr>
    
      </template>
    </tbody>
  </table>  
</template>

<script>
  import { showPayType } from '../common/common.js'
  import { showVasOrderStatus } from '../api/vas.js'

  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getStatusDesc: function (status) {
        return showVasOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
    }
  }
</script>