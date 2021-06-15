<template>
  <div id="flightRefunds">
    <div class="card">
      <div class="card-header bg-info text-white">
        机票退票
      </div>
      <div class="card-body">
        <form class="" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">

          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>

          <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找退票</button>
        </form>
      </div>
    </div>
    <table class="table table-sm table-striped small">
        <thead>
            <tr>
                <th>票号</th>
                <th>乘客</th>
                <th>国际?</th>
                <th>退票单号</th>
                <th>公司名称</th>
                <th>原收金额</th>
                <th>航司退票费</th>
                <th>手续费</th>
                <th>操作员</th>
                <th>航司实退</th>
                <th>实退客人</th>
                <th>利润</th>
                <th>提交时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" v-bind:class="{'success text-success': info.bePaid === '1'}">
                <td>{{info.balanceCode}}-{{info.ticketNo}}</td>
                <td>{{info.psgName}}</td>
                <td>
                  <span class="text-danger" v-if="info.intlTicket === 1">国际</span>
                  <span v-else>国内</span>
                </td>
                <td>{{info.refundOrderNo}}</td>
                <td>
                  <template v-if="info.customer !== null">{{info.customer.vipName}}</template>
                </td>
                <td>{{info.ticketAmount}}</td>
                <td>{{info.airRefundCharge}}</td>
                <td>{{info.serviceCharge}}</td>
                <td>{{info.operator}}</td>                
                <td>{{info.airlineRefundAmount}}</td>
                <td>{{info.passengerRefundAmount}}</td>
                <td>{{info.profit}}</td>
                <td>{{info.createTime}}</td>
                <td>
                  <router-link :to="`/bill/detail/0?billNum=` + info.billNum">详情</router-link>
                </td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
    <div class="modal" id="modelNewRefund" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">退票录入</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                
                </div>
                <div class="modal-body">
                    <form id="frmUser" role="form" class="form-horizontal">
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                票号    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="ticketNo" />
                                <span class="help-block">请录入要进行退票操作的票号</span>
                            </div>
                        </div>

                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                乘客姓名    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model="psgName" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                客户名称    
                            </label>
                            <div class="col-md-6">
                                {{vipName}}
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                账单号    
                            </label>
                            <div class="col-md-6">
                                {{billNum}}
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                账单金额    
                            </label>
                            <div class="col-md-6">
                                {{billSum}}
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                原付金额     
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control"  v-model.number="accountRecv" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                航司退票费    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.nuber="airRefundFee" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                退票服务费    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.number="serviceCharge" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-md-4 text-right">
                                备注    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model="remark" />
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default"  data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="createRefundTicket()">保存</button>
                </div>
            </div>
        </div>                    
    </div>
  </div>  
</template>

<script>
  import { searchFlightTicket, searchBillSum } from '@/api/user.js'
  import { searchCustomers } from '@/api/customer.js'
  import { createFlightRefund, processRefund, submitRefund, setRefundAirlineRefunded, setRefundPassengerRefunded, searchBillRefundTickets } from '@/api/flight-refund.js'
  import MyDatePicker from '@/components/my-datepicker.vue'
  import MyPagination from '@/components/my-pagination.vue'
  import $ from 'jquery'

  export default {
    components: {
      MyDatePicker,
      MyPagination
    },
    data () {
      return {
        ticketNo: '',
        psgName: '',
        accountRecv: 0,
        airRefundFee: 0,
        serviceCharge: 0,
        remark: '',
        billNum: '',
        billSum: 0,
        vipName: '',

        dataList: [],
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',

        showMode: 0
      }
    },
    watch: {
      ticketNo: function () {
        var length = this.ticketNo.length
        if (length === 13 || length === 14) {
          this.searchTicketInfo()
        }
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchTicketInfo: function () {
        searchFlightTicket({ 'ticketNo': this.ticketNo }, (jsonResult) => {
          if (jsonResult !== null) {
            this.showTicketInfo(jsonResult)
          }
        })
      },
      showTicketInfo: function (info) {
        this.psgName = info.passengerName
        this.remark = info.routeDetail
        this.accountRecv = info.accountRecv
        this.billNum = info.billNum
        this.vipName = info.customer.vipName

        this.searchBillSum(info.billNum)
      },
      searchBillSum: function (billNum) {
        searchBillSum({ 'billNum': this.billNum }, (jsonResult) => {
          this.billSum = jsonResult
        })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate
        }
        searchBillRefundTickets(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      createRefundTicket: function () {
        const params = {
          'ticketNo': this.ticketNo,
          'psgName': this.psgName,
          'accountRecv': this.accountRecv,
          'airRefundFee': this.airRefundFee,
          'serviceCharge': this.serviceCharge,
          'remark': this.remark
        }

        createFlightRefund(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            this.cancel()
            this.search()
          }
        })
      },
      newRefundTicket: function () {
        this.reset()
        $('#modelNewRefund').modal()
      },
      cancel: function () {
        $('#modelNewRefund').modal('hide')
      },
      getStatus: function (status) {
        switch (status) {
          case 0: return '待处理'
          case 1: return '处理中'
          case 2: return '已提交'
          case 8: return '航司已退'
          case 16: return '已退票'
          case 32: return '处理完毕'
          default:
            return status
        }
      },
      reset: function () {
        this.ticketNo = ''
        this.psgName = ''
        this.accountRecv = 0
        this.airRefundFee = 0
        this.serviceCharge = 0
        this.remark = ''
      },
      searchCustomer: function () {
        searchCustomers((jsonResult) => {
          this.customers = jsonResult.dataList
        })
      },
      processRefund: function (id) {
        processRefund(id, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.search()
          } else {
            this.showErrMsg('操作失败：' + this.errmsg)
          }
        })
      },
      setRefundSubmitted: function (id) {
        submitRefund(id, (jsonResult) => {
          console.log(jsonResult)
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.search()
          } else {
            this.showErrMsg('操作失败：' + this.errmsg)
          }
        })
      },
      setRefundAirlineDone: function (id) {
        const refundInfo = this.getRefundById(id)
        if (refundInfo === null) this.showErrMsg('数据出错')
        const amount = window.prompt('航司实际退款金额？', refundInfo.airlineRefundAmount)
        // console.log(amount)
        const params = {
          amount: amount
        }
        setRefundAirlineRefunded(id, params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.search()
          } else {
            this.showErrMsg('操作失败：' + jsonResult.errmsg)
          }
        })
      },
      setRefundPassengerRefunded: function (id) {
        const refundInfo = this.getRefundById(id)
        if (refundInfo === null) this.showErrMsg('数据出错')
        const amount = window.prompt('实际退客户金额？', refundInfo.passengerRefundAmount)
        // console.log(amount)
        const params = {
          amount: amount
        }
        setRefundPassengerRefunded(id, params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.search()
          } else {
            this.showErrMsg('操作失败：' + jsonResult.errmsg)
          }
        })
      },
      getRefundById: function (id) {
        let refundInfo
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].id === id) {
            refundInfo = this.dataList[i]
            break
          }
        }
        return refundInfo
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