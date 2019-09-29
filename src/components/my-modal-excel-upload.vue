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
                      <div class="form-group">
                          <label class="control-label">
                              Excel格式    
                          </label>
                          <div>
                              <select class="form-control" name="formatNo">
                                <option value="1"><slot name="excelFormatDesc">test</slot></option>
                              </select>
                          </div>
                          <span class="text-muted small">
                            
                          </span>
                      </div>
                      <div class="form-group">
                          <label>选择需要上传的文件</label>
                          <input type="file" class="form-control-file" name="upfile" id="inputFileName">
                          <span class="text-muted small">
                            文件名请不要有中文或全角字符，请使用字母或数字命名文件名。
                            <br />
                            <span class="text-danger">{{errmsg}}</span>
                          </span>
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

      errmsg: ''
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

      // console.log(formData)
      
      this.resolve({
        'data': formData
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
