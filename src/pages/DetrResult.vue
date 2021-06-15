<template>
  <div id="fd-request">
    <div class="card">
      <div class="card-header">
        DETR结果(客票使用状态)
      </div>
      <div class="card-body">
          <form class="">
              <div class="row mb-2">
                  <label>使用状态</label>
                  <select name="sc.ticketStatus" class="form-control" v-model.number="ticketStatus">
                      <option value="-1">全部</option>
                      <option value="0">未使用</option>
                      <option value="1">已使用</option>
                  </select>
              </div>
              <div class="row mb-2">
                <my-date-picker id="searchDate" v-model="searchDate" placeholder="创建日期"></my-date-picker>
                <my-date-picker id="sellDate" v-model="sellDate" placeholder="销售日期"></my-date-picker>
              </div>
              <select class="form-control" v-model.number="sc.pageSize">
              <option value="25">25</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="5000">5000</option>
              </select>

              <div class="row mb-2">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              </div>
              <span class="ms-auto">
                <button type="button" class="btn btn-primary ml-2" @click.stop="importExcel()">导入Excel</button>
                <button type="button" class="btn btn-success ml-5" @click.stop="downloadResult()">下载</button> 
              </span>
          </form>
      </div>
    </div>
    <div class="card-body py-0">
      <span class="small">提示：鼠标放在票号上可以看到DETR内容</span>
    </div>
    <table class="table table-response table-striped table-sm table-hover small">
        <thead>
          <tr>
              <th>票号</th>
              <th>姓名</th>
              <th>航班号</th>
              <th>起飞日期</th>
              <th>行程</th>
              <th></th>
              <th>使用状态</th>
              <th>销售日期</th>
              <th>用户名</th>
              <th>上传日期</th>
              <th></th>
          </tr>        
        </thead>
        <tbody>
          <tr v-for="fd in dataList">
            <td><a :title="fd.detrDetail">{{fd.ticketNo}}</a></td>
            <td>{{fd.psgName}}</td>
            <td>{{fd.flightNo}}</td>
            <td>{{fd.fltDate}}</td>
            <td>{{fd.segInfo}}</td>
            <td>{{fd.pnrNo}}</td>
            <td>{{fd.isUsedDesc}}</td>
            <td>{{fd.sellDate}}</td>
            <td>{{fd.username}}</td>
            <td>{{fd.createDate}}</td>
            <td>
              <button type="button" @click.stop="refreshDetrInfo(fd.id)">刷新</button>
            </td>
          </tr>          
        </tbody>
    </table>
          
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
    </nav>

    <my-modal-excel-upload ref="modalUploadExcel">
      用Excel导入票号
      <template v-slot:excelFormatDesc>Excel格式说明: 票号，销售日期(可空)</template>
    </my-modal-excel-upload>
  </div>
</template>

<script>
  import { searchDetrResults, uploadDetrRequest, refreshDetrInfo } from '../api/misc.js'
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import MyModalExcelUpload from '../components/my-modal-excel-upload.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MyModalExcelUpload
    },
    data () {
      return {
        dataList: [],
        id: 0,

        searchDate: '',
        sellDate: '',
        ticketStatus: -1,
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
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
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.ticketStatus': this.ticketStatus,
          'sc.searchDate': this.searchDate,
          'sc.beginDate': this.sellDate
        }
        searchDetrResults(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          }
        )
      },
      refreshDetrInfo: function (id) {
        const params = { id }
        refreshDetrInfo(params, v => {
          if (v.status === 'OK') {
            this.showErrMsg('请耐心等待后台刷新')
            this.search()
          } else {
            this.showErrMsg('错误: ' + v.errmsg)
          }
        })
      },
      downloadResult: function () {
        const params = 'sc.pageNo=' + this.sc.pageNo +
          '&sc.pageSize=' + this.sc.pageSize +
          '&sc.ticketStatus=' + this.ticketStatus +
          '&sc.searchDate=' + this.searchDate + 
          '&sc.beginDate=' + this.sellDate

        const url = APP_FLIGHT_PATH + '/downloadDetr.do?' + params
        window.open(url)
      },
      importExcel: function () {
        this.$refs.modalUploadExcel.modal().then((formData) => {
          this.showLoading('处理中......')
          uploadDetrRequest(formData.data, v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功')
            } else {
              this.showErrMsg('操作失败:' + v.errmsg, 'danger')
            }
          }, () => {
            this.hideLoading()
          })
        }).catch((ex) => {})
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