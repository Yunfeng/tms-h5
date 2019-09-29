<template>
  <div class="modal" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              政策底价
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <input type="hidden" id="frmPolicyManage_id" class="form-control" name="id" />

            <div class="form-group row">
                <label class="col-3 col-form-label text-right">
                    航空公司*    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.trim="carrier" placeholder="航空公司两字代码，只支持一个，必填"/>
                </div>
            </div>
  
            <div class="form-group row">
                <label class="col-3 col-form-label text-right">
                    舱位*    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model.trim="subclass" placeholder="舱位，只支持一个，必填"/>
                </div>
            </div>

            <div class="form-group row">
                <label class="col-3 col-form-label text-right">
                    行程类型    
                </label>
                <div class="col-9">
                    <select class="form-control" v-model="tripType">
                        <option value="1">单程</option>
                        <option value="2">往返</option>
                    </select>
                </div>
            </div>

                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            出发机场    
                        </label>
                        <div class="col-9">
                            <input type="text" class="form-control" v-model.trim="dport" placeholder="机场三字代码，只支持一个，可不填"/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            到达机场    
                        </label>
                        <div class="col-9">
                            <input type="text" v-model.trim="aport" class="form-control" placeholder="机场三字代码，只支持一个，可不填"/>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            最大扣率    
                        </label>
                        <div class="col-9">
                            <input type="text" v-model.number="maxReturnPoint" class="form-control"  />
                            <span class="help-block">普通政策填写最大扣率</span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            最低价格    
                        </label>
                        <div class="col-9">
                            <input type="text" v-model.number="lowLimitPrice" class="form-control"  />
                            <span class="text-muted small">特殊政策填写最低价格</span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            距今天数    
                        </label>
                        <div class="col-9">
                            <input type="text" v-model.number="offsetDay" class="form-control"  />
                            <span class="text-muted small">-1:不限, 0:今天, 1: 明天, 2: 后天, 以此类推</span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-3 col-form-label text-right">
                            航班号   
                        </label>
                        <div class="col-9">
                            <input type="text" v-model.trim="flightNo" class="form-control" />
                            <span class="text-muted small">航班号，不需航空公司二字代码</span>
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

      id: 0,
      dport: '',
      aport: '',
      carrier: '',
      flightNo: '',
      subclass: '',
      offsetDay: -1,
      lowLimitPrice: 0,
      maxReturnPoint: 0,
      tripType: 0
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      const params = {
        id: this.id,
        dport: this.dport,
        aport: this.aport,
        carrier: this.carrier,
        flightNo: this.flightNo,
        subclass: this.subclass,
        offsetDay: this.offsetDay,
        lowLimitPrice: this.lowLimitPrice,
        maxReturnPoint: this.maxReturnPoint,
        tripType: this.tripType
      }

      this.resolve(params)
    },
    cancel: function () {
      $(this.$el).modal('hide')

      this.reject(null)
    },
    modal: function (v) {
      $(this.$el).modal()

      this.reset()
      if (v !== undefined && v !== null) {
        this.dport = v.departurePort
        this.aport = v.arrivalPort
        this.carrier = v.carrier
        this.flightNo = v.flightNo
        this.subclass = v.subclass
        this.offsetDay = v.offsetDay
        this.lowLimitPrice = v.lowLimitPrice
        this.maxReturnPoint = v.maxReturnPoint
        this.tripType = v.tripType
      }

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    reset: function () {
      this.id = 0
      this.dport = ''
      this.aport = ''
      this.carrier = ''
      this.flightNo = ''
      this.subclass = ''
      this.offsetDay = -1
      this.lowLimitPrice = 0
      this.maxReturnPoint = 0
      this.tripType = 0
    }
  }
}
</script>
