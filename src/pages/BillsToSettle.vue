  <template>
  <div id="bills">
    <div class="card">
      <div class="card-header bg-info text-white">
        待结算账单
      </div>
      <div class="card-body px-1">
        <form class="form-inline">
          <select class="form-control" v-model.number="billType">
            <option value="-1">所有</option>
            <option value="0">机票</option>
            <option value="5">退票</option>
            <option value="7">改签</option>
            <option value="6">服务</option>
            <option value="2">酒店</option>
            <option value="3">火车票</option>
          </select>
          <my-date-picker id="date0" v-model="beginDate" placeholder="账单日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date1" v-model="endDate" placeholder="账单日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="date2" v-model="etdzDateBegin" placeholder="出票日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date3" v-model="etdzDateEnd" placeholder="出票日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="date4" v-model="auditDateBegin" placeholder="审核日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="date5" v-model="auditDateEnd" placeholder="审核日期到" sizing="sm"></my-date-picker>
          <select class="form-control" v-model.number="supplierId">
            <option value="0">所有供应商</option>
            <template v-for="info in suppliers">
              <option :value="info.id">{{info.name}}</option>
            </template>
          </select>
          <div class="col-2 px-0">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <input class="form-control" placeholder="成本中心" size="7" v-model.trim="costCenter">
          <input type="textfield" class="form-control" size="6" placeholder="订单号" v-model.trim="orderNo">
          <input type="textfield" class="form-control" size="8" placeholder="原始单号" v-model.trim="flightOrderNo">
          <input type="textfield" class="form-control" size="6" placeholder="账单备注" v-model.trim="remark">
          <label>每页</label>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="500">500</option>
              <option value="5000">5000</option>
          </select>

            <button type="button" class="btn btn-primary ml-1" @click.stop="searchBills()">查找账单</button>
            <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
            <a class="btn btn-success ml-auto invisible" @click.stop="downloadBillInfo()" href="#" title="a">下载</a> 
            <button type="button" class="btn btn-warning btn-sm ml-auto" @click.stop="checkPayStatus()" title="检查散客订单的收款状态" :disabled="btnDisabled">收款状态</button> 
        </form>
      </div>                
      <table class="table table-striped table-hover table-sm small">
        <thead>
          <tr>
            <th>账单号</th>
            <th>类型</th>
            <th>客户</th>
            <th>编号/成本/项目</th>
            <th>账单/出票日期</th>
            <th>审核日期</th>
            <th>订票员</th>
            <th>收款方式</th>
            <th class="text-right">账单金额</th>
            <th class="text-right">成本</th>
            <th class="text-right">利润</th>
            <th>备注</th>
            <th>订单号</th>
            <th>原始单号</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" size="8" v-model.trim="filter.billNum"></td>
            <td></td>
            <td><input type="text" size="8" v-model.trim="filter.vipName"></td>
            <td><input type="text" size="6" v-model.trim="filter.customerCode"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right"><input type="text" size="6" v-model.number="filter.billSum"></td>
            <td class="text-right"><input type="text" size="6" v-model.number="filter.cost"></td>
            <td></td>
            <td></td>
            <td></td>
            <td><button @click.stop="resetFilter()">清空</button></td>
            <td></td>
          </tr>
          <template  v-for="(info, index) in filterBills">
            <tr @mouseenter.once="showBillDetail(info)">   
              <td>
                <input type="checkbox" :value="info.id" v-model="reviewedIds" />
                {{(info.billNum)}}
              </td>      
              <td>{{showBillTypeDesc(info.billType)}}</td>                       
              <td>
                <template v-if="info.customerType ===0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.vipName}}  
                </template>                  
              </td>
              <td>
                <template v-if="info.customer !== null">
                  {{info.customer.customerCode}}  
                </template>   
                /{{info.costCenter}}/{{info.projectName}}               
              </td>
              <td>
                {{info.opDate}}
                <template v-if="info.etdzDate !== info.opDate && info.etdzDate !== null && info.etdzDate.length > 0">
                  /{{info.etdzDate}}
                </template>
              </td>
              <td>{{info.auditDate}}</td>
              <td>{{info.op1}}</td>
              <td>{{info.payTypeNoteDesc}}
                  <template v-if="info.bePaid === '0'">
                      <span class="text-danger small">未收</span>
                  </template>
                  <template v-else-if="info.bePaid === '1'">
                      <span class="text-success small">已收</span>
                  </template>
              </td>
              <td class="text-right">{{info.billSum}}</td>
              <td class="text-right">{{info.cost}}</td>
              <td class="text-right">{{info.profit}}</td>                
              <td></td>                
              <td>{{info.orderNo}}</td>                
              <td>{{info.flightOrderNo}}</td>                
              <td><router-link :to="`/bill/detail/` + info.id + `?print=1`" target="_blank">详情</router-link></td>
            </tr>
            <tr>
              <td colspan="11" class="text-center">  
                <!-- 显示订单详情：主要是人名 -->
                <!-- 机票账单 -->
                <template v-if="info.billType === '0' && info.tickets.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.tickets">
                      <td>{{detail.passengerName}}</td>
                      <td>{{detail.balanceCode}}-{{(detail.ticketNo)}}</td>
                    </tr>
                  </table>
                </template>
                <!-- 酒店账单 -->
                <template v-else-if="info.billType === '2' && info.hotelBookings.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.hotelBookings">
                      <td>{{detail.passengerName}}</td>
                      <td>{{detail.hotelName}}</td>
                    </tr>
                  </table>
                </template>
                <!-- 火车票账单 -->
                <template v-else-if="info.billType === '3' && info.trainTickets.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.trainTickets">
                      <td>{{detail.passengerName}}</td>
                      <td>{{detail.trainNo}}</td>
                    </tr>
                  </table>
                </template>
                <!-- 退票账单 -->
                <template v-else-if="info.billType === '5' && info.refundTickets.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.refundTickets">
                      <td>{{detail.psgName}}</td>
                      <td>{{detail.balanceCode}}-{{(detail.ticketNo)}}</td>
                    </tr>
                  </table>
                </template>
                <!-- 服务账单 -->
                <template v-else-if="info.billType === '6' && info.vasOrders.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.vasOrders">
                      <td>{{detail.productName}}</td>
                      <td>{{detail.remark}}</td>
                    </tr>
                  </table>
                </template>
                <!-- 服务账单 -->
                <template v-else-if="info.billType === '7' && info.changeOrders.length > 0">                    
                  <table class="mb-0 ml-auto mr-auto">
                    <tr v-for="detail in info.changeOrders">
                      <td>{{detail.psgName}}</td>
                      <td>{{detail.balanceCode}}-{{(detail.ticketNo)}}</td>
                    </tr>
                  </table>
                </template>
              </td>
              <td colspan="5">  
                {{info.remark}}
              </td>
            </tr>
          </template>
          <tr v-if="sc.pageTotal === 1">   
            <td colspan="8" class="text-right">合计：</td>                             
            <td  class="text-right">{{totalBillSum}}</td>
            <td class="text-right">{{totalCost}}</td>
            <td class="text-right">{{totalProfit}}</td>                
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="15">
              <button @click.stop="uncheckAll()" class="btn btn-sm btn-secondary ml-1">全否</button>
              <button @click.stop="checkAll()" class="btn btn-sm btn-primary ml-1">全选</button>
              <button @click.stop="checkAllShow()" class="btn btn-sm btn-success">全选可见</button>
              
              <template v-if="searchedCustomerId >= 0">
                <button class="btn btn-success float-right" @click.stop="createSettlement()">新建(加入)结算单</button>  
              </template>
              <template v-else>
                <span class="text-warning float-right">指定客户查找账单，此处会有变化</span>
              </template>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right" v-if="sc.pageTotal > 1">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <my-modal-create-settlement ref="modalCreateSettlement">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-create-settlement>
  </div>


