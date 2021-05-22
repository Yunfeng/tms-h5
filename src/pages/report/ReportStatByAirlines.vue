<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        航空公司统计
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <label>日期</label>
          <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>

          <button type="button" class="btn btn-primary btn-sm ml-1" @click.stop="searchStats()">统计</button>
        </form>
      </div>
    </div>
    <div class="card-body py-0 bg-info text-warning text-center">
      机票
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
              <th>航司</th>
              <th class="text-right">机票数量</th>
              <th class="text-right">总金额</th>
              <th class="text-right">总成本</th>
              <th class="text-right">总利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-for="(info, index) in dataList">
              <td class="text-right">{{index + 1}}</td>
              <td class="">
                {{info.carrier}}
              </td>
              <td class="text-right">{{info.count}}</td>
              <td class="text-right">{{info.totalAmount}}</td>
              <td class="text-right">{{info.totalCost}}</td>
              <td class="text-right">{{info.totalProfit}}</td>
            </tr>
            <tr v-if="count > 0">
              <td colspan="2">合计：</td>
              <td class="text-right">{{count}}</td>
              <td class="text-right">{{totalAmount}}</td>
              <td class="text-right">{{totalCost}}</td>
              <td class="text-right">{{totalProfit}}</td>
            </tr>
          </tbody>
        </table>        
      </div>
      <div class="tab-pane fade show active" id="data-picture">
        <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
      </div>
    </div>

  </div>
</template>

<script>
  import { searchAirlinesStats } from '../../api/report.js'
  import { today } from '../../common/common.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import VePie from 'v-charts/lib/pie'

  export default {
    components: {
      MyDatePicker,
      VePie
    },
    data () {
      return {
        dataList: [],
        beginDate: '',
        endDate: '',
        count: 0,
        totalAmount: 0,
        totalCost: 0,
        totalProfit: 0,
        chartSettings: {
          limitShowNum: 5
        },
        chartData: {
          columns: ['航司', '机票数量'],
          rows: [
            { '日期': '1月1日', '销售量': 123 },
            { '日期': '1月2日', '销售量': 1223 },
            { '日期': '1月3日', '销售量': 2123 },
            { '日期': '1月4日', '销售量': 4123 },
            { '日期': '1月5日', '销售量': 3123 },
            { '日期': '1月6日', '销售量': 7123 }
          ]
        }
      }
    },
    mounted: function () {
      this.endDate = today()
      this.beginDate = this.endDate.substr(0, 8) + '01'
      // this.beginDate = '2019-01-01'
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

        searchAirlinesStats(params,
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

            this.fillPie()    
          },
          () => { this.hideLoading() }
        )
      },
      fillPie: function () {
        this.chartData.rows.splice(0)
        for (const info of this.dataList) {
          this.chartData.rows.push({'航司': info.carrier, '机票数量': info.count})
        }
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