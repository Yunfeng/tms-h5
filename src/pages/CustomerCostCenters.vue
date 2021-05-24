<template>
  <div id="customers">
    <div class="card">
      <div class="card-header bg-info text-white">
        企业-订单备注
      </div>
      <div class="card-body">
        <form class="form-inline">
            <div class="col-2">
              <my-select-customer :customerId.sync="customerId0" :minId="-1"></my-select-customer>
            </div>
            <select class="form-control" v-model.number="noteType0">
                            <option value="0">所有</option>
                            <option value="100">成本中心</option>
                            <option value="200">项目名称</option>
                          </select>
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>

          <a href="javascript:void(0)" v-on:click="newNote();" class="btn btn-success ms-auto">新建</a> 
        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>公司</th>
                <th>类型</th>
                <th>名称</th>
                <th>创建时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.customer.vipName}}</td>
                <td>
                  <template v-if="info.noteType === 100">成本中心</template>
                  <template v-if="info.noteType === 200">项目名称</template>
                </td>
                <td>{{info.name}}</td>
                <td>{{info.createTime}}</td>
                <td><button class="btn btn-danger btn-sm" @click="deleteCustomerNote(info.id)">删除</button></td>
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
                        增加订单注释内容
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
                    <div class="form-group row">
                      <label class="control-label col-3 text-right">
                        公司    
                      </label>
                      <div class="col-9">
                        <my-select-customer :customerId.sync="customerId" :minId="1" :disabled="id > 0"></my-select-customer>
                      </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-3 text-right">
                            类型
                        </label>
                        <div class="col-9">
                          <select class="form-control" v-model.number="noteType">
                            <option value="100">成本中心</option>
                            <option value="200">项目名称</option>
                          </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-3 text-right">
                            名称
                        </label>
                        <div class="col-9">
                          <input type="text" id="frmUser_fullname" class="form-control" name="info.name" v-model="name" />
                          <small class="form-text text-muted"></small>
                        </div>
                    </div>
                                      

                  </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" v-on:click="saveNote()">保存</button>
                </div>
            </div>
        </div>
    </div>         
  </div>
</template>

<script>
  import { searchCustomerNotes, createCustomerNote, deleteCustomerNote } from '../api/customer.js'
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'
  import MySelectCustomer from '../components/my-select2-customer.vue'

  export default {
    components: {
      MyPagination,
      MySelectCustomer
    },
    data () {
      return {
        id: 0,
        customerId: 0,
        noteType: 100,
        name: '',

        dataList: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 15,
          pageTotal: 0
        },
        customerId0: -1,
        noteType0: 0
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'customerId': this.customerId0,
          'noteType': this.noteType0
        }

        searchCustomerNotes(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      newNote: function () {
        this.id = 0
        this.customerId = 0
        this.name = ''
        $('#modalPolicyManage').modal()
      },
      saveNote: function () {
        const params = {
          'customerId': this.customerId,
          'noteType': this.noteType,
          'name': this.name
        }

        createCustomerNote(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      deleteCustomerNote: function (id) {
        deleteCustomerNote(id, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            this.search()
          }
        })
      },
      reset: function () {
        this.name = ''
        this.sc.pageNo = 1
        this.customerid0 = -1
        this.noteType0 = 0
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