<template>
  <div class="modal" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title">
              更改预订人
            </slot>
          </h6>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body">
          <form id="frmUser" role="form" class="form-horizontal">
            <div class="form-group row">
                <label class="control-label col-3 text-right">
                  <slot name="title2">
                    预订人    
                  </slot>
                </label>
                <div class="col-9">
                    <select class="form-control" v-model.trim="username">
                      <template v-for="info in users">
                        <option :value="info.username">{{info.username}}</option>
                      </template>
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
import { searchUsers } from '../api/user.js'
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

      users: [],
      username: ''
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')

      this.resolve({ 'op1': this.username })
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (username) {
      $(this.$el).modal()

      this.username = username
      this.searchUsers()

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    searchUsers: function () {
      if (this.users.length > 0) return
      searchUsers((jsonResult) => {
        this.users = jsonResult.dataList
      })
    }
  }
}
</script>
