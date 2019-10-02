<template>
  <div id="customers">
    <div class="card">
      <div class="card-header bg-info text-white">
        企业员工信息
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearchUser">
          <input type="hidden" name="sc.pageNo" v-model.number="sc.pageNo">
          <input type="hidden" name="sc.pageSize" v-model.number="sc.pageSize">
          <div class="form-group">
              <input type="textfield" class="form-control" placeholder="姓名" name="sc.name" v-model.trim="searchName" size="15">
          </div>
          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>
          </div>

        </form>
      </div>
    </div>

    <passenger-list :dataList="dataList"></passenger-list>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>
</template>

<script>
  import { APP_FLIGHT_PATH, showIdTypeDesc } from '../common/common.js'
  import { searchPassengers, createPsg } from '../api/user.js'
  import { searchDepartmentsByCustomerId, searchCustomers } from '../api/customer.js'
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'
  import PassengerList from '../components/list/passenger-list.vue'

  export default {
    name: 'passengers',
    components: {
      MyPagination,
      MyDatePicker,
      PassengerList
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
        searchName: ''
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
          'sc.name': this.searchName
        }
        // this.showLoading('查询中...')
        searchPassengers(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
          // this.hideLoading()
        })
      }, 
      reset: function () {
        this.searchName = ''
        this.sc.pageNo = 1
        this.search()
      },
      download: function () {
        const url = APP_FLIGHT_PATH + '/admin/passengers/download'
        window.open(url)
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