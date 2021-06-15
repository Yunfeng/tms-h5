<template>
  <div class="modal" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">
              <slot name="title">
                修改日期
              </slot>
            </h6>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form role="form" class="form-horizontal">
            <div class=" row">
              <label class="col-3 col-form-label">客户</label>
              <div class="col-9">
                <my-select-customer :customerId.sync="customerId"></my-select-customer>
              </div>
            </div>

            <div class=" row">
              <label class="col-3 col-form-label">开始日期</label>
              <div class="col-9">
                <my-date-picker id="dateRangeBegin" v-model.trim="beginDate"></my-date-picker>
              </div>
            </div>
            <div class=" row">
              <label class="col-3 col-form-label">截止日期</label>
              <div class="col-9">
                <my-date-picker id="dateRangeEnd" v-model.trim="endDate"></my-date-picker>
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
import MyDatePicker from '../components/my-datepicker.vue'
import MySelectCustomer from '../components/my-select-customer.vue'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  components: {
    MyDatePicker,
    MySelectCustomer
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      beginDate: '',
      endDate: '',
      customerId: -1
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        'beginDate': this.beginDate,
        'endDate': this.endDate,
        'customerId': this.customerId
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (val) {
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
