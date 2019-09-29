<template>
	<div id="new-charter-flight-order" >
    <div class="card">
      <div class="card-header bg-info text-white">
          新建包机订单
          <span class="float-right" @click.stop="back()">返回</span>
      </div>
    </div>
    <div class="card">
      <div class="card-header text-center">航班内容</div>
      <table id="fltTable" class="table table-sm">
        <thead>
          <tr>
            <th>航班号</th>
            <th>起飞日期</th>
            <th>舱位</th>
            <th>出发机场</th>
            <th>到达机场</th>
            <th>起飞时间</th>
            <th>到达时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in flights">
            <tr>
              <td>
                <input type="text" class="form-control" maxlength="10" placeholder="航班号" v-model.trim="info.flight.flightNo" /></td>
              <td>
                <input type="text" class="form-control" maxlength="15" placeholder="起飞日期" v-model.trim="info.flight.departureDate" /></td>
              <td>
                <input type="text" class="form-control" maxlength="2" placeholder="舱位" v-model.trim="info.flight.subclass" /></td>
              <td>
                <input type="text" class="form-control" maxlength="3" placeholder="出发机场" v-model.trim="info.flight.departureAirport" size="10" /></td>
              <td>
                <input type="text" class="form-control" maxlength="3" placeholder="到达机场" v-model.trim="info.flight.arrivalAirport" size="10" /></td>
              <td>
                <input type="text" class="form-control" placeholder="起飞时间"  v-model.trim="info.flight.departureTime" size="10" /></td>
              <td>
                <input type="text" class="form-control" placeholder="到达时间"  v-model.trim="info.flight.arrivalTime" size="10" /></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header text-center">乘机人信息</div>                  
      <table class="table table-sm">
        <thead>
        <tr>
            <th>姓名</th>
            <th>证件号</th>
            <th>证件类型</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in passengers">
            <tr>
              <td>
                <input type="text" class="form-control" placeholder="乘机人姓名" v-model.trim="info.psgName"/>
              </td>
              <td>
                  <input type="text" class="form-control" placeholder="证件号" v-model.trim="info.idNo" />
              </td>
              <td>
                  <select class="form-control" v-model.number="info.idType">
                    <option value="1">身份证</option>
                    <option value="2">护照</option>
                    <option value="99">其它</option>
                  </select>
              </td>
              <td>
                <a href="javascript:void(0)" @click.stop="deletePsg(index)"  class="btn btn-sm btn-danger float-right">删除</a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card-footer">        
        <span>
          <a href="javascript:void(0);" @click.stop="addPsg()" class="btn btn-sm btn-success">增加乘机人</a>
        </span>
      </div>
    </div>
    <div class="card">
        <div class="card-header text-center">结算信息</div>
        <div class="card-body">
          <table class="table table-sm">
            <tr>
              <td>票面价</td>
              <td>销售价</td>
              <td>税</td>
              <td>保险费</td>
              <td>服务费</td>
            </tr>
            <tr>
              <td><input type="text" class="form-control" v-model.number="price"></td>
              <td><input type="text" class="form-control" v-model.number="parvalue"></td>
              <td><input type="text" class="form-control" v-model.number="tax"></td>
              <td><input type="text" class="form-control" v-model.number="insurance"></td>
              <td><input type="text" class="form-control" v-model.number="serviceCharge"></td>
            </tr>
            <tr>
              <td>代理费率</td>
              <td>代理费金额</td>
              <td>客户让扣</td>
              <td>客户让利金额</td>
              <td></td>
            </tr>
            <tr>
              <td><input type="text" class="form-control" v-model.number="commRate"></td>
              <td><input type="text" class="form-control" v-model.number="commission"></td>
              <td><input type="text" class="form-control" v-model.number="discountRate"></td>
              <td><input type="text" class="form-control" v-model.number="discount"></td>
              <td></td>
            </tr>
            <tr>
              <td>应付/张</td>
              <td>人数</td>
              <td>总计应付</td>
              <td>利润</td>
              <td></td>
            </tr>
            <tr>
              <td>{{amount}}</td>
              <td>{{psgCount}}</td>
              <td>
                {{totalAmount}}
              </td>
              <td>{{profit}}</td>
              <td></td>
            </tr>
          </table>
        </div>
    </div>
    <div class="card">
        <div class="card-header">客户及付款信息</div>
        <div class="card-body">
          <div class="form-group row">
            <label class="col-2 control-label text-right">客户</label>
            <div class="col-10">
              <select class="form-control" v-model.number="customerId">
                <option value="0">散客</option>
                <template v-for="info in customers">
                  <option :value="info.id">{{info.name}}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 control-label text-right">付款方式</label>
            <div class="col-10">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="1" v-model.number="payType">现金
              </label>
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="2" v-model.number="payType">信用卡
              </label>
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="4" v-model.number="payType">支票
              </label>
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="8" v-model.number="payType">账单
              </label>
            </div>
          </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header">行程单/发票</div>
        <div class="card-body">
          <div class="form-group row">
            <label class="col-2 control-label text-right">是否需要行程单或发票?</label>
            <div class="col-10">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="0" v-model.number="itineraryType">不
              </label>
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="1" v-model.number="itineraryType">行程单
              </label>
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" value="2" v-model.number="itineraryType">发票
              </label>
            </div>
          </div>
        </div>
        <div class="form-group row" v-if="itineraryType > 0">
          <label class="col-2 control-label text-right">邮寄地址</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="itineraryMailingAddress">
          </div>
        </div>
        <div class="form-group row" v-if="itineraryType > 0">
          <label class="col-2 control-label text-right">备注</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="itineraryMailingMemo">
          </div>
        </div>
    </div>
    <div class="card">
      <div class="card-header">其它</div>
      <div class="card-body">
        <div class="form-group row">
          <label class="col-2 control-label text-right">时限</label>
          <div class="col-4">
          <my-date-picker id="etdzDate" v-model.trim="etdzDate"></my-date-picker>
            <div class="help-box">确认开票的时限</div>
          </div>       
          <div class="col-4">
            <input type="text" class="form-control" v-model.trim="etdzTime" placeholder="时间格式：2330">
            <div class="help-box small">时间部分格式：HHmm, 例如：2330</div>
          </div>         
        </div>
        <div class="form-group row">
          <label class="col-2 control-label text-right">备注</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="memo">
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-primary btn-block ml-2" @click.stop.prevent="createFlightOrder()">创建订单</button>  
  </div>
