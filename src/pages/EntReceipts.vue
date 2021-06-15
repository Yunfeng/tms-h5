<template>
  <div id="entReceipt">
    <div class="card">
      <div class="card-header bg-info text-white">
        收(退)款单
      </div>
      <div class="card-body">
        <form class="">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <div class="col-2 px-0">
            <my-select-customer :customerId.sync="customerId0" :enterpriseType="1"></my-select-customer>
          </div>

          <select class="form-control" v-model.number="status0">
            <option value="-1">全部</option>
            <option value="0">未销完</option>
            <option value="1">已销完</option>
          </select>

          <select class="form-control" v-model.number="receiptType">
            <option value="-1">全部</option>
            <option value="0">收款单</option>
            <option value="1">退款单</option>
          </select>

          <input type="textfield" class="form-control" size="6" placeholder="收款单号" v-model.trim="receiptNo0">
          <input type="textfield" class="form-control" size="6" placeholder="金额" v-model.trim="amount0">

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


          <span class="ms-auto">
              <button class="btn btn-success" @click.stop.prevent="newReceipt()">录入</button> 
          </span>
        </form>
      </div>
    </div>
    <table class="table table-striped table-hover table-sm small">
        <thead>
            <tr>
                <th>收款单号</th>
                <th>公司名称</th>
                <th>操作员</th>
                <th class="text-right">金额</th>
                <th class="text-right">已销</th>
                <th class="text-right">剩余金额</th>
                <th>收款银行</th>
                <th>收款日期</th>
                <th>备注</th>
                <th>创建时间</th>
                <th>修改时间</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-if="dataList.length > 10">
              <td colspan="5" class="text-right">(剩余余额) 合计：</td>
              <td class="text-right">{{totalBalance}}</td>
            </tr>
            <tr v-for="(info, index) in dataList" :class="{ 'bg-info text-white': info.status === 1 }">
                <td>                  
                  <span v-if="info.receiptType === 0">{{info.receiptNo}}</span>
                  <span class="text-danger" v-if="info.receiptType === 1">{{info.receiptNo}} <small>退</small></span>
                </td>
                <td>
                  <template v-if="info.customerType === 0">散客</template>
                  <template v-else-if="info.customer !== null">{{info.customer.vipName}}</template>                  
                </td>
                <td>{{info.operator}}</td>
                <td class="text-right">{{info.amount}}</td>
                <td class="text-right">{{info.writeOffAmount}}</td>
                <td class="text-right">{{calcBalance(info)}}</td>
                <td>{{info.receiptBank}}</td>
                <td>{{info.receiptDate}}</td>
                <td>
                  {{info.remark}}
                  <a href="javascript:void(0)" @click.stop="editRemark(info.id)" class="small">修改</a>
                </td>
                <td>{{info.createTime}}</td>
                <td>{{info.lastUpdate}}</td>
                <td class="text-center">
                  <template v-if="info.status === 0 && info.amount !== 0">
                      <router-link :to="`/ent/receipt/` + info.id + `/writeoff`" class="text-success">去销账</router-link>
                  </template>
                </td>
                <td class="text-center">
                  <template v-if="info.status === 0 && info.receiptType === 0">
                    <button class="btn-warning" @click.stop="refundReceipt(info.id)">退款</button>
                  </template>
                </td>
                <td>
                  <router-link :to="`/ent/receipt/` + info.id + `/history`" class="">日志</router-link>

                  <template v-if="info.status === 0 && info.writeOffAmount === 0">
                    <button class="btn-danger float-right" @click.stop="deleteReceipt(info.id)">删除</button>
                  </template>
                </td>
            </tr>
            <tr>
              <td colspan="5" class="text-right">(剩余余额) 合计：</td>
              <td class="text-right">{{totalBalance}}</td>
            </tr>
        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>


    <my-modal-receipt-create ref="modalReceiptCreate">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-receipt-create>
    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-price-remark ref="modalRefund">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-price-remark>
  </div>
</template>

<script>
  import { searchEntReceipts, createEntReceipt, deleteReceipt, refundReceipt, updateReceiptRemark } from '../api/receipt.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import MySelectCustomer from '../components/my-select2-customer.vue'
  import MyModalReceiptCreate from '../components/my-modal-receipt-create.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalPriceRemark from '../components/my-modal-price-remark.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCustomer,
      MyModalReceiptCreate,
      MyModalPrompt,
      MyModalPriceRemark
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
        customerId0: -1,
        status0: 0,
        receiptNo0: '',
        amount0: '',
        totalBalance: 0,
        receiptType: 0,

        modalTitle: '',
        modalNullable: true
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
      search: function () {
        let amount = Number.parseInt(this.amount0)
        if (isNaN(amount)) {
          amount = 0
        }
        // console.log(amount)
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.customerId': this.customerId0,
          'sc.status': this.status0,
          'sc.receiptNo': this.receiptNo0,
          'sc.amount': amount,
          'sc.receiptType': this.receiptType
        }

        this.showLoading()

        searchEntReceipts(params,
          v => {
            this.dataList = v.dataList
            this.sc = v.page
            this.calcTotalBalance(this.dataList)
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.sc.pageNo = 1
        this.beginDate = ''
        this.endDate = ''
        this.customerId0 = -1
        this.status0 = 0
        this.receiptNo0 = ''
        this.amount0 = ''
        this.receiptType = 0
      },
      deleteReceipt: function (id) {
        this.modalTitle = '确定删除？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          this.doDeleteReceipt(id)
        }).catch((ex) => {})
      },
      doDeleteReceipt: function (id) {
        deleteReceipt(id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg('删除成功')
            this.search()
          }
        })
      },
      newReceipt: function () {
        this.$refs.modalReceiptCreate.modal().then((v) => {
          // console.log(v)
          const params = {
            'customerId': v.customerId,
            'amount': v.amount,
            'remark': v.remark,
            'receiptBank': v.receiptBank,
            'receiptDate': v.receiptDate,
            'receiptIds': v.receiptIds
          }

          createEntReceipt(params, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      refundReceipt: function (id) {
        this.modalTitle = '请输入退款金额，并备注理由：'
        this.$refs.modalRefund.modal(0, '').then(v => {
          this.doRefundReceipt(id, v.price, v.remark)
        }).catch((ex) => {})
      },
      doRefundReceipt: function (id, amount, remark) {
        const params = {
          'amount': amount,
          'remark': remark
        }
        refundReceipt(id, params, v => this.commonShowMessage(v))
      },
      editRemark: function (id) {
        // 修改收款单备注
        this.modalTitle = '请输入新的备注'
        this.$refs.modalPrompt.modal().then((remark) => {
          const params = { remark }
          
          updateReceiptRemark(id, params, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('失败：' + jsonResult.errmsg, 'danger')
        } else {
          this.search()
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
        }
      },
      calcBalance: function (info) {
        return Math.round((info.amount - info.writeOffAmount) * 100) / 100
      },
      calcTotalBalance: function (infos) {
        this.totalBalance = 0
        for (const info of this.dataList) {
          this.totalBalance += info.amount - info.writeOffAmount
        }

        this.totalBalance = Math.round(this.totalBalance * 100) / 100
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