<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
              收(退)款单录入
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
              <div class="form-group row mb-1">
                  <label class="control-label col-3 text-right">
                      企业    
                  </label>
                  <div class="col-9">
                      <my-select-customer :minId="0" :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="control-label col-3 text-right">
                      金额    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control" v-model.number="amount" />
                      <span class="text-muted small">金额为负数时表示退款单，仅限于退票账单销账用</span>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="control-label col-3 text-right">
                      收款银行    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control" v-model="receiptBank" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="control-label col-3 text-right">
                      收款日期    
                  </label>
                  <div class="col-9">
                    <my-date-picker id="receiptDate" v-model="receiptDate" sizing="sm" placeholder="格式：2017-01-23"></my-date-picker>
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="control-label col-3 text-right">
                      备注*
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control" v-model="remark" />
                  </div>
              </div>
          </form>
          <table class="table table-sm table-striped small" v-if="dataList.length > 0">
            <thead>
              <tr class="bg-info text-white">
                <th>收款单号</th>
                <th class="text-right">余额</th>
                <th>备注</th>
              </tr>                        
            </thead>
            <tbody>
              <tr>   
                <td colspan="3" class="text-center text-danger">
                  选择以下收款单，将余额并入当前收款单。
                </td>
              </tr>
              <tr v-for="info in filterRefundNote(dataList)">   
                <td>
                  <input type="checkbox" :value="info.id" v-model="receiptIds" />
                  {{(info.receiptNo)}}
                </td>
                <td class="text-right">{{info.amount - info.writeOffAmount}}</td>
                <td>{{info.remark}}</td>
              </tr>
              <tr>   
                <td>
                  小计
                </td>
                <td class="text-right">{{subTotal}}</td>
                <td></td>
              </tr>
            </tbody>
          </table> 
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click.stop="cancel()">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="ok()">确定</button>
        </div>
      </div>
    </div>                    
  </div>
</template>

<script>
import $ from 'jquery'
import { searchEntReceipts } from '../api/receipt.js'
import MyDatePicker from '../components/my-datepicker.vue'
import MySelectCustomer from '../components/my-select-customer.vue'

export default {
  components: {
    MyDatePicker,
    MySelectCustomer
  },
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      dataList: [],

      customerId: -1,
      amount: 0,
      remark: '',
      receiptBank: '',
      receiptDate: null,
      receiptIds: [],
      subTotal: 0
    }
  },
  watch: {
    customerId: function () {
      this.searchReceipts()
    },
    receiptIds: function (newVal) {
      this.calcTotal()
    },
    amount: function () {
      this.calcTotal()
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        customerId: this.customerId,
        amount: this.amount,
        remark: this.remark,
        receiptBank: this.receiptBank,
        receiptDate: this.receiptDate,
        receiptIds: this.receiptIds
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function () {
      this.reset()
      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    reset: function () {
      this.customerId = -1
      this.amount = 0
      this.remark = ''
      this.receiptBank = ''
      this.receiptDate = null
    },
    searchReceipts: function () {
      if (this.customerId === -1) {
        this.dataList.splice(0)
        return
      }

      this.receiptIds.splice(0)

      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 50,
        'sc.customerId': this.customerId,
        'sc.status': 0
      }

      searchEntReceipts(params, (jsonResult) => {
        this.dataList = jsonResult.dataList
        // console.log(jsonResult)
      })
    },
    filterRefundNote: function (dataList) {
      // 过滤掉退款单
      return dataList.filter(function (r) {
        return r.amount > 0
      })
    },
    calcTotal: function () {
      this.subTotal = this.amount
      this.receiptIds.forEach((receiptId, index) => {
        // console.log(receiptId + ', ' + index)
        this.filterRefundNote(this.dataList).forEach((info, index1) => {
          // console.log(info + ', ' + index1)
          if (info.id === receiptId) {
            this.subTotal += info.amount - info.writeOffAmount
          }
        })
      })
    }
  }
}
</script>
