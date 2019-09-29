<template>
  <div id="bills">
    <div class="card">
      <div class="card-header bg-info text-white">
        账单
      </div>
      <div class="card-body px-1">
        <form class="form-inline">
          <select class="form-control" v-model.number="billType">
            <option value="-1">类别</option>
            <option value="0">机票</option>
            <option value="5">退票</option>
            <option value="7">改签</option>
            <option value="6">服务</option>
            <option value="2">酒店</option>
            <option value="3">火车票</option>
          </select>
          <select class="form-control" v-model.number="intlTicket">
            <option value="-1">类型</option>
            <option value="0">国内</option>
            <option value="1">国际</option>
          </select>
          <select class="form-control" v-model.number="payType">
            <option value="0">收款方式</option>
            <option value="1">现金</option>
            <option value="2">信用卡</option>
            <option value="4">支票</option>
            <option value="8">记账</option>
          </select>
          <select class="form-control" v-model.number="reviewed">
            <option value="-1">审核</option>
            <option value="0">未审核</option>
            <option value="1">已审核</option>
          </select>
          <select class="form-control" v-model.number="bePaid">
            <option value="-1">收款</option>
            <option value="0">未收</option>
            <option value="1">已收</option>
          </select>
          <select class="form-control" v-model.number="paymentStatus">
            <option value="-1">付款</option>
            <option value="0">未付</option>
            <option value="1">已付</option>
          </select>
          <div class="col-2 px-0">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <div class="col-2 px-0">
            <my-select-supplier :supplierId.sync="supplierId"></my-select-supplier>
          </div>
          <my-date-picker id="date0" v-model="beginDate" placeholder="账单日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date1" v-model="endDate" placeholder="账单日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="date2" v-model="etdzDateBegin" placeholder="出票日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date3" v-model="etdzDateEnd" placeholder="出票日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="date4" v-model="auditDateBegin" placeholder="审核日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date5" v-model="auditDateEnd" placeholder="审核日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="date6" v-model="settleDateBegin" placeholder="结算日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date7" v-model="settleDateEnd" placeholder="结算日期到" sizing="sm"></my-date-picker>
              
              
              <input type="textfield" class="form-control" size="8" placeholder="账单号" v-model.trim="billNum">
              <input type="textfield" class="form-control" size="8" placeholder="订单号" v-model.trim="orderNo">
              <input type="textfield" class="form-control" size="8" placeholder="原始单号" v-model.trim="flightOrderNo">
              <input type="textfield" class="form-control" size="8" placeholder="账单备注" v-model.trim="remark">
              <input type="textfield" class="form-control" size="8" placeholder="成本中心" v-model.trim="costCenter">
              <input type="textfield" class="form-control" size="8" placeholder="结算单号" v-model.trim="settlementNo">
              <label>每页记录数</label>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="50">50</option>
          </select>
              <button type="button" class="btn btn-primary ml-1" @click.stop="searchBills()">查找账单</button>
              <button type="button" class="btn btn-secondary btn-sm ml-3" @click.stop="reset()">重置</button>

              <div class="ml-auto">
                <router-link to="/setting/bill-templates">下载模板</router-link>
                <select class="form-control" v-model.number="downloadFormat">
                  <option value="0">默认格式</option>
                  <option value="1">格式一</option>
                  <template v-for="info in templates">
                    <option :value="info.templateNo">{{info.name}}</option>  
                  </template>
                  
                </select>
                <a class="btn btn-success ml-auto" @click.stop="downloadBillInfo()" href="#">下载</a> 
              </div>
              
        </form>
      </div>
    </div>            
    <table class="table table-striped table-hover table-sm small">
        <thead>
            <tr>
                <th>类别</th>
                <th>账单号</th>
                <th>账单日期</th>
                <th>订单号</th>
                <th>客户</th>
                <th>代码/成本/项目</th>                
                <th class="text-center">收款方式</th>
                
                <th>审核日期</th>
                <th>结算</th>
                <th>收支</th>
                <th class="text-right">金额</th>
                <th class="text-right">成本</th>
                <th class="text-right">利润</th>
                <th>预订员</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
          <template v-for="info in orders" >            
            <tr :key="info.id">   
                <td>
                  {{showBillTypeDesc(info.billType)}}
                  <span v-if="info.intlTicket === 0">(国内)</span>
                  <span class="text-danger" v-else-if="info.intlTicket === 1">(国际)</span>

                </td>                             
                <td>{{info.billNum}}</td>   
                <td>{{info.opDate}}</td>                          
                <td>{{info.orderNo}}</td>                             
                <td>
                  <template v-if="info.customerType === 0">散客</template>
                  <template v-else-if="info.customer !== null">
                    {{info.customer.vipName}}  
                  </template>                  
                </td>
                <td>{{info.customerCode}}/{{info.costCenter}}/{{info.projectName}}</td>
                
                
                <td class="text-center">{{info.payTypeNoteDesc}}</td>
                <td>
                  <template v-if="info.audited === '1' && info.auditDate !== null">
                    <span class="small">{{info.auditDate}}</span>
                  </template>
                  <template v-else-if="info.audited === '1'">
                    <span class="small">已审核</span>
                  </template>
                  <template v-else>
                    <span class="text-danger small">未审核</span>
                  </template>
                </td>
                <td>
                  <span class="small"  v-if="info.settlementNo !== null">
                    {{info.settleDate}} <br />
                    {{info.settlementNo}}
                  </span>
                  <span class="text-danger small" v-else-if="info.bePaid === '0'">未结算</span>
                </td>                
                <td>
                  <span class="text-danger small" v-if="info.bePaid === '1'">已收 {{info.receiptNo}} / </span>
                  <span class="small" v-if="info.paymentStatus === 1">已付</span>
                </td>                
                <td class="text-right">{{info.billSum}}</td>
                <td class="text-right">{{info.cost}}</td>
                <td class="text-right">{{info.profit}}</td>                
                
                <td>{{info.op1}}</td>       
                <td>
                  <template v-if="info.audited !== '1' && isAdmin">
                    <button  type="button" class="btn btn-sm btn-success" @click.stop="auditBillDone(info.id)">审核通过</button>
                  </template>
                  <template v-else-if="info.audited === '1' && isAdmin">
                    <template v-if="info.bePaid !== '1'">
                      <button  type="button" class="btn btn-sm btn-success" @click.stop="writeOffBill(info.id)">已收</button>
                    </template>

                    <template v-if="info.paymentStatus === 0">
                      <button  type="button" class="btn btn-sm btn-warning ml-2" @click.stop="finishPayment(info.id)">已付</button>  
                    </template>
                    
                  </template>
                </td>      
                <td><router-link :to="`/bill/detail/` + info.id">详情</router-link></td>
            </tr>
            <tr :key="info.id + `-memo`" v-if="info.remark">
              <td colspan="15" class="text-right"><strong>备注：</strong>{{info.remark}}</td>
              <td></td>
            </tr>
          </template>
        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>
