<template>
  <div id="newFlightTicket" >
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/bills">账单</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/flt/tickets">机票</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="float-right" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <div class="card">
      <div class="card-body">
        <div class="row mb-2">
          <label>编码内容</label>
          <textarea class="form-control" rows="6" v-model.trim="pnrDetail"></textarea>
          <button type="button" class="btn btn-primary" @click.stop="processPnrDetail()">分析编码内容</button>
          <button type="button" class="btn btn-info  btn-sm float-right" @click.stop="inputPnr()">手工录入</button>
        </div>
      </div>
    </div>
    <template v-if="pnr !== null">
      <div class="card">
        <div class="card-header">航班内容</div>
        <table id="fltTable" class="table table-sm">
          <thead>
            <tr>
              <th>航班号</th>
              <th>起飞日期</th>
              <th>舱位</th>
              <th>出发机场</th>
              <th>航站楼</th>
              <th>到达机场</th>
              <th>航站楼</th>
              <th>起飞时间</th>
              <th>到达时间</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(info, index) in pnr.flights">
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.flightNo" />
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.departureDate"/>
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.subclass" />
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.departureAirport" />
                </td>
                <td>  
                  <input type="text" class="form-control" v-model.trim="info.flight.departureTerminal" />
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.arrivalAirport" />
                </td>
                <td>  
                  <input type="text" class="form-control" v-model.trim="info.flight.arrivalTerminal" />
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.departureTime" />
                </td>
                <td>
                  <input type="text" class="form-control" v-model.trim="info.flight.arrivalTime" />
                </td>
                <td>
                  <a href="javascript:void(0)" @click.stop="deletePnrFlt(index)"  class="btn btn-sm btn-danger">删除</a>
                </td>
            </tr>  
            <tr v-if="inputMode === 1" class="bg-warning">
              <td  colspan="10">
                航段
                <select v-model.number="quickInputIndex">
                  <option value="0">1</option>
                  <option value="1">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                快速输入
                <input type="text" size="100" placeholder="示例： SHAPEK/MU456/Y/2017-12-31" v-model.trim="quickInput" />
              </td>
            </tr>                              
          </tbody>
        </table>
        <div class="card-footer">        
          <span>
            <a href="javascript:void(0)" @click.stop="addPnrFlt()" class="btn btn-sm btn-success">增加航段</a>
          </span>
        </div>
      </div>
      <div class="card">
          <div class="card-header">票号信息</div>                    
          <table id="psgTable" class="table table-sm">
              <thead>
                <tr>
                  <th>票号</th>
                  <th>姓名</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(info, index) in pnr.tickets">
                    <td>
                        <input type="text" class="form-control" placeholder="票号" v-model.trim="info.ticketNo" />
                    </td>
                    <td>
                      <input type="text" class="form-control" v-model.trim="info.psgName" />
                    </td>
                    <td>
                      <a href="javascript:void(0)" title="删除当前票号" @click.stop="deletePnrTicket(index)"  class="btn btn-sm btn-danger">删除</a>
                    </td>  
                  </tr>
                  
              </tbody>
              </table>
          
          <div class="card-footer">        
              <span><a href="javascript:void(0)" @click.stop="addPnrTicket()" class="btn btn-sm btn-success">增加票号</a></span>
          </div>
      </div>
      <div class="card">
          <div class="card-header">结算信息</div>
          <div class="card-body">
            <!-- <my-price-input :ticketCount.sync="ticketCount" :price.sync="price" :parvalue.sync="parvalue" :tax.sync="tax" :insurance.sync="insurance" :serviceCharge.sync="serviceCharge" :commRate.sync="commRate" :commission.sync="commission" :discountRate.sync="discountRate" :discount.sync="discount" :amount.sync="amount" :totalAmount.sync="totalAmount" :profit.sync="profit" :totalProfit.sync="totalProfit" :bottomPrice.sync="bottomPrice"></my-price-input> -->
            <my-price-input v-bind.sync="priceInfo"></my-price-input>
            <div class=" row">
              <label class="col-2 control-label text-right">保存方式</label>
              <div class="col-10">
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="0" v-model.number="saveMode">单张账单
                  </label>
                  <label class="form-check-label">
                      <input type="radio" class="form-check-input" value="1" v-model.number="saveMode">多张账单
                  </label>                            
              </div>
            </div>
          </div>
      </div>
      <div class="card">
          <div class="card-header">客户信息</div>
          <div class="card-body">
            <div class=" row">
              <label class="col-2 control-label">客户</label>
              <div class="col-10">
                <select class="form-control" v-model.number="customerId">
                    <template v-for="info in customers">
                        <option :value="info.id">{{info.name}}</option>
                    </template>
                </select>
              </div>
            </div>
          </div>
      </div>
      <div class="card">
          <div class="card-header">备注</div>
          <div class="card-body">
            <div class=" row">
              <label class="col-2 control-label text-right">供应商</label>
              <div class="col-10">
                <select class="form-control" v-model.number="supplierId">
                  <option value="0">无</option>
                    <template v-for="info in suppliers">
                        <option :value="info.id">{{info.name}}</option>
                    </template>
                </select>
              </div>
            </div>
            <div class=" row">
              <label class="col-2 control-label text-right">出票备注</label>
              <div class="col-10">
                  <input type="text" class="form-control" v-model.trim="etdzMemo">
                  <span class="help-text">出票地、出票方式等内容</span>
              </div>
            </div>
            <div class=" row">
              <label class="col-2 control-label text-right">支付方式</label>
              <div class="col-10">
                <select class="form-control" v-model.number="paymentMethodId">
                  <option value="0">无</option>
                    <template v-for="info in paymentMethods">
                        <option :value="info.id">{{info.name}}</option>
                    </template>
                </select>
              </div>
            </div>
            <div class=" row">
              <label class="col-2 control-label text-right">付款备注</label>
              <div class="col-10">
                  <input type="text" class="form-control" v-model.trim="payMemo">
                  <span class="help-text">付款方式，付款金额等等内容</span>
              </div>
            </div>

          </div>
      </div>
      <button type="button" class="btn btn-lg btn-primary btn-block mt-2 mb-2" @click.stop="save()">保存</button>
    </template>
  </div>	
