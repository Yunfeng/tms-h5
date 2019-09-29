<template>
	<div id="newFlightOrder" >
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item"><router-link to='/flt/orders'>机票订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <div class="card" v-if="editing === false">
      <div class="card-body py-0">
        <div class="form-group">
          <textarea class="form-control" rows="12" v-model.trim="pnrDetail" placeholder="请将编码内容粘帖到此处"></textarea>
          <button type="button" class="btn btn-primary btn-sm mt-1" :disabled="btnDisabled" @click.stop="processPnrDetail();">导入编码内容</button>
          <button type="button" class="btn btn-info  btn-sm mt-1 float-right" @click.stop="inputPnr()">手工录入</button> 
        </div>
      </div>
    </div>
    <template v-if="pnr !== null && editing">
      <div class="card">
        <div class="card-body bg-info text-white py-1">行程信息
          <a href="javascript:void(0);" @click.stop="addPnrFlt()" class="btn btn-sm btn-success">增加航段</a>
        </div>
        <table class="table table-sm mb-0">
          <thead>
            <tr>
              <th scope="col" class="text-center">出发机场</th>
              <th scope="col" class="text-center">到达机场</th>
              <th scope="col" class="text-center">起飞日期</th>
              <th scope="col" class="text-center">航班号</th>
              <th scope="col" class="text-center">舱位</th>
              <th scope="col" class="text-center">起飞时间</th>
              <th scope="col" class="text-center">到达时间</th>
              <th scope="col" class="text-center">出发航站楼</th>
              <th scope="col" class="text-center">到达航站楼</th>
              <th scope="col" class=""></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(info, index) in pnr.flights">
              <flt-tr v-bind:flight="info.flight" v-bind:index="index" v-on:remove="deletePnrFlt(index)"></flt-tr>
            </template>
          </tbody>
          <tfoot v-if="inputMode === 1">
            <tr class="bg-secondary">
              <td colspan="10">
                <input type="text" class="form-control" placeholder="快速输入" v-model.trim="quickInput" />
                <span class="text-muted">
                  请sd后复制相应的航段信息，从第一个数字开始复制整行。示例如下：<br />
                  <pre>2.  ZH9502 Y   MO10JUN  PVGSZX HK1   1135 1420          E T2T3</pre>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="card-body bg-info text-white py-1">乘机人信息
          <a href="javascript:void(0);" @click.stop="addPnrPsg()" class="btn btn-sm btn-success">增加乘机人</a>
        </div>                  
        <table class="table table-sm">
          <thead>
          <tr class="small">
              <th></th>
              <th>姓名</th>
              <th>证件号</th>
              <th>证件类型</th>
              <th>常旅客号</th>
              <th>手机</th>
              <th></th>
          </tr>
          </thead>
          <tbody>
            <template v-for="(info, index) in pnr.passengers">
              <tr>
                <td>
                  <input type="checkbox" v-model="info.selected" />
                </td>
                <td>  
                  <input type="text" class="form-control form-control-sm" placeholder="乘机人姓名" v-model.trim="info.psgName"/>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm" placeholder="证件号" v-model.trim="info.idNo" />
                </td>
                <td>
                    <select class="form-control form-control-sm" v-model.number="info.idType" placeholder="证件类型">
                      <option value="1">身份证</option>
                      <option value="2">护照</option>
                      <option value="4">港澳通行证</option>
                      <option value="8">台胞证</option>  
                      <option value="99">其它</option>
                    </select>
                </td>
                <td><input type="text" class="form-control form-control-sm" placeholder="常旅客号" v-model.trim="info.ffpNo" /></td>
                <td><input type="text" class="form-control form-control-sm" placeholder="手机号" v-model.trim="info.mobile" /></td>
                <td>
                    <select class="form-control form-control-sm" v-model.number="info.psgType" placeholder="">
                      <option value="0">成人</option>
                      <option value="1">儿童</option>
                      <option value="2">婴儿</option>
                    </select>
                </td>
                <td>
                  <a href="javascript:void(0)" @click.stop="deletePnrPsg(index)"  class="btn btn-sm btn-danger float-right">删除</a>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7">
                <a href="javascript:void(0)" @click.stop="selectAllPsg()" class="btn btn-sm btn-success">全选</a>
                                
                <a href="javascript:void(0)" @click.stop="unselectAllPsg()" class="btn btn-sm btn-danger ml-3">全否</a>                
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="card-body bg-info text-white py-1">结算信息</div>
          <my-price-input psgTypeName="成人" v-bind.sync="adultPrice" key="adultPriceInput" v-if="adultCount > 0">
          </my-price-input>
          <my-price-input psgTypeName="儿童" v-bind.sync="childPrice" key="childPriceInput" v-if="childCount > 0">
          </my-price-input>  
          <my-price-input psgTypeName="婴儿" v-bind.sync="infantPrice" key="infantPriceInput" v-if="infantCount > 0">
          </my-price-input>  
        <table class="table bg-light">
          <tr>
            <td>总计</td>
            <td>人数：{{psgCount}}</td>
            <td>总应收：{{totalAmount}}</td>
            <td>总应付：{{totalCost}}</td>
            <td>利润：<span class="text-danger">{{totalProfit}}</span></td>
          </tr>
        </table>

        <div class="card-body bg-info text-white py-1">客户及付款信息</div>
        <div class="card-body py-2">
          <div class="form-group row" v-if="possibleCustomers.length > 0">
            <label class="col-2 control-label text-right text-warning">可能是:</label>
            <div class="col-8">
              <template v-for="name in possibleCustomers">
                <span class="text-primary">{{name}}</span>&nbsp;&nbsp;
              </template>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 control-label text-right">客户</label>
            <div class="col-8">
              <my-select-customer :minId="0" :customerId.sync="customerId"></my-select-customer>
            </div>
          </div>
          <div class="form-group row" v-if="costCenters.length > 0">
            <label class="col-2 control-label text-right">成本中心</label>
            <div class="col-8">
              <select class="form-control" v-model="costCenter">
                <option value="">请选择</option>
                <option :value="info.name" v-for="info in costCenters">{{info.name}}</option>
              </select>
            </div>
          </div>
          <div class="form-group row" v-if="projectNames.length > 0">
            <label class="col-2 control-label text-right">项目名称</label>
            <div class="col-8">
              <select class="form-control" v-model="projectName">
                <option value="">请选择</option>
                <option :value="info.name" v-for="info in projectNames">{{info.name}}</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 control-label text-right">付款方式</label>
            <div class="col-10">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="1" v-model.number="payType">
                <label class="form-check-label">现付（现金等）</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="8" v-model.number="payType">
                <label class="form-check-label">记账</label>
              </div>
            </div>

          </div>
          <div class="form-group row" v-if="payType === 1">
            <label class="col-2 control-label text-right">付款方式备注</label>
            <div class="col-8">
              <my-select-income :incomeRemark.sync="payRemark"></my-select-income>
            </div>
          </div>
        </div>

        <div class="card-body bg-info text-white py-1">行程单/发票</div>
        <div class="card-body py-0">
          <div class="form-group row mb-0">
            <label class="col-2 control-label text-right">是否需要行程单或发票?</label>
            <div class="col-10">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="0" v-model.number="itineraryType">
                <label class="form-check-label">不需要</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="1" v-model.number="itineraryType">
                <label class="form-check-label">行程单</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="2" v-model.number="itineraryType">
                <label class="form-check-label">发票</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="3" v-model.number="itineraryType">
                <label class="form-check-label">信息单</label>
              </div>
            </div>
          </div>
          <template v-if="itineraryType > 0">
            <div class="form-group row mb-1" >
              <label class="col-2 control-label text-right">派送日期</label>
              <div class="col-8">
                  <my-date-picker id="deliveryDate" v-model.trim="deliveryDate"></my-date-picker>
              </div>
            </div>
            <div class="form-group row mb-1">
              <label class="col-2 control-label text-right">邮寄地址</label>
              <div class="col-8">
                  <input type="text" class="form-control" v-model.trim="itineraryMailingAddress">
              </div>
            </div>
            <div class="form-group row mb-1">
              <label class="col-2 control-label text-right">收件人</label>
              <div class="col-8">
                  <input type="text" class="form-control" v-model.trim="itineraryRecipient">
              </div>
            </div>
            <div class="form-group row mb-1">
              <label class="col-2 control-label text-right">联系电话</label>
              <div class="col-8">
                  <input type="text" class="form-control" v-model.trim="itineraryRecipientMobile">
              </div>
            </div>
            <div class="form-group row mb-1">
              <label class="col-2 control-label text-right">备注</label>
              <div class="col-8">
                  <input type="text" class="form-control" v-model.trim="itineraryMailingMemo">
              </div>
            </div>
          </template>
        </div>

        <div class="card-body bg-info text-white py-1">订票人</div>
        <div class="card-body py-1">
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">姓名</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model.trim="linkman">
            </div>
          </div>
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">电话</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model.trim="linkPhone">
            </div>
          </div>
        </div>

        <div class="card-body bg-info text-white py-1">供应商及支出付款方式</div>
        <div class="card-body py-1">
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">供应商</label>
            <div class="col-8">
                <my-select-supplier :supplierId.sync="supplierId" :supplierType="supplierType"></my-select-supplier>
            </div>
          </div>
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">支出付款方式</label>
            <div class="col-8">
                <my-select-payment :paymentId.sync="paymentMethodId"></my-select-payment>
            </div>
          </div>
        </div>

        <div class="card-body bg-info text-white py-1">其它</div>
        <div class="card-body py-1">
          <div class="form-group row mb-0 mt-1">
            <label class="col-2 control-label text-right">时限</label>
            <div class="col-4">
            <my-date-picker id="etdzDate" v-model.trim="etdzDate"></my-date-picker>
              <div class="text-muted">可留空，用于提醒开票</div>
            </div>       
            <div class="col-4">
              <input type="text" class="form-control" v-model.trim="etdzTime" placeholder="时间格式：2330">
              <div class="text-muted">时间部分格式：HHmm, 例如：2330</div>
            </div>         
          </div>
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">备注</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model.trim="memo">
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">预订人</label>
            <div class="col-8">
                <my-select-op1 sizing="sm" :username.sync="op1">
                  <span slot="title">本人</span>
                </my-select-op1>
            </div>
          </div>
          <div class="form-group row mb-1">
            <label class="col-2 control-label text-right">记录编码</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model.trim="pnrNo">
            </div>
          </div>

        </div>

        <div class="card-body py-0">
          <div class="offset-2">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="0" v-model.number="intlTicket">
              <label class="form-check-label">国内航班</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="1" v-model.number="intlTicket">
              <label class="form-check-label">国际航班</label>
            </div>
          </div>
        </div>


        <div class="card-footer text-center">
          <button type="button" class="btn btn-primary" :disabled="btnDisabled" @click.stop.prevent="createFlightOrder()">保存新订单</button>
          <span class="ml-2 text-danger" v-if="psgTotal > psgCount">{{psgTotal - psgCount}}人未选择保存</span>
        </div>
      </div>
      
    </template>                          
  </div>
