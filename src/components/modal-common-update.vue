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
            <div class=" row">
              <label class="col-3 col-form-label text-right">
              	<slot name="label1">字段1</slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model="field1">
              </div>
            </div>
            <div class=" row" v-if="itemCount > 1">
              <label class="col-3 col-form-label text-right">
              	<slot name="label2">字段2</slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model="field2">
              </div>
            </div>
            <div class=" row" v-if="itemCount > 2">
              <label class="col-3 col-form-label text-right">
              	<slot name="label3">字段3</slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model="field3">
              </div>
            </div>
            <div class=" row"  v-if="itemCount > 3">
              <label class="col-3 col-form-label text-right">
              	<slot name="label4">字段4</slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model="field4">
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

      field1: '',
      field2: '',
      field3: '',
      field4: '',

      itemCount: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({
      	'field1': this.field1,
      	'field2': this.field2,
      	'field3': this.field3,
      	'field4': this.field4
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (val1, val2, val3, val4) {
      $(this.$el).modal()

      this.field1 = val1
      this.field2 = val2      
      this.field3 = val3
      this.field4 = val4

      this.itemCount = 0;
      if (val1 !== undefined) this.itemCount++
  	  if (val2 !== undefined) this.itemCount++
      if (val3 !== undefined) this.itemCount++
      if (val4 !== undefined) this.itemCount++

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise // 返回promise对象,给父级组件调用
    }
  }
}
</script>
