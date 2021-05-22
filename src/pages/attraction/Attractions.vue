<template>
	<div id="attractions">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/attractions'>景点</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">列表</li>
        <li class="breadcrumb-item ml-auto"><router-link to='/attractions/ticket/orders'>门票订单</router-link></li>
      </ol>
    </nav>
    <template v-for="(info, index) in dataList">
      <div class="media mb-3">
        <img class="d-flex mr-3 rounded-circle" src="" alt="图片" height="64">
        <div class="media-body">
            <h5 class="mt-0">{{info.name}}</h5>
            <dl class="row mb-2">
              <dt class="col-sm-3">地址</dt>
              <dd class="col-sm-9">{{info.address}}</dd>

              <dt class="col-sm-3">开放时间</dt>
              <dd class="col-sm-9">
                {{info.openTime}}
              </dd>
              <dt class="col-sm-3">状态</dt>
              <dd class="col-sm-9">
                <span class="text-success" v-if="info.status === 1">正常</span>
                <span class="text-danger" v-else>停用</span>
              </dd>
            </dl>
            <router-link :to="`/attraction/` + info.id" class="btn btn-success btn-sm float-right">
                采购
              </router-link>
        </div>
      </div>
    </template>

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