</template>

<script>
  import { searchBills, getBillTypeDesc, auditBill, writeOffSingleBill, finishBillPayment, searchDataTemplates } from '../api/bill.js'
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MySelectCustomer from '../components/my-select2-customer.vue'
  import MySelectSupplier from '../components/my-select2-supplier.vue'

  export default {
    name: 'MyBills',
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCustomer,
      MySelectSupplier
    },
    data () {
      return {
        orders: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        etdzDateBegin: '',
        etdzDateEnd: '',
        auditDateBegin: '',
        auditDateEnd: '',
        settleDateBegin: '',
        settleDateEnd: '',
        billType: -1,
        payType: 0,
        customerId: -1,
        supplierId: 0,
        billNum: '',
        orderNo: '',
        flightOrderNo: '',
        remark: '',
        costCenter: '',
        settlementNo: '',
        reviewed: -1,
        bePaid: -1,
        paymentStatus: -1,
        intlTicket: -1,
        downloadFormat: 0,

        templates: []
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    activated: function () {
      this.searchBills()
      this.searchDataTemplates()
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchDataTemplates: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 100
        }

        searchDataTemplates(params,
          (jsonResult) => {
            this.templates = jsonResult.dataList
          }
        )
      },
      searchBills: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.etdzDateBegin': this.etdzDateBegin,
          'sc.etdzDateEnd': this.etdzDateEnd,
          'sc.auditDateBegin': this.auditDateBegin,
          'sc.auditDateEnd': this.auditDateEnd,
          'sc.settleDateBegin': this.settleDateBegin,
          'sc.settleDateEnd': this.settleDateEnd,
          'sc.billNum': this.billNum,
          'sc.orderNo': this.orderNo,
          'sc.flightOrderNo': this.flightOrderNo,
          'sc.remark': this.remark,
          'sc.costCenter': this.costCenter,
          'sc.settlementNo': this.settlementNo,
          'sc.intlTicket': this.intlTicket,
          'sc.supplierId': this.supplierId,
          'reviewed': this.reviewed,
          'billType': this.billType,
          'customerId': this.customerId,
          'payType': this.payType,
          'bePaid': this.bePaid,
          'paymentStatus': this.paymentStatus
        }

        this.showLoading('加载中')

        searchBills(params,
          (jsonResult) => {
            this.orders = jsonResult.dataList
            this.sc = jsonResult.page
          }, () => {
            this.hideLoading()
          }
        )
      },
      auditBillDone: function (id) {
        auditBill(id, v => {
          if (v.status === 'OK') {
            this.showErrMsg('操作成功')
            this.searchBills()
          } else {
            this.showErrMsg('操作失败: ' + jsonResult.errmsg)
          }
        })
      },
      writeOffBill: function (id) {
        writeOffSingleBill(id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.searchBills()
          }
        })
      },
      finishPayment: function (id) {
        //完成支付
        finishBillPayment(id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.searchBills()
          }
        })
      },
      showBillTypeDesc: function (val) {
        return getBillTypeDesc(val)
      },
      reset: function () {
        this.customerId = -1
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.etdzDateBegin = ''
        this.etdzDateEnd = ''
        this.auditDateBegin = ''
        this.auditDateEnd = ''
        this.settleDateBegin = ''
        this.settleDateEnd = ''
        this.billType = -1
        this.billNum = ''
        this.orderNo = ''
        this.flightOrderNo = ''
        this.remark = ''
        this.costCenter = ''
        this.settlementNo = ''
        this.reviewed = -1
        this.bePaid = -1
        this.paymentStatus = -1
        this.intlTicket = -1
        this.supplierId = 0
      },
      downloadBillInfo: function () {
        const params = 'sc.pageNo=' + this.sc.pageNo +
          '&sc.beginDate=' + this.beginDate + '&sc.endDate=' + this.endDate +
          '&reviewed=' + this.reviewed +
          '&billType=' + this.billType +
          '&customerId=' + this.customerId +
          '&payType=' + this.payType +
          '&bePaid=' + this.bePaid +
          '&paymentStatus=' + this.paymentStatus +
          '&sc.billNum=' + this.billNum +
          '&sc.orderNo=' + this.orderNo +
          '&sc.flightOrderNo=' + this.flightOrderNo +
          '&sc.remark=' + this.remark +
          '&sc.costCenter=' + this.costCenter +
          '&sc.settlementNo=' + this.settlementNo +
          '&sc.etdzDateBegin=' + this.etdzDateBegin +
          '&sc.etdzDateEnd=' + this.etdzDateEnd +
          '&sc.auditDateBegin=' + this.auditDateBegin +
          '&sc.auditDateEnd=' + this.auditDateEnd +
          '&sc.settleDateBegin=' + this.settleDateBegin +
          '&sc.settleDateEnd=' + this.settleDateEnd +
          '&sc.intlTicket=' + this.intlTicket + 
          '&sc.supplierId=' + this.supplierId + 
          '&format=' + this.downloadFormat

        const url = APP_FLIGHT_PATH + '/downloadBillInfo.do?' + params
        // console.log(url)
        window.open(url)
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.searchBills()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.searchBills()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.searchBills()
      }
    }
  }
</script>