<template>
  <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">
              {{title}}
            </h4>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <div class="col-12">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="0" v-model.number="denyCode">
                  <label class="form-check-label">同意</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="100" v-model.number="denyCode">
                  <label class="form-check-label">拒绝</label>
                </div>
              </div>
            </div>


            <div class=" row">
              <div class="col-12">
                <input type="text" class="form-control" v-model.trim="denyReason" placeholder="如果拒绝，请输入拒绝的原因，不少于3个字" />
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

      title: '',
      denyCode: 100,
      denyReason: '',
    }
  },
  methods: {
    ok: function () {
      if (!this.nullable && this.remark.trim().length < 1) {
        return
      }

      $(this.$el).modal('hide')
      this.resolve({
        'denyCode': this.denyCode,
        'denyReason': this.denyReason
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (val) {
      this.title = val

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
