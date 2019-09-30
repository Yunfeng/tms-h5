<template>
  <div id="flight-change-order-detail">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item"><router-link to='/flt/change/orders'>改签单</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped">
          <thead>
              <tr>
                  <th>改签单号</th>
                  <th class="text-center">票号</th>
                  <th>乘客</th>
                  <th class="text-center">证件号</th>
                  <th class="text-right">销售价</th>
                  <th class="text-right">税</th>
                  <th class="text-right">改签费</th>
                  <th class="text-right">服务费</th>
                  <th>操作员</th>
                  <th>新票号</th>
                  <th>状态</th>
                  <th>提交时间</th>                  
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.changeOrderNo}}</td>
                  <td class="text-center">{{detail.balanceCode}}-{{detail.ticketNo}}</td>
                  <td>{{detail.psgName}}</td>
                  <td class="text-center">{{detail.idNo}}</td>
                  <td class="text-right">{{detail.parvalue}}</td>
                  <td class="text-right">{{detail.tax}}</td>
                  <td class="text-right">{{detail.airChangeCharge}}</td>
                  <td class="text-right">{{detail.serviceCharge}}</td>
                  <td>{{detail.operator}}</td>                
                  <td>{{detail.newTicketNo}}
                  </td>
                  <td>
                    {{getStatus(detail.status)}}
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>                
                  <td>{{detail.createTime}}</td>                  
              </tr>
          </tbody>
        </table>
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>公司名称</th>
              <th>原订单号</th>
              <th>国际?</th>
              <th>付款方式</th>
              <th>付款备注</th>
              <th>修改时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <template v-if="detail.customer !== null">{{detail.customer.vipName}}</template>
              </td>
              <td>
                {{detail.orderNo}}
              </td>
              <td>
                <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                <span v-else>国内</span>
              </td>

              <td>{{showPayType(detail.payType)}}</td>
              <td>{{detail.payRemark}}</td>
              <td>{{detail.lastUpdate}}</td>                 
            </tr>
          </tbody>
        </table>

        <div class="card-body bg-info py-0">航班信息</div>    
        <table class="table table-striped table-hover table-sm">
            <thead>
                <tr>
                    <th>出发</th>
                    <th>到达</th>
                    <th>航班号</th>
                    <th>舱位</th>
                    <th>出发日期</th>
                    <th>出发时间</th>
                    <th>到达时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.flights" :key="index">   
                    <td>
                      <span v-if="info.flightType === 1" class="text-success">新:</span>
                      <span v-if="info.flightType === 0" class="text-danger">原:</span>
                        {{info.flight.departureAirportName}} 
                        <small>{{info.flight.departureAirport}} {{info.flight.departureTerminal}}</small>
                    </td>                             
                    <td>
                        {{info.flight.arrivalAirportName}}
                        <small>{{info.flight.arrivalAirport}} {{info.flight.arrivalTerminal}}</small>
                    </td>
                    <td>{{info.flight.flightNo}}</td>
                    <td>{{info.flight.subclass}}</td>
                    <td>{{info.flight.departureDate}}</td>
                    <td>{{info.flight.departureTime}}</td>
                    <td>{{info.flight.arrivalTime}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body">
            备注: {{detail.remark}}
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  import { searchChangeOrderDetail, showChangeOrderStatus } from '../api/flight-change.js'
  import { showPayType } from '../common/common.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        searchChangeOrderDetail(this.id, (val) => { this.detail = val })
      },
      searchHistories: function () {
        searchChangeOrderHistory(this.id, v => { this.histories = v })
      },
      getStatus: function (val) {
        return showChangeOrderStatus(val)
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('失败：' + jsonResult.errmsg, 'danger')
        } else {
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
          this.search()
        }
      },
      showPayType: function (val) {
        return showPayType(val)
      }
    }
  }
  // 250
</script>