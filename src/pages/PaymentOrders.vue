<template>
	<div id="paymentOrders">
    <div class="card">
      <div class="card-header bg-info text-white">
        付款单 - 在线支付
      </div>
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>付款单号</th>
            <th>
              <select v-model.number="status">
                <option value="0">全部状态</option>
                <option value="9">已付款</option>
              </select>
            </th>
            <th>付款人</th>
            <th>memo</th>
            <th>金额</th>
            <th>订单类型</th>
            <th>订单id</th>
            <th>微信支付交易号</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in dataList">
            <tr>
              <td>{{info.trade_no}}</td>
              <td>{{info.statusDesc}}</td>
              <td>{{info.enterpriseName}}</td>
              <td>{{info.memo}}</td>
              <td>{{info.price}}</td>
              <td>{{info.orderType}}</td>
              <td>{{info.orderId}}</td>
              <td>{{info.transactionId}}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card-body text-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </div>
    </div>      
  </div>
</template>

<script>
import $ from 'jquery'
import MyPagination from '../components/my-pagination.vue'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: '数据加载中',

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 15,
        pageTotal: 0
      },
      status: 0
    }
  },
  computed: {
  },
  watch: {
    status: function () {
      this.search()
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    search: function () {
      this.dataList.splice(0)

      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        url: '/Flight/paymentOrders',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.status': this.status
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
          // console.log(self.sc)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false

          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
        }
      })
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
