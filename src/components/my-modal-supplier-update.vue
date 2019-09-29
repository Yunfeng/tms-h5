<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              更改供应商
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row">
                <label class="control-label col-3 text-right">
                    供应商
                </label>
                <div class="col-9" v-if="canShowSelect2 == 1">
                    <my-select-supplier :supplierId.sync="supplierId" :supplierType="supplierType"></my-select-supplier>
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

export default {
  components: {
    MySelectSupplier
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '', // 保存promise对象

      supplierId: 0,
      supplierType: -1,

      canShowSelect2: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ supplierId: this.supplierId })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (supplierId, supplierType) {
      const self = this
      console.log(supplierId + ", " + supplierType)
      $(this.$el).on("shown.bs.modal", function(){
        // 需要等bootstrap的对话框显示完成了，再渲染select2封装的控件
        // console.log("shown.bs.modal")
        self.canShowSelect2 = 1

        self.supplierId = supplierId
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
