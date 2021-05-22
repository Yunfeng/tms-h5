<template>
  <div id="pat-codes">
    <div class="card">
      <div class="card-body">
        <form class="form-inline">
          <div class="row mb-2">
            <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
          </div>

          <span class="ml-auto" v-if="false">
            <a href="javascript:void(0)" v-on:click="newUser();" class="btn btn-success btn-lg">新建</a> 
          </span> 
        </form>
      </div>
      <table class="table table-striped table-hover table-sm small">
          <thead>
              <tr>
                  <th>航司</th>
                  <th>旅行代码</th>
                  <th>PAT代码</th>
                  <th>出票方式</th>
                  <th>德付通密码</th>
                  <th>金额</th>
                  <th>最小金额</th>
                  <th>状态</th>
                  <th>创建日期</th>
                  <th>修改日期</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in patCodes" :key="info.carrier">
                  <td>{{info.carrier}}</td>
                  <td>{{info.tourCode}}</td>
                  <td>{{info.patCode}}</td>
                  <td>{{getTicketTypeDesc(info.ticketType)}}</td>
                  <td>{{info.dpayPassword}}</td>
                  <td>{{info.dpayAmount}}</td>
                  <td>{{info.minDpayAmount}}</td>
                  <td>{{getStatusDesc(info.status)}}</td>
                  <td>{{info.createTime}}</td>
                  <td>{{info.lastUpdate}}</td>
                  <td><a href="javascript:void(0)" @click.stop="editInfo(index)">修改</a></td>
              </tr>

          </tbody>
      </table>
    </div>
    <!-- New Request Modal -->
    <div class="modal" id="modalPolicyManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">修改</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                    <form id="frmUser" role="form" class="form-horizontal">
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                航司*    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_username" class="form-control" name="user.username" placeholder="用户名" v-model="carrier" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                旅行代码 
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_fullname" class="form-control" name="user.empname" placeholder="" v-model="tourCode" />
                                <span class="help-block"></span>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                 PAT 代码   
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_mobile" class="form-control" name="user.mobileNo" v-model="patCode" placeholder="" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                出票类型    
                            </label>
                            <div class="col-md-6">
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="0" v-model.number="ticketType">
                                  <label class="form-check-label">BSP</label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="1" v-model.number="ticketType">
                                  <label class="form-check-label">德付通</label>
                                </div>

                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                德付通密码    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_email" class="form-control" name="user.email" v-model="dpayPassword" placeholder="" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                德付通金额    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_email" class="form-control" name="user.email" v-model="dpayAmount" placeholder="" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                最小德付通金额    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_email" class="form-control" name="user.email" v-model="minDpayAmount" placeholder="" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                启用状态    
                            </label>
                            <div class="col-md-6">
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="0" v-model.number="status">
                                  <label class="form-check-label text-danger">停用</label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" value="1" v-model.number="status">
                                  <label class="form-check-label">启用</label>
                                </div>
                            </div>
                        </div>
                        
                        
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="createTourCode()">保存</button>
                </div>
            </div>
        </div>
    </div>
         
  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchTourCodes, createTourCode } from '../../api/admin.js'

  export default {
    data () {
      return {
        patCodes: [],

        carrier: '',
        tourCode: '',
        patCode: '',
        ticketType: 0,
        dpayPassword: '',
        dpayAmount: 0,
        minDpayAmount: 0,
        status: 0,
        id: 0
      }
    },
    mounted: function () {
      this.search()
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
        searchTourCodes(v => {
          this.patCodes = v
        })
      },
      createTourCode: function () {
        const params = {
          'id': this.id,
          'carrier': this.carrier,
          'tourCode': this.tourCode,
          'patCode': this.patCode,
          'ticketType': this.ticketType,
          'dpayPassword': this.dpayPassword,
          'dpayAmount': this.dpayAmount,
          'minDpayAmount': this.minDpayAmount,
          'status': this.status
        }

        createTourCode(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      editInfo: function (index) {
        const info = this.patCodes[index]
        this.id = info.id
        this.carrier = info.carrier
        this.tourCode = info.tourCode
        this.patCode = info.patCode
        this.ticketType = info.ticketType
        this.dpayPassword = info.dpayPassword
        this.dpayAmount = info.dpayAmount
        this.minDpayAmount = info.minDpayAmount
        this.status = info.status

        $('#modalPolicyManage').modal()
      },
      getStatusDesc: function (val) {
        if (val === 0) {
          return '停用'
        } else {
          return '启用'
        }
      },
      getTicketTypeDesc: function (val) {
        if (val === 0) {
          return 'BSP'
        } else if (val === 1) {
          return '德付通'
        } else {
          return val
        }
      }
    }
  }
</script>