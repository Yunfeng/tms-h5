<template>
  <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">
              <slot name="title">
                修改备注
              </slot>
            </h6>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class="form-group row">
              <label class="col-3 col-form-label">短信格式</label>
              <div class="col-9">
                <select class="custom-select" v-model.number="smsFormat">
                  <option value="0">格式1</option>
                  <template v-if="username !== 'demo'">
                    <option value="1">格式2</option>
                    <option value="2">格式3</option>
                    <option value="3">格式4</option>
                    <option value="4">格式5</option>
                  </template>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-12">
                <label class="small">
                  短信内容：
                  <span class="text-info" v-if="loading">(获取中......)</span>
                </label>
                <textarea class="form-control" rows="5" v-model="smsContent"></textarea>
              </div>
            </div>
            <div class="form-group form-check row mb-1">
                <div class="col-12">
                  <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="useMySmsContent">
                    使用我的短信内容
                  </label>
                </div>
            </div>            
            <div class="form-group row">
              <div class="col-12">
                <input type="text" class="form-control" v-model.trim="mobile" placeholder="请在此输入接受信息的手机号" />
                <span class="small text-muted">请输入手机号（留空则使用订单中对应乘机人的手机号）</span>
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
import { getOrderSmsContent, getFlightOrderSmsContent, getFlightOrderApprovalSmsContent } from '../api/sms.js'
import { ORDER_FLIGHT, ORDER_TRAIN } from '../common/const.js'

export default {
  props: {
    orderType: {
      type: String,
      default: ORDER_FLIGHT
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      orderId: 0,
      psgId: 0,
      mobile: '',
      smsContent: '',
      smsFormat: 0,
      smsType: 0,
      useMySmsContent: false,

      loading: false
    }
  },
  computed: {
    username () { return this.$store.state.username }
  },
  watch: {
    smsFormat: function (newVal) {
      this.searchSmsContent()
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      if (this.useMySmsContent === false) {
        this.smsContent = ''
      }

      this.resolve({
        mobile: this.mobile,
        smsContent: this.smsContent,
        smsFormat: this.smsFormat
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (smsType, orderId, psgId) {
      this.smsType = smsType
      this.smsFormat = 0
      this.orderId = orderId
      this.psgId = psgId
      this.useMySmsContent = false

      this.searchSmsContent()

      $(this.$el).modal()

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    searchSmsContent: function () {
      if (this.smsType === 2) {
        this.loading = true
        const params = {
          'orderType': this.orderType,
          'orderId': this.orderId,
          'psgId': this.psgId, 'smsFormat': this.smsFormat
        }
        getOrderSmsContent(params, v => {
          if (v.status === 'OK') {
            this.smsContent = v.desc
          } else {
            this.smsContent = v.errmsg
          }
        }, () => {
          this.loading = false
        })
      } else if (this.smsType === 0) {
        // 预定成功后发送的短信
        getFlightOrderApprovalSmsContent(this.orderId, v => {
          if (v.status === 'OK') {
            this.smsContent = v.desc
          }
        })
      }
    }
  }
}
</script>
