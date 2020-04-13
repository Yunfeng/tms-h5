<template>
  <div id="flight-refund-order-detail">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item"><router-link to='/flt/refund/orders'>退票单</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped small mb-0">
          <thead>
              <tr>
                  <th>退票单号</th>
                  <th>票号</th>
                  <th>乘客</th>
                  <th>证件号</th>
                  
                  <th class="text-right">销售价</th>
                  <th class="text-right">税</th>
                  <th class="text-right">实收</th>
                  <th class="text-right">退票费</th>
                  <th class="text-right">服务费</th>
                  <th>状态</th>
                  <th class="text-right">实退</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.refundOrderNo}}</td>
                  <td>{{detail.balanceCode}}-{{detail.ticketNo}}
                    <span class="text-danger" v-if="detail.intlTicket === 1">国际</span>
                    <span v-else>国内</span>
                  </td>
                  <td>{{detail.psgName}}</td>
                  <td>{{detail.idNo}}</td>
                  <td class="text-right">{{detail.parValue}}</td>
                  <td class="text-right">{{detail.tax}}</td>
                  <td class="text-right">{{detail.ticketAmount}}</td>
                  <td class="text-right">{{detail.airRefundCharge}}</td>
                  <td class="text-right">{{detail.serviceCharge}}</td>      
                  <td>
                    {{showRefundOrderStatus(detail.status)}}
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>
                  <td class="text-right">
                      <strong>{{detail.passengerRefundAmount}}</strong>
                  </td>
              </tr>

          </tbody>
        </table>
        <table class="table table-sm table-striped small">
          <thead>
              <tr>
                  <th>公司名称</th>
                  <th>收款方式</th>
                  <th>收款备注</th>
                  <th>退款日期</th>
                  <th class="text-right">提交时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>
                    <template v-if="detail.customer !== null">{{detail.customer.vipName}}</template>
                  </td>
                  <td>{{showPayType(detail.payType)}}</td>
                  <td>{{detail.payRemark}}</td>
                  <td>{{detail.psgRefundDate}}</td>
                  <td class="text-right">{{detail.createTime}}</td>

              </tr>

          </tbody>
        </table>
        <div class="card-body bg-info py-0">航班信息</div>    
        <table class="table table-striped table-hover table-sm small">
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
                <tr v-for="(info, index) in detail.flights" :key="index">   
                    <td>
                        {{info.dportName}} 
                        <small>{{info.dport}} {{info.dterm}}</small>
                    </td>                             
                    <td>
                        {{info.aportName}}
                        <small>{{info.aport}}  {{info.aterm}}</small>
                    </td>
                    <td>{{info.ddate}}</td>
                    <td>{{info.flightNo}}</td>
                    <td>{{info.dtime}}</td>
                    <td>{{info.atime}}</td>
                    <td>{{info.subclass}}</td>
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
  import { searchRefundOrderDetail, showRefundOrderStatus, showReasonCodeDesc, searchRefundOrderDetailByOrderNo } from '../../api/flight-refund.js'
  import { showPayType } from '../../common/common.js'
  import { ORDER_FLIGHT_REFUND } from '../../common/const.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0,
        refundOrderNo: '',
        histories: [],

        modalTitle: '',
        price1Title: '',
        price2Title: ''
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      if (this.id === 0) {
        this.refundOrderNo = this.$route.query.orderNo
      }

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
        // searchRefundOrderDetail(this.id, (val) => { this.detail = val })
        if (this.id > 0) {
          searchRefundOrderDetail(this.id, (val) => { this.detail = val })
        } else {
          searchRefundOrderDetailByOrderNo(this.refundOrderNo, v => {
            this.detail = v
            this.id = this.detail.id
          })
        }
      },
      showRefundOrderStatus: function (val) {
        return showRefundOrderStatus(val)
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
  // 315
</script>