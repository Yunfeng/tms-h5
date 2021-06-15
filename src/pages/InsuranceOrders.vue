<template>
  <div id="flight-orders">
    <div class="card">
      <div class="card-header bg-info text-white">
        保险订单
      </div>
      <div class="card-body">
        <form class="" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" v-model="sc.pageSize">

          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <input type="textfield" class="form-control" size="8" placeholder="保险单号" v-model.trim="orderNo">
          <input type="textfield" class="form-control" size="8" placeholder="姓名" v-model.trim="psgName">
          <select class="form-control" v-model.number="status" name="sc.status">
            <option value="-1">所有</option>
            <option value="0">待处理</option>
            <option value="1">已处理</option>
            <option value="2">已完成</option>
            <option value="4">已取消</option>
          </select>
          <button type="button" class="btn btn-primary btn-lg ml-2" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
        </form>

      </div>
    </div>

    <vas-order-list :dataList="dataList"></vas-order-list>
          
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
    </nav>
  </div>
</template>

<script>
  import { searchInsuranceOrders, showVasOrderStatus } from '../api/vas.js'
  import { showPayType } from '../common/common.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import VasOrderList from '../components/vas-order-list.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      VasOrderList
    },
    data () {
      return {
        dataList: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },

        beginDate: '',
        endDate: '',
        status: -1,
        orderNo: '',
        customerId: -1,
        psgName: ''
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.status': this.status,
          'sc.orderNo': this.orderNo,
          'sc.customerId': this.customerId,
          'sc.name': this.psgName
        }
        searchInsuranceOrders(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          }
        )
      },
      quickSearch: function (status) {
        this.status = status
        this.search()
      },
      getStatusDesc: function (status) {
        return showVasOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.orderNo = ''
        this.status = -1
        this.sc.pageNo = 1
        this.customerId = -1
        this.psgName = ''
        // this.search()
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