<template>
  <div id="payments">
    <div class="card">
      <div class="card-header bg-info text-white">
        支出支付方式 <small>(向供应商支付时所使用的支付途径)</small>
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" value="1">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="20">                            
          <select class="form-control ml-1" name="sc.status" v-model.number="scStatus">
            <option value="-1">状态</option>
            <option value="0">停用</option>
            <option value="1">启用</option>
          </select>
          <div class="row mb-2">
              <button type="button" class="btn btn-primary ml-1" v-on:click="search()">查找</button>
          </div>
          

          <a href="javascript:void(0)" class="btn btn-success ml-auto" v-on:click="newPayment()">新建</a> 
        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>名称</th>
                <th>拼音</th>
                <th>开户行</th>
                <th>开户名</th>
                <th>账号</th>
                <th>备注</th>
                <th>状态</th>
                <th>创建日期</th>
                <th>修改日期</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" :class="{'table-dark text-white': info.status === 0}" :key="info.id">
                <td>{{info.name}}</td>
                <td>{{info.pinyin}}</td>
                <td>{{info.bankName}}</td>
                <td>{{info.accountName}}</td>
                <td>{{info.accountNo}}</td>
                <td>{{info.remark}}</td>
                <td>
                  <template v-if="info.status">
                    <span class="text-success text-lg">启用</span>
                  </template>
                  <template v-else>
                    <span class="text-danger">停用</span>
                  </template>
                </td>
                <td>{{info.createTime}}</td>
                <td>{{info.lastUpdate}}</td>
                <td>
                  <button class="btn btn-info btn-sm" @click.stop="editPaymentMethod(index)">修改</button>
                </td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
    
    <!-- New  Modal -->
    <div class="modal" id="modalNew" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">新建支付方式</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                    <form id="frmPolicy" role="form" class="form-horizontal">
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                名称    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="name" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                拼音（用于排序）    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="pinyin" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                开户行    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="bankName" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                开户名    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="accountName" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                开户账号    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="accountNo" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                备注    
                            </label>
                            <div class="col-md-6">
                                <input type="text" class="form-control" v-model.trim="remark" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4 text-right">
                                状态    
                            </label>
                            <div class="col-md-6">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="0" v-model.number="status">
                                <label class="form-check-label text-danger">停用</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="1" v-model.number="status">
                                <label class="form-check-label text-success">启用</label>
                              </div>

                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" v-on:click="save()">保存</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import MyPagination from '../components/my-pagination.vue'
  import $ from 'jquery'
  import { searchPaymentMethods, savePaymentMethod } from '../api/basic-data.js'

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
        scStatus: -1,

        id: 0,
        name: '',
        pinyin: '',
        bankName: '',
        accountName: '',
        accountNo: '',
        remark: '',
        status: 1,

        dataList: []
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },      
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        this.showLoading()
        searchPaymentMethods($('#frmSearch').serialize(), 
          v => {
          this.dataList = v.dataList
          this.sc = v.page
        }, () => {
          this.hideLoading()
        })
      },
      reset: function () {
        this.id = 0
        this.name = ''
        this.pinyin = ''
        this.bankName = ''
        this.accountName = ''
        this.accountNo = ''
        this.remark = ''
        this.status = 1
      },
      newPayment: function () {
        this.reset()

        $('#modalNew').modal()
      },
      editPaymentMethod: function (idx) {
        const o = this.dataList[idx]
        this.reset()

        this.id = o.id
        this.name = o.name
        this.pinyin = o.pinyin
        this.bankName = o.bankName
        this.accountName = o.accountName
        this.accountNo = o.accountNo
        this.remark = o.remark
        this.status = o.status

        $('#modalNew').modal()
      },
      save: function () {
        const params = {
          'id': this.id,
          'name': this.name,
          'pinyin': this.pinyin,
          'bankName': this.bankName,
          'accountName': this.accountName,
          'accountNo': this.accountNo,
          'remark': this.remark,
          'status': this.status
        }

        savePaymentMethod(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalNew').modal('hide')
            this.search()
            this.showErrMsg('操作成功')
          } else {
            this.showErrMsg('操作失败：' + jsonResult.errmsg)
          }
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
