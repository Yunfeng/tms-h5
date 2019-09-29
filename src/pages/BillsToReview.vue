<template>
  <div id="bills">
    <div class="card">
      <div class="card-header bg-info text-white">
        待审核账单
      </div>
      <div class="card-body px-0">
        <form class="form-inline">
          <select class="form-control" v-model.number="billtype">
            <option value="0">机票</option>
            <option value="5">机票退票</option>
            <option value="7">机票改签</option>
            <option value="6">增值服务</option>
            <option value="2">酒店</option>
            <option value="3">火车票</option>
          </select>
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="账单日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="账单日期到" sizing="sm"></my-date-picker>
          <my-date-picker id="etdzDateBegin" v-model="etdzDateBegin" name="sc.etdzDateBegin" placeholder="出票日期从" sizing="sm"></my-date-picker>
          <my-date-picker id="etdzDateEnd" v-model="etdzDateEnd" name="sc.etdzDateEnd" placeholder="出票日期到" sizing="sm"></my-date-picker>
          <div class="col-2 px-0">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <select class="form-control" v-model.number="supplierId">
            <option value="0">所有供应商</option>
            <template v-for="info in suppliers">
              <option :value="info.id">{{info.name}}</option>
            </template>
          </select>
          <my-select-op2 sizing="sm" :username.sync="op2"></my-select-op2>
          <label>每页记录数</label>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="50">50</option>
              <option value="500">500</option>
              <option value="5000">5000</option>
          </select>

            <button type="button" class="btn btn-primary ml-1" @click.stop="searchBills()">查找账单</button>
            <button type="button" class="btn btn-danger btn-sm ml-auto" @click.stop="autoReview()" :disabled="autoReviewing">
              <template v-if="autoReviewing">
                自动审核中...
              </template>
              <template v-else>
                自动审核 
              </template>    
            </button> 
            <a class="btn btn-success ml-auto" @click.stop="downloadBillInfo()" href="#">下载</a> 
        </form>
      </div>                
      <table class="table table-striped table-hover table-sm small">
        <thead>
          <tr>
            <th>账单号</th>
            <th>客户</th>
            <th>编号/成本/项目</th>
            <th>账单日期</th>
            <th>出票日期</th>
            <th>订票员</th>
            <th>收款方式</th>
            <th>供应商</th>
            <th>支付方式</th>
            <th class="text-right">账单金额</th>
            <th class="text-right">成本</th>
            <th class="text-right">利润</th>
            <th>备注</th>
            <th>订单号</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>              
              <input type="text" size="8" v-model.trim="filter.billNum">
            </td>
            <td>
              <input type="text" size="8" v-model.trim="filter.vipName">
            </td>
            <td>
              <input type="text" size="6" v-model.trim="filter.customerCode">
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right">
              <input type="text" size="6" v-model.number="filter.billSum">
            </td>
            <td class="text-right">
              <input type="text" size="6" v-model.number="filter.cost">
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td><button @click.stop="resetFilter()">清空</button></td>
          </tr>
          <tr v-for="(info, index) in filterBills">   
            <td>
              <input type="checkbox" :value="info.id" v-model="reviewedIds" />
              {{(info.billNum)}}
            </td>                             
            <td>
              <template v-if="info.customerType === 0">
                散客
              </template>                  
              <template v-else-if="info.customer !== null">
                {{info.customer.vipName}}  
              </template>                  
            </td>
            <td>
              <template v-if="info.customer !== null">
                {{info.customer.customerCode}}/  
              </template> 
              {{info.costCenter}}/{{info.projectName}}                 
            </td>
            <td>{{info.opDate}}</td>
            <td>{{info.etdzDate}}</td>
            <td>{{info.op1}}</td>
            <td>{{info.payTypeNoteDesc}}
                <template v-if="info.bePaid === '1'">
                    <span class="text-success small">已收</span>
                </template>
            </td>
            <td>
              <template v-if="info.supplier !== null">
                {{info.supplier.name}}
              </template>              
            </td>
            <td>
              <template v-if="info.paymentMethod !== null">
                {{info.paymentMethod.name}}  
              </template>              
            </td>
            <td class="text-right">{{info.billSum}}</td>
            <td class="text-right">{{info.cost}}</td>
            <td class="text-right">{{info.profit}}</td>                
            <td>{{info.remark}}</td>                
            <td>{{info.orderNo}}</td>                
            <td><router-link :to="`/bill/detail/` + info.id + `?print=1`" target="_blank">详情</router-link></td>
          </tr>
          <tr>   
            <td colspan="9" class="text-right">合计：</td>                             
            <td class="text-right">{{totalBillSum}}</td>
            <td class="text-right">{{totalCost}}</td>
            <td class="text-right">{{totalProfit}}</td>                
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr v-if="orders.length > 0">
            <td colspan="15">
              <button @click.stop="uncheckAll()" class="btn btn-sm btn-secondary">全否</button>
              <button @click.stop="checkAll()" class="btn btn-sm btn-primary">全选</button>
              <button @click.stop="checkAllShow()" class="btn btn-sm btn-warning">全选可见</button>
              
              <button class="btn btn-success float-right" @click.stop="reviewPass()">审核通过</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right" v-if="sc.pageTotal > 1">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
  </div>


</template>

<script>
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import { searchSuppliers } from '../api/basic-data.js'
  import { searchUnreviewedBills, reviewBillInfoPassed, autoReviewBillInfo } from '../api/bill.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MySelectCustomer from '../components/my-select2-customer.vue'
  import MySelectOp2 from '../components/my-select-operator.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MyModalPrompt,
      MySelectCustomer,
      MySelectOp2
    },
    data () {
      return {
        orders: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 50,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        etdzDateBegin: '',
        etdzDateEnd: '',
        billtype: '0',
        customerId: -1,
        suppliers: [],
        supplierId: 0,
        op2: '',

        totalBillSum: 0,
        totalCost: 0,
        totalProfit: 0,

        reviewedIds: [],
        modalTitle: '',
        filter: {
          billNum: '',
          customerCode: '',
          vipName: '',
          billSum: 0,
          cost: 0
        },
        autoReviewing: false
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
          // console.log(info)
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
      this.searchBills()
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
        this.uncheckAll()
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.etdzDateBegin': this.etdzDateBegin,
          'sc.etdzDateEnd': this.etdzDateEnd,
          'sc.ticketer': this.op2,
          'billType': this.billtype,
          'customerId': this.customerId,
          'supplierId': this.supplierId
        }

        this.showLoading()

        searchUnreviewedBills(params,
          (jsonResult) => {
            this.orders = jsonResult.dataList
            this.sc = jsonResult.page
          },
          () => { this.hideLoading() }
        )
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
      reviewPass: function () {
        if (this.reviewedIds.length < 1) {
          this.showErrMsg('请选中审核通过的账单号')
          return
        }

        this.modalTitle = '请确认要通过审核的账单总金额为：'
        this.$refs.modalPrompt.modal(this.totalBillSum).then(() => {
          reviewBillInfoPassed({
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
          this.showErrMsg('失败：' + jsonResult.errmsg)
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
        const params = 'sc.pageNo=' + this.sc.pageNo + '&sc.beginDate=' + this.beginDate + '&sc.endDate=' + this.endDate + '&billType=' + this.billtype + '&customerId=' + this.customerId + '&reviewed=0'
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
      autoReview: function () {
        // auto review
        this.autoReviewing = true
        autoReviewBillInfo((jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('出现错误')
          }
        }, () => {
          this.autoReviewing = false
        })
      }
    }
  }
</script>