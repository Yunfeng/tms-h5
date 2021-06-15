<template>
  <div id="customers">
    <div class="card">
      <div class="card-header bg-info text-white">
        企业部门信息
      </div>
      <div class="card-body">
        <form class="" id="frmSearchUser">
          <input type="hidden" name="sc.pageNo" v-model.number="sc.pageNo">
          <input type="hidden" name="sc.pageSize" v-model.number="sc.pageSize">
          <div class="row mb-2">
              <input type="textfield" class="form-control" placeholder="部门名称" name="sc.name" v-model.trim="searchName" size="15">
          </div>
          <div class="row mb-2">
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>
          </div>

          <a href="javascript:void(0)" v-on:click="newDept();" class="btn btn-success ms-auto">新建</a> 
        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>公司</th>
                <th>部门</th>
                <th>联系人</th>
                <th>手机</th>
                <th>电话</th>
                <th>email</th>
                <th>备注</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.customer.vipName}}</td>
                <td>{{info.name}}</td>
                <td>{{info.linkMan}}</td>
                <td>{{info.mobile}}</td>
                <td>{{info.phone}}</td>
                <td>{{info.email}}</td>
                <td>{{info.remark}}</td>
                <td><a href="javascript:void(0)" v-on:click="editDept(index)">修改</a></td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <!-- New Request Modal -->
    <div class="modal" id="modalPolicyManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">
                      <template v-if="id === 0">
                        增加  
                      </template>
                      <template v-else>
                        修改
                      </template>                      
                    </h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                    
                </div>
                <div class="modal-body">
                  <form id="frmUser" role="form" class="form-horizontal">
                    <input type="hidden" id="frmUser_id" name="user.id" v-model.number="id" />
                    
                    <div class=" row">
                        <label class="control-label col-3 text-right">
                            部门名称*    
                        </label>
                        <div class="col-9">
                          <input type="text" id="frmUser_fullname" class="form-control" name="info.name" v-model="name" />
                          <small class="form-text text-muted"></small>
                        </div>
                    </div>
                    <div class=" row">
                        <label class="control-label col-3 text-right">
                            联系人    
                        </label>
                        <div class="col-md-9">
                            <input type="text" id="frmUser_mobile" class="form-control" name="info.linkMan" v-model="linkMan"  />
                            <small class="form-text text-muted">联系人</small>
                        </div>
                    </div>
                    <div class=" row">
                      <label class="control-label col-3 text-right">
                          手机    
                      </label>
                      <div class="col-9">
                          <input type="text" id="frmUser_mobile" class="form-control" name="info.mobile" v-model="mobile" />
                          <small class="form-text text-muted">手机号</small>
                      </div>
                    </div>
                    <div class=" row">
                      <label class="control-label col-3 text-right">
                          电话    
                      </label>
                      <div class="col-9">
                          <input type="text" id="frmUser_mobile" class="form-control" name="info.phone" v-model="phone" />
                          <small class="form-text text-muted">联系电话</small>
                      </div>
                    </div>                    
                    <div class=" row">
                      <label class="control-label col-3 text-right">
                          电子邮件    
                      </label>
                      <div class="col-9">
                        <input type="text" id="frmUser_mobile" class="form-control" name="info.email" v-model="email" />
                        <small class="form-text text-muted"></small>
                      </div>
                    </div>                    
                    <div class=" row">
                      <label class="control-label col-3 text-right">
                          备注    
                      </label>
                      <div class="col-9">
                        <input type="text" id="frmUser_mobile" class="form-control" name="info.remark" v-model="remark" />
                          <small class="form-text text-muted"></small>
                      </div>
                    </div>                    

                  </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" v-on:click="saveDept()">保存</button>
                </div>
            </div>
        </div>
    </div>         
  </div>
</template>

<script>
  import { createDepartment, searchDepartments } from '../api/user.js'
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    components: {
      MyPagination
    },
    data () {
      return {
        id: 0,
        customerId: 0,
        name: '',
        mobile: '',
        phone: '',
        linkMan: '',
        email: '',
        remark: '',

        dataList: [],
        customers: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 15,
          pageTotal: 0
        },
        searchName: ''
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (msg) {
        // this.$store.dispatch('showLoading', { 'loadingText': msg })
      },
      hideLoading: function () {
        // this.$store.dispatch('hideLoading')
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.searchName
        }
        console.log(params)
        // this.showLoading('查询中...')
        searchDepartments(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
          // this.hideLoading()
        })
      },
      newDept: function () {
        this.id = 0
        this.customerId = 0
        this.name = ''
        this.mobile = ''
        this.phone = ''
        this.linkMan = ''
        this.email = ''
        this.remark = ''

        $('#modalPolicyManage').modal()
      },
      saveDept: function () {
        const params = {
          'id': this.id,
          'name': this.name,
          'linkMan': this.linkMan,
          'mobile': this.mobile,
          'phone': this.phone,
          'email': this.email,
          'remark': this.remark
        }

        const jsonParam = JSON.stringify(params)

        createDepartment(jsonParam, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
            window.alert(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      editDept: function (index) {
        const info = this.dataList[index]

        this.id = info.id
        this.name = info.name
        this.linkMan = info.linkMan
        this.mobile = info.mobile
        this.phone = info.phone
        this.email = info.email
        this.remark = info.remark

        $('#modalPolicyManage').modal()
      },
      reset: function () {
        this.name = ''
        this.sc.pageNo = 1
        this.search()
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