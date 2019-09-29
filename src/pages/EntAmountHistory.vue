<template>
  <div id="flight-order-history">
    <div class="card">
      <div class="card-header bg-info text-white">
        <span class="float-right" @click.stop="back()">返回</span>
        交易记录
      </div>
      <table class="table table-sm table-striped small">
          <tr>
              <th>时间</th>
              <th class="text-right">存入</th>
              <th class="text-right">支出</th>
              <th class="text-right">余额</th>
              <th>备注<span class="pull-right">单位: 元</span></th>
          </tr>
          <tbody>
          <tr v-for="info in histories">
              <td>{{info.createTime}}</td>
              <td class="text-right">
                {{info.credit/100}}
              </td>
              <td class="text-right">
                {{info.debt/100}}
              </td>
              <td class="text-right">{{info.accountBalance/100}}</td>
              <td>{{info.remark}}</td>
          </tr>
        </tbody>
      </table>

      <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>

    </div>
  </div>
</template>

<script>
  import { searchCustomerTrans } from '../api/bill.js'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    components: {
      MyPagination
    },
    data () {
      return {
        id: 0,
        histories: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        }        
      }
    },
    mounted: function () {
      this.id = this.$route.params.id
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        }
        searchCustomerTrans(this.id, params, v => {
          this.histories = v.dataList
          this.sc = v.page
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