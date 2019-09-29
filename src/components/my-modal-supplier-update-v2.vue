<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            <slot name="title">
              更改供应商
            </slot>
          </h4>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row">
                <label class="control-label col-3 text-right">
                    供应商
                </label>
                <div class="col-9" v-if="canShowSelect2 == 1">
                    <my-select-supplier :supplierId.sync="supplierId" :supplierType="supplierType" :paymentMethodId.sync="payMethodId"></my-select-supplier>
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-3 text-right">
                    支付方式    
                </label>
                <div class="col-9">
                  <my-select-payment :paymentId.sync="payMethodId"></my-select-payment>
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-3 text-right">
                    BSP自动开票
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="0" v-model.number="autoTicketing">
                    <label class="form-check-label text-danger">不</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="autoTicketing">
                    <label class="form-check-label">是</label>
                  </div>
                  <br/>
                  <span class="text-muted small">支持国内、单程、成人订单</span>
                </div>
            </div>
            <div class="form-group row" v-if="autoTicketing === 1">
                <label class="control-label col-3 text-right align-center">
                    开票价格
                </label>
                <div class="col-8">
                  <input type="text" class="form-control" v-model="price" />
                  <span class="text-muted small">为0时，使用订单中的成人票面价</span>
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
import MySelectSupplier from '../components/my-select2-supplier.vue'
import MySelectPayment from '../components/my-select-payment.vue'

export default {
  components: {
    MySelectSupplier,
    MySelectPayment
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '', // 保存promise对象

      supplierId: 0,
      supplierType: -1,
      payMethodId: 0,
      autoTicketing: 1,
      price: 0,

      canShowSelect2: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({
        supplierId: this.supplierId,
        paymentMethodId: this.payMethodId,
        autoTicketing: this.autoTicketing,
        price: this.price
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },    
    modal: function (supplierId, payMethodId, supplierType) {
      this.autoTicketing = 1
      
      const self = this
      // console.log(supplierId + ", " + payMethodId + ", " + supplierType)
      $(this.$el).on("shown.bs.modal", function(){
        // 需要等bootstrap的对话框显示完成了，再渲染select2封装的控件
        // console.log("shown.bs.modal")
        self.canShowSelect2 = 1

        self.supplierId = supplierId
        self.payMethodId = payMethodId
        // console.log(supplierType)
        if (supplierType !== undefined) {
          self.supplierType = supplierType
        }
      })

      $(this.$el).modal()

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise // 返回promise对象,给父级组件调用
    }
  }
}
</script>
