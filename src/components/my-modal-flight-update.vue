<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="title">
              航班信息修改
            </slot>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class=" row mb-1">
              <label class="control-label col-3 text-right">
                  出发机场    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="info.dport" />
              </div>
            </div>
            <div class=" row mb-1">
              <label class="control-label col-3 text-right">
                  出发航站楼    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="info.dterm" />
              </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    到达机场    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="info.aport" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    到达航站楼    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="info.aterm" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    航班号   
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="info.flightNo" />
                </div>
            </div>
            <div class=" row mb-1">
                <label class="control-label col-3 text-right">
                    舱位    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="info.subClass" />
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    出发日期   
                </label>
                <div class="col-9">
                  <my-date-picker id="ddate" v-model="info.ddate" sizing="sm"></my-date-picker>
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    出发时间    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="info.dtime" />
                </div>
            </div>
            <div class=" row  mb-1">
                <label class="control-label col-3 text-right">
                    到达时间    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="info.atime" />
                </div>
            </div>            
          </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click.stop="cancel()">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="ok(info)">确定</button>
        </div>
      </div>
    </div>                    
  </div>
</template>

<script>
import $ from 'jquery'
import MyDatePicker from '../components/my-datepicker.vue'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    }
  },
  components: {
    MyDatePicker
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      info: {
        id: 0,
        dport: '',
        aport: '',
        ddate: '',
        flightNo: '',
        subClass: '',
        dterm: '',
        aterm: '',
        dtime: '',
        atime: ''
      }
    }
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve({
        'orderId': 0,
        'flightId': this.info.id,
        'dport': this.info.dport,
        'aport': this.info.aport,
        'ddate': this.info.ddate,
        'flightNo': this.info.flightNo,
        'subClass': this.info.subClass,
        'dterm': this.info.dterm,
        'aterm': this.info.aterm,
        'dtime': this.info.dtime,
        'atime': this.info.atime
      })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (id, info) {
      this.info = Object.assign({id}, info)
      // console.log(this.info)

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
