<template>
	<div id="attractions">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/attractions'>景点</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">列表</li>
        <li class="breadcrumb-item ml-auto"><router-link to='/attractions/ticket/orders'>门票订单</router-link></li>
      </ol>
    </nav>
    <div class="card">
        <div class="card-header bg-info text-white">景点信息</div>
        <div class="card-body">
        <form class="form-inline" id="frmSearch">
          <div class="form-group">
            <label>状态</label>
            <select class="form-control" v-model.number="status">
                <option value="-1">全部</option>
                <option value="0">停用</option>
                <option value="1">启用</option>
            </select>

              <select class="form-control form-control-sm" v-model.number="sc.pageSize">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
              </select>

              <button type="button" class="btn btn-primary ml-1" v-on:click="search()">查找</button>
          </div>
          
        </form>
      </div>
    </div>

    <table class="table table-hover table-sm">
      <thead>
        <tr>
          <th>名称</th>
          <th>地址</th>
          <th>开放时间</th>
          <th>备注</th>
          <th>状态</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(info, index) in dataList">
          <tr>
            <td>{{info.name}}</td>
            <td>
              {{info.address}}
            </td>
            <td>
              {{info.openTime}}
            </td>
            <td>
              {{info.remark}}
            </td>
            <td>
              <span class="text-success" v-if="info.status === 1">正常</span>
              <span class="text-danger" v-else>停用</span>
            </td>
            <td>
              <router-link :to="`/attraction/` + info.id" class="btn btn-success btn-sm">
                采购
              </router-link>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>


  </div>
</template>

<script>
import { searchAttractions } from '../../api/attraction.js'
import MyPagination from '../../components/my-pagination.vue'

export default {
  components: {
    MyPagination
  },
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 5,
        pageTotal: 0
      },
      status: -1
    }
  },
  computed: {
    isAdmin () { return this.$store.getters.isAdmin }
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
    search: function () {
      var params = { 
        'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize,
        'sc.status': this.status
      }

      searchAttractions(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        () => {}
      )
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
