<template>
  <div class="modal" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">
                付款方式
            </h6>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <div class="col-12">
                <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="1" v-model.number="payType">现金
                </label>
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" value="2" v-model.number="payType">信用卡
                </label>
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" value="4" v-model.number="payType">支票
                </label>
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" value="8" v-model.number="payType">账单
                </label>
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
      default: 'modalPayType'
    },
    nullable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      payType: 8
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve(this.payType)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (val) {
      this.payType = Number.parseInt(val)

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
