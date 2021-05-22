<template>
  <div id="myHistories">
      <div class="card">
        <div class="card-header">操作日志</div>
        <div class="card-body">
            <form class="form-inline" id="frmSearchHistory">
                <input type="hidden" id="frmSearchHistory_sc_pageNo" name="sc.pageNo" v-model.number="sc.pageNo">
                <input type="hidden" id="frmSearchHistory_sc_pageSize" name="sc.pageSize" v-model.number="sc.pageSize">

              <div class="row mb-2">
                <input type="text" class="form-control" id="frmSearchHistory_sc_remark" name="sc.remark" placeholder="备注" size="10" v-model.trim="remark">
              </div>
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>

               
            </form>
        </div>
        <table class="table table-striped table-hover table-sm small">
          <thead>
            <tr>
                <th>用户名</th>
                <th>IP地址</th>
                <th>备注</th>
                <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in dataList">
              <td>{{info.username}}</td>
              <td>{{info.ipaddr}}</td>
              <td>{{info.memo}}</td>
              <td>{{info.lastupdate}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>
  </div>
</template>

<script>
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import MyPagination from '../components/my-pagination.vue'
  import $ from 'jquery'

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
        remark: '',

        dataList: []
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      search: function () {
        const self = this
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.remark': this.remark
        }
        $.ajax({
          type: 'post',
          url: APP_FLIGHT_PATH + '/searchOpHistory.do',
          data: params,
          dataType: 'json',
          success: function (jsonResult) {
            self.dataList = jsonResult.dataList
            self.sc = jsonResult.page
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