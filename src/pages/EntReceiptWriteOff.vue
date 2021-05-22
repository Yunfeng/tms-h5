<template>
  <div id="writeOff">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/ent/receipts'>收款单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">销账</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <table class="table table-striped table-sm small">
          <thead>
              <tr class="bg-info text-white">
                  <th>收款单号</th>
                  <th>公司名称</th>
                  <th>操作员</th>
                  <th>金额</th>
                  <th>核销金额</th>
                  <th>备注</th>
                  <th>创建时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr >
                  <td>{{detail.receiptNo}}</td>
                  <td>
                    <template v-if="detail.customerType === 0">散客</template>
                    <template v-else>{{detail.customer.vipName}}</template>                    
                  </td>
                  <td>{{detail.operator}}</td>
                  <td>{{detail.amount}}</td>
                  <td>{{detail.writeOffAmount}}</td>
                  <td>{{detail.remark}}</td>
                  <td>{{detail.createTime}}</td>
              </tr>
          </tbody>
      </table>
      <ul class="nav nav-tabs  nav-bordered mb-3">
        <li class="nav-item">
          <a class="nav-item nav-link active" data-bs-toggle="tab" href="#nav-settlement">结算单</a>
        </li>
        <li class="nav-item">
          <a class="nav-item nav-link" data-bs-toggle="tab" href="#nav-bill">账单</a>
        </li>
        <li class="nav-item">
          <a class="nav-item nav-link" data-bs-toggle="tab" href="#nav-flight">账单-机票</a>
        </li>
      </ul>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-settlement">
          <div class="card">
            <div class="card-body">
              <button type="button" class="btn btn-primary btn-sm" @click.stop="searchSettlements()">查找结算单</button>
            </div>
            <table class="table table-hover table-sm small">
              <thead>
                  <tr class="bg-info text-white">
                      <th>结算单号</th>
                      <th>名称</th>
                      <th class="text-right  text-waring">金额</th>
                      <th>付款状态</th>
                      <th>创建时间</th>
                      <th>修改时间</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                <tr v-for="(info, index) in settlements">   
                    <td>{{info.settlementNo}}</td>
                    <td>{{info.name}}</td>
                    <td class="text-right">{{info.amount}}</td>
                    <td>
                      <template v-if="info.paid === 0">
                        <span class="text-danger small">未支付</span>                    
                      </template>
                      <template v-else>
                        已支付
                      </template>
                    </td>
                    <td>{{info.createTime}}</td>
                    <td>{{info.lastUpdate}}</td>
                    <td>
                        <a href="javascript:void(0)" @click.stop.prevent="writeOffSettlement(info.id)" class="text-danger">销账</a>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>          
        </div>
        <div class="tab-pane fade" id="nav-bill">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <div class="row mb-2">
                  <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
                  <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
                </div>
                <input type="textfield" class="form-control" size="6" placeholder="账单号" v-model.trim="billNum">
                <input type="textfield" class="form-control" size="6" placeholder="订单号" v-model.trim="orderNo">
                <input type="textfield" class="form-control" size="8" placeholder="原始单号" v-model.trim="flightOrderNo">
                <div class="row mb-2">
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="-1" v-model.number="billType">全部
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="0" v-model.number="billType">机票
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="5" v-model.number="billType">退票
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="7" v-model.number="billType">改签
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="6" v-model.number="billType">服务
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="2" v-model.number="billType">酒店
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="3" v-model.number="billType">火车票
                  </label>
                </div>
                <div class="row mb-2">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchBill()">查找</button>
                  <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
                </div> 
              </form>
            </div>
            <table class="table table-hover table-sm small">
              <thead>
                  <tr class="bg-info text-white">
                      <th>类型</th>
                      <th>账单号</th>
                      <th>订单号</th>
                      <th>原始单号</th>
                      <th class="text-right">账单金额</th>
                      <th>日期</th>
                      <th>付款方式</th>
                      <th>结算单？</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(info, index) in billInfos">   
                      <td>{{showBillTypeDesc(info.billType)}}</td>
                      <td>
                        <router-link :to="`/bill/detail/` + info.id">{{(info.billNum)}}</router-link>
                      </td>
                      <td>{{info.orderNo}}</td>
                      <td>{{info.flightOrderNo}}</td>
                      <td class="text-right">
                          {{info.billSum}}
                      </td>
                      <td>{{info.opDate}}</td>
                      <td>
                          {{info.payTypeNoteDesc}}
                          <template v-if="info.bePaid === null">
                              <span class="text-warning small">未销账</span>
                          </template>
                      </td>
                      <td>{{info.settlementNo}}</td>
                      <td>
                        <a href="javascript:void(0)" @click.stop.prevent="writeOffByBillId(info.id)" class="text-danger">销账</a>
                      </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade" id="nav-flight">
          <div class="card">
            <div class="card-body">
              <form class="form-inline">
                <input type="textfield" class="form-control" size="10" placeholder="票号" v-model.trim="ticketNo">
                <input type="textfield" class="form-control" size="10" placeholder="姓名" v-model.trim="name">
                <div class="row mb-2">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="searchTicket()">查找</button>
                  <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset3()">重置</button>
                </div> 
              </form>
            </div>
            <table class="table table-sm table-striped small">
                <thead>
                    <tr>
                        <th>票号</th>
                        <th>乘机人</th>
                        <th>出票日期</th>
                        <th colspan="5" class="bg-info text-center text-white">行程</th>
                        <th class="text-center">实收</th>
                        <th class="text-center">成本</th>
                        <th class="text-center">利润</th>
                        <th>账单号</th>
                        <th></th>
                    </tr>                        
                </thead>
                <tbody>
                    <tr v-for="(info, index) in tickets" :class="{'bg-success text-white': info.bePaid === '1'}">
                        <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
                        <td class="">{{info.passengerName}}</td>
                        <td >{{info.etdzDate}}</td>
                        <td>
                          <template v-for="(flt, index) in info.details">
                              {{flt.dport}}{{flt.dportName}}
                            <template v-if="index < info.details.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                          <template v-for="(flt, index) in info.details">
                            {{flt.aport}}{{flt.aportName}}
                            <template v-if="index < info.details.length - 1 "><br/></template>
                          </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.ddate}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.flight}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td>
                            <template v-for="(flt, index) in info.details">
                              {{flt.subclass}}
                              <template v-if="index < info.details.length - 1 "><br/></template>
                            </template>
                        </td>
                        <td class="text-right">{{info.accountRecv}}</td>
                        <td class="text-right">{{info.cost}}</td>
                        <td class="text-right">{{info.profit}}</td>
                        <td class="">
                          <router-link :to="`/bill/detail/0?billNum=` + info.billNum">{{info.billNum}}</router-link>
                        </td>
                        <td>
                        <a href="javascript:void(0)" @click.stop.prevent="writeOffByBillNo(info.billNum)" class="text-danger">销账</a>
                      </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>      
    </template>
  </div>	
