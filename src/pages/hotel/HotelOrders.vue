<template>
  <div id="hotelOrders">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/hotel/orders'>酒店订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">列表</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>       

    <div class="card">
      <div class="card-body py-1">
        <form class="form-inline" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">
          <div class="form-group">      
            <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
            <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          </div>
          <input type="textfield" class="form-control" size="6" placeholder="订单号" v-model.trim="orderNo" />
          <input type="textfield" class="form-control ml-1" size="10" placeholder="入住人" v-model.trim="name">
          <input type="textfield" class="form-control ml-1" size="10" placeholder="酒店名称" v-model.trim="hotelName">
          <select class="form-control form-control-sm" v-model.number="status" name="sc.status">
            <option value="-1">订单状态</option>
            <option value="0">待处理</option>
            <option value="1">处理中</option>
            <option value="2">已完成</option>
            <option value="4">已取消</option>
          </select>

          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div> 

          <router-link to='/hotel/order' class="btn btn-success ml-auto">新建</router-link>
        </form>
      </div>
      <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>订单号</th>
                <th>公司名称</th>
                <th>入住人</th>
                <th>酒店</th>
                <th>入住日期</th>
                <th>离店日期</th>
                <th>房型</th>
                <th>房间数</th>
                <th>价格</th>
                <th>服务费</th>
                <th>预订人</th>
                <th>总金额</th>
                <th>总成本</th>
                <th>利润</th>
                <th>生成时间</th>
                <th>状态</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
          <template v-for="info in dataList" >
            <tr :class="{'table-dark': info.status === 4}" style="color: black">
                <td>                  
                  <router-link :to="`/hotel/order/` + info.id">{{info.orderNo}}</router-link>
                </td>
                <td>
                    {{info.customerName}}  
                </td>
                <td>{{info.passengerName}}</td>
                <td>{{info.hotelName}}</td>
                <td>{{info.checkInDate}}</td>
                <td>{{info.checkOutDate}}</td>
                <td>{{info.roomType}}</td>
                <td>{{info.roomCount}}</td>
                <td>{{info.price}}</td>
                <td>{{info.serviceCharge}}</td>
                <td>{{info.operator}}</td>
                <td>{{info.totalAmount}}</td>
                <td>{{info.totalCost}}</td>
                <td>{{info.profit}}</td>
                <td>{{info.createTime}}</td>
                <td>{{getStatusDesc(info.status)}}</td>
                <td class="">
                  <router-link :to="`/hotel/order/` + info.id">详情</router-link>
                </td>
            </tr>
            <tr :class="{'table-dark': info.status === 4}" style="color: black" v-if="info.remark">                
                <td colspan="15" class="text-right">{{info.remark}}</td>
                <td colspan="2"></td>
            </tr>
            
          </template>
            <tr v-if="dataList.length ===0">
              <td colspan="18" class="text-center">未找到符合的数据</td>
            </tr>
        </tbody>
      </table>
    </div>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>	
</template>

<script>
  import { searchHotelOrders, showHotelOrderStatus } from '../../api/hotel.js'
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
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        orderNo: '',
        customerId: -1,
        name: '',
        hotelName: '',
        status: -1
      }
    },
    mounted: function () {
      // this.search()
    },
    activated: function () {
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
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
          'sc.customerId': this.customerId,
          'sc.name': this.name,
          'sc.hotelName': this.hotelName,
          'sc.status': this.status
        }
        searchHotelOrders(params,
          v => {
            this.dataList = v.dataList
            this.sc = v.page

            // if (v.dataList.length === 0) {
            //   this.showErrMsg('没找到任何东西')
            // }
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.orderNo = ''
        this.customerId = -1
        this.name = ''
        this.hotelName = ''
        this.status = -1
      },
      getStatusDesc: function (status) {
        return showHotelOrderStatus(status)
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