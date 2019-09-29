<template>
  <table id="flight-order-list" class="table table-response table-sm table-striped table-hover small">
    <thead>
      <tr>
        <th></th>
        <th>类型</th>
        <th>国际</th>
        <th>原编码</th>
        <th>乘机人</th>
        <th colspan="5" class="bg-info text-center text-white">行程</th>
        <th>新编码</th>
        <th>授权Office</th>
        <th>备注</th>
        <th>订单日期</th>
        <th>状态</th>
        <th>次数</th>
        <th>更新时间</th>
        <td></td>
      </tr>                        
    </thead>
    <tbody>
      <template v-for="(info, index) in dataList">
        <tr :class="{'text-muted': info.status === 4}" :key="info.id">
          <td>{{info.id}}</td>
          <td>{{getMonitorType(info.monitoring)}}</td>
          <td>
            <span class="text-danger" v-if="info.intlTicket === 1">国际</span>
          </td>
          <td>
            {{info.oldPnrNo}}  
          </td>
          <td>
              <template v-for="(psg, index) in info.passengers">
                <b>{{psg.name}}</b>
                <br/>
                <span class="small text-info">{{psg.idNo}},{{psg.idType}}</span>
                <br/>
                <small>{{psg.mobile}}</small>
                <template v-if="index < info.passengers.length - 1 "><br/></template>
              </template>
          </td>
          <td>
              <template v-for="(flt, index) in info.flights">
                <small class="text-success">{{flt.flight.departureAirport}}</small>
                {{flt.flight.departureAirportName}}
                {{flt.flight.departureTerminal}}                
                <template v-if="index < info.flights.length - 1 "><br/></template>
              </template>
          </td>
          <td>
              <template v-for="(flt, index) in info.flights">
                <small class="text-success">{{flt.flight.arrivalAirport}}</small>
                {{flt.flight.arrivalAirportName}}
                {{flt.flight.arrivalTerminal}}
                <template v-if="index < info.flights.length - 1 "><br/></template>
              </template>
          </td>
          <td>
              <template v-for="(flt, index) in info.flights">
                {{flt.flight.departureDate}}
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
              <template v-for="(flt, index) in info.flights">
                {{flt.flight.subclass}}
                <template v-if="index < info.flights.length - 1 "><br/></template>
              </template>
          </td>
          <td>
            {{info.newPnrNo}}
          </td>
          <td>
            {{info.authOfficeNo}}
          </td>
          <td>
            {{info.remark}}
          </td>
          <td>
            {{info.createTime.substring(5)}}
          </td>
          <td>
            {{getStatusDesc(info.status)}}
            <span class="text-danger small" v-if="info.dayAndNight === 1">日夜</span>
          </td>
          <td>
            {{info.tryCount}}
          </td>
          <td>
            <template v-if="info.lastUpdate !== null">
              {{info.lastUpdate.substring(5)}}  
            </template>            
          </td>
          <td>
            <button @click.stop="copyOrder(info.id)">复制</button>
            <template v-if="info.status === 0 || info.status === 1">
              <button class="btn btn-sm btn-danger float-right" @click.stop="cancelOrder(info.id)">取消</button>
            </template>
            <template v-else-if="info.status === 4 || info.status === 2">
              <button class="btn btn-sm btn-info ml-3 " @click.stop="monitorOrder(info.id)">重新监控</button>

              <button class="btn btn-sm btn-danger ml-3" @click.stop="deleteOrder(info.id)">删除</button>
            </template>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
  import { cancelCatchOrder, monitorCatchOrder, showMonitorTypeDesc, showOrderStatus } from '../api/catch-order.js'

  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getStatusDesc: function (status) {
        return showOrderStatus(status)
      },
      getMonitorType: function (monitoring) {
        return showMonitorTypeDesc(monitoring)
      },
      cancelOrder: function (id) {
        cancelCatchOrder(id,
          {'reasonDesc': 'test'},
          v => {
            console.log(v)
            this.$emit('refresh')
          }
        )
      },
      monitorOrder: function (id) {
        monitorCatchOrder(id,
          v => {
            console.log(v)
            this.$emit('refresh')
          }
        )
      },
      copyOrder: function (id) {
        this.$emit('copyOrder', id)
      },
      deleteOrder: function (id) {
        this.$emit('deleteOrder', id)
      }
    }
  }
</script>