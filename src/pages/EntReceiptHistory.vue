<template>
  <div id="flight-order-history">
    <div class="card">
      <div class="card-header bg-info text-white">
        <span class="float-right" @click.stop="back()">返回</span>
        收款单日志
      </div>
      <table class="table table-sm table-striped table-hover small">
          <tr>
              <td>操作人</td>
              <td class="text-right">增加(+)</td>
              <td class="text-right">减少(-)</td>
              <td class="text-right">余额</td>
              <td>内容</td>
              <td>时间</td>
          </tr>
          <tbody>
          <tr v-for="info in histories">
              <td>{{info.operator}}</td>
              <td class="text-right">{{info.credit}}</td>
              <td class="text-right">{{info.debt}}</td>
              <td class="text-right">{{info.balance}}</td>
              <td>{{info.remark}}</td>
              <td>{{info.createTime}}</td>
          </tr>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { searchReceiptHistory } from '../api/receipt.js'

  export default {
    data () {
      return {
        id: 0,
        histories: []
      }
    },
    mounted: function () {
      this.id = this.$route.params.id
      this.viewHistory()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      viewHistory: function () {
        searchReceiptHistory(this.id,
          (jsonResult) => { this.histories = jsonResult }
        )
      }
    }
  }
</script>