</template>

<script>
  import { searchEntReceipt } from '../api/receipt.js'
  import { getBillTypeDesc, writeOffBill, writeOffSettlement } from '../api/bill.js'
  import { searchBills, searchUnpaidSettlements } from '../api/bill.js'
  import { searchUnpaidTickets } from '../api/bill.js'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        id: 0,
        detail: null,

        billInfos: [],
        settlements: [],
        tickets: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 1000,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        billType: -1,
        billNum: '',
        orderNo: '',
        flightOrderNo: '',
        ticketNo: '',
        name: ''
      }
    },
    computed: {
      customerId: function () {
        if (this.detail.customerType === 0) {
          return 0
        } else {
          return this.detail.customer.id
        }
      }
    },
    mounted: function () {
      this.id = this.$route.params.id
      this.refreshReceiptInfo()
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
      refreshReceiptInfo: function () {
        const params = {
          'id': this.id
        }

        searchEntReceipt(params, (jsonResult) => {
          this.detail = jsonResult
        })
      },
      writeOffByBillId: function (billId) {
        const params = {
          'billId': billId,
          'receiptId': this.id
        }

        writeOffBill(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            this.refreshReceiptInfo()
            this.searchBill()
          }
        })
      },
      writeOffByBillNo: function (billNo) {
        const params = {
          'billNo': billNo,
          'receiptId': this.id
        }

        writeOffBill(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            this.refreshReceiptInfo()
            this.searchTicket()
          }
        })
      },
      writeOffSettlement: function (settlementId) {
        const params = {
          'receiptId': this.id,
          'settlementId': settlementId
        }

        writeOffSettlement(params, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg)
          } else {
            this.refreshReceiptInfo()
            this.searchSettlements()
          }
        })
      },
      searchBill: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'customerId': this.customerId,
          'bePaid': '0',
          'reviewed': '1',
          'billType': this.billType,
          'sc.billNum': this.billNum,
          'sc.orderNo': this.orderNo,
          'sc.flightOrderNo': this.flightOrderNo
        }

        searchBills(params, (jsonResult) => {
          this.billInfos = jsonResult.dataList
        })
      },
      searchSettlements: function () {
        const params = {
          'customerId': this.customerId
        }
        searchUnpaidSettlements(params, v => { this.settlements = v })
      },
      showBillTypeDesc: function (val) {
        return getBillTypeDesc(val)
      },
      searchTicket: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.ticketNo': this.ticketNo,
          'sc.name': this.name,
          'sc.customerId': this.customerId,
          'sc.payStatus': 0
        }

        this.showLoading('加载中')
        searchUnpaidTickets(params,
          (jsonResult) => {
            this.tickets = jsonResult.dataList
            this.sc = jsonResult.page
          }, () => {
            this.hideLoading()
          }
        )
      },
      reset: function () {
        this.billType = -1
        this.billNum = ''
        this.orderNo = ''
        this.flightOrderNo = ''
      },
      reset3: function () {
        this.ticketNo = ''
        this.name = ''
      }
    }
  }
</script>