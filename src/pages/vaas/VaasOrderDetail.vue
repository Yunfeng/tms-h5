<template>
  <div id="vas-order-detail">
    <template v-if="detail !== null">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item">
              <router-link to='/vaas/orders'>机场服务订单（第三方服务)</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">详情</li>
          <span class="ml-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>

      <div class="card">
        <table class="table table-sm table-striped table-hover small">
          <thead>
            <tr>
              <th>服务单号</th>
              <th>外部订单号</th>
              <th>客户</th>
              <th>产品名称</th>
              <th class="text-right">数量</th>
              <th class="text-right">价格</th>
              <th class="text-right">折扣</th>
              <th class="text-right">总金额</th>
              <th class="text-center">付款方式</th>
              <th>状态</th>
            </tr>                        
          </thead>
          <tbody>
              <tr>
                <td>{{detail.orderNo}}</td>
                <td>{{detail.externalOrderNo}}</td>
                  <td>
                      <template v-if="detail.customer !== null">
                        {{detail.customer.vipName}}
                    </template>
                    <template v-else>
                        散客
                    </template>
                  </td>
                  <td>{{detail.productName}}</td>
                  <td class="text-right">{{detail.count}}</td>
                  <td class="text-right">{{detail.price}}</td>
                  <td class="text-right">{{detail.discount}}</td>
                  <td class="text-right">{{detail.total}}</td>
                  <td class="text-center">
                    {{getPayTypeDesc(detail.payType)}}
                    <template v-if="detail.payType !== 8 && detail.payStatus ===0">
                      <span class="small text-danger">(未付)</span>
                      <button class="btn btn-danger btn-sm" @click.stop="setOrderPaid()">已收款</button>
                    </template>
                    <span class="small text-primary" v-if="detail.payStatus === 2">已销</span>
                  </td>
                  <td>{{getStatusDesc(detail.orderStatus)}}</td>
              </tr>
          
          </tbody>
        </table>
        <table class="table table-sm table-striped table-hover small">
          <thead>
            <tr>
              <th class="text-center">成本中心</th>
              <th class="text-center">项目名称</th>
              <th>预定人</th>
            </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td class="text-center">
                    {{detail.costCenter}}
                  </td>
                  <td class="text-center">
                    {{detail.projectName}}
                  </td>
                  <td>{{detail.operator}}</td>
              </tr>
          
          </tbody>
        </table>        
        <div class="card-body bg-info text-white py-0">乘客信息</div>
      
        <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>证件号</th>
                    <th>手机</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(info, index) in detail.passengers" :key="info.id">   
                    <td >
                        {{info.name}}
                    </td>                             
                    <td>{{info.idNo}}</td>
                    <td>{{info.mobile}}</td>
                    <td>{{info.remark}}</td>
                </tr>                               
            </tbody>
        </table>
        <div class="card-body bg-info text-white py-0">航班信息</div>    
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
                <tr v-for="info in detail.flights" :key="info.id">   
                    <td>
                      <span class="text-success">{{info.dport}}</span>
                        {{info.dportName}} 
                        {{info.dterm}} 
                        
                    </td>                             
                    <td>
                      <span class="text-success">{{info.aport}}</span>
                        {{info.aportName}}
                        {{info.aterm}}
                        
                    </td>
                    <td>{{info.ddate}}</td>
                    <td>{{info.flightNo}}</td>
                    <td>{{info.dtime}}</td>
                    <td>{{info.atime}}</td>
                    <td>{{info.subclass}}</td>
                </tr>                               
            </tbody>
        </table>
      </div>
      <div class="card">
          <div class="card-header bg-secondary text-white">
              备注
          </div>
          <div class="card-body">
              {{detail.remark}}
          </div>
      </div>
      <div class="card">
        <div class="card-body py-1">
            <button class="btn btn-primary btn-sm ml-auto mr-auto" @click.stop="onlinePay()">支付订单</button>
        </div>
      </div>
      
    </template>
    <div id="paymentForm" ></div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { showPayType } from '../../common/common.js'
  import { searchVaasOrderDetail, showVasOrderStatus, payVaasOrder } from '../../api/vas.js'
  
  export default {
    data () {
      return {
        detail: null,
        id: 0,
        histories: [],

        remark: '',
        psgId: 0,
        psgName: '',
        psgIdNo: '',
        psgRemark: '',

        modalTitle: ''
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
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
        searchVaasOrderDetail(this.id, v => { this.detail = v })
      },
      getStatusDesc: function (status) {
        return showVasOrderStatus(status)
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
      },
      onlinePay: function () {
        payVaasOrder(this.detail.id, v => {
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