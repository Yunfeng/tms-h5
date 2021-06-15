<template>
  <div id="users">
    <div class="card">
      <div class="card-body">
        <form class="">
          <div class="row mb-2">
            <input type="textfield" class="form-control" placeholder="用户名" v-model.trim="username" size="10">
          </div>
          <div class=" ml-1">
            <input type="textfield" class="form-control" placeholder="手机" v-model.trim="mobile" size="10">
          </div>
          <div class=" ml-1">
            <input type="textfield" class="form-control" placeholder="eterm用户名" v-model.trim="etermUsername" size="10">
          </div>
          <div class=" ml-1">
              <select class="form-control" v-model.number="sc.pageSize">
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
              </select>
          </div>          
          <div class="row mb-2">
            <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
            <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
          </div>

          <span class="ms-auto">
            <button type="button" v-on:click="newUser();" class="btn btn-success btn-lg" id="btnNewUser">新建</button> 
          </span> 
        </form>
      </div>
      <table class="table table-striped table-hover table-sm small">
          <thead>
              <tr>
                  <th>用户名</th>
                  <th>全名</th>
                  <th>手机</th>
                  <th>邮件</th>
                  <th>部门</th>
                  <th>企业微信id</th>
                  <th>eterm用户名</th>
                  <th>状态</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(user, index) in userList" :key="user.username" :class="{'table-dark text-white': user.status === 4}">
                  <td>{{user.username}}</td>
                  <td>{{user.empname}}</td>
                  <td>{{user.mobileNo}}</td>
                  <td>{{user.email}}</td>
                  <td>
                    <template v-for="info in user.departments">
                      {{info.name}},
                    </template>
                  </td>
                  <td>
                    {{user.wwUserId}}
                    <span v-if="user.wwUserId.length > 0">  
                      <img :src="user.avatar" width="25" height="25" />                    
                      <a href="javascript:void(0)" v-on:click="delWwUser(index);" class="text-danger">删除</a>
                      <a href="javascript:void(0)" v-on:click="syncWwUser(index);">同步</a>
                    </span>
                  </td>
                  <td>
                    <template v-if="user.etermUsername !== null">
                      <template v-if="user.etermUsername.length > 10">
                        <span :title="user.etermUsername">{{user.etermUsername.substring(0, 10)}}...</span>
                      </template>
                      <template v-else>
                        {{user.etermUsername}}
                      </template>
                    </template>
                  </td>
                  <td>
                    <span v-if="user.status === 1">正常</span>
                    <span v-if="user.status === 4">停用</span>
                  </td>
                  <td>
                    <a href="javascript:void(0)" @click.stop="editUser(index)" class="">修改</a>
                    <a href="javascript:void(0)" @click.stop="resetPassword(index)" class="ml-2 text-danger" v-if="isAdmin">重置密码</a>
                  </td>
              </tr>

          </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <!-- New Request Modal -->
    <div class="modal" id="modalPolicyManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">新增用户</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                    <form id="frmUser" role="form" class="form-horizontal">
                        <input type="hidden" id="frmUser_id" name="user.id" v-model="user.id" />
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                用户名*    
                            </label>
                            <div class="col-8">
                                <input type="text" id="frmUser_username" class="form-control" name="user.username" placeholder="用户名" v-model="user.username" />
                                <span class="help-block">登录系统用的用户名</span>
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                真实姓名*    
                            </label>
                            <div class="col-8">
                                <input type="text" id="frmUser_fullname" class="form-control" name="user.empname" placeholder="真实姓名" v-model="user.empname" />
                                <span class="help-block"></span>
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                手机    
                            </label>
                            <div class="col-8">
                                <input type="text" id="frmUser_mobile" class="form-control" name="user.mobileNo" v-model="user.mobileNo" placeholder="手机号" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                电子邮件    
                            </label>
                            <div class="col-8">
                                <input type="text" id="frmUser_email" class="form-control" name="user.email" v-model="user.email" placeholder="电子邮件" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                eterm用户名    
                            </label>
                            <div class="col-8">
                                <input type="text" id="frmUser_email" class="form-control" name="user.etermUsername" v-model="user.etermUsername" placeholder="eterm用户名" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                部门    
                            </label>
                            <div class="col-8">
                              <select class="form-control" v-model="deptIds"  size="3" multiple>
                                <template v-for="info in departments">
                                    <option :value="info.id" v-if="info.parentId > 0" :key="info.id">{{info.name}}</option>  
                                  </template>
                              </select>
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                职位    
                            </label>
                            <div class="col-8">
                                <input type="text" class="form-control" v-model="user.position" placeholder="职务" />
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                状态    
                            </label>
                            <div class="col-8">
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="4" v-model.number="user.status">
                                  <label class="form-check-label text-danger">停用</label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="1" v-model.number="user.status">
                                  <label class="form-check-label">正常</label>
                                </div>
                            </div>
                        </div>
                        <div class=" row">
                            <label class="control-label col-3 text-right">
                                与企业微信同步
                            </label>
                            <div class="col-8">
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="0" v-model.number="syncWxWork">
                                  <label class="form-check-label text-danger">暂不</label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="1" v-model.number="syncWxWork">
                                  <label class="form-check-label">是</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="createUser()">保存</button>
                </div>
            </div>
        </div>
    </div>
         
    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>


  </div>	
