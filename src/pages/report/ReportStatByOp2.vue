<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        出票员统计
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
    <table class="table table-sm table-striped small">
      <thead>
        <tr>
          <th></th>
          <th>出票员</th>
          <th></th>
          <th class="text-right">数量</th>
          <th class="text-right">总金额</th>
          <th class="text-right">总成本</th>
          <th class="text-right">总利润</th>
        </tr>                        
      </thead>
      <tbody>
        <tr v-if="count > 0">
          <td colspan="3">合计：</td>
          <td class="text-right">{{count}}</td>
          <td class="text-right">{{totalAmount}}</td>
          <td class="text-right">{{totalCost}}</td>
          <td class="text-right">{{totalProfit}}</td>
        </tr>
        
        <template v-for="(info, index) in dataList">
          <tr>
            <td class="text-right">{{index + 1}}</td>
            <td class="">
              {{info.op2}}
            </td>
            <td></td>
            <td class="text-right">{{info.count}}</td>
            <td class="text-right">{{info.totalAmount}}</td>
            <td class="text-right">{{info.totalCost}}</td>
            <td class="text-right">{{info.totalProfit}}</td>
          </tr>
          <tr v-for="item in info.items">
            <td class="text-right"></td>
            <td class="">
              
            </td>
            <td>{{item.billTypeName}}</td>
            <td class="text-right">{{item.count}}</td>
            <td class="text-right">{{item.totalAmount}}</td>
            <td class="text-right">{{item.totalCost}}</td>
            <td class="text-right">{{item.totalProfit}}</td>
          </tr>
          
        </template>
        <tr v-if="count > 0">
          <td colspan="3">合计：</td>
          <td class="text-right">{{count}}</td>
          <td class="text-right">{{totalAmount}}</td>
          <td class="text-right">{{totalCost}}</td>
          <td class="text-right">{{totalProfit}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { searchOp2Stats } from '../../api/report.js'
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
        totalAmount: 0,
        totalCost: 0,
        totalProfit: 0
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

        this.reset()

        const params = {
          'beginDate': this.beginDate,
          'endDate': this.endDate
        }

        this.showLoading()

        searchOp2Stats(params, 
          v => {
            this.dataList = v
            for (const info of this.dataList) {
              this.count += info.count
              this.totalAmount += info.totalAmount
              this.totalCost += info.totalCost
              this.totalProfit += info.totalProfit
            }

            this.totalAmount = Math.round(this.totalAmount * 100) / 100
            this.totalCost = Math.round(this.totalCost * 100) / 100
            this.totalProfit = Math.round(this.totalProfit * 100) / 100
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.count = 0
        this.totalAmount = 0
        this.totalCost = 0
        this.totalProfit = 0
      }
    }
  }
</script>