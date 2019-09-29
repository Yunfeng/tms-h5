<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
              改签完成
          </h6>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <div class="card">
            <div class="card-body">
              <form>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      新编码    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control form-control-sm" v-model.trim="pnrNo" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                      新票号    
                  </label>
                  <div class="col-9">
                      <input type="text" class="form-control form-control-sm" v-model.trim="ticketNo" />
                  </div>
              </div>
              <div class="form-group row mb-1">
                  <label class="col-form-label col-3 text-right">
                  </label>
                  <div class="col-9">
                    <label class="form-check-label">
                      <input type="checkbox" class="form-check-input" v-model="confirmed">
                      确定
                    </label>
                    <span class="text-muted small">填写准确或不填，勾选后再确定</span>
                  </div>
              </div>
              </form>
            </div> 
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

      ticketNo: '',
      pnrNo: '',
      confirmed: false
    }
  },
  methods: {
    ok: function () {
      if (this.confirmed === false) return

      $(this.$el).modal('hide')
      this.resolve({
        ticketNo: this.ticketNo,
        pnrNo: this.pnrNo
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function () {
      this.ticketNo = ''
      this.pnrNo = ''
      this.confirmed = false

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
