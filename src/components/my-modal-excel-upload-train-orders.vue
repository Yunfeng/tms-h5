<template>
  <div class="modal" id="modalUploadExcel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel">
                    <slot>上传Excel文件并导入数据</slot>
                  </h4>
                  <button type="button" class="close" data-dismiss="modal">
                      <span aria-hidden="true">&times;</span>
                      <span class="sr-only">Close</span>
                  </button>
              </div>
              <div class="modal-body">
                  <form id = "uploadFileForm" method="post" enctype="multipart/form-data">                      
                      <div class="row mb-2">
                          <label>选择需要上传的文件</label>
                          <input type="file" class="form-control-file" name="upfile" id="inputFileName">
                          <span class="text-muted small">
                            文件名请不要有中文或全角字符，请使用字母或数字命名文件名。
                            <br />
                            <span class="text-danger">{{errmsg}}</span>
                          </span>
                      </div> 

                      <div class="form-group row mb-2">
                        <label class="control-label col-3 text-right">供应商</label>
                        <div class="col-9">
                          <my-select-supplier :supplierId.sync="supplierId" name="supplierId"></my-select-supplier>
                        </div>
                      </div>
                      <div class="form-group row mb-2">
                        <label class="control-label col-3 text-right">支付方式</label>
                        <div class="col-9">
                          <my-select-payment :paymentId.sync="paymentId" name="paymentMethodId"></my-select-payment>
                        </div>
                      </div>

                  </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary btn-lg ml-2" @click.stop="ok()">
                      开始上传  
                  </button>
              </div>
          </div>
      </div>
  </div>    
</template>


<script>
import $ from 'jquery'
import { getFlightOrderSmsContent, getFlightOrderApprovalSmsContent } from '../api/sms.js'
import MySelectSupplier from '../components/my-select-supplier.vue'
import MySelectPayment from '../components/my-select-payment.vue'


export default {
  props: {
    nullable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    MySelectSupplier,
    MySelectPayment
  },  
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      errmsg: '',
      supplierId: 0,
      paymentId: 0
    }
  },
  methods: {
    ok: function () {
      const filename = $('#inputFileName').val()

      if (filename.length === 0) {
        this.errmsg = "请选择需要上传的文件"
        return
      }

      $(this.$el).modal('hide')

      const formData = new window.FormData($('#uploadFileForm')[0])

      console.log(formData)
      
      this.resolve({
        'data': formData,
        'supplierId': this.supplierId,
        'paymentMethodId': this.paymentId
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function () {
      this.errmsg = ''
      $('#inputFileName').val('')
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
