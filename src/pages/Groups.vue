<template>
  <div id="groups">
      <div class="card">
        <div class="card-header bg-info text-white">
          组管理
        </div>
        <div class="card-body">
            <form class="form-inline">
                <input type="hidden" v-model.number="sc.pageNo">
                <input type="hidden" v-model.number="sc.pageSize">
                <div class="row mb-2">
                    <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
                </div>

                 

                <span class="ml-auto">
                    <a href="javascript:void(0)" @click.stop="newGroup();" class="btn btn-success btn-lg">新建</a> 
                </span> 
            </form>
        </div>
        <table class="table table-striped table-sm small">
            <thead>
                <tr>
                    <th>组名</th>
                    <th>角色</th>
                    <th>用户</th>
                    <th>创建日期</th>
                    <th></th>
                </tr>                        
            </thead>
            <tbody>
                <tr v-for="(info, index) in dataList">
                    <td>{{info.groupName}}</td>
                    <td>
                      <template v-if="info.authorities.length > 0">
                        <span v-for="role in info.authorities">{{role.role}} </span>
                      </template>
                      <template v-else>
                        无
                      </template>
                      <a href="javascript:void(0)" class="small" @click.stop="editRole(index)">编辑</a>
                    </td>
                    <td>
                      <template v-if="info.users.length > 0">
                        <span v-for="user in info.users">
                          <template v-if="user.userInfo !== null">
                            {{user.userInfo.empname}}  
                          </template>
                          <template v-else>, null</template>                          
                        </span>
                      </template>
                      <template v-else>
                        无
                      </template>
                      <a href="javascript:void(0)" class="small" @click.stop="editUser(index)">编辑</a>
                    </td>
                    <td>{{info.createTime}}</td>
                </tr>

            </tbody>
        </table>
        <nav id="pagination-box" class="float-right">
          <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
        </nav>
      </div>

      <!-- New Request Modal -->
      <div class="modal" id="modalNew" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">新建组</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                      <form id="frmUser" role="form" class="form-horizontal">
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  组名    
                              </label>
                              <div class="col-md-6">
                                  <input type="text" class="form-control" v-model.trim="groupName" />
                                  <span class="help-block">不能重复</span>
                              </div>
                          </div>                          
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-success" @click.stop="saveGroup()">保存</button>
                  </div>
              </div>
          </div>
      </div>
      <div class="modal" id="modalRole" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">角色 - <small>{{groupName}}</small></h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                      <form id="frmUser" role="form" class="form-horizontal">
                          <div class="form-group row">
                              <label class="control-label col-4 text-right">
                                  角色   
                              </label>
                              <div class="col-6">
                                <select class="form-control" v-model="roleSelected" size="8" multiple>
                                  <template v-for="role in roles" >
                                      <option :value="role.role">{{role.roleName}}</option>  
                                    </template>
                                </select>
                              </div>
                          </div>                           
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-success" @click.stop="saveRole()">保存</button>
                  </div>
              </div>
          </div>
      </div>
      <div class="modal" id="modalUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">组-{{groupName}}</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                      <form>                          
                          <div class="row mb-2">
                            <label for="exampleFormControlSelect1">包含以下成员：</label>
                            <select class="form-control" v-model.number="userId0">
                              <option v-for="info in groupUsers" :value="info.id">{{info.name}}</option>       
                            </select>
                            <button type="button" class="btn btn-danger mt-1" @click.stop="delUserFromGroup()">从组删除</button>
                          </div>                        
                          <div class="row mb-2">
                            <label>不包含以下成员:</label>
                            <select class="form-control" v-model.number="userId">
                              <option value="0">选择</option>
                              <template v-for="info in users" >
                                <option :value="info.id">{{info.username}} - {{info.empname}}</option>  
                              </template>
                              
                            </select>
                            <button type="button" class="btn btn-success mt-1" @click.stop="addUserToGroup()">添加到组</button>
                          </div>                        
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                  </div>
              </div>
          </div>
      </div>
         
  </div>	
</template>

<script>
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'
  import { searchGroups, saveGroup, saveRole, addUserToGroup, delUserFromGroup, searchRoles } from '../api/groups.js'
  import { searchUsers2 } from '../api/user.js'

  export default {
    components: {
      MyPagination
    },
    data () {
      return {
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 15,
          pageTotal: 0
        },

        dataList: [],
        groupName: '',
        roleSelected: [],
        id: 0,

        users: [],
        groupUsers: [],
        roles: [],
        userId: 0,
        userId0: 0
      }
    },
    mounted: function () {
      this.search()
      this.searchRoles()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        }

        searchGroups(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
        })
      },
      newGroup: function () {
        this.groupName = ''
        this.id = 0
        this.roleSelected.splice(0)

        $('#modalNew').modal()
      },
      saveGroup: function () {
        const params = {
          'id': this.id,
          'groupName': this.groupName
        }

        saveGroup(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('保存成功')
            $('#modalNew').modal('hide')
            this.search()
          } else {
            this.showErrMsg('保存失败：' + jsonResult.errMsg)
          }
        })
      },
      editRole: function (idx) {
        const info = this.dataList[idx]
        this.id = info.id
        this.groupName = info.groupName
        this.roleSelected.splice(0)

        for (let i = 0; i < info.authorities.length; i++) {
          this.roleSelected.push(info.authorities[i].role)
        }

        $('#modalRole').modal()
      },
      saveRole: function () {
        let roleName = ''
        console.log(this.roleSelected)
        for (let i = 0; i < this.roleSelected.length; i++) {
          roleName += this.roleSelected[i] + ','
        }

        const params = {
          'id': this.id,
          'roleName': roleName
        }

        saveRole(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('保存成功')
            $('#modalRole').modal('hide')
            this.search()
          } else {
            this.showErrMsg('保存失败：' + jsonResult.errmsg)
          }
        })
      },
      editUser: function (idx) {
        const info = this.dataList[idx]

        this.id = info.id
        this.groupName = info.groupName

        this.groupUsers.splice(0)
        for (let i = 0; i < info.users.length; i++) {
          if (info.users[i].userInfo === null) {
            continue
          } else {
            console.log(info.users[i])
          }
          this.groupUsers.push({
            'id': info.users[i].userInfo.id,
            'username': info.users[i].userInfo.username,
            'name': info.users[i].userInfo.empname
          })
        }

        $('#modalUser').modal()
        if (this.users.length === 0) {
          this.searchUsers()
        }
      },
      searchUsers: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 1000
        }
        searchUsers2(params, (jsonResult) => {
          this.users = jsonResult.dataList
        })
      },
      addUserToGroup: function () {
        const params = {
          'userId': this.userId,
          'groupId': this.id
        }

        addUserToGroup(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('保存成功')
            $('#modalUser').modal('hide')

            this.search()
          } else {
            this.showErrMsg('保存失败：' + jsonResult.errmsg)
          }
        })
      },
      delUserFromGroup: function () {
        const params = {
          'userId': this.userId0,
          'groupId': this.id
        }

        delUserFromGroup(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('删除成功')
            $('#modalUser').modal('hide')

            this.search()
          } else {
            this.showErrMsg('删除失败：' + jsonResult.errmsg)
          }
        })
      },
      searchRoles: function () {
        searchRoles((jsonResult) => {
          this.roles = jsonResult
        })
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