</template>

<script>
  import { SUPPLIER_FLIGHT } from '../common/const.js'
  import { processPnrDetail, searchPriceByRoute, searchFlightFixedCommission } from '../api/user.js'
  import { searchCustomers, searchPossibleCustomers } from '../api/customer.js'
  import { createFlightOrder } from '../api/flight.js'
  import { processPnrFlightContent } from '../api/flight-change.js'
  import { searchNotesByCustomer } from '../api/customer.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPriceInput from '../components/flight-price-input.vue'
  import MySelectCustomer from '../components/my-select-customer.vue'
  import MySelectIncome from '../components/my-select-income.vue'
  import PriceInfo from '../common/PriceInfo.js'
  import MySelectPayment from '../components/my-select-payment.vue'
  import MySelectSupplier from '../components/my-select2-supplier.vue'
  import MySelectOp1 from '../components/my-select-operator.vue'
  import FltTr from '../components/flt-tr.vue'

  import $ from 'jquery'

  export default {
    components: {
      MyDatePicker,
      MyPriceInput,
      MySelectCustomer,
      MySelectIncome,
      MySelectPayment,
      MySelectSupplier,
      MySelectOp1,
      FltTr
    },
    data () {
      return {
        editing: false,
        pnrDetail: '',
        pnr: null,

        customerId: 0,
        costCenter: '',
        projectName: '',
        costCenters: [],
        projectNames: [],

        supplierId: 0,
        paymentMethodId: 0,

        adultPrice: new PriceInfo(),
        childPrice: new PriceInfo(),
        infantPrice: new PriceInfo(),

        adultCount: 0,
        childCount: 0,
        infantCount: 0,

        memo: '',
        etdzDate: '',
        etdzTime: '',
        payType: 1,
        payRemark: '',
        itineraryType: 0,
        itineraryMailingAddress: '',
        itineraryMailingMemo: '',
        itineraryRecipient: '',
        itineraryRecipientMobile: '',
        deliveryDate: '',
        linkman: '',
        linkPhone: '',
        intlTicket: -1,
        op1: '',
        pnrNo: '',

        inputMode: 0,
        quickInput: '',

        btnDisabled: false,

        possibleCustomers: []
      }
    },
    watch: {
      customerId: function (newVal) {
        if (newVal === 0) {
          this.payType = 1
        } else if (newVal > 0) {
          this.payType = 8
        }
        this.getMailAddress()
        this.getCostCenters()
      },
      quickInput: function (newVal, oldVal) {
        this.processQuickInput()
      }
    },
    computed: {
      supplierType: function () {
        return SUPPLIER_FLIGHT
      },
      flightCount: function () {
        if (this.pnr === null) {
          return 0
        }

        return this.pnr.flights.length
      },
      psgCount: function () {
        if (this.pnr === null) {
          return 0
        }

        let count = 0
        this.adultCount = 0
        this.childCount = 0
        this.infantCount = 0

        for (const psg of this.pnr.passengers) {
          if (psg.selected === false) continue

          count++

          if (psg.psgType === 1) {
            this.childCount++
          } else if (psg.psgType === 2) {
            this.infantCount++
          }
        }

        this.adultCount = count - this.childCount - this.infantCount

        this.adultPrice.ticketCount = this.adultCount
        this.childPrice.ticketCount = this.childCount
        this.infantPrice.ticketCount = this.infantCount

        return count
      },
      psgTotal: function () {
        if (this.pnr === null) {
          return 0
        }
        return this.pnr.passengers.length
      },
      totalAmount: function () {
        return this.adultPrice.amount * this.adultCount +
          this.childPrice.amount * this.childCount +
          this.infantPrice.amount * this.infantCount
      },
      totalCost: function () {
        return this.adultPrice.cost * this.adultCount +
          this.childPrice.cost * this.childCount +
          this.infantPrice.cost * this.infantCount
      },
      totalProfit: function () {
        return this.adultPrice.profit * this.adultCount +
          this.childPrice.profit * this.childCount +
          this.infantPrice.profit * this.infantCount
      }
    },
    mounted: function () {
      $('[data-toggle="tooltip"]').tooltip()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },
      processPnrDetail: function () {
        if (this.pnrDetail.length === 0) {
          this.showErrMsg('编码内容不能为空')
          return
        }
        this.btnDisabled = true
        const params = { 'pnrDetail': this.pnrDetail }

        this.adultCount = 0
        this.childCount = 0

        processPnrDetail(params,
          (jsonResult) => {
            this.btnDisabled = false
            this.inputMode = 0
            this.pnr = jsonResult
            this.pnrNo = this.pnr.pnrNo
            this.etdzDate = this.pnr.tktlDate
            this.etdzTime = this.pnr.tktlTime
            this.adultPrice.price = this.pnr.price
            this.adultPrice.parvalue = this.pnr.parvalue
            this.adultPrice.tax = this.pnr.tax
            this.adultPrice.commRate = this.pnr.commRate
            this.adultCount = this.pnr.adultCount
            this.intlTicket = this.pnr.type3

            if (this.pnr.childCount > 0) {
              this.childCount = this.pnr.childCount
              this.childPrice.price = this.pnr.chdPrice
              this.childPrice.parvalue = this.pnr.chdParvalue
              this.childPrice.tax = this.pnr.chdTax
              this.childPrice.commRate = this.pnr.chdCommRate
            }

            if (this.pnr.infantCount > 0) {
              this.infantCount = this.pnr.infantCount
              this.infantPrice.price = this.pnr.infPrice
              this.infantPrice.parvalue = this.pnr.infParvalue
              this.infantPrice.tax = this.pnr.infTax
              this.infantPrice.commRate = this.pnr.infCommRate
            }

            this.editing = true

            //查找可能归属的公司
            this.searchPossibleCustomers()
          }
        )
      },
      searchPossibleCustomers: function () {
        this.possibleCustomers.splice(0)
        let names = []
        for (let i = 0; i < this.pnr.passengers.length; i++) {
          names.push({
            'name': this.pnr.passengers[i].psgName,
            'idNo': this.pnr.passengers[i].idNo
          })
        }

        const jsonParams = JSON.stringify(names)

        searchPossibleCustomers(jsonParams,
          v => {
            this.possibleCustomers.push(...v)
          }
        )
      },
      searchPriceByPnr: function (carrier, subclass, dport, aport) {
        const params = {
          'sc.carrier': carrier,
          'sc.subClass': subclass,
          'sc.dport': dport,
          'sc.aport': aport
        }

        searchPriceByRoute(params,
          (jsonResult) => {
            this.price = 0
            if (jsonResult.dataList.length > 0) {
              this.adultPrice.price = jsonResult.dataList[0].price
              this.caclTicketAmount()
            }
          }
        )
      },
      createFlightOrder: function () {
        if (this.intlTicket !== 0 && this.intlTicket !== 1) {
          this.showErrMsg('请确定订单为国内订单，还是国际订单', 'danger')
          return
        }

        for(const fltInfo of this.pnr.flights) {
          fltInfo.flight.departureTime = fltInfo.flight.dtime
          fltInfo.flight.arrivalTime = fltInfo.flight.atime
        }

        const params = {
          'customerId': this.customerId,
          'costCenter': this.costCenter,
          'projectName': this.projectName,
          'payType': this.payType,
          'payRemark': this.payRemark,

          'adultPrice': this.adultPrice,
          'childPrice': this.childPrice,
          'infantPrice': this.infantPrice,

          'totalAmount': this.totalAmount,
          'totalProfit': this.totalProfit,

          'tktlDate': this.etdzDate,
          'tktlTime': this.etdzTime,
          'pnrNo': this.pnrNo,
          'pnrDetail': this.pnrDetail,
          'itineraryType': this.itineraryType,
          'itineraryMailingAddress': this.itineraryMailingAddress,
          'itineraryMailingMemo': this.itineraryMailingMemo,
          'itineraryRecipient': this.itineraryRecipient,
          'itineraryRecipientMobile': this.itineraryRecipientMobile,
          'deliveryDate': this.deliveryDate,
          'linkman': this.linkman,
          'linkPhone': this.linkPhone,
          'intlTicket': this.intlTicket,
          'flights': this.pnr.flights,
          'passengers': this.pnr.passengers,

          'supplierId': this.supplierId,
          'paymentMethodId': this.paymentMethodId,
          'op1': this.op1
        }

        const jsonParams = JSON.stringify(params)

        this.showLoading('保存中')

        createFlightOrder(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg, 'danger')
            } else {
              // 根据条件判断是否跳转，还是停在此页
              if (this.psgCount === this.psgTotal) {
                this.showErrMsg('全部保存成功，跳转到订单详情页面')
                this.pnr = null
                this.pnrDetail = ''
                this.$router.push('/flt/order/' + jsonResult.returnCode)
              } else {
                // 留在当前页面，继续保存
                this.showErrMsg('保存成功，请继续保存余下的乘机人')
                let b = true
                while (b) {
                  b = false
                  for (let i = 0; i < this.pnr.passengers.length; i++) {
                    if (this.pnr.passengers[i].selected) {
                      b = true
                      this.deletePnrPsg(i)
                    }
                  }
                }
              }
            }
          },
          () => { this.hideLoading() }
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
          passengers: []
        }
        this.addPnrFlt()
        this.addPnrPsg()

        this.editing = true
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
            'dtime': '',
            'arrivalTime': '',
            'atime': ''
          }
        })
      },
      addPnrPsg: function () {
        this.pnr.passengers.push({ 'selected': true, 'psgName': '', 'idNo': '', 'idType': '', mobile: '' })
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
            this.adultPrice.commission = jsonResult
          }
        )
      },
      reset: function () {
        // body...
        this.pnrDetail = ''
        this.pnr = null

        this.customerId = -1

        this.adultPrice.reset()
        this.childPrice.reset()
        this.infantPrice.reset()

        this.etdzMemo = ''
        this.payType = 8
        this.pnrNo = ''

        this.inputMode = 0
      },
      getMailAddress: function () {
        this.itineraryMailingAddress = ''
        this.itineraryType = 0
        this.itineraryRecipient = ''
        this.itineraryRecipientMobile = ''

        if (this.customerId < 1) return

        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 1,
          'sc.customerId': this.customerId
        }

        searchCustomers(params, (jsonResult) => {
          const customers = jsonResult.dataList

          for (let i = 0; i < customers.length; i++) {
            if (customers[i].id === this.customerId) {
              // console.log(customers[i])
              this.itineraryMailingAddress = customers[i].address
              this.itineraryType = customers[i].itineraryType
              this.itineraryRecipient = customers[i].linkman
              this.itineraryRecipientMobile = customers[i].phone
            }
          }
        })
      },
      getCostCenters: function () {
        this.costCenter = ''
        this.projectName = ''
        this.costCenters.splice(0)
        this.projectNames.splice(0)
        if (this.customerId < 1) return

        searchNotesByCustomer(this.customerId, (jsonResult) => {
          for (const info of jsonResult) {
            if (info.noteType === 100) {
              this.costCenters.push(info)
            } else if (info.noteType === 200) {
              this.projectNames.push(info)
            }
          }
        })
      },
      processQuickInput: function () {
        if (this.quickInput.length < 6) {
          return
        }

        const idx = this.quickInput.indexOf('.')
        if (idx > 0) {
          // pnr中的航班格式
          processPnrFlightContent({ content: this.quickInput }, v => {
            if (v !== null && v.flight !== null) {
              console.log(v)

              this.quickInput = ''
              this.pnr.flights.push({'flight': v.flight})
            }
          })
        }
      },
      selectAllPsg: function () {
        if (this.pnr === null) {
          return
        }
        for (const psg of this.pnr.passengers) {
          psg.selected = true
        }
      },
      unselectAllPsg: function () {
        if (this.pnr === null) {
          return
        }
        for (const psg of this.pnr.passengers) {
          psg.selected = false
        }
      }
    }
  }
  // 585
</script>