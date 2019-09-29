<template>
  <div id="users">
    <div class="card">
      <div class="card-body">
        <form class="form-inline">
          <div class="form-group">
            <input type="text" class="form-control mr-sm-2" size="11" placeholder="用户名" v-model.trim="username">
          </div>
          <div class="form-group">
            <input type="text" class="form-control mr-sm-2" size="11" placeholder="手机" v-model.trim="mobile">
          </div>
          <select class="form-control form-control mr-sm-2" v-model.number="userType">
            <option value="-1">所有会员</option>
            <option value="0">散客</option>
            <option value="1">企业</option>
          </select>

          <div class="form-group">
            <button type="button" class="btn btn-primary  mr-sm-2" @click.stop="search()">查找</button>
            <button type="button" class="btn btn-secondary btn-sm" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
      <table class="table table-striped table-hover table-sm small">
          <thead>
              <tr>
                  <th>用户名</th>
                  <th>全名</th>
                  <th>用户类型</th>
                  <th>手机</th>
                  <th>邮件</th>
                  <th>企业名称</th>
                  <th>企业微信id</th>
                  <th>openid</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(user, index) in userList" :key="user.username">
                  <td>{{user.username}}</td>
                  <td>{{user.empname}}</td>
                  <td>
                    <template v-if="user.userType === 0">散客</template>
                    <template v-else-if="user.userType === 1">企业</template>
                  </td>
                  <td>{{user.mobileNo}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.corpName}}</td>
                  <td>{{user.wwUserId}}</td>
                  <td>{{user.openId}}</td>
              </tr>

          </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchMembers, createUser, searchDepartments, deleteWwUser } from '../api/admin.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'

  export default {
    components: {
      MyPagination,
      MyModalPrompt
    },
    data () {
      return {
        modalTitle: '',
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        username: '',
        mobile: '',
        userType: -1,

        userList: [],
        user: {
          'id': 0,
          'username': '',
          'empname': '',
          'mobileNo': '',
          'email': '',
          'etermUsername': ''
        },
        deptIds: [],
        departments: []
      }
    },
    mounted: function () {
      this.search()
      this.searchDepartments()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.username': this.username,
          'sc.mobile': this.mobile,
          'sc.type': this.userType
        }
        searchMembers(params, (jsonResult) => {
          this.userList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      newUser: function () {
        this.user.id = 0
        this.user.username = ''
        this.user.empname = ''
        this.user.mobileNo = ''
        this.user.email = ''
        this.user.etermUsername = ''

        this.deptIds.splice(0)

        $('#modalPolicyManage').modal()
      },
      createUser: function () {
        const params = {
          'id': this.user.id,
          'username': this.user.username,
          'fullName': this.user.empname,
          'mobileNo': this.user.mobileNo,
          'email': this.user.email,
          'etermUsername': this.user.etermUsername,
          'departments': this.deptIds
        }

        createUser(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      editUser: function (index) {
        const info = this.userList[index]
        this.user.id = info.id
        this.user.username = info.username
        this.user.empname = info.empname
        this.user.mobileNo = info.mobileNo
        this.user.email = info.email
        this.user.etermUsername = info.etermUsername

        this.deptIds.splice(0)
        for (const d of info.departments) {
          this.deptIds.push(d.id)
        }

        $('#modalPolicyManage').modal()
      },
      searchDepartments: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 500
        }

        searchDepartments(params, (jsonResult) => {
          this.departments = jsonResult.dataList
        })
      },
      delWwUser: function (index) {
        const info = this.userList[index]

        this.modalTitle = '确定从企业微信中删除该用户吗？'

        this.$refs.modalPrompt.modal().then((remark) => {
          this.showLoading()
          const params = {
            'id': info.id,
            'remark': remark
          }
          deleteWwUser(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.search()
            }},
            () => { this.hideLoading() }
          )
        }).catch((ex) => {})
      },
      reset: function () {
        this.username = ''
        this.mobile = ''
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.search()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.search()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.search()
      }
    }
  }
</script>