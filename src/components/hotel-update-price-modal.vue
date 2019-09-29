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
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row">
              <label class="col-3 col-form-label text-right">销售价</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="price">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 col-form-label text-right">成本</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="cost">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-3 col-form-label text-right">服务费</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="serviceCharge">
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
      promise: '', // 保存promise对象

      price: 0,
      cost: 0,
      serviceCharge: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ price: this.price, cost: this.cost, serviceCharge: this.serviceCharge })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (price, cost, serviceCharge) {
      $(this.$el).modal()

      this.price = price
      this.cost = cost
      this.serviceCharge = serviceCharge

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise // 返回promise对象,给父级组件调用
    }
  }
}
</script>
