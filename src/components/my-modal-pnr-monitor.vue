<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              编码监控
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body py-0">
          <div class="card py-0">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <label class="col-3 col-form-label text-right">
                <slot name="priceTitle">
                  编码
                </slot>
              </label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.number="pnr">
              </div>
            </div>
            <div class=" row">
              <label class="col-3 col-form-label text-right">
                <slot name="remarkTitle">
                  监控类型
                </slot>
              </label>
              <div class="col-9">
                <select class="form-control" v-model.number="monitorType">
                  <option value="1">NO/HX提醒</option>
                  <option value="2">追位</option>
                </select>
              </div>
            </div>
          </form>

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

      pnr: '',
      monitorType: 1
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        pnr: this.pnr,
        monitorType: this.monitorType
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function () {
      this.pnr = ''
      this.monitorType = 1
      
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