</template>

<script>
  import $ from 'jquery'
  import { mapActions } from 'vuex'
  import { searchUsers, createUser, searchDepartments, deleteWwUser, syncWwUser, resetUserPassword } from '../api/admin.js'
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
          pageSize: 25,
          pageTotal: 0
        },
        username: '',
        mobile: '',
        etermUsername: '',

        userList: [],
        user: {
          'id': 0,
          'username': '',
          'empname': '',
          'mobileNo': '',
          'email': '',
          'etermUsername': '',
          'position': '',
          'status': 0
        },
        deptIds: [],
        departments: [],
        syncWxWork: 1
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      // console.log('mounted')
      this.search()
      this.searchDepartments()
    },
    methods: {
      ...mapActions([
        'showLoading',
        'hideLoading'
      ]),
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {   
        this.showLoading()

        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.username': this.username,
          'sc.mobile': this.mobile,
          'sc.etermUsername': this.etermUsername
        }

        searchUsers(params, v => {
            this.userList = v.dataList
            this.sc = v.page
          }, () => this.hideLoading()
        )
      },
      newUser: function () {
        this.user.id = 0
        this.user.username = ''
        this.user.empname = ''
        this.user.mobileNo = ''
        this.user.email = ''
        this.user.etermUsername = ''
        this.user.position = ''
        this.user.status = 1

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
          'position': this.user.position,
          'etermUsername': this.user.etermUsername,
          'status': this.user.status,
          'departments': this.deptIds,
          'syncWxWork': this.syncWxWork
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
        this.user.status = info.status
        this.user.position = info.position

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
              this.showErrMsg(v.desc)
              this.search()
            }},
            () => { this.hideLoading() }
          )
        }).catch((ex) => {})
      },
      syncWwUser: function (index) {
        const info = this.userList[index]
        const params = {
          'id': info.id,
        }

        syncWwUser(params, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg(v.desc)
            this.search()
          }},
          () => { this.hideLoading() }
        )
      },
      resetPassword: function (index) {
        const info = this.userList[index]

        this.modalTitle = '重置用户(' + info.username + ')密码, 请输入新密码'

        this.$refs.modalPrompt.modal().then((remark) => {
          this.showLoading()

          const params = {
            'id': info.id,
            'password': remark
          }
          resetUserPassword(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              // this.search()
            }},
            () => { this.hideLoading() }
          )
        }).catch((ex) => {})
      },
      reset: function () {
        this.username = ''
        this.mobile = ''
        this.etermUsername = ''
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