</template>

<script>
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import { searchSuppliers } from '../api/basic-data.js'
  import { searchBillsToSettle, getBillTypeDesc, createSettlement, checkPayStatus, searchBillDetail } from '../api/bill.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyModalCreateSettlement from '../components/my-modal-settlement-create.vue'
  import MySelectCustomer from '../components/my-select2-customer.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MyModalCreateSettlement,
      MySelectCustomer
    },
    data () {
      return {
        orders: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        etdzDateBegin: '',
        etdzDateEnd: '',
        auditDateBegin: '',
        auditDateEnd: '',
        billType: -1,
        customerId: -1,
        suppliers: [],
        supplierId: 0,
        costCenter: '',
        orderNo: '',
        flightOrderNo: '',
        remark: '',

        totalBillSum: 0,
        totalCost: 0,
        totalProfit: 0,

        reviewedIds: [],
        modalTitle: '',

        searchedCustomerId: -1,

        filter: {
          billNum: '',
          customerCode: '',
          vipName: '',
          billSum: 0,
          cost: 0
        },

        btnDisabled: false
      }
    },
    watch: {
      reviewedIds: function () {
        this.caclTotal()
      }
    },
    computed: {
      filterBills: function () {
        const self = this
        return this.orders.filter(function (info) {
          return (self.filter.billNum === '' || info.billNum.indexOf(self.filter.billNum) >= 0) &&
            (self.filter.customerCode === '' || (info.customer !== null && info.customer.customerCode !== null && info.customer.customerCode.indexOf(self.filter.customerCode) >= 0)) &&
            (self.filter.billSum === 0 || self.filter.billSum === info.billSum) &&
            (self.filter.cost === 0 || self.filter.cost === info.cost) &&
            (self.filter.vipName === '' || (info.customer !== null && info.customer.vipName !== null && info.customer.vipName.indexOf(self.filter.vipName) >= 0))
        })
      }
    },
    mounted: function () {
      this.searchSuppliers()
      // this.searchBills()
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
          'billType': this.billType,
          'customerId': this.customerId,
          'supplierId': this.supplierId,
          'sc.costCenter': this.costCenter,
          'sc.orderNo': this.orderNo,
          'sc.flightOrderNo': this.flightOrderNo,
          'sc.remark': this.remark
        }

        this.showLoading()

        searchBillsToSettle(params,
          (jsonResult) => {
            this.reviewedIds.splice(0)

            this.orders = jsonResult.dataList
            this.sc = jsonResult.page

            this.searchedCustomerId = this.customerId
          },
          () => { this.hideLoading() }
        )
      },
      showBillTypeDesc: function (val) {
        return getBillTypeDesc(val)
      },
      resetTotal: function () {
        this.totalBillSum = 0
        this.totalCost = 0
        this.totalProfit = 0
      },
      caclTotal: function () {
        // console.log('caclTotal')
        this.resetTotal()

        for (const info of this.orders) {
          if (this.reviewedIds.indexOf(info.id) >= 0) {
            this.totalBillSum += info.billSum
            this.totalCost += info.cost
            this.totalProfit += info.profit
          }
        }

        this.totalBillSum = Math.round(this.totalBillSum * 100) / 100
        this.totalCost = Math.round(this.totalCost * 100) / 100
        this.totalProfit = Math.round(this.totalProfit * 100) / 100
      },
      checkAllShow: function () {
        const self = this
        this.reviewedIds = []
        this.filterBills.forEach(function (item) {
          self.reviewedIds.push(item.id)
        })
        this.caclTotal()
      },
      checkAll: function () {
        const self = this
        this.reviewedIds = []
        this.orders.forEach(function (item) {
          self.reviewedIds.push(item.id)
        })
        this.caclTotal()
      },
      uncheckAll: function () {
        this.reviewedIds = []
        this.resetTotal()
      },
      createSettlement: function () {
        if (this.reviewedIds.length < 1) {
          this.showErrMsg('请选择账单')
          return
        }

        this.$refs.modalCreateSettlement.modal(this.totalBillSum, this.searchedCustomerId).then((v) => {
          createSettlement({
            'customerId': this.searchedCustomerId,
            'settlementId': v.settlementId,
            'settlementNo': v.settlementNo,
            'settlementName': v.settlementName,
            'total': this.totalBillSum,
            'billIds': this.reviewedIds
          }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      searchSuppliers: function () {
        if (this.suppliers.length > 0) return
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 500
        }

        searchSuppliers(params,
          (jsonResult) => {
            this.suppliers = jsonResult.dataList
          }
        )
      },
      checkPayStatus: function () {
        this.btnDisabled = true
        checkPayStatus(v => this.commonShowMessage(v), () => { this.btnDisabled = false })
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
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('失败：' + jsonResult.errmsg, 'danger')
        } else {
          this.searchBills()
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
        }
      },
      downloadBillInfo: function () {
        const params = 'sc.pageNo=' + this.sc.pageNo + '&sc.beginDate=' + this.beginDate + '&sc.endDate=' + this.endDate + '&billType=' + this.billType + '&customerId=' + this.customerId + '&reviewed=1&bePaid=0&settled=0'
        const url = APP_FLIGHT_PATH + '/downloadBillInfo.do?' + params
        window.open(url)
      },
      resetFilter: function () {
        this.filter.billNum = ''
        this.filter.customerCode = ''
        this.filter.vipName = ''
        this.filter.billSum = 0
        this.filter.cost = 0
      },
      reset: function () {
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.etdzDateBegin = ''
        this.etdzDateEnd = ''
        this.auditDateBegin = ''
        this.auditDateEnd = ''
        this.billType = -1
        this.supplierId = 0
        this.customerId = -1
        this.costCenter = ''
        this.orderNo = ''
        this.flightOrderNo = ''
      },
      showBillDetail: function (bill) {
        const params = {
          'id': bill.id
        }

        searchBillDetail(params,
          v => {
            if (v.billType === '0') {
              // 机票账单
              for (let x of v.tickets) {
                bill.tickets.push(x)
              }
            } else if (v.billType === '2') {
              // 酒店账单
              for (let x of v.hotelBookings) {
                bill.hotelBookings.push(x)
              }
            } else if (v.billType === '3') {
              // 火车票账单
              for (let x of v.trainTickets) {
                bill.trainTickets.push(x)
              }
            } else if (v.billType === '5') {
              // 退票账单
              for (let x of v.refundTickets) {
                bill.refundTickets.push(x)
              }
            } else if (v.billType === '6') {
              // 服务账单
              for (let x of v.vasOrders) {
                bill.vasOrders.push(x)
              }
            } else if (v.billType === '7') {
              // 改签账单
              for (let x of v.changeOrders) {
                bill.changeOrders.push(x)
              }
            }
          }
        )

      }
    }
  }
  // 380
</script>