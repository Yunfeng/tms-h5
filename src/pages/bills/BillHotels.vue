<template>
  <div id="hotelOrders">
    <div class="card">
      <div class="card-header bg-info text-white">
        酒店账单
      </div>
      <div class="card-body">
        <form class="" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">
          <div class="row mb-2">      
            <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
            <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          </div>
          <div class="col-3">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <input type="textfield" class="form-control ml-1" size="10" placeholder="入住人" v-model.trim="name">
          <input type="textfield" class="form-control ml-1" size="10" placeholder="酒店名称" v-model.trim="hotelName">
          <div class="row mb-2">
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div> 
        </form>
      </div>
    </div>

    <table class="table table-striped table-sm small">
      <thead>
          <tr>
              <th>账单号</th>
              <th>销售日期</th>
              <th>公司名称</th>
              <th>入住人</th>
              <th>酒店</th>
              <th>入住日期</th>
              <th>离店日期</th>
              <th>房型</th>
              <th>房间数</th>
              <th>价格/间夜</th>
              <th>成本/间夜</th>
              <th>间夜</th>
              <th>服务费</th>
              <th>总金额</th>
              <th>总成本</th>
              <th>利润</th>
              <th>备注</th>
              <th></th>
          </tr>                        
      </thead>
      <tbody>
          <tr v-for="(info, index) in dataList">
              <td>{{info.billNum}}</td>
              <td>{{info.saleDate}}</td>
              <td>{{info.customer.vipName}}</td>
              <td>{{info.passengerName}}</td>
              <td>{{info.hotelName}}</td>
              <td>{{info.ddate}}</td>
              <td>{{info.leaveDate}}</td>
              <td>{{info.roomType}}</td>
              <td>{{info.roomCount}}</td>
              <td>{{info.price}}</td>
              <td>{{info.bottomPrice}}</td>
              <td>{{info.count}}</td>
              <td>{{info.serviceCharge}}</td>
              <td>{{info.totalAmount}}</td>
              <td>{{info.totalCost}}</td>
              <td>{{info.profit}}</td>
              <td>{{info.remark}}</td>
              <td class="">
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
  import MyDatePicker from '@/components/my-datepicker.vue'
  import MyPagination from '@/components/my-pagination.vue'
  import MyHotelBookingNew from '@/components/my-modal-hotel-booking-create.vue'
  import { searchHotelBills } from '@/api/hotel.js'

  import MySelectCustomer from '@/components/my-select2-customer.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MyHotelBookingNew,
      MySelectCustomer
    },
    data () {
      return {
        dataList: [],
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        customerId: -1,
        name: '',
        hotelName: ''
      }
    },
    mounted: function () {
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
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.customerId': this.customerId,
          'sc.name': this.name,
          'sc.hotelName': this.hotelName
        }
        searchHotelBills(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.customerId = -1
        this.name = ''
        this.hotelName = ''
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