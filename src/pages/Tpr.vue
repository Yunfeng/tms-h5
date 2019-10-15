<template>
	<div id="tpr-list">
    <div class="card">
      <div class="card-header bg-info text-white">
        出票数据
      </div>
    </div>

    <div class="card col-12 hidden-md-down">
      <form class="form-inline">
        <my-date-picker :id="'beginDate'" :class="'form-control m-1'" :placeholder="'开始日期'" v-model="beginDate"></my-date-picker> 
        <my-date-picker :id="'endDate'" :class="'form-control m-1'" :placeholder="'截止日期'" v-model="endDate"></my-date-picker> 
        <input class="form-control m-1" type="text" placeholder="eterm用户名" size="10" v-model="etermUsername">
        <input class="form-control m-1" type="text" placeholder="设备号" size="4" v-model="deviceId">
        <input class="form-control m-1" type="text" placeholder="票号" size="12" v-model.trim="ticketNo">
        <button type="button" class="btn btn-success mr-2" @click.stop="search()">确定</button>
        <button type="button" class="btn btn-info btn-sm" @click.stop="reset()">重置</button>  
      </form>
      
    </div>
    <div class="card col-12 px-0">
      <table class="table table-sm table-striped table-hover small">
        <thead>
            <tr>
                <th>出票日期</th>
                <th class="hidden-sm-down">设备号</th>
                <th>票号</th>
                <th>编码</th>
                <th>出发</th>
                <th>到达</th>
                <th class="text-right">价格</th>
                <th class="text-right">税</th>
                <th class="text-right">佣金</th>
                <th class="text-right">底价</th>
                <th>ctcm</th>
                <th>ctct</th>
                <th>出票处</th>
                <th>eterm用户名</th>
                <th>生成时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="flight in dataList" :key="flight.id">
              <td><small>{{flight.sellDate}}</small></td>
              <td class="hidden-sm-down"><small>{{flight.deviceId}}</small></td>
              <td>{{flight.ticketNo}}
                <span class="text-muted" v-if="flight.ticketStatus === 1">改签</span>
                <span class="text-muted" v-if="flight.ticketStatus === 4">退票</span>
                <span class="text-muted" v-if="flight.ticketStatus === 16">废</span>
                  {{flight.conjTag}}
              </td>
              <td>
                {{flight.pnrNo}}
              </td>
              <td>{{flight.orig}}</td>   
              <td>{{flight.dest}}</td>   
              <td class="text-right">{{flight.price}}</td>   
              <td class="text-right">{{flight.tax}}</td>   
              <td class="text-right">{{flight.commission}}</td>   
              <td class="text-right">{{flight.bottomPrice}}</td>   
              <td>{{flight.ctcmCount}}</td>     
              <td>{{flight.linkPhone}}</td>     
              <td>
                <template v-if="flight.supplier !== null">{{flight.supplier.name}}</template>
              </td> 
              <td>{{flight.etermUsername}}</td>     
              <td>{{flight.createTime}}</td>     
              <td>{{flight.checkStatus}}</td>
            </tr>
        </tbody>
      </table>
      <div class='card-block'>
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
      </div>
    </div> 

    <!-- New  Modal -->
    <div class="modal" id="modalTpr" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">导入tpr指令结果</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="exampleFormControlTextarea1">tpr指令结果</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" v-model.trim="tprContent"></textarea>
                    <span class="text-muted small">请将tpr指令结果完全复制</span>
                  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="saveTprContent()">保存</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="modalExcel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">上传Excel文件导入机票数据</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span>
                        <span class="sr-only">Close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id = "uploadFileForm" method="post" enctype="multipart/form-data">                      
                      <input type="hidden" name="fileContentType" value="100">
                        <div class="form-group">
                            <label class="control-label">
                                供应商    
                            </label>
                            <div>
                                <select class="form-control" name="supplierId">
                                  <option value="0">请选择供应商</option>
                                  <template v-for="info in suppliers">
                                    <option :value="info.id" :key="info.id">{{info.name}}</option>
                                  </template>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">
                                Excel格式    
                            </label>
                            <div>
                                <select class="form-control" name="formatNo">
                                  <option value="1">格式一 (出票日期、开始票号、截止票号、票数、支付金额、支付备注)</option>
                                  <option value="2">格式二 (票号、乘机人、PNR、航班号、支付金额、出票日期)</option>
                                </select>
                            </div>
                            <span class="text-muted small">
                              格式一（六列）：出票日期、开始票号、截止票号、票数、支付金额、支付备注；数据从第二行开始）<br/>
                              格式二（六列）：票号、乘机人、PNR、航班号、支付金额、出票日期；数据从第二行开始）<br/>
                            </span>
                        </div>
                        <div class="form-group">
                            <label>选择需要上传的文件</label>
                            <input type="file" class="form-control-file" name="upfile" id="inputFileName">
                            <span class="text-muted small">
                              文件名请不要有中文或全角字符，请使用字母或数字命名文件名。
                            </span>
                        </div>   
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary btn-lg ml-2" @click.stop="uploadExcel()" :disabled="uploading">
                      <template v-if="uploading">
                        上传中...
                      </template>
                      <template v-else>
                        开始上传  
                      </template>                      
                    </button>
                </div>
            </div>
        </div>
    </div>    
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import MyDatePicker from '../components/my-datepicker.vue'
import { searchTpr, saveTprContent } from '../api/flight.js'
import { searchSuppliers } from '../api/basic-data.js'
import { APP_FLIGHT_PATH } from '../common/common.js'
import $ from 'jquery'