</template>

<script>
  import { processPnrDetail, searchFlightFixedCommission, searchCustomers, createFlightBill } from '@/api/user.js'
  import { searchSuppliers, searchPaymentMethods } from '@/api/basic-data.js'
  import MyPriceInput from '@/components/flight-price-input.vue'

  export default {
    components: {
      MyPriceInput
    },
    data () {
      return {
        pnrDetail: '',
        pnr: null,

        customers: [],
        suppliers: [],
        paymentMethods: [],

        customerId: 0,
        supplierId: 0,
        paymentMethodId: 0,

        priceInfo: {
          ticketCount: 1,
          price: 0,
          parvalue: 0,
          tax: 0,
          insurance: 0,
          serviceCharge: 0,
          commRate: 0,
          commission: 0,
          discountRate: 0,
          discount: 0,
          amount: 0,
          totalAmount: 0,
          profit: 0,
          totalProfit: 0,
          bottomPrice: 0
        },

        etdzMemo: '',
        payMemo: '',
        saveMode: 0,

        inputMode: 0,
        quickInput: '',
        quickInputIndex: 0
      }
    },
    watch: {
      saveMode: function (newValue) {
        if (newValue === 1) {
          this.priceInfo.ticketCount = 1
        } else {
          this.priceInfo.ticketCount = this.pnr.tickets.length
        }
      },
      quickInput: function (newVal, oldVal) {
        this.processQuickInput()
      }
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      processPnrDetail: function () {
        if (this.pnrDetail.length === 0) {
          this.showErrMsg('编码内容不能为空')
          return
        }
        const params = { 'pnrDetail': this.pnrDetail }

        processPnrDetail(params,
          (jsonResult) => {
            this.inputMode = 0
            this.pnr = jsonResult
            this.priceInfo.price = this.pnr.price
            this.priceInfo.parvalue = this.pnr.parvalue
            this.priceInfo.tax = this.pnr.tax
            this.priceInfo.ticketCount = this.pnr.tickets.length

            this.searchFixedCommission()
            this.searchCustomer()
            this.searchSupplier()
            this.searchPaymentMethods()
          }
        )
      },
      deletePnrTicket: function (index) {
        this.pnr.tickets.splice(index, 1)
      },
      deletePnrPsg: function (index) {
        this.pnr.passengers.splice(index, 1)
      },
      deletePnrFlt: function (index) {
        this.pnr.flights.splice(index, 1)
      },
      inputPnr: function () {
        this.inputMode = 1
        this.pnr = {
          flights: [],
          tickets: [],
          price: 0,
          parvalue: 0,
          tax: 0
        }
        this.addPnrFlt()
        this.addPnrTicket()

        this.searchCustomer()
        this.searchSupplier()
        this.searchPaymentMethods()
      },
      addPnrFlt: function () {
        this.pnr.flights.push({
          'flight': {
            'flightNo': '',
            'departureDate': '',
            'subclass': '',
            'departureAirport': '',
            'departureTerminal': '',
            'arrivalAirport': '',
            'arrivalTerminal': '',
            'departureTime': '',
            'arrivalTime': ''
          }
        })
      },
      addPnrTicket: function () {
        this.pnr.tickets.push({ 'ticketNo': '123', 'psgName': '321' })
      },
      searchFixedCommission: function () {
        if (this.pnr === null || this.pnr.flights === null || this.pnr.flights.length < 1) return

        var carrier = this.pnr.flights[0].flight.flightNo.substr(0, 2)
        var subclass = this.pnr.flights[0].flight.subclass

        searchFlightFixedCommission({ 'carrier': carrier, 'subclass': subclass },
          (jsonResult) => {
            this.commission = jsonResult
          }
        )
      },
      save: function () {
        // console.log(this.priceInfo)
        const params = {
          'customerId': this.customerId,
          'supplierId': this.supplierId,
          'paymentMethodId': this.paymentMethodId,
          'etdzMemo': this.etdzMemo,
          'payMemo': this.payMemo,
          'price': this.priceInfo.price,
          'parvalue': this.priceInfo.parvalue,
          'tax': this.priceInfo.tax,
          'insurance': this.priceInfo.insurance,
          'serviceCharge': this.priceInfo.serviceCharge,
          'commRate': this.priceInfo.commRate,
          'commission': this.priceInfo.commission,
          'discountRate': this.priceInfo.discountRate,
          'discount': this.priceInfo.discount,
          'amount': this.priceInfo.amount,
          'totalAmount': this.priceInfo.totalAmount,
          'profit': this.priceInfo.profit,
          'totalProfit': this.priceInfo.totalProfit,
          'flights': this.pnr.flights,
          'tickets': this.pnr.tickets,
          'saveMode': this.saveMode
        }

        // console.log(params)

        var str = JSON.stringify(params)

        createFlightBill(str, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg('失败：' + jsonResult.errmsg)
          } else {
            this.showErrMsg('保存成功')
            this.reset()
          }
        })
      },
      searchCustomer: function () {
        searchCustomers(null, (jsonResult) => {
          this.customers = jsonResult.dataList
        })
      },
      searchSupplier: function () {
        searchSuppliers(null, (jsonResult) => {
          this.suppliers = jsonResult.dataList
        })
      },
      searchPaymentMethods: function () {
        searchPaymentMethods(null, (jsonResult) => {
          this.paymentMethods = jsonResult.dataList
        })
      },
      reset: function () {
        // body...
        this.pnrDetail = ''
        this.pnr = null

        this.customerId = 0
        this.supplierId = 0
        this.paymentMethodId = 0

        this.priceInfo.ticketCount = 0
        this.priceInfo.price = 0
        this.priceInfo.parvalue = 0
        this.priceInfo.tax = 0
        this.priceInfo.insurance = 0
        this.priceInfo.serviceCharge = 0
        this.priceInfo.commRate = 0
        this.priceInfo.commission = 0
        this.priceInfo.discountRate = 0
        this.priceInfo.discount = 0
        this.priceInfo.amount = 0
        this.priceInfo.totalAmount = 0
        this.priceInfo.profit = 0
        this.priceInfo.totalProfit = 0

        this.etdzMemo = ''
      },
      processQuickInput: function () {
        if (this.flightCount < 1 || this.quickInputIndex < 0 || this.quickInputIndex >= this.flightCount) {
          return
        }
        if (this.quickInput.length < 6) {
          return
        }
        const items = this.quickInput.split('/')
        console.log(items)
        if (items.length > 0) {
          const item = items[0].toUpperCase()
          if (item.length === 6) {
            this.pnr.flights[this.quickInputIndex].flight.departureAirport = item.substr(0, 3)
            this.pnr.flights[this.quickInputIndex].flight.arrivalAirport = item.substr(3, 6)
          }
        }

        if (items.length > 1) {
          const item = items[1].toUpperCase()
          this.pnr.flights[this.quickInputIndex].flight.flightNo = item
        }
        if (items.length > 2) {
          const item = items[2].toUpperCase()
          this.pnr.flights[this.quickInputIndex].flight.subclass = item
        }
        if (items.length > 3) {
          const item = items[3].toUpperCase()
          this.pnr.flights[this.quickInputIndex].flight.departureDate = item
        }
      }
    }
  }
</script>