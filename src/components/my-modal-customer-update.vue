<template>
  <div class="modal" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              更改客户
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row mb-0 mt-1">
              <label class="col-3 control-label text-right">客户</label>
              <div class="col-9" v-if="canShowSelect2 === 1">
                <my-select-customer :customerId.sync="customerId" :minId="0"></my-select-customer>
              </div>
            </div>
            <div class="form-group row mb-0 mt-1" v-if="costCenters.length > 0">
              <label class="col-3 control-label text-right">成本中心</label>
              <div class="col-9">
                <select class="form-control" v-model="costCenter">
                  <option value="">请选择</option>
                  <option :value="info.name" v-for="info in costCenters">{{info.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group row mb-0 mt-1" v-if="projectNames.length > 0">
              <label class="col-3 control-label text-right">项目名称</label>
              <div class="col-9">
                <select class="form-control" v-model="projectName">
                  <option value="">请选择</option>
                  <option :value="info.name" v-for="info in projectNames">{{info.name}}</option>
                </select>
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
import MySelectCustomer from '../components/my-select2-customer.vue'
import { searchNotesByCustomer } from '../api/customer.js'

export default {
  components: {
    MySelectCustomer
  },
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

      customerId: 0,
      costCenter: '',
      projectName: '',
      costCenters: [],
      projectNames: [],

      canShowSelect2: 0
    }
  },
  watch: {
    customerId: function (newVal) {
      this.getCostCenters()
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ 'customerId': this.customerId,
        'costCenter': this.costCenter,
        'projectName': this.projectName })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (customerId) {
      const self = this
      $(this.$el).on("shown.bs.modal", function(){
        // 需要等bootstrap的对话框显示完成了，再渲染select2封装的控件
        // console.log("shown.bs.modal")
        self.canShowSelect2 = 1
      })


      $(this.$el).modal()

      this.customerId = customerId

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    getCostCenters: function () {
      this.costCenter = ''
      this.projectName = ''
      this.costCenters.splice(0)
      this.projectNames.splice(0)
      if (this.customerId < 1) return

      searchNotesByCustomer(this.customerId, (jsonResult) => {
        for (const info of jsonResult) {
          if (info.noteType === 100) {
            this.costCenters.push(info)
          } else if (info.noteType === 200) {
            this.projectNames.push(info)
          }
        }
      })
    }
  }
}
</script>
