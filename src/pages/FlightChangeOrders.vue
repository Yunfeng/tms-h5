<template>
  <div id="flightRefunds">
    <div class="card">
      <div class="card-header bg-info text-white">
        改签单
      </div>
      <div class="card-body">
        <form class="form-inline" >
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <input type="textfield" class="form-control" size="8" placeholder="改签单号" v-model.trim="changeOrderNo">
          <input type="textfield" class="form-control" size="6" placeholder="姓名" v-model.trim="name">
          <input type="textfield" class="form-control" size="10" placeholder="证件号" v-model.trim="idno">
          <input type="textfield" class="form-control" size="6" placeholder="票号" v-model.trim="ticketNo">
          <input type="textfield" class="form-control" size="6" placeholder="编码" v-model.trim="pnrNo">
          <select class="form-control ml-1" v-model.number="intlTicket">
            <option value="-1">所有</option>
            <option value="0">国内</option>
            <option value="1">国际</option>
          </select>
          <select class="form-control ml-1" v-model.number="status">
            <option value="-1">所有状态</option>
            <option value="0">待处理</option>
            <option value="1">处理中</option>
            <option value="2">已完成</option>
            <option value="4">已取消</option>
          </select>
          <select class="form-control form-control-sm ml-1" v-model.number="sc.pageSize">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
          </select>

          <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
        </form>
      </div>
    </div>
    
    <flight-change-list :dataList="dataList"></flight-change-list>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>  
</template>

<script>
  import { searchChangeOrders } from '../api/flight-change.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import FlightChangeList from '../components/flight-order-change-list.vue'
  
  export default {
    name: 'MyFlightChangeOrders',
    components: {
      MyDatePicker,
      MyPagination,
      FlightChangeList
    },
    data () {
      return {
        dataList: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',

        showMode: 0,
        modalTitle: '',
        intlTicket: -1,
        status: -1,
        ticketNo: '',
        pnrNo: '',
        name: '',
        idno: '',
        changeOrderNo: '',
        customerId: -1
      }
    },
    mounted: function () {
      this.search()
    },
    activated: function () {
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
          'sc.endDate': this.endDate,
          'sc.intlTicket': this.intlTicket,
          'sc.status': this.status,
          'sc.pnrNo': this.pnrNo,
          'sc.ticketNo': this.ticketNo,
          'sc.name': this.name,
          'sc.idno': this.idno,
          'sc.changeOrderNo': this.changeOrderNo,
          'sc.customerId': this.customerId
        }

        searchChangeOrders(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        }, () => {
          this.hideLoading()
        })
      },
      reset: function () {
        this.ticketNo = ''
        this.pnrNo = ''
        this.status = -1
        this.intlTicket = -1
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.name = ''
        this.idno = ''
        this.changeOrderNo = ''
        this.customerId = -1
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
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('失败：' + jsonResult.errmsg)
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