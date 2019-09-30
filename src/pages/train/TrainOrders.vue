<template>
  <div id="trainTickets">
    <div class="card mb-0">
      <div class="card-header bg-info text-white">
        火车票订单
      </div>
      <div class="card-body mb-0">
        <form class="form-inline" id="frmSearch">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <input type="textfield" class="form-control" size="6" placeholder="订单号" v-model.trim="orderNo" />
          <input type="textfield" class="form-control ml-1" size="6" placeholder="乘客" v-model.trim="name">
          <my-date-picker id="ddate0" v-model="ddate" placeholder="出发日期"></my-date-picker>
          <select class="form-control form-control-sm" v-model.number="status" name="sc.status">
            <option value="-1">状态</option>
            <option value="0">待处理</option>
            <option value="1">处理中</option>
            <option value="2">已完成</option>
            <option value="4">已取消</option>
          </select>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
          </select>

          <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>

        </form>
      </div>
    </div>
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>

      <table class="table table-striped table-sm small">
          <thead>
              <tr>
                  <th>订单号</th>
                  <th>公司</th>
                  <th>乘客</th>
                  <th>车次</th>
                  <th>出发日期</th>
                  <th>出发</th>
                  <th>到达</th>
                  <th>等级</th>
                  <th>价格</th>
                  <th>服务费</th>
                  <th>外部订单号</th>
                  <th>生成时间</th>
                  <th>状态</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
            <template v-for="info in dataList">
              <tr :class="{'table-dark': info.status === 4}" style="color: black">
                  <td>{{info.orderNo}}</td>
                  <td>{{info.customerName}}</td>
                  <td>{{getShortName(info.passengerName, 20)}}</td>
                  <td>{{info.trainNo}}</td>
                  <td>{{info.ddate}}</td>
                  <td>{{info.dcity}}</td>
                  <td>{{info.acity}}</td>
                  <td>{{info.seatClass}}</td>
                  <td>{{info.price}}</td>
                  <td>{{info.serviceCharge}}</td>
                  <td>{{info.externalOrderNo}}</td>
                  <td>{{info.createTime}}</td>
                  <td>{{getStatusDesc(info.status)}}</td>
                  <td>
                    <router-link :to="`/train/order/` + info.id">详情</router-link>
                  </td>
              </tr>
              <tr v-if="info.remark">
                <td colspan="13" class="text-right">{{info.remark}}</td>
                <td colspan="2"></td>
              </tr>
              
            </template>

          </tbody>
      </table>
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>

  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchTrainOrders, showTrainOrderStatus } from '../../api/train.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MyPagination from '../../components/my-pagination.vue'
  
  export default {
    components: {
      MyDatePicker,
      MyPagination
    },
    data () {
      return {
        dataList: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        orderNo: '',
        ddate: '',
        name: '',
        customerId: -1,
        user: { 'id': 0 },

        status: -1
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
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
        this.showLoading()

        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.orderNo': this.orderNo,
          'sc.endDate': this.endDate,
          'sc.name': this.name,
          'sc.departureDate': this.ddate,
          'customerId': this.customerId,
          'sc.status': this.status
        }

        searchTrainOrders(params, v => {
            this.dataList = v.dataList
            this.sc = v.page
          }, 
          () => { this.hideLoading() }
        )
      },
      getStatusDesc: function (status) {
        return showTrainOrderStatus(status)
      },
      reset: function () {
        this.customerId = -1
        this.ddate = ''
        this.name = ''
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.orderNo = ''
        this.status = -1
      },
      getShortName: function (val, max) {
        if (val === null || val.length <= max) {
          return val
        } else {
          return val.substring(0, max) + ' ......'
        }
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.search()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.search()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.search()
      }
    }
  }
</script>