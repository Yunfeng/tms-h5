<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        月统计
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <label>账单日期</label>
          <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>

          <button type="button" class="btn btn-primary btn-sm ml-1" @click="searchStats($event.target)">统计</button>
        </form>
      </div>
    </div>
    <div class="card-body py-0 bg-info text-white text-center">
      账单（包括机票、退票、改签、服务、酒店、火车票）
    </div>

    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="profile-tab" data-bs-toggle="tab" href="#data-picture" >图形</a>
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane fade" id="data-list">
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th></th>
              <th>公司</th>
              <th class="text-right">账单数量</th>
              <th class="text-right">未付金额</th>
              <th class="text-right">未付占比</th>
              <th class="text-right">已付金额</th>
              <th class="text-right">总金额</th>
              <th class="text-right">总成本</th>
              <th class="text-right">总利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr>
                <td>              
                </td>
                <td>
                  <input type="text" size="8" v-model.trim="filter.vipName">
                </td>
                <td colspan="7"></td>
              </tr>
            <tr v-for="(info, index) in dataListFilter">
              <td class="text-right">{{index + 1}}</td>
              <td class="">
                  {{info.customer.name}}
                  <span class="small text-success" v-if="info.customer.customerCode !== ''">{{info.customer.customerCode}}</span>
              </td>
              <td class="text-right">{{info.count}}</td>
              <td class="text-right">{{info.unpaidTotalAmount}}</td>
              <td class="text-right">{{calcUnpaidPercent(info.unpaidTotalAmount, info.totalAmount)}}%</td>
              <td class="text-right">{{info.paidTotalAmount}}</td>
              <td class="text-right">{{info.totalAmount}}</td>
              <td class="text-right">{{info.totalCost}}</td>
              <td class="text-right">{{info.totalProfit}}</td>
            </tr>
            <tr v-if="count > 0">
              <td colspan="2">合计：</td>
              <td class="text-right">{{count}}</td>
              <td class="text-right">{{unpaidTotalAmount}}</td>
              <td class="text-right">{{calcUnpaidPercent(unpaidTotalAmount, totalAmount)}}%</td>
              <td class="text-right">{{paidTotalAmount}}</td>
              <td class="text-right">{{totalAmount}}</td>
              <td class="text-right">{{totalCost}}</td>
              <td class="text-right">{{totalProfit}}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="tab-pane fade show active text-center" id="data-picture">
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </div>
    </div>

  </div>
</template>

<script>
  import { searchMonthlyStats, searchDailyStats } from '../../api/report.js'
  import { today } from '../../common/common.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import VeLine from 'v-charts/lib/line'

  export default {
    components: {
      MyDatePicker,
      VeLine
    },
    data () {
      return {
        dataList: [],
        beginDate: '',
        endDate: '',

        count: 0,
        unpaidTotalAmount: 0,
        paidTotalAmount: 0,
        totalAmount: 0,
        totalCost: 0,
        totalProfit: 0,

        filter: {
          vipName: ''
        },

        chartSettings: {
          xAxisType: 'time'
        },
        chartData: {
          columns: ['日期', '金额'],
          rows: [
            { '日期': '2018-01-01', '金额': 1393 }
          ]
        }

      }
    },
    computed: {
      dataListFilter: function () {
        const self = this
        return this.dataList.filter(function (info) {
          // console.log(info)
          // console.log(self.filter)
          return (self.filter.vipName === '' || info.customer.name.indexOf(self.filter.vipName) >= 0 || info.customer.customerCode.indexOf(self.filter.vipName) >= 0)
        })
      }
    },
    mounted: function () {
      this.endDate = today()
      this.beginDate = this.endDate.substr(0, 8) + '01'
      this.beginDate = '2019-01-01'
      this.chartData.rows.splice(0)
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      searchStats: function (obj) {
        // console.log(obj)
        if (this.beginDate === '' || this.endDate === '') return

        this.reset()

        const params = {
          'beginDate': this.beginDate,
          'endDate': this.endDate
        }

        this.showLoading()

        searchMonthlyStats(params,
          v => {
            this.dataList = v
            for (const info of this.dataList) {
              this.count += info.count
              this.unpaidTotalAmount += info.unpaidTotalAmount
              this.paidTotalAmount += info.paidTotalAmount
              this.totalAmount += info.totalAmount
              this.totalCost += info.totalCost
              this.totalProfit += info.totalProfit
            }

            this.unpaidTotalAmount = Math.round(this.unpaidTotalAmount * 100) / 100
            this.paidTotalAmount = Math.round(this.paidTotalAmount * 100) / 100
            this.totalAmount = Math.round(this.totalAmount * 100) / 100
            this.totalCost = Math.round(this.totalCost * 100) / 100
            this.totalProfit = Math.round(this.totalProfit * 100) / 100
          },
          () => { this.hideLoading() }
        )

        searchDailyStats(params, v => {
          this.chartData.rows.splice(0)
          for (const info of v) {
            // { '日期': '2018-01-01', '金额': 1393, '成本': 1093, '利润': 0.32 }
            this.chartData.rows.push({
              '日期': info.opDate, 
              '金额': info.totalAmount,
              '成本': info.totalCost,
              '利润': info.totalProfit,
            })
          }

        })
      },
      reset: function () {
        this.count = 0
        this.unpaidTotalAmount = 0
        this.paidTotalAmount = 0
        this.totalAmount = 0
        this.totalCost = 0
        this.totalProfit = 0

        this.filter.vipName = ''
      },
      calcUnpaidPercent: function (unpaidAmount, amount) {
        // console.log(unpaidAmount + ', ' + amount)
        if (amount === 0) {
          return 0
        } else {
          return Math.round(unpaidAmount / amount * 100)
        }
      }
    }
  }
</script>