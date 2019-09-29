<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        待审核账单-机票
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">

          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始出票日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止出票日期"></my-date-picker>
          <input type="textfield" class="form-control" size="10" placeholder="票号" v-model.trim="ticketNo">
          <input type="textfield" class="form-control" size="10" placeholder="姓名" v-model.trim="name">
          <label>记录数</label>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="50">50</option>
          </select>
          <button type="button" class="btn btn-primary ml-1" @click.stop="searchTickets()">查找机票</button>
          <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
        </form>
      </div>
    </div>
    <table class="table table-sm table-striped table-hover small">
        <thead>
            <tr>
                <th>票号</th>
                <th>乘机人</th>
                <th>公司</th>
                <th>出票日期</th>
                <th colspan="6" class="bg-info text-center text-white">行程</th>
                <th class="text-center">实收</th>
                <th class="text-center">成本</th>
                <th class="text-center">利润</th>
                <th>备注</th>
                <th>账单号</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" :class="{'bg-success text-white': info.bePaid === '1'}">
                <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
                <td class="">{{info.passengerName}}</td>
                <td class="">
                  <template v-if="info.customer !== null">{{info.customer.vipName}}</template>
                </td>
                <td >{{info.etdzDate}}</td>
                <td>
                  <template v-for="(flt, index) in info.flights">
                      {{flt.departureAirport}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
                </td>
                <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.arrivalAirport}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.departureDate}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.flightNo}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.subclass}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td class="text-center">
                    <template v-for="(flt, index) in info.flights">
                      {{flt.departureTime}}-{{flt.arrivalTime}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>

                <td class="text-right">{{info.accountRecv}}</td>
                <td class="text-right">{{info.cost}}</td>
                <td class="text-right">{{info.profit}}</td>
                <td class="">{{info.remark}}</td>
                <td class="">
                  <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger" @click.stop="auditBillDone(info.billNum)">审核</button>
                </td>
            </tr>
            <tr>
              <td colspan="16" class="text-right">提醒：审核是针对账单的操作，一个账单会包含多张机票</td>
            </tr>
        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>
</template>

<script>
  import { searchUnreviewedTickets, auditBillByBillNum } from '../api/bill.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    name: 'BillTickets',
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
          pageSize: 15,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        ticketNo: '',
        name: ''
      }
    },
    mounted: function () {
      this.searchTickets()
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
      searchTickets: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.ticketNo': this.ticketNo,
          'sc.name': this.name
        }

        this.showLoading('加载中')
        searchUnreviewedTickets(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          }, () => {
            this.hideLoading()
          }
        )
      },
      auditBillDone: function (billNum) {
        const params = { 'billNum': billNum}
        this.showLoading('审核中')
        auditBillByBillNum(params,
          v => {
            if (v.status === 'OK') {
              this.showErrMsg('审核成功')
              this.searchTickets()
            } else {
              this.showErrMsg('审核失败', danger)
            }
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.name = ''
        this.ticketNo = ''
        this.beginDate = ''
        this.endDate = ''
        this.sc.pageNo = 1
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.searchTickets()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.searchTickets()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.searchTickets()
      }
    }
  }
</script>