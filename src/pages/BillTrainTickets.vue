<template>
  <div id="trainTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        火车票
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearch">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <div class="col-2">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <input type="textfield" class="form-control ml-1" size="10" placeholder="乘客" v-model.trim="name">
          <my-date-picker id="ddate0" v-model="ddate" placeholder="出发日期"></my-date-picker>

          <button type="button" class="btn btn-primary ml-1" @click.stop="searchTickets()">查找</button>
          <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>

        </form>
      </div>
    </div>
      <table class="table table-striped table-sm small">
          <thead>
              <tr>
                  <th>账单号</th>
                  <th>公司名称</th>
                  <th>乘客</th>
                  <th>车次</th>
                  <th>出发日期</th>
                  <th>出发</th>
                  <th>到达</th>
                  <th>等级</th>
                  <th>价格</th>
                  <th>服务费</th>
                  <th>备注</th>
                  <th>销售日期</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList">
                  <td>{{info.billNum}}</td>
                  <td>{{info.customer.vipName}}</td>
                  <td>{{info.passengerName}}</td>
                  <td>{{info.trainNo}}</td>
                  <td>{{info.ddate}}</td>
                  <td>{{info.dcity}}</td>
                  <td>{{info.acity}}</td>
                  <td>{{info.seatClass}}</td>
                  <td>{{info.price}}</td>
                  <td>{{info.serviceCharge}}</td>
                  <td>{{info.remark}}</td>
                  <td>{{info.saleDate}}</td>
                  <td>
                    <router-link :to="`/bill/detail/0?billNum=` + info.billNum">详情</router-link>
                  </td>
              </tr>

          </tbody>
      </table>
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>

  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchTrainTickets } from '../api/train.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  
  import MySelectCustomer from '../components/my-select2-customer.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCustomer
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
        ddate: '',
        name: '',
        customerId: -1,
        user: { 'id': 0 }
      }
    },
    mounted: function () {
      this.searchTickets()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchTickets: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.name': this.name,
          'sc.departureDate': this.ddate,
          'customerId': this.customerId,
        }

        searchTrainTickets(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      reset: function () {
        this.customerId = -1
        this.ddate = ''
        this.name = ''
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
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