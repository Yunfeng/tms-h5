<template>
  <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">
              <slot name="title">
                比价参数设置
              </slot>
            </h6>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <label class="col-3 col-form-label text-right">监控频率</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.trim="monitorInterval" placeholder="" />
                <span class="small text-muted">隔多久监控一次（单位：分钟）</span>
              </div>
            </div>
            <div class=" row">
              <label class="col-3 col-form-label text-right">底价</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.trim="bottomPrice" placeholder="" />
                <span class="small text-muted"></span>
              </div>
            </div>
            <div class=" row">
              <label class="col-3 col-form-label text-right">出发日期</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.trim="outboundDate" placeholder="" />
                <span class="small text-muted">日期格式：2019-04-17 多个日期用逗号隔开</span>
              </div>
            </div>
            <div class=" row" v-if="policyType ===2">
              <label class="col-3 col-form-label text-right">回程日期</label>
              <div class="col-9">
                <input type="text" class="form-control" v-model.trim="inboundDate" placeholder="" />
                <span class="small text-muted">日期格式：2019-04-17 多个日期用逗号隔开</span>
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
      promise: '',

      policyType: 0,
      monitorInterval: 0,
      bottomPrice: 0,
      outboundDate: '',
      inboundDate: ''
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({
      	policyType: this.policyType,
        monitorInterval: this.monitorInterval,
        bottomPrice: this.bottomPrice,
        outboundDate: this.outboundDate,
        inboundDate: this.inboundDate
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (policyType, info) {
      this.policyType = policyType
      this.monitorInterval = info.monitorInterval
      this.bottomPrice = info.bottomPrice
      this.outboundDate = info.monitorOutboundDate
      this.inboundDate = info.monitorInboundDate


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
