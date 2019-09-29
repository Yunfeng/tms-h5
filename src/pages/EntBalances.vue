<template>
  <div id="entBalances">
    <div class="card">
      <div class="card-header bg-info text-white">
        企业客户授信
      </div>
      <div class="card-body">
        <form class="form-inline">
          <div class="form-group">
              <input type="textfield" class="form-control" placeholder="公司名称" name="sc.name" v-model.trim="name" size="15">
          </div>
          <div class="form-group">
            <select class="form-control ml-1" v-model.number="sc.pageSize">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>          
          </div>
          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>
          </div>

        </form>
      </div>
      <table class="table table-response table-striped table-hover table-sm" id="tableList">
          <thead>
              <tr>
                  <th>被授权方</th>
                  <th class="text-right">现金账户(元)</th>
                  <th class="text-right">信用额度(元)</th>
                  <th class="text-right">信用余额(元)</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList">
                  <td>
                    {{info.name}}
                    <span class="text-danger small">{{info.customerCode}}</span>
                  </td>
                  <td class="text-right">
                    {{info.cashBalance/100}} 
                    <a href="javascript:void(0)" @click="editCashBalance(index)" class="small">修改</a>
                  </td>
                  <td class="text-right">
                    {{info.creditLimit/100}} 
                    <a href="javascript:void(0)" @click="editCreditLimit(index)" class="small">修改</a>
                  </td>
                  <td class="text-right">
                    {{info.creditBalance/100}} 
                  </td>
                  <td>
                    <router-link :to="`/customer/` + info.enterpriseId + `/trans`">交易记录</router-link>
                  </td>
              </tr>
          </tbody>
      </table>
    </div>
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>
      <!-- 修改现金账户对话款 -->
      <div class="modal" id="modalCashBalance" tabindex="-1" role="dialog" aria-labelledby="modalModifyEntBalanceTitle" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="modalModifyEntBalanceTitle">调整现金账户</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      
                  </div>
                  <div class="modal-body">
                      <form id="frmModifyEntCashBalance" role="form" class="form-horizontal">
                          <input type="hidden" name="id" v-model="authorizee" />
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  +/-   
                              </label>
                              <div class="col-md-6">
                                      <input type="radio" name="opMode" value="0" v-model="opMode">扣款
                                      <input type="radio" name="opMode" value="1" v-model="opMode">充值
                              </div>
                          </div>
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  调整金额    
                              </label>
                              <div class="col-md-6">
                                  <input type="text" id="frmModifyEntCashBalance_amount" class="form-control" name="modifyAmount" v-model="amount" />
                                  <span class="help-text">整数，单位元</span>
                              </div>
                          </div>
                          
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  备注(调整事由)    
                              </label>
                              <div class="col-md-6">
                                  <input type="text" id="frmTmcPolicy_remark" class="form-control" name="remark" v-model="remark" />
                              </div>
                          </div>
                        

                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-primary" v-on:click="updateCashBalance()">保存</button>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- New Request Modal -->
      <div class="modal" id="modalCreditLimit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title" id="myModalLabel">新增授权</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                      
                  </div>
                  <div class="modal-body">
                      <form id="frmUser" role="form" class="form-horizontal">
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  授权给
                              </label>
                              <div class="col-md-6">
                                  
                                  <select class="form-control" v-model="authorizee">
                                    <option v-for="info in dataList" v-bind:value="info.enterpriseId">
                                      {{ info.name }}
                                    </option>
                                  </select>
                              </div>
                          </div>
                          <div class="form-group row">
                              <label class="control-label col-md-4">
                                  信用额度    
                              </label>
                              <div class="col-md-6">
                                  <input type="text" class="form-control" placeholder="信用额度" v-model="creditLimit" />
                                  <span class="help-block">单位：元</span>
                              </div>
                          </div>
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-primary" v-on:click="saveCreditLimit()">保存</button>
                  </div>
              </div>
          </div>
      </div>

  </div>	
</template>

<script>
  import { searchCustomerBalances, saveEntCreditLimit, saveEntCashBalance } from '../api/user.js'
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    components: {
      MyPagination
    },
    data () {
      return {
        authorizee: 0,
        creditLimit: 0,
        opMode: 0,
        amount: 0,
        remark: '',

        dataList: [],
        name: '',
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        }
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
          'sc.name': this.name,
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        }

        searchCustomerBalances(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      reset: function () {
        this.name = ''        
      },
      newEntBalance: function () {
        this.authorizee = 0
        this.creditLimit = 0

        $('#modalCreditLimit').modal()
      },
      saveCreditLimit: function () {
        const params = {
          'authorizee': this.authorizee,
          'creditLimit': this.creditLimit
        }

        saveEntCreditLimit(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalCreditLimit').modal('hide')
            this.search()
          } else {
            this.showErrMsg('操作失败：' + jsonResult.errmsg)
          }
        })
      },
      editCreditLimit: function (index) {
        this.authorizee = this.dataList[index].enterpriseId
        this.creditLimit = this.dataList[index].creditLimit / 100

        $('#modalCreditLimit').modal()
      },
      editCashBalance: function (index) {
        this.authorizee = this.dataList[index].enterpriseId

        $('#modalCashBalance').modal()
      },
      updateCashBalance: function () {
        const params = {
          'id': this.authorizee,
          'opMode': this.opMode,
          'modifyAmount': this.amount,
          'remark': this.remark
        }

        saveEntCashBalance(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalCashBalance').modal('hide')
            this.searchEntBalance()
          } else {
            this.showErrMsg(jsonResult.errmsg)
          }
        })
      },
      getAuthorizeeName: function (enterpriseId) {
        for (let i = 0; i < this.customers.length; i++) {
          if (this.customers[i].enterpriseId === enterpriseId) {
            return this.customers[i].name
          }
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