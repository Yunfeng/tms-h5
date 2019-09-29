<template>
  <div id="flightTickets">
    <div class="card">
      <div class="card-header bg-info text-white">
        月报
      </div>
      <div class="card-body py-1">
        <form class="form-inline">
          <label>日期</label>
          <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" sizing="sm"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" sizing="sm"></my-date-picker>
          <label>供应商</label>
          <select class="form-control" v-model.number="supplierId">
            <option value="0">所有</option>
            <template v-for="info in suppliers">
              <option :value="info.id">{{info.name}}</option>
            </template>
          </select>
          <div class="col-2">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>

          <button type="button" class="btn btn-primary btn-sm ml-1" @click.stop="searchTickets($event.target)">查找</button>
        </form>
      </div>
    </div>
    <nav class="nav nav-tabs" id="myTab" role="tablist">
      <a class="nav-item nav-link active" data-toggle="tab" href="#nav-flight">
        机票出票
        <template v-if="ticketCount > 0">
          <small class="text-success">({{ticketCount}}, {{totalTicketProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link" data-toggle="tab" href="#nav-change">
        机票改签
        <template v-if="changeCount > 0">
          <small class="text-success">({{changeCount}}, {{totalChangeProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link" data-toggle="tab" href="#nav-refund">
        退(废)票
        <template v-if="refundCount > 0">
          <small class="text-success">({{refundCount}}, {{totalRefundProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link" data-toggle="tab" href="#nav-vas">
        增值服务
        <template v-if="vasCount > 0">
          <small class="text-success">({{vasCount}}, {{totalVasProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link" data-toggle="tab" href="#nav-hotel">
        酒店
        <template v-if="hotelCount > 0">
          <small class="text-success">({{hotelCount}}, {{totalHotelProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link" data-toggle="tab" href="#nav-train">
        火车票
        <template v-if="trainCount > 0">
          <small class="text-success">({{trainCount}}, {{totalTrainProfit}})</small>
        </template>
      </a>
      <a class="nav-item nav-link">
        总利润：{{ totalProfit }}
      </a>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-flight">
        <div class="card-body py-0 bg-info text-warning text-center">
          机票出票（根据账单日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>出票日期</th>
              <th>票号</th>
              <th>乘机人</th>
              <th>公司</th>
              <th colspan="5" class="text-center bg-info">行程</th>
              <th>订票人</th>
              <th class="text-right">票面</th>
              <th class="text-right">税</th>
              <th class="text-right">代理费</th>
              <th class="text-right">服务费</th>
              <th class="text-right">让利</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="dataList.length > 10" class="bg-info text-white">
              <td colspan="16">小计：</td>
              <td class="text-right">{{totalTicketAmount}}</td>
              <td class="text-right">{{totalTicketCost}}</td>
              <td class="text-right">{{totalTicketProfit}}</td>
            </tr>
            <tr v-for="(info, index) in dataList">
              <td class="text-center">{{index + 1}}</td>
              <td >{{info.etdzDate}}</td>
              <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
              <td class="">{{info.passengerName}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>                
              </td>              
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.departureAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.arrivalAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.departureDate}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.flightNo}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.subclass}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td class="">{{info.op1}}</td>
              <td class="text-right">{{info.parvalue}}</td>
              <td class="text-right">{{info.tax}}</td>
              <td class="text-right">{{info.commission}}</td>
              <td class="text-right">{{info.serviceCharge}}</td>
              <td class="text-right">{{info.discount}}</td>
              <td class="text-right">{{info.accountRecv}}</td>
              <td class="text-right">{{info.cost}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="dataList.length > 0" class="bg-info text-white">
              <td colspan="16">小计：</td>
              <td class="text-right">{{totalTicketAmount}}</td>
              <td class="text-right">{{totalTicketCost}}</td>
              <td class="text-right">{{totalTicketProfit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tab-pane fade" id="nav-change">
        <div class="card-body py-0 bg-info text-warning text-center">
          改签（根据进入账单的日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>账单日期</th>
              <th>票号</th>
              <th>乘客</th>
              <th>公司</th>
              <th>类型</th>
              <th colspan="5" class="text-center bg-info">行程</th>
              <th>提交人</th>
              <th class="text-right">销售价</th>
              <th class="text-right">税</th>
              <th class="text-right">航司改签费</th>
              <th class="text-right">服务费</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>              
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="changes.length > 10" class="bg-info text-white">
              <td colspan="16">小计：</td>
              <td class="text-right">{{totalChangeAmount}}</td>
              <td class="text-right">{{totalChangeCost}}</td>
              <td class="text-right">{{totalChangeProfit}}</td>
            </tr>            
            <tr v-for="(info, index) in changes">
              <td class="text-right">{{index + 1}}</td>
              <td >{{info.opDate}}</td>
              <td >
                <u>{{info.balanceCode}}-{{info.ticketNo}}</u>
                <br />
                {{info.newTicketNo}}
              </td>
              <td class="">{{info.passengerName}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>
                
              </td>
              <td>{{info.reasonCodeDesc}}</td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.departureAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.arrivalAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.departureDate}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.flightNo}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.subclass}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td class="">{{info.op1}}</td>
              <td class="text-right">{{info.parvalue}}</td>
              <td class="text-right">{{info.tax}}</td>
              <td class="text-right">{{info.airChangeCharge}}</td>
              <td class="text-right">{{info.serviceCharge}}</td>
              <td class="text-right">{{info.airChangeCharge + info.serviceCharge}}</td>
              <td class="text-right">{{info.airChangeCharge}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="changes.length > 0" class="bg-info text-white">
              <td colspan="16">小计：</td>
              <td class="text-right">{{totalChangeAmount}}</td>
              <td class="text-right">{{totalChangeCost}}</td>
              <td class="text-right">{{totalChangeProfit}}</td>
            </tr>
          </tbody>
        </table>        
      </div>
      <div class="tab-pane fade" id="nav-refund">        
        <div class="card-body py-0 bg-info text-warning text-center">
          退废机票（根据进入账单的日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>账单日期</th>
              <th>票号</th>
              <th>乘客</th>
              <th>公司</th>
              <th>类型</th>
              <th colspan="5" class="text-center bg-info">行程</th>
              <th>提交人</th>
              <th class="text-right">原付金额</th>
              <th class="text-right">退票费</th>
              <th class="text-right">服务费</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="refunds.length > 10" class="bg-info text-white">
              <td colspan="15">小计：</td>
              <td class="text-right">{{totalRefundAmount}}</td>
              <td class="text-right">{{totalRefundCost}}</td>
              <td class="text-right">{{totalRefundProfit}}</td>
            </tr>            
            <tr v-for="(info, index) in refunds">
              <td class="text-right">{{index + 1}}</td>
              <td >{{info.opDate}}</td>
              <td >{{info.balanceCode}}-{{info.ticketNo}}</td>
              <td class="">{{info.passengerName}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>
                
              </td>
              <td>{{info.reasonCodeDesc}}</td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.departureAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    <small class="text-success">{{flt.arrivalAirport}}</small>
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.departureDate}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.flightNo}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td>
                  <template v-for="(flt, index) in info.flights">
                    {{flt.subclass}}
                    <template v-if="index < info.flights.length - 1 "><br/></template>
                  </template>
              </td>
              <td class="">{{info.op1}}</td>
              <td class="text-right">{{info.ticketAmount}}</td>
              <td class="text-right">{{info.airRefundCharge}}</td>
              <td class="text-right">{{info.serviceCharge}}</td>
              <td class="text-right">{{info.passengerRefundAmount}}</td>
              <td class="text-right">{{info.airlineRefundAmount}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="refunds.length > 0" class="bg-info text-white">
              <td colspan="15">小计：</td>
              <td class="text-right">{{totalRefundAmount}}</td>
              <td class="text-right">{{totalRefundCost}}</td>
              <td class="text-right">{{totalRefundProfit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tab-pane fade" id="nav-vas">        
        <div class="card-body py-0 bg-info text-warning text-center">
          保险、服务单等（根据进入账单的日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>账单日期</th>
              <th>产品名称</th>
              <th>公司</th>
              <th>提交人</th>
              <th>供应商</th>
              <th>支付方式</th>
              <th class="text-right">单价</th>
              <th class="text-right">数量</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="vasList.length > 10" class="bg-info text-white">
              <td colspan="9">小计：</td>
              <td class="text-right">{{totalVasAmount}}</td>
              <td class="text-right">{{totalVasCost}}</td>
              <td class="text-right">{{totalVasProfit}}</td>
            </tr>
            <tr v-for="(info, index) in vasList">
              <td class="text-right">{{index + 1}}</td>
              <td >{{info.opDate}}</td>
              <td >{{info.productName}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>
                
              </td>
              <td class="">{{info.op1}}</td>
              <td class="">{{info.supplier.name}}</td>
              <td class="">{{info.paymentMethod.name}}</td>
              <td class="text-right">{{info.price}}</td>
              <td class="text-right">{{info.count}}</td>
              <td class="text-right">{{info.total}}</td>
              <td class="text-right">{{info.cost}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="vasList.length > 0" class="bg-info text-white">
              <td colspan="9">小计：</td>
              <td class="text-right">{{totalVasAmount}}</td>
              <td class="text-right">{{totalVasCost}}</td>
              <td class="text-right">{{totalVasProfit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tab-pane fade" id="nav-hotel" >        
        <div class="card-body py-0 bg-info text-warning text-center">
          酒店（根据账单日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>账单日期</th>
              <th>酒店名称</th>
              <th>房型</th>
              <th>入住日期</th>
              <th>离店日期</th>
              <th>房间数</th>
              <th>公司</th>
              <th>提交人</th>
              <th>供应商</th>
              <th>支付方式</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="hotelList.length > 10" class="bg-info text-white">
              <td colspan="11">小计：</td>
              <td class="text-right">{{totalHotelAmount}}</td>
              <td class="text-right">{{totalHotelCost}}</td>
              <td class="text-right">{{totalHotelProfit}}</td>
            </tr>            
            <tr v-for="(info, index) in hotelList">
              <td class="text-right">{{index + 1}}</td>
              <td >{{info.opDate}}</td>
              <td >{{info.hotelName}}</td>
              <td >{{info.roomType}}</td>
              <td >{{info.ddate}}</td>
              <td >{{info.leaveDate}}</td>
              <td >{{info.roomCount}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>
                
              </td>
              <td class="">{{info.op1}}</td>
              <td class="">{{info.supplier.name}}</td>
              <td class="">{{info.paymentMethod.name}}</td>
              <td class="text-right">{{info.total}}</td>
              <td class="text-right">{{info.cost}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="hotelList.length > 0" class="bg-info text-white">
              <td colspan="11">小计：</td>
              <td class="text-right">{{totalHotelAmount}}</td>
              <td class="text-right">{{totalHotelCost}}</td>
              <td class="text-right">{{totalHotelProfit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tab-pane fade" id="nav-train" >        
        <div class="card-body py-0 bg-info text-warning text-center">
          火车票（根据账单日期查询）
        </div>
        <table class="table table-sm table-striped small">
          <thead>
            <tr>
              <th>序号</th>
              <th>账单日期</th>
              <th>班次</th>
              <th>出发</th>
              <th>到达</th>
              <th>日期</th>
              <th>等级</th>
              <th>公司</th>
              <th>提交人</th>
              <th>供应商</th>
              <th>支付方式</th>
              <th class="text-right">实收</th>
              <th class="text-right">成本</th>
              <th class="text-right">利润</th>
            </tr>                        
          </thead>
          <tbody>
            <tr v-if="trainList.length > 10" class="bg-info text-white">
              <td colspan="11">小计：</td>
              <td class="text-right">{{totalTrainAmount}}</td>
              <td class="text-right">{{totalTrainCost}}</td>
              <td class="text-right">{{totalTrainProfit}}</td>
            </tr>
            <tr v-for="(info, index) in trainList">
              <td class="text-right">{{index + 1}}</td>
              <td >{{info.opDate}}</td>
              <td >{{info.trainNo}}</td>
              <td >{{info.dcity}}</td>
              <td >{{info.acity}}</td>
              <td >{{info.ddate}}</td>
              <td >{{info.seatClass}}</td>
              <td class="">
                <template v-if="info.customerType === 0">散客</template>
                <template v-else-if="info.customer !== null">
                  {{info.customer.name}}({{info.customer.customerCode}})
                </template>
                
              </td>
              <td class="">{{info.op1}}</td>
              <td class="">{{info.supplier.name}}</td>
              <td class="">{{info.paymentMethod.name}}</td>
              <td class="text-right">{{info.total}}</td>
              <td class="text-right">{{info.cost}}</td>
              <td class="text-right">{{info.profit}}</td>
            </tr>
            <tr v-if="trainList.length > 0" class="bg-info text-white">
              <td colspan="11">小计：</td>
              <td class="text-right">{{totalTrainAmount}}</td>
              <td class="text-right">{{totalTrainCost}}</td>
              <td class="text-right">{{totalTrainProfit}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>    
  </div>
</template>

<script>
  import { searchMonthSaleReport, searchMonthRefundReport, searchMonthChangeReport, searchMonthVasReport, searchMonthHotelReport, searchMonthTrainReport } from '../../api/report.js'
  import { searchSuppliers } from '../../api/basic-data.js'
  import { today } from '../../common/common.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MySelectCustomer from '../../components/my-select2-customer.vue'

  export default {
    components: {
      MyDatePicker,
      MySelectCustomer
    },
    data () {
      return {
        dataList: [],
        refunds: [],
        changes: [],
        vasList: [],
        hotelList: [],
        trainList: [],

        suppliers: [],

        beginDate: '',
        endDate: '',
        supplierId: 0,
        customerId: -1,

        totalTicketAmount: 0,
        totalTicketCost: 0,
        totalTicketProfit: 0,
        ticketCount: 0,

        totalRefundAmount: 0,
        totalRefundCost: 0,
        totalRefundProfit: 0,
        refundCount: 0,

        totalChangeAmount: 0,
        totalChangeCost: 0,
        totalChangeProfit: 0,
        changeCount: 0,

        totalVasAmount: 0,
        totalVasCost: 0,
        totalVasProfit: 0,
        vasCount: 0,

        totalHotelAmount: 0,
        totalHotelCost: 0,
        totalHotelProfit: 0,
        hotelCount: 0,

        totalTrainAmount: 0,
        totalTrainCost: 0,
        totalTrainProfit: 0,
        trainCount: 0
      }
    },
    computed: {
      totalProfit: function () {
        const total = this.totalTicketProfit + this.totalRefundProfit + this.totalChangeProfit + this.totalVasProfit + this.totalHotelProfit + this.totalTrainProfit
        return Math.round(total * 100) / 100
      }
    },
    mounted: function () {
      this.endDate = today()
      this.beginDate = this.endDate.substr(0, 8) + '01'
      this.searchSuppliers()
    },
    methods: {
      searchTickets: function (obj) {
        this.dataList.splice(0)
        this.refunds.splice(0)
        this.changes.splice(0)
        this.vasList.splice(0)
        this.hotelList.splice(0)
        this.trainList.splice(0)
        // console.log(obj)
        if (this.beginDate === '' || this.endDate === '') return

        const params = {
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          'supplierId': this.supplierId,
          'customerId': this.customerId
        }

        searchMonthSaleReport(params, v => {
            this.dataList = v
            this.calcTicketTotal()
          }
        )

        searchMonthRefundReport(params, v => {
          this.refunds = v
          this.calcRefundTotal()
        })

        searchMonthChangeReport(params, v => {
          this.changes = v
          this.calcChangeTotal()
        })

        searchMonthVasReport(params, v => {
          this.vasList = v
          this.calcVasTotal()
        })

        searchMonthHotelReport(params, v => {
          this.hotelList = v
          this.calcHotelTotal()
        })

        searchMonthTrainReport(params, v => {
          this.trainList = v
          this.calcTrainTotal()
        })
      },
      calcTicketTotal: function () {
        this.totalTicketAmount = 0
        this.totalTicketCost = 0
        this.totalTicketProfit = 0
        this.ticketCount = 0

        for (const t of this.dataList) {
          this.totalTicketAmount += t.accountRecv
          this.totalTicketCost += t.cost
          this.totalTicketProfit += t.profit
          this.ticketCount++
        }

        this.totalTicketAmount = Math.round(this.totalTicketAmount * 100) / 100
        this.totalTicketCost = Math.round(this.totalTicketCost * 100) / 100
        this.totalTicketProfit = Math.round(this.totalTicketProfit * 100) / 100
      },
      calcRefundTotal: function () {
        this.totalRefundAmount = 0
        this.totalRefundCost = 0
        this.totalRefundProfit = 0
        this.refundCount = 0

        for (const t of this.refunds) {
          this.totalRefundAmount += t.passengerRefundAmount
          this.totalRefundCost += t.airlineRefundAmount
          this.totalRefundProfit += t.profit
          this.refundCount++
        }

        this.totalRefundAmount = Math.round(this.totalRefundAmount * 100) / 100
        this.totalRefundCost = Math.round(this.totalRefundCost * 100) / 100
        this.totalRefundProfit = Math.round(this.totalRefundProfit * 100) / 100
      },
      calcChangeTotal: function () {
        this.totalChangeAmount = 0
        this.totalChangeCost = 0
        this.totalChangeProfit = 0
        this.changeCount = 0

        for (const t of this.changes) {
          this.totalChangeAmount += t.airChangeCharge + t.serviceCharge
          this.totalChangeCost += t.airChangeCharge
          this.totalChangeProfit += t.profit
          this.changeCount++
        }

        this.totalChangeAmount = Math.round(this.totalChangeAmount * 100) / 100
        this.totalChangeCost = Math.round(this.totalChangeCost * 100) / 100
        this.totalChangeProfit = Math.round(this.totalChangeProfit * 100) / 100
      },
      calcVasTotal: function () {
        this.totalVasAmount = 0
        this.totalVasCost = 0
        this.totalVasProfit = 0
        this.vasCount = 0

        for (const t of this.vasList) {
          this.totalVasAmount += t.total
          this.totalVasCost += t.cost
          this.totalVasProfit += t.profit
          this.vasCount++
        }

        this.totalVasAmount = Math.round(this.totalVasAmount * 100) / 100
        this.totalVasCost = Math.round(this.totalVasCost * 100) / 100
        this.totalVasProfit = Math.round(this.totalVasProfit * 100) / 100
      },
      calcHotelTotal: function () {
        this.totalHotelAmount = 0
        this.totalHotelCost = 0
        this.totalHotelProfit = 0
        this.hotelCount = 0

        for (const t of this.hotelList) {
          this.totalHotelAmount += t.total
          this.totalHotelCost += t.cost
          this.totalHotelProfit += t.profit
          this.hotelCount++
        }

        this.totalHotelAmount = Math.round(this.totalHotelAmount * 100) / 100
        this.totalHotelCost = Math.round(this.totalHotelCost * 100) / 100
        this.totalHotelProfit = Math.round(this.totalHotelProfit * 100) / 100
      },      
      calcTrainTotal: function () {
        this.totalTrainAmount = 0
        this.totalTrainCost = 0
        this.totalTrainProfit = 0
        this.trainCount = 0

        for (const t of this.trainList) {
          this.totalTrainAmount += t.total
          this.totalTrainCost += t.cost
          this.totalTrainProfit += t.profit
          this.trainCount++
        }

        this.totalTrainAmount = Math.round(this.totalTrainAmount * 100) / 100
        this.totalTrainCost = Math.round(this.totalTrainCost * 100) / 100
        this.totalTrainProfit = Math.round(this.totalTrainProfit * 100) / 100
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
      }
    }
  }
</script>