<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        支付方式统计
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <label>出票日期</label>
          <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>

          <button type="button" class="btn btn-primary btn-sm ml-1" @click.stop="searchStats()">统计</button>
        </form>
      </div>
    </div>
    <div class="card-body py-0 bg-info text-warning text-center">
      机票
    </div>
    <table class="table table-sm table-striped small">
      <thead>
        <tr>
          <th></th>
          <th>支付方式</th>
          <th class="text-right">数量</th>
          <th class="text-right">总金额</th>
        </tr>                        
      </thead>
      <tbody>
        <tr v-for="(info, index) in dataList">
          <td class="text-right">{{index + 1}}</td>
          <td class="">
            <template v-if="info.paymentMethod !== null">{{info.paymentMethod.name}}</template>
          </td>
          <td class="text-right">{{info.count}}</td>
          <td class="text-right">{{info.totalAmount}}</td>
        </tr>
        <tr v-if="count > 0">
          <td colspan="2">合计：</td>
          <td class="text-right">{{count}}</td>
          <td class="text-right">{{totalAmount}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { searchPaymentMethodStats } from '../../api/report.js'
  import { today } from '../../common/common.js'
  import MyDatePicker from '../../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        dataList: [],
        beginDate: '',
        endDate: '',

        count: 0,
        totalAmount: 0
      }
    },
    mounted: function () {
      this.endDate = today()
      this.beginDate = this.endDate.substr(0, 8) + '01'
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      searchStats: function () {
        if (this.beginDate === '' || this.endDate === '') return
        this.count = 0
        this.totalAmount = 0

        const params = {
          'beginDate': this.beginDate,
          'endDate': this.endDate
        }

        this.showLoading()

        searchPaymentMethodStats(params,
          v => {
            this.dataList = v
            for (const info of this.dataList) {
              this.count += info.count
              this.totalAmount += info.totalAmount
            }
          },
          () => { this.hideLoading() }
        )
      }
    }
  }
</script>