<template>
  <div id="entReceipt">
    <div class="card">
      <div class="card-header bg-info text-white">
        结算单
      </div>
      <div class="card-body py-1">
        <form class="" id="frmSearch">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>

          <select class="form-control" v-model.number="status0">
            <option value="-1">收款状态</option>
            <option value="0">未收款</option>
            <option value="1">已收款</option>
          </select>

          <input type="textfield" class="form-control" size="8" placeholder="结算单号" v-model.trim="settlementNo0">
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="10000">10000</option>
          </select>


          <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>单号</th>
                <th>名称</th>
                <th>公司名称</th>
                <th class="text-right">金额</th>
                <th>收款状态</th>
                <th>创建时间</th>
                <th>修改时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-if="dataList.length > 10">
              <td colspan="3" class="text-right">金额合计：</td>
              <td class="text-right">{{totalAmount}}</td>
            </tr>
            <tr v-for="(info, index) in dataList"  :class="{ 'bg-info text-white': info.paid === 1 }">
              <td :class="{ 'text-danger': info.amount < 0 }">
                {{info.settlementNo}}
              </td>
              <td  :class="{ 'text-danger': info.amount < 0 }">
                {{info.name}} 
              </td>
              <td>
              
               
                  {{info.customerName}}  
                         
              </td>
              <td class="text-right"   :class="{ 'text-danger': info.amount < 0 }">{{info.amount}}</td>
              <td>
                <span class="text-danger small" v-if="info.payStatus === 0">未收款</span>
                <span v-else-if="info.payStatus === 1">已收款</span>
              </td>
              <td>{{info.createTime}}</td>
              <td>{{info.lastUpdate}}</td>
              <td>
                <router-link :to="`/ent/settlement/` + info.id + `/report?showTitle=0`" target="_blank">查看</router-link>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">金额合计：</td>
              <td class="text-right">{{totalAmount}}</td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

  </div>
</template>

<script>
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import { searchSettlements, batchCreateSettlement, updateSettlementName } from '../api/bill.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination
    },
    data () {
      return {
        customerId: 0,
        amount: 0,
        remark: '',

        dataList: [],
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        customerId0: -1,
        status0: -1,
        settlementNo0: '',
        amount0: '',

        modalTitle: '',

        totalAmount: 0
      }
    },
    mounted: function () {
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
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status === 'OK') {
          this.showErrMsg('操作成功：' + jsonResult.desc)
          this.search()
        } else {
          this.showErrMsg('操作失败: ' + jsonResult.errmsg, 'danger')
        }
      },
      search: function () {
        let amount = Number.parseInt(this.amount0)
        if (isNaN(amount)) {
          amount = 0
        }
        const params = {
          'pageNo': this.sc.pageNo,
          'pageSize': this.sc.pageSize,
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          'payStatus': this.status0,
          'settlementNo': this.settlementNo0
        }

        this.showLoading()

        searchSettlements(params, 
          v => {
            this.dataList = v.dataList
            this.sc = v.page
            this.calcTotalAmount(this.dataList)
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.customerId0 = -1
        this.settlementNo0 = ''
        this.amount0 = ''
        this.status0 = -1
      },
      calcTotalAmount: function (infos) {
        this.totalAmount = 0
        for (const info of this.dataList) {
          this.totalAmount += info.amount
        }

        this.totalAmount = Math.round(this.totalAmount * 100) / 100
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