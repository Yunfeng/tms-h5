<template>
  <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              填写票号
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <table class="table table-striped table-hover table-sm">
            <thead>
              <tr>
                <th>姓名</th>
                <th>票号</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(info, index) in passengers">   
                  <td>
                      {{info.name}}
                  </td>                             
                  <td>
                    <input type="text" class="form-control" placeholder="票号" v-model="info.ticketNo" />
                  </td>
              </tr>   
            </tbody>
          </table>
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

      passengers: []
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve(this.passengers)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (passengers) {
      $(this.$el).modal()
      
      this.passengers = passengers

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
