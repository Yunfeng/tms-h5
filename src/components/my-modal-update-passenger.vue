<template>
  <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              修改乘客信息
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class=" row">
                <label class="control-label col-md-4 text-right">
                    姓名    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="psgInfo.name" />
                </div>
            </div>
            <div class=" row">
                <label class="control-label col-md-4 text-right">
                    证件号    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="psgInfo.idNo" />
                </div>
            </div>
            <div class=" row">
                <label class="control-label col-md-4 text-right">
                    常旅客号    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="psgInfo.ffpNo" />
                </div>
            </div>
            <div class=" row">
                <label class="control-label col-md-4 text-right">
                    手机    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="psgInfo.mobile" />
                </div>
            </div>
            <div class=" row">
                <label class="control-label col-md-4 text-right">
                    备注   
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="psgInfo.remark" />
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
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '', // 保存promise对象

      psgInfo: {
        'id': '',
        'name': '',
        'idNo': '',
        'ffpNo': '',
        'mobile': '',
        'remark': ''
      }
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve(this.psgInfo)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (passenger) {
      $(this.$el).modal()

      this.psgInfo.id = passenger.id
      this.psgInfo.name = passenger.name
      this.psgInfo.idNo = passenger.idNo
      this.psgInfo.ffpNo = passenger.ffpNo
      this.psgInfo.mobile = passenger.mobile
      this.psgInfo.remark = passenger.remark

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise // 返回promise对象,给父级组件调用
    }
  }
}
</script>
