<template>
  <div id="airports">
    <div class="card">
      <div class="card-body">
        <form class="form-inline">
          <div class="row mb-2">
              <input type="textfield" class="form-control" placeholder="两字代码" size="8" v-model.trim="twoCode">
              <input type="textfield" class="form-control" placeholder="三字代码" size="8" v-model.trim="threeCode">
          </div>
          <div class="row mb-2">
              <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
          </div>

          <span class="ml-auto">
              <a href="javascript:void(0)" v-on:click="newUser();" class="btn btn-success btn-lg">新建</a> 
          </span> 
        </form>
      </div>
    </div>
    <table class="table table-striped table-hover table-sm small">
        <thead>
            <tr>
                <th>两字代码</th>
                <th>三字代码</th>
                <th>中文名</th>
                <th>英文名</th>
                <th>中文简称</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="info in dataList" :key="info.id">
                <td>{{info.twoCode}}</td>
                <td>{{info.threeCode}}</td>
                <td>{{info.name}}</td>
                <td>{{info.nameEn}}</td>
                <td>{{info.nickName}}</td>
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
            <h4 class="modal-title" id="myModalLabel">新增航空公司信息</h4>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          </div>
          <div class="modal-body">
            <form id="frmUser" role="form" class="form-horizontal">
              <div class="form-group row">
                <label class="control-label col-4">
                    三字代码    
                </label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model.trim="threeCode" />
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-4">
                    两字代码    
                </label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model.trim="twoCode" />
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-4">
                    中文名    
                </label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model.trim="name" />
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-4">
                    中文简称    
                </label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model.trim="nickName" />
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-4">
                    英文名    
                </label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model.trim="nameEn" />
                </div>
              </div>
                  
            </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" v-on:click.stop="createUser()">保存</button>
          </div>
        </div>
      </div>
    </div>
         
  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchAirlines, createAirline } from '../api/basic-data.js'
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
          pageSize: 50,
          pageTotal: 0
        },
        threeCode: '',
        twoCode: '',
        name: '',
        nameEn: '',
        nickName: '',

        dataList: []
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
          'threeCode': this.threeCode,
          'twoCode': this.twoCode
        }

        searchAirlines(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      newUser: function () {
        this.threeCode = ''
        this.twoCode = ''
        this.name = ''
        this.nameEn = ''
        this.nickName = ''

        $('#modalPolicyManage').modal()
      },
      createUser: function () {
        const params = {
          'threeCode': this.threeCode,
          'twoCode': this.twoCode,
          'name': this.name,
          'nickName': this.nickName,
          'nameEn': this.nameEn
        }

        createAirline(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
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
      },
      reset: function () {
        this.threeCode = ''
        this.twoCode = ''
      }
    }
  }
</script>