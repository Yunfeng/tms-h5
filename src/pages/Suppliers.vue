<template>
  <div id="suppliers">
    <div class="card">
      <div class="card-header bg-info text-white">
        供应商
        <span class="small bg-white text-muted ml-2">机票、酒店以及服务等产品的供应商</span>
      </div>
      <div class="card-body">
        <form class="form-inline">
          <input type="text" class="form-control" size="8" placeholder="名称" v-model.trim="name0" />
          <select class="form-control ml-1" v-model.number="supplierType0">
            <option value="-1">类型</option>
            <option value="0">综合</option>
            <option value="1">机票</option>
            <option value="2">保险</option>
            <option value="3">酒店</option>
            <option value="4">旅游</option>
            <option value="5">火车票</option>
          </select>
          <select class="form-control ml-1" v-model.number="scStatus">
            <option value="-1">状态</option>
            <option value="0">停用</option>
            <option value="1">启用</option>
          </select>
            <div class="form-group ml-1">
              <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-muted btn-sm ml-5" @click.stop="reset0()">重置</button>
            </div>
            
            <a href="javascript:void(0)" class="btn btn-success ms-auto" @click="newSupplier()">新建</a> 
        </form>
      </div>
    </div>
    <table class="table table-striped table-hover table-sm small">
      <thead>
        <tr>
          <th>名称</th>
          <th>拼音</th>
          <th>类型</th>
          <th>备注</th>
          <th>默认支付方式</th>
          <th>状态</th>
          <th></th>
          <th></th>
          <th>生成时间</th>
          <th>修改时间</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(info, index) in suppliers" :key="info.id" :class="{'table-dark text-white': info.status === 0}">
          <td>{{info.name}}</td>
          <td>{{info.pinyin}}</td>
          <td>{{getTypeDesc(info.supplierType)}}</td>
          <td>{{info.remark}}</td>
          <td>{{info.paymentMethodName}}</td>
          <td>
            <template v-if="info.status">
              <span class="text-success text-lg">启用</span>
            </template>
            <template v-else>
              <span class="text-danger">停用</span>
            </template>
          </td>
          <td>
            <template v-if="info.isDefault && info.status">
              默认
            </template>
            <template v-else-if="info.supplierType === 0 && info.status">
              <button type="button" class="btn btn-warning btn-sm" @click.stop="setDefaultSupplier(info.id)">设为默认</button>
            </template>
          </td>
          <td>
            <template v-if="info.isBsp && info.status">
              BSP开票
              <button type="button" class="btn btn-danger btn-sm" @click.stop="setBspSupplier(info.id, 0)">取消</button>
            </template>
            <template v-else-if="info.supplierType === 1 && info.status">
              <button type="button" class="btn btn-warning btn-sm" @click.stop="setBspSupplier(info.id, 1)">设为BSP开票</button>
            </template>
          </td>
          <td>{{info.createTime}}</td>
          <td>{{info.lastUpdate}}</td>
          <td>
            <button class="btn btn-info btn-sm" @click.stop="editSupplier(index)">修改</button>
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
                    <h4 class="modal-title" id="myModalLabel">
                      <template v-if="this.id ===0">
                        新建供应商信息
                      </template>
                      <template v-else>
                        修改供应商信息
                      </template>
                    </h4>
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
                                类型    
                            </label>
                            <div class="col-md-6">
                                <select class="form-control" v-model.number="supplierType">
                                  <option value="0">综合</option>
                                  <option value="1">机票</option>
                                  <option value="2">保险</option>
                                  <option value="3">酒店</option>
                                  <option value="4">旅游</option>
                                  <option value="5">火车票</option>
                                </select>
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
                                支付方式(默认)
                            </label>
                            <div class="col-md-6">
                                <select class="form-control" v-model.number="paymentMethodId">
                                  <option value="0">无</option>   
                                  <template v-for="info in pmList">
                                    <option :key="info.id" :value="info.id"  v-if="info.status === 1">{{info.name}}</option>
                                  </template>                                                                 
                                </select>
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
                    <button type="button" class="btn btn-primary" v-on:click="saveSupplier()">保存</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import MyPagination from '../components/my-pagination.vue'
  import $ from 'jquery'
  import { searchSuppliers, saveSupplier, searchPaymentMethods, updateDefaultSupplier, updateBspSupplier } from '../api/basic-data.js'

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
        supplierType0: -1,
        name0: '',
        scStatus: -1,

        id: 0,
        name: '',
        supplierType: 0,
        remark: '',
        pinyin: '',
        paymentMethodId: 0,
        status: 1,

        suppliers: [],
        pmList: []
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      this.search()
      this.searchPaymentMethods()
    },
    methods: {
      ...mapMutations([
        'showLoading',
        'hideLoading'
      ]),
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.type': this.supplierType0,
          'sc.name': this.name0,
          'sc.status': this.scStatus
        }

        this.showLoading()
        
        searchSuppliers(params, v => {
          this.suppliers = v.dataList
          this.sc = v.page
        }, () => {
          this.hideLoading()
        })
      },
      searchPaymentMethods: function () {
        searchPaymentMethods({
            'sc.pageNo': 1,
            'sc.pageSize': 1000
          }, v => {
            this.pmList = v.dataList
          }
        )
      },
      reset0: function () {
        this.supplierType0 = -1
        this.name0 = ''
        this.scStatus = -1
      },
      reset: function () {
        this.id = 0
        this.name = ''
        this.supplierType = 0
        this.remark = ''
        this.pinyin = ''
        this.paymentMethodId = 0
        this.status = 1
      },
      newSupplier: function () {
        this.reset()

        $('#modalNew').modal()
      },
      saveSupplier: function () {
        const params = {
          'id': this.id,
          'name': this.name,
          'supplierType': this.supplierType,
          'remark': this.remark,
          'pinyin': this.pinyin,
          'paymentMethodId': this.paymentMethodId,
          'status': this.status
        }
        saveSupplier(params, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalNew').modal('hide')
            this.search()
          } else {
            this.showErrMsg("失败：" + jsonResult.errmsg)
          }
        })
      },
      editSupplier: function (idx) {
        this.reset()

        const o = this.suppliers[idx]
        this.id = o.id
        this.name = o.name
        this.supplierType = o.supplierType
        this.remark = o.remark
        this.pinyin = o.pinyin
        this.paymentMethodId = o.paymentMethodId
        this.status = o.status

        $('#modalNew').modal()
      },
      setDefaultSupplier: function (supplierId) {
        this.showLoading()
        updateDefaultSupplier(supplierId, v => {
          if (v.status === 'OK') {
            this.search()
          } else {
            this.showErrMsg(v.errMsg, 'danger')
          }
        }, () => this.hideLoading())
      },
      setBspSupplier: function (supplierId, status) {
        this.showLoading()
        const params = {
          status
        }
        updateBspSupplier(supplierId, params, v => {
          if (v.status === 'OK') {
            this.search()
          } else {
            this.showErrMsg(v.errMsg, 'danger')
          }
        }, () => this.hideLoading())
      },
      getTypeDesc: function (val) {
        switch (val) {
          case 0: return '综合'
          case 1: return '机票'
          case 2: return '保险'
          case 3: return '酒店'
          case 4: return '旅游'
          case 5: return '火车票'
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
