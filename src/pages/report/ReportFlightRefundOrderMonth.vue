<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        退票报表
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <label>提交退票日期</label>
          <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>
          <label>供应商</label>
          <select class="form-control" v-model.number="supplierId">
            <option value="0">所有</option>
            <template v-for="info in suppliers">
              <option :value="info.id">{{info.name}}</option>
            </template>
          </select>

          <button type="button" class="btn btn-primary btn-sm ml-1" @click.stop="searchTickets($event.target)">查找</button>
        </form>
      </div>
    </div>
    <div class="card-body py-0 bg-info text-warning text-center">
      退票（根据退票单）
    </div>
    <table class="table table-sm table-striped small">
      <thead>  
        <tr>
                <th>票号</th>
                <th>退票单号</th>
                <th>订单号</th>
                <th>国际?</th>
                <th>公司名称</th>
                <th>乘客</th>
                <th colspan="5" class="bg-info text-center text-white">所退行程</th>
                <th>退票时间</th>
                <th>供应商</th>
                <th>支付方式</th>
                <th>状态</th>
                <th class="text-right">销售价</th>
                <th class="text-right">税</th>
                <th class="text-right">成本</th>
                <th class="text-right">实收</th>
                <th class="text-right">退票费</th>
                <th class="text-right">服务费</th>
                <th class="text-right">航司实退</th>
                <th class="text-right">实退客人</th>
                <th class="text-right">利润</th>
            </tr>                        
      </thead>
      <tbody>
        <tr v-for="(info, index) in dataList" v-bind:class="{'success text-white': info.bePaid === '1'}">
          <td>{{info.balanceCode}}-{{info.ticketNo}}</td>
          <td>{{info.refundOrderNo}}</td>
          <td>{{info.orderNo}}</td>
                <td>
                  <span class="text-danger" v-if="info.intlTicket === 1">国际</span>
                  <span v-else>国内</span>
                </td>
                <td>
                  <template v-if="info.customerType === 0">
                    散客
                  </template>
                  <template v-else-if="info.customer !== null">
                    {{info.customer.vipName}}
                  </template>
                </td>
                <td>{{info.psgName}}</td>
                <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.flight.departureAirport}}</small>
                    {{flt.flight.departureAirportName}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      <small class="text-success">{{flt.flight.arrivalAirport}}</small>
                      {{flt.flight.arrivalAirportName}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.flight.departureDate}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.flight.flightNo}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>
                    <template v-for="(flt, index) in info.flights">
                      {{flt.flight.subclass}}
                      <template v-if="index < info.flights.length - 1 "><br/></template>
                    </template>
                </td>
                <td>{{info.createTime}}</td>
                <td>{{info.supplier.name}}</td>
                <td>{{info.paymentMethod.name}}</td>
                <td>{{getStatus(info.status)}}</td>
                <td class="text-right">{{info.parvalue}}</td>
                <td class="text-right">{{info.tax}}</td>
                <td class="text-right">{{info.cost}}</td>
                <td class="text-right">{{info.ticketAmount}}</td>
                <td class="text-right">{{info.airRefundCharge}}</td>
                <td class="text-right">{{info.serviceCharge}}</td>
                <td class="text-right">{{info.airlineRefundAmount}}</td>
                <td class="text-right">{{info.passengerRefundAmount}}</td>
                <td class="text-right">{{info.profit}}</td>
            </tr>
        <tr v-if="dataList.length > 0" class="bg-info text-white">
          <td>小计：</td>
          <td colspan="20">{{ticketCount}} 张</td>
          <td class="text-right">{{totalAmount}}</td>
          <td class="text-right">{{totalCost}}</td>
          <td class="text-right">{{totalProfit}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { searchRefundOrderReport } from '../../api/report.js'
  import { searchSuppliers } from '../../api/basic-data.js'
  import { today } from '../../common/common.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import { showRefundOrderStatus } from '../../api/flight-refund.js'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        dataList: [],
        beginDate: '',
        endDate: '',
        ticketCount: 0,
        totalAmount: 0,
        totalCost: 0,
        totalProfit: 0,

        suppliers: [],
        supplierId: 0
      }
    },
    mounted: function () {
      this.endDate = today()
      this.beginDate = this.endDate.substr(0, 8) + '01'
      this.searchSuppliers()
    },
    methods: {
      searchTickets: function (obj) {
        console.log(obj)
        if (this.beginDate === '' || this.endDate === '') return

        const params = {
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          'supplierId': this.supplierId
        }

        searchRefundOrderReport(params,
          (jsonResult) => {
            this.dataList = jsonResult
            this.calcTotal()
          }
        )
      },
      calcTotal: function () {
        this.totalAmount = 0
        this.totalCost = 0
        this.totalProfit = 0

        for (const t of this.dataList) {
          this.totalAmount += t.airlineRefundAmount
          this.totalCost += t.passengerRefundAmount
          this.totalProfit += t.profit
        }

        this.ticketCount = this.dataList.length
      },
      searchSuppliers: function () {
        if (this.suppliers.length > 0) return
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 100
        }

        searchSuppliers(params,
          (jsonResult) => {
            this.suppliers = jsonResult.dataList
          }
        )
      },
      getStatus: function (status) {
        return showRefundOrderStatus(status)
      }
    }
  }
</script>