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
            <div class="form-group row">
              <label class="col-3 col-form-label text-right">
                <slot name="price1Title">
                  价格1
                </slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="price1">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 col-form-label text-right">
                <slot name="price2Title">
                  价格2
                </slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="price2">
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

      price1: 0,
      price2: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ price1: this.price1, price2: this.price2 })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (price1, price2) {
      $(this.$el).modal()

      this.price1 = price1
      this.price2 = price2

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