</template>

<script>
  import { searchFlightFixedCommission } from '../api/user.js'
  import { searchCustomers } from '../api/customer.js'
  import { createFlightOrder } from '../api/flight.js'
  import { searchCharterFlightDetail } from '../api/charter-flight.js'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        charterId: 0,
        charterFlightDetail: null,
        flights: [],
        passengers: [],

        customerId: 0,

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
        memo: '',
        etdzDate: '',
        etdzTime: '',
        payType: 8,
        itineraryType: 0,
        itineraryMailingAddress: '',
        itineraryMailingMemo: '',

        customers: []
      }
    },
    watch: {
      parvalue: function () {
        this.calc()
      },
      tax: function () {
        this.calc()
      },
      insurance: function () {
        this.calc()
      },
      serviceCharge: function () {
        this.calc()
      },
      discount: function () {
        this.calc()
      },
      commission: function () {
        this.calc()
      },
      commRate: function () {
        this.calc()
      },
      discountRate: function () {
        this.calc()
      }
    },
    computed: {
      psgCount: function () {
        if (this.pnr !== null) {
          return this.passengers.length
        } else {
          return 0
        }
      }
    },
    mounted: function () {
      const id = this.$route.query.charterId
      if (id !== undefined) {
        this.charterId = parseInt(id)
        this.searchCharterFlightDetail(this.charterId)
      }
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchCharterFlightDetail: function (id) {
        searchCharterFlightDetail(id,
          (jsonResult) => {
            this.charterFlightDetail = jsonResult
            this.flights = jsonResult.details
            this.addPsg()

            this.price = jsonResult.salePrice
            this.parvalue = jsonResult.salePrice
          }
        )
      },
      createFlightOrder: function () {
        var params = {
          'charterFlightId': this.charterId,
          'customerId': this.customerId,
          'payType': this.payType,
          'price': this.price,
          'parvalue': this.parvalue,
          'tax': this.tax,
          'insurance': this.insurance,
          'serviceCharge': this.serviceCharge,
          'commRate': this.commRate,
          'commission': this.commission,
          'discountRate': this.discountRate,
          'discount': this.discount,
          'amount': this.amount,
          'totalAmount': this.totalAmount,
          'profit': this.profit,
          'etdzDate': this.etdzDate,
          'etdzTime': this.etdzTime,
          'itineraryType': this.itineraryType,
          'itineraryMailingAddress': this.itineraryMailingAddress,
          'itineraryMailingMemo': this.itineraryMailingMemo,
          'flights': this.flights,
          'passengers': this.passengers
        }

        var jsonParams = JSON.stringify(params)

        createFlightOrder(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              this.pnr = null
              this.pnrDetail = ''
              this.$router.push('/flt/order/' + jsonResult.returnCode)
            }
          }
        )
      },
      deletePsg: function (index) {
        this.passengers.splice(index, 1)
      },
      addPsg: function () {
        this.passengers.push({ 'psgName': '', 'idNo': '', 'idType': '' })
      },
      calc: function () {
        if (this.commRate > 0) {
          this.commission = this.parvalue * this.commRate / 100
        }
        if (this.discountRate > 0) {
          this.discount = this.parvalue * this.discountRate / 100
        }

        this.amount = this.parvalue + this.tax + this.insurance + this.serviceCharge - this.discount
        this.totalAmount = this.amount * this.psgCount
        this.profit = (this.commission + this.serviceCharge - this.discount) * this.psgCount
      },
      searchFixedCommission: function () {
        if (this.pnr === null || this.pnr.flights === null || this.pnr.flights.length < 1) return

        const carrier = this.pnr.flights[0].flight.flightNo.substr(0, 2)
        const subclass = this.pnr.flights[0].flight.subclass

        const params = {
          'carrier': carrier,
          'subclass': subclass
        }

        searchFlightFixedCommission(params,
          (jsonResult) => {
            this.commission = jsonResult
          }
        )
      },
      reset: function () {
        // body...
        this.flight.splice(0)
        this.passengers.splice(0)

        this.customerId = 0
        this.ticketCount = 0

        this.price = 0
        this.parvalue = 0
        this.tax = 0
        this.insurance = 0
        this.serviceCharge = 0
        this.commRate = 0
        this.commission = 0
        this.discountRate = 0
        this.discount = 0
        this.etdzMemo = ''
        this.amount = 0
        this.totalAmount = 0
        this.profit = 0
        this.payType = 8
      },
      searchCustomer: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 500
        }

        searchCustomers(params, (jsonResult) => {
          this.customers = jsonResult.dataList
        })
      }
    }
  }

</script>