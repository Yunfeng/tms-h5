<template>
  <div id="flight-order-history">
    <div class="card">
      <div class="card-header bg-info text-white">
        <span class="float-right" 
          @click.stop="back()">返回</span>
        机票订单操作记录
      </div>
      <table class="table table-sm table-striped small">
          <tr>
              <td>操作员</td>
              <td>内容</td>
              <td>时间</td>
          </tr>
          <tr v-for="info in histories" :key="info.id">
              <td>{{info.operator}}</td>
              <td>{{info.content}}</td>
              <td>{{info.createTime}}</td>
          </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { searchFlightOrderHistory } from '../../api/flight.js'

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
        searchFlightOrderHistory(this.id,
          (jsonResult) => { this.histories = jsonResult }
        )
      }
    }
  }
</script>