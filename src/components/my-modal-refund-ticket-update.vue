<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              退票修改
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <div class="card py-0">
            <div class="card-body py-0">
              <div class=" row mb-0">
                  <label class="col-form-label col-4 text-right">
                      票号    
                  </label>
                  <div class="col-md-6">
                      <input type="text" readonly class="form-control-plaintext" v-model.trim="ticketNo" />
                  </div>
              </div>
              <div class=" row mb-0">
                  <label class="col-form-label col-4 text-right">
                      乘客姓名    
                  </label>
                  <div class="col-md-6">
                      <input type="text" readonly class="form-control-plaintext" v-model="psgName" />
                  </div>
              </div>
              <div class=" row mb-1">
                  <label class="col-form-label col-4 text-right">
                      金额    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control" v-model.number="amount" />
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

      ticketNo: '',
      psgName: '',
      amount: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        ticketNo: this.ticketNo,
        name: this.psgName,
        amount: this.amount
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (ticketNo, psgName, amount) {
      this.ticketNo = ticketNo
      this.psgName = psgName
      this.amount = amount
      $(this.$el).modal()
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
