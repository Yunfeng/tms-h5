<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              更改支付方式
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class=" row">
                <label class="control-label col-3 text-right">
                    支付方式    
                </label>
                <div class="col-9">
                  <my-select-payment :paymentId.sync="payMethodId"></my-select-payment>
                </div>
            </div>
          </form>
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
import MySelectPayment from '../components/my-select-payment.vue'

export default {
  components: {
    MySelectPayment
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      payMethodId: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ payMethodId: this.payMethodId })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (payMethodId) {
      $(this.$el).modal()

      this.payMethodId = payMethodId

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
