<template>
  <div id="vas-order-detail">
    <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        <span class="fa-2">租车订单详情</span>
    </div>

    <template v-if="detail !== null">
      <div class="card">
        <div class="card-body py-0">
          <dl class="row mb-2">
            <dt class="col-4">询价单号</dt>
            <dd class="col-8">{{detail.orderNo}} {{getStatusDesc(detail.status)}}</dd>

            <dt class="col-4">使用类型</dt>
            <dd class="col-8">{{showUseTypeDesc(detail.useType)}}</dd>

            <dt class="col-4">城市</dt>
            <dd class="col-8">{{detail.cityName}}</dd>

            <dt class="col-4">机场</dt>
            <dd class="col-8">{{detail.airportCode}}</dd>

            <dt class="col-4">航班号</dt>
            <dd class="col-8">{{detail.flightNo}}</dd>

            <dt class="col-4">使用时间</dt>
            <dd class="col-8">{{detail.useTime}}</dd>

            <dt class="col-4">出发地址</dt>
            <dd class="col-8">{{detail.departureAddress}}</dd>

            <dt class="col-4">到达地址</dt>
            <dd class="col-8">{{detail.arrivalAddress}}</dd>

            <dt class="col-4">车型</dt>
            <dd class="col-8">{{detail.vehicleTypeName}}</dd>

            <dt class="col-4">价格</dt>
            <dd class="col-8">{{detail.price}}</dd>

            <dt class="col-4">优惠</dt>
            <dd class="col-8">{{detail.discount}}</dd>
            
            <dt class="col-4">联系人：</dt>
            <dd class="col-8">{{detail.linkman}}</dd>

            <dt class="col-4">联系电话：</dt>
            <dd class="col-8">{{detail.linkPhone}}</dd>

            <dt class="col-4">备注</dt>
            <dd class="col-8">{{detail.remark}}</dd>
          </dl>
        </div>        
        <div class="card-body py-0" v-if="detail.status === 2 || detail.status === 8">
          <dl class="row mb-2">
            <dt class="col-4">车牌</dt>
            <dd class="col-8">{{detail.vehicleNo}}</dd>

            <dt class="col-4">品牌</dt>
            <dd class="col-8">{{detail.vehicleTypeBrand}}</dd>

            <dt class="col-4">司机姓名</dt>
            <dd class="col-8">{{detail.driverName}}</dd>

            <dt class="col-4">司机电话</dt>
            <dd class="col-8">{{detail.driverPhone}}</dd>

            <dt class="col-4">司机状态：</dt>
            <dd class="col-8">{{detail.driverStatusDesc}}</dd>

            <dt class="col-4">订单状态：</dt>
            <dd class="col-8">{{detail.supplierOrderStatusDesc}}</dd>

          </dl>
        </div>
        <div class="card-body py-1">
            <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 10">
              <button class="btn btn-danger btn-sm ms-auto me-auto" @click.stop="cancelOrder()">取消订单</button>
              <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="approveOrder()">审批订单</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 1">
              <button class="btn btn-danger btn-sm ms-autome-auto" @click.stop="cancelOrder()">取消订单</button>
            </div>
            
            <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="onlinePay()">支付订单</button>
        </div>
      </div>
      <div class="card">
          <div class="card-header small">
              <a href="javascript:void(0)" class="float-right" @click.stop="viewHistory()">查看历史记录</a>
          </div>
          <table class="table table-sm table-striped small">
              <tr>
                  <td>操作员</td>
                  <td>内容</td>
                  <td>时间</td>
              </tr>
              <tr v-for="info in histories">
                  <td>{{info.operator}}</td>
                  <td>{{info.content}}</td>
                  <td>{{info.createTime}}</td>
              </tr>
          </table>
      </div>
    </template>

    <div id="paymentForm" ></div>
    <my-modal-confirm ref="confirmModal"></my-modal-confirm>

  </div>
</template>

<script>
  import { searchRentalCarOrder, searchRentalOrderHistory, cancelRentalCarOrder, showOrderStatusDesc, showUseTypeDesc, payForRentalCarOrder, approveRentalCarOrder } from '../../api/rentalcar.js'
  import MyModalConfirm from '../../components/my-modal-prompt-confirm.vue'

  export default {
    components: {
      MyModalConfirm
    },
    data () {
      return {
        detail: null,
        id: 0,
        histories: []
      }
    },
    mounted: function () {
      this.id = this.$route.params.id
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
        searchRentalCarOrder(this.id, v => { this.detail = v })
      },
      getStatusDesc: function (status) {
        return showOrderStatusDesc(status)
      },
      showUseTypeDesc: function (status) {
        return showUseTypeDesc(status)
      },            
      viewHistory: function () {
        searchRentalOrderHistory(this.id, (jsonResult) => { this.histories = jsonResult })
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
      },
      cancelOrder: function () {
        cancelRentalCarOrder(this.id, v => this.commonShowMessage(v))
      },
      approveOrder: function () {
        this.$refs.confirmModal.modal('用车订单审批')
          .then(v => {
              // this.showLoading('处理中')
              const params = {
                'denyCode': v.denyCode,
                'denyReason': v.denyReason
              }
              console.log(params)
              approveRentalCarOrder(this.id, params, v => this.commonShowMessage(v), () => this.hideLoading())
          })
          .catch(ex => {})
      },
      onlinePay: function () {
        payForRentalCarOrder(this.detail.id, v => {
          if (v.status === 'OK') {
            this.showErrMsg('如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。', 'info')
            console.log(v.url)
            $('#paymentForm').empty().html(v.url)
            document.forms['alipaysubmit'].submit()            
          } else {
            this.showErrMsg(v.errmsg, 'danger')
          }
        })
      },
    }
  }
  // 530
</script>