export default {
  name: 'TprList',
  components: {
    MyPagination,
    MyDatePicker
  },
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      beginDate: '',
      endDate: '',
      deviceId: '',
      ticketNo: '',
      etermUsername: '',

      tprContent: '',
      suppliers: [],

      uploading: false
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
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
      let deviceId = this.deviceId
      if (deviceId === '') {
        deviceId = 0
      }

      let beginDate = this.beginDate
      if (beginDate === '') {
        beginDate = null
      }

      let endDate = this.endDate
      if (endDate === '') {
        endDate = null
      }

      let params = { 
        'beginDate': beginDate,
        'endDate': endDate,
        'device': deviceId,
        'ticketNo': this.ticketNo,
        'etermUsername': this.etermUsername,
        'pageSize': this.sc.pageSize,
        'pageNo': this.sc.pageNo
      }

      this.showLoading()

      searchTpr(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        () => { this.hideLoading() }
      )
    },
    reset: function () {
      this.beginDate = ''
      this.endDate = ''
      this.deviceId = ''
      this.ticketNo = ''
      this.etermUsername = ''
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
    showAbbr: function (val) {
      if (val !== null && val.length > 10) {
        return val.substring(0, 10) + '...'
      } else {
        return val
      }
    },
    showStatus: function (val) {
      switch (val) {
        case 0: return ''
        case 4: return '已退票'
        default: return val
      }
    },
    importTprContent: function () {
      this.tprContent = ''
      $('#modalTpr').modal()
    },
    importExcel: function () {
      this.searchSuppliers()
      $('#modalExcel').modal()
    },
    saveTprContent: function () {
      const params = {
        'tprContent': this.tprContent
      }
      saveTprContent(params, (jsonResult) => {
        if (jsonResult.status === 'OK') {
          $('#modalTpr').modal('hide')
          this.search()
        } else {
          this.showErrMsg('保存失败')
        }
      })
    },
    searchSuppliers: function () {
      if (this.suppliers.length > 0) return

      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 50
      }

      searchSuppliers(params,
        (jsonResult) => {
          this.suppliers = jsonResult.dataList
        }
      )
    },
    uploadExcel: function () {
      const filename = $('#inputFileName').val()
      if (filename.length === 0) {
        this.showErrMsg('请选择需要导入的EXCEL文件')
        return
      }

      this.uploading = true
      const self = this

      // showLoading();
      var formData = new window.FormData($('#uploadFileForm')[0])
      $.ajax({
        url: APP_FLIGHT_PATH + '/upload/excel',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (jsonResult) {
          if (jsonResult.status !== 'OK') {
            self.showErrMsg(jsonResult.errmsg)
          } else {
            self.showErrMsg('上传成功, ' + jsonResult.desc)
            $('#inputFileName').val('')
            $('#modalExcel').modal('hide')
          }
        },
        complete: function () {
          self.uploading = false
        }
      })
    },
    downloadTpr: function () {
      const params = 'endDate=' + this.endDate + '&beginDate=' + this.beginDate + '&etermUsername=' + this.etermUsername + '&device=' + this.deviceId
      const url = APP_FLIGHT_PATH + '/tprs/download?' + params
      window.open(url)
    }
  }
}
</script>
