<template>
  <div id="flight-order-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/hotel/orders'>酒店订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-sm table-striped table-hover small">
          <thead>
              <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>成本中心</th>
                  <th>项目名称</th>
                  <th>预订人</th>
                  <th>收款方式</th>
                  <th>收款备注</th>
                  <th>收款状态</th>
                  <th>服务费</th>
                  <th>总金额</th>
                  <th>订单状态</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                  <td>
                    {{detail.customerName}}
                  </td>
                  <td>{{detail.costCenter}}</td>
                  <td>{{detail.projectName}}</td>
                  <td>{{detail.operator}}</td>
                  <td>
                    {{getPayTypeDesc(detail.payType)}}
                  </td>
                  <td>{{detail.payRemark}}</td>
                  <td>
                    <span class="text-danger" v-if="detail.payStatus === 0">未收款</span>
                    <span class="text-info"   v-else-if="detail.payStatus === 1">已收款</span>
                    <span class="text-primary" v-else-if="detail.payStatus === 2">已销账</span>
                  </td>
                  <td>{{detail.serviceCharge}}</td>
                  <td>{{detail.totalAmount}}</td>
                  <td>{{getStatusDesc(detail.status)}}</td>
              </tr>
          
          </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">酒店信息</div>      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>房型</th>
                    <th>到店日期</th>
                    <th>离店日期</th>
                    <th>房间数</th>
                    <th>销售价</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>
                        {{detail.hotelName}}
                    </td>                             
                    <td>{{detail.roomType}}</td>
                    <td>{{detail.checkInDate}}</td>
                    <td>{{detail.checkOutDate}}</td>
                    <td>{{detail.roomCount}}</td>
                    <td>{{detail.price}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">客人信息</div>      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>姓名</th>
                </tr>
            </thead>
            <tbody>
                <tr>   
                    <td>
                        {{detail.passengerName}}
                    </td>                             
                </tr>                               
            </tbody>
        </table>
        <div class="card-body py-0">
            备注: {{detail.remark}}
        </div>
      </div>
      
    </template>

  </div>
  
</template>

<script>
  import { APP_FLIGHT_PATH, SUPPLIER_HOTEL } from '../../common/const.js'
  import { showPayType, showPsgType } from '../../common/common.js'

  import { searchHotelOrder, showHotelOrderStatus } from '../../api/hotel.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0,
        orderNo: '',

        modalTitle: '',
        modalNullable: false,

        histories: []
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      psgCount: function () {
        if (this.detail !== null) {
          this.priceInfo.ticketCount = this.detail.passengers.length
          return this.priceInfo.ticketCount
        } else {
          this.priceInfo.ticketCount = 1
          return 1
        }
      },
      supplierId: function () {
        return this.detail.supplierId
      },
      payMethodId: function () {
        return this.detail.paymentMethodId
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
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },
      search: function () {
      	searchHotelOrder(this.id, (val) => { this.detail = val })
      },
      getStatusDesc: function (status) {
        return showHotelOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('操作失败：' + jsonResult.errmsg, 'danger')
        } else {
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
          this.search()
        }
      } 
    }
  }
</script>