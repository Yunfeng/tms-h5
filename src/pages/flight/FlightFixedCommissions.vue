<template>
  <div id="fixed-flight-commission">
    <div class="card">
      <div class="card-header bg-info text-white">机票定额代理费</div>
      <div class="card-body">
          <form class="" id="frmSearch">
              <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" value="1">
              <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="20">
              <div class="row mb-2">
                  <input type="textfield" class="form-control" id="frmSearch_carrier" placeholder="航空公司"  name="sc.carrier"  size="10">
              </div>
              <div class="row mb-2">
                  <input type="textfield" class="form-control" id="frmSearch_subClass" placeholder="舱位"  name="sc.subClass"  size="6">
              </div>
              
              <div class="row mb-2">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              </div>
              

                  <a href="javascript:void(0)" class="btn btn-success ms-auto" @click="newFixedPoilcy()">录入新政策</a> 
          </form>
      </div>
    </div>
    <table class="table table-striped table-sm">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位性质</th>
                <th>舱位</th>
                <th>航司代理费</th>
                <th>备注</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(info, index) in policies">
                <td>{{info.carrier}}</td>
                <td>{{info.cabinClass}}</td>
                <td>{{info.subclass}}</td>
                <td>{{info.carrierCharge}}</td>
                <td>{{info.remark}}</td>

                <td><a href="javascript:void(0)" v-on:click="editFixedPolicy(index)">修改</a></td>
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
                      <h4 class="modal-title" id="myModalLabel">录入定额代理费</h4>
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  </div>
                  <div class="modal-body">
                      <form id="frmPolicy" role="form" class="form-horizontal">
                          <input type="hidden" name="fixedPolicy.id" v-model="id" />                        
                          <div class=" row">
                              <label class="control-label col-4 text-right">
                                  航司    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.carrier" v-model="carrier" />
                              </div>
                          </div>
                          <div class=" row">
                              <label class="control-label  col-4 text-right">
                                  舱位性质    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.cabinClass" v-model="cabinClass" />
                                  <span class="text-muted small">F,C,Y等</span>
                              </div>
                          </div>
                          <div class=" row">
                              <label class="control-label  col-4 text-right">
                                  舱位    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.subclass" v-model="subclass" />
                              </div>
                          </div>
                          <div class=" row">
                              <label class="control-label  col-4 text-right">
                                  航司定额    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.carrierCharge"  v-model="carrierCharge" />
                                  <span class="text-muted small">航司给的定额代理费，单位：元</span>
                              </div>
                          </div>
                          <div class=" row">
                              <label class="control-label  col-4 text-right">
                                  让利金额    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.sellerCharge"  v-model="sellerCharge" />
                                  <span class="text-muted small">卖家给开票的返利金额，单位：元</span>
                              </div>
                          </div>
                          <div class=" row">
                              <label class="control-label  col-4 text-right">
                                  备注    
                              </label>
                              <div class="col-md-8">
                                  <input type="text" class="form-control" name="fixedPolicy.remark"  v-model="remark" />
                              </div>
                          </div>
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" class="btn btn-primary" v-on:click="saveFixedPolicy()">保存</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import MyPagination from '../../components/my-pagination.vue'
  import $ from 'jquery'
  import { searchFlightFixedCommissions, saveFlightFixedCommission } from '../../api/user.js'

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

        id: 0,
        customerId: 0,
        carrier: '',
        cabinClass: '',
        subclass: '',
        carrierCharge: 0,
        sellerCharge: 0,
        authorizee: 0,
        remark: '',
        userList: [],
        policies: []
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
        searchFlightFixedCommissions($('#frmSearch').serialize(), (jsonResult) => {
          this.policies = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      reset: function () {
        this.id = 0
        this.carrier = ''
        this.cabinClass = ''
        this.subclass = ''
        this.carrierCharge = 0
        this.sellerCharge = 0
        this.authorizee = 0
        this.remark = ''
      },
      newFixedPoilcy: function () {
        this.reset()

        $('#modalNew').modal()
      },
      saveFixedPolicy: function () {
        saveFlightFixedCommission($('#frmPolicy').serialize(), (jsonResult) => {
          if (jsonResult.status === 'OK') {
            $('#modalNew').modal('hide')
            this.search()
          } else {
            this.showErrMsg(jsonResult.errmsg)
          }
        })
      },
      editFixedPolicy: function (index) {
        this.id = this.policies[index].id
        this.carrier = this.policies[index].carrier
        this.cabinClass = this.policies[index].cabinClass
        this.subclass = this.policies[index].subclass
        this.carrierCharge = this.policies[index].carrierCharge
        this.sellerCharge = this.policies[index].sellerCharge
        this.remark = this.policies[index].remark

        $('#modalNew').modal()
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
