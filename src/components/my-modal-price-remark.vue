<template>
  <div class="modal" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              价格修改
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <label class="col-3 col-form-label text-right">
                <slot name="priceTitle">
                  金额
                </slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="price">
              </div>
            </div>
            <div class=" row">
              <label class="col-3 col-form-label text-right">
                <slot name="remarkTitle">
                  备注
                </slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.trim="remark">
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

      price: 0,
      remark: ''
    }
  },
  methods: {
    ok: function () {
      if (this.price <= 0 || this.remark === null || this.remark.length === 0) {
        return
      }

      $(this.$el).modal('hide')

      this.resolve({ 'price': this.price, 'remark': this.remark })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (price, remark) {
      $(this.$el).modal()

      this.price = price
      this.remark = remark

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
