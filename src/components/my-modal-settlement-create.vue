<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
              创建/加入结算单
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <div class="card py-0">
            <div class="card-body py-0">
              <div class="form-group row mb-0">
                  <label class="col-form-label col-3 text-right">
                      已有结算单     
                  </label>
                  <div class="col-9">
                    <select class="form-control" v-model.number="settlementId">
                      <option value="0">新建</option>
                      <template v-for="info in dataList">
                        <option :value="info.id">{{info.name}}/{{info.settlementNo}}</option>
                      </template>
                    </select>
                  </div>
              </div>
              <div class="form-group row mb-0">
                  <label class="col-form-label col-3 text-right">
                      金额     
                  </label>
                  <div class="col-9">
                      <input type="text" readonly class="form-control-plaintext"  v-model.number="amount" />
                  </div>
              </div>
              <div class="form-group row mb-1" v-if="settlementId == 0">
                  <label class="col-form-label col-3 text-right">
                      结算单编号    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control" v-model.trim="settlementNo" />
                      <span class="text-muted small">最大长度20，不能重复</span>
                  </div>
              </div>
              <div class="form-group row mb-1" v-if="settlementId == 0">
                  <label class="col-form-label col-3 text-right">
                      结算单名称    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control" v-model.trim="settlementName" />
                      <span class="text-muted small">最大长度50，可以写一个描述性强的名称</span>
                  </div>
              </div>
            </div> 
          </div>
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
import { searchSettlements } from '../api/bill.js'

export default {
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

      customerId: -1,
      amount: 0,
      settlementId: 0,
      settlementNo: '',
      settlementName: '',

      dataList: []
    }
  },
  mounted: function () {
    console.log('my-modal-settlemetn-create mounted')
  },
  activated: function () {
    console.log('my-modal-settlemetn-create activated')
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        settlementId: this.settlementId,
        settlementNo: this.settlementNo,
        settlementName: this.settlementName
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (amount, customerId) {
      this.customerId = customerId
      this.amount = amount

      this.dataList.splice(0)
      
      this.searchSettlements()

      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    searchSettlements: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 500,
        'sc.customerId': this.customerId,
        'sc.status': 0
      }

      searchSettlements(params, (jsonResult) => {
        this.dataList = jsonResult.dataList
      })
    }
  }
}
</script>
