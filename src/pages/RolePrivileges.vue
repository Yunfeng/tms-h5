<template>
  <div id="role-privileges">
    <div class="card">
        <div class="card-body">
            <form class="form-inline" id="frmSearchUser">
                <select class="form-control" v-model="roleName">
                  <option value="">所有</option>
                  <template v-for="role in roles" >
                      <option :value="role.role">{{role.roleName}}/{{role.role}}</option>  
                    </template>
                </select>

                <div class="form-group">
                    <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
                </div>

                <span class="ml-auto">
                      <a href="javascript:void(0)" @click.stop="add();" class="btn btn-success btn-lg">增加</a> 
                  </span> 
            </form>
        </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th></th>
                <th>role</th>
                <th>res_type</th>
                <th>res_content</th>
                <th>res_remark</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{index + 1}}</td>
                <td>{{info.role}}</td>
                <td>{{info.resType}}</td>
                <td>{{info.resContent}}</td>
                <td>{{info.resRemark}}</td>
                <td>
                  <a href="javascript:void(0)" @click.stop="deleteRolePrivilege(info.id)">删除</a>
                </td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <div class="modal" id="modalNew" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">增加角色权限</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                      <form id="frmUser" role="form" class="form-horizontal">
                          <div class="form-group row">
                              <label class="control-label col-4 text-right">
                                  角色   
                              </label>
                              <div class="col-6">
                                <select class="form-control" v-model="role">
                                  <template v-for="role in roles" >
                                      <option :value="role.role">{{role.roleName}}</option>  
                                    </template>
                                </select>
                              </div>
                          </div>   
                          <div class="form-group row">
                              <label class="control-label col-4 text-right">
                                  权限   
                              </label>
                              <div class="col-6">
                                <select class="form-control" v-model="privilegeIds"  size="8" multiple>
                                  <template v-for="info in privileges" >
                                      <option :value="info.id">{{info.resRemark}}</option>  
                                    </template>
                                </select>
                              </div>
                          </div>                       
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-success" @click.stop="save()">保存</button>
                  </div>
              </div>
          </div>
      </div>
  </div>	
</template>

<script>
  import $ from 'jquery'
  import { addRolePrivilege, deleteRolePrivilege, searchRolePrivileges, searchRoles, searchPrivileges } from '../api/groups.js'
  import MyPagination from '../components/my-pagination.vue'

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
        roleName: '',

        dataList: [],
        roles: [],
        privileges: [],

        privilegeIds: [],
        role: ''
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
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.roleName
        }
        searchRolePrivileges(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      add: function () {
        if (this.privileges.length === 0) {
          searchPrivileges((jsonResult) => {
            this.privileges = jsonResult
          })
        }

        $('#modalNew').modal()
      },
      save: function () {
        // console.log(this.privilegeIds)
        const params = {
          role: this.role,
          privilegeIds: this.privilegeIds
        }
        addRolePrivilege(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalNew').modal('hide')
            this.search()
            this.showErrMsg('增加成功.')
          } else {
            this.showErrMsg('失败了!' + jsonResult.errMsg)
          }
        })
      },
      deleteRolePrivilege: function (id) {
        deleteRolePrivilege(id, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('删除成功')
            this.search()
          }
        })
      },
      searchRoles: function () {
        if (this.roles.length === 0) {
          searchRoles((jsonResult) => {
            this.roles = jsonResult
          })
        }
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