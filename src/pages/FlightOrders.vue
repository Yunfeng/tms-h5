<template>
  <div id="flight-orders">
    <div class="card">
      <div class="card-header bg-info text-white">
        机票订单
      </div>
      <div class="card-body py-1 px-1">
        <form>
          <div class="form-row">
            <div class="col">
              <input type="textfield" class="form-control form-control-sm" size="6" placeholder="订单号" v-model.trim="orderNo">
            </div>
            <div class="col">
              <input type="textfield" class="form-control form-control-sm" size="6" placeholder="姓名" v-model.trim="name">
            </div>
            <div class="col">
              <input type="textfield" class="form-control form-control-sm" size="6" placeholder="证件号" v-model.trim="idno">
            </div>
            <div class="col">
              <input type="textfield" class="form-control form-control-sm" size="12" placeholder="票号" v-model.trim="ticketNo">
            </div>
            <div class="col">
              <input type="textfield" class="form-control form-control-sm" size="10" placeholder="航班号" v-model.trim="flightNo">
            </div>
            <div class="col">
              <my-date-picker id="ddate" v-model="ddate" placeholder="航班日期" sizing="sm"></my-date-picker>
            </div>
            <div class="col">
              <my-date-picker id="beginDate" name="sc.beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
            </div>
            <div class="col">
              <my-date-picker id="endDate" name="sc.endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>
            </div>            
            <div class="col">
              <select class="form-control form-control-sm" v-model.number="intlTicket">
                <option value="-1">所有</option>
                <option value="0">国内</option>
                <option value="1">国际</option>
              </select>
            </div>
            <div class="col">
              <select class="form-control form-control-sm" v-model.number="status" name="sc.status">
                <option value="-1">订单状态</option>
                <option value="0">暂不开票</option>
                <option value="1">待开票审核</option>
                <option value="2">待开票</option>
                <option value="4">已取消</option>
                <option value="8">开票中</option>
                <option value="16">已开票</option>
                <option value="32">已完成</option>
              </select>
            </div>
            <div class="col">
              <select class="form-control form-control-sm" v-model.number="sc.pageSize">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
              </select>
            </div>
            <div class="col">
              <button type="button" class="btn btn-primary btn-sm" @click.stop="search()">查找</button>
            </div>
          </div>
          
          <div class="form-row">
            <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
    </div>
    <flight-order-list :dataList="dataList"></flight-order-list>
          
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
    </nav>
  </div>
</template>

<script>
  import { searchFlightOrders } from '../api/flight.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import FlightOrderList from '../components/flight-order-list.vue'

  export default {
    name: 'MyFlightOrders',
    components: {
      MyDatePicker,
      MyPagination,
      FlightOrderList
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
        name: '',
        idno: '',
        ticketNo: '',
        pnrNo: '',
        status: -1,
        customerId: -1,
        customerType: -1,
        intlTicket: -1,
        workStatus: 0,
        onlyMine: 0,
        op1: '',
        orderNo: '',
        payStatus: -1,
        flightNo: '',
        ddate: '',

        stat: null
      }
    },
    activated: function () {
      this.search()
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.name': this.name,
          'sc.idno': this.idno,
          'sc.status': this.status,
          'sc.customerId': this.customerId,
          'sc.customerType': this.customerType,
          'sc.ticketNo': this.ticketNo,
          'sc.intlTicket': this.intlTicket,
          'sc.pnrNo': this.pnrNo,
          'sc.workStatus': this.workStatus,
          'sc.onlyMine': this.onlyMine,
          'sc.op1': this.op1,
          'sc.orderNo': this.orderNo,
          'sc.payStatus': this.payStatus,
          'sc.departureDate': this.ddate,
          'sc.flightNo': this.flightNo
        }
        this.showLoading('查询中')
        searchFlightOrders(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.name = ''
        this.idno = ''
        this.ticketNo = ''
        this.pnrNo = ''
        this.status = -1
        this.sc.pageNo = 1
        this.onlyMine = 0
        this.op1 = ''
        this.orderNo = ''

        this.ddate = ''
        this.flightNo = ''

        this.customerId = -1
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