<template>
  <div id="flight-orders">
    <div class="card">
      <div class="card-header bg-info text-white">
        机场服务订单（第三方服务）
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <input type="textfield" class="form-control" size="6" placeholder="服务单号" v-model.trim="orderNo" />
          <select class="form-control" v-model.number="status" name="sc.status">
            <option value="-1">所有</option>
            <option value="0">待处理</option>
            <option value="1">已处理</option>
            <option value="4">已取消</option>
          </select>
          <button id="btnSearch" type="button" class="btn btn-primary ml-2" @click.stop="search()">查找</button>
          <a href="javascript:void(0)" @click.stop="quickSearch(0)" class="small ml-1">待处理</a>
          <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>

            <router-link class="btn btn-success ms-auto" to="/vaas/order">新建</router-link>
        </form>

      </div>

      <vas-order-list :dataList="dataList"></vas-order-list>
            
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </nav>
    </div>
  </div>
</template>

<script>
  import { showPayType } from '../../common/common.js'
  import { searchVaasOrders, showVasOrderStatus } from '../../api/vas.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MyPagination from '../../components/my-pagination.vue'
  import MySelectCustomer from '../../components/my-select2-customer.vue'
  import MySelectProduct from '../../components/my-select-product.vue'
  import VasOrderList from '../../components/vas-order-list.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCustomer,
      MySelectProduct,
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
        productCode: '',

        orderType: 1
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.status': this.status,
          'sc.orderNo': this.orderNo
        }
        searchVaasOrders(params, v => {
	        this.dataList = v.dataList
	        this.sc = v.page
	        if (this.dataList.length === 0) {
	        	this.showErrMsg('未找到符合条件的数据')
	        }
      	})
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
        this.status = -1
        this.sc.pageNo = 1
        this.orderNo = ''
        this.customerId = -1
        this.productCode = ''
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