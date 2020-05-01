<template>
  <div id="book-form" class="row">
    <div class="col-12 bg-info text-center text-white">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      <span>机票预定</span>
    </div> 

    <!-- 航班信息 -->
    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        航班信息
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>日期</th>
            <th>航班号</th>
            <th>出发</th>
            <th>到达</th>
            <th>舱位</th>
            <th>票面价</th>
            <th>税</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(flt, index) in flights">
            <tr >
              <td>{{index+1}}</td>
              <td>{{flt.ddate}}</td>
              <td>{{flt.flightNo}} <small>{{flt.carrierName}}</small></td>
              <td>{{flt.dportName}} <small>{{flt.dterm}}</small> {{flt.showDtime}}</td>
              <td>{{flt.aportName}} <small>{{flt.aterm}}</small> {{flt.showAtime}}</td>
              <td>{{flt.subclass}}</td>
              <td><i class="fa fa-rmb text-warning"></i> {{flt.price}}</td>
              <td>
                {{flt.tax}}
              </td>
              <td>
                <a href="javascript:void(0)"  @click.stop="removeFlightInfo(index)" class="btn btn-sm btn-danger float-right">
                  <i class="fa fa-times" aria-hidden="true"></i>删除
                </a>
              </td>
            </tr>
            <tr>
              <td colspan="8">改签规则：{{flt.changeRule}}</td>
            </tr>
            <tr>
              <td colspan="8">退票规则：{{flt.refundRule}}</td>
            </tr>
            
          </template>
          <tr v-if="fltCount === 1">
            <td colspan="9">
              <a href="javascript:void(0)" @click.stop="searchReturn()" class="btn btn-success">搜索返程</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- passengers -->
    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        乘机人
      </div>
      <table class="table table-sm">
        <thead>
          <tr class="small">
              <th>序号</th>
              <th>姓名</th>
              <th>证件号</th>
              <th>证件类型</th>
              <th>常旅客号</th>
              <th>手机</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
            <template v-for="(psg, index) in psgInfos">
              <tr>
                <td>
                  {{index+1}}
                </td>
                <td>  
                  <input type="text" class="form-control" placeholder="乘机人姓名" v-model.trim="psg.name"/>
                </td>
                <td>
                    <input type="text" class="form-control" placeholder="证件号" v-model.trim="psg.idNo" />
                </td>
                <td>
                    <select class="form-control" v-model.number="psg.idType">
                      <option value="1">身份证</option>
                      <option value="2">护照</option>
                      <option value="99">其它</option>
                    </select>
                </td>
                <td><input type="text" class="form-control" placeholder="常旅客号" v-model.trim="psg.ffpNo" /></td>
                <td><input type="text" class="form-control" placeholder="手机号" v-model.trim="psg.mobile" /></td>
                <td>
                    <select class="form-control" v-model.number="psg.psgType">
                      <option value="0">成人</option>
                      <option value="1">儿童</option>
                      <option value="2">婴儿</option>
                    </select>
                </td>
                <td>
                  <a href="javascript:void(0)" @click.stop="deletePsg(index)"  class="btn btn-sm btn-danger float-right">删除</a>
                </td>
              </tr>
            </template>
          </tbody>
      </table>
      <div class="card-foter">
        <button type="button" @click.stop="addPsg()" class="btn btn-success">
          添加乘客
        </button>
        </div>
    </div>

    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        付款方式
      </div>
      <div class="card-body py-2">
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
      </div>
    </div>
    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        发票需求
      </div>
      <div class="card-body py-2">
          <div class="form-group row">
            <label class="col-2 control-label text-right">发票类型</label>
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
                <input class="form-check-input" type="radio" value="4" v-model.number="itineraryType">
                <label class="form-check-label">行程单+附加服务</label>
              </div>
            </div>

          </div>
      </div>
    </div>


    <div class="card col-12 bg-white border-0 mt-1 px-0" v-if="insurances.length > 0">
      <div class="card-header bg-warning text-white py-0">
        <span>保险</span>
      </div>
      <table class="table">
        <tr v-for="(info, index) in insurances">    
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="serviceProductCodes" :value="info.productCode">
              <label class="form-check-label">{{info.productName}}</label>                 
            </div>
          </td>
          <td>
            <i class="fa fa-rmb text-warning"></i>{{info.price}}元/份 (优惠金额{{info.discount}})
          </td>
          <td>
            <small>购买 {{psgInfos.length}} 份</small>
          </td>
          <td>
            <small>{{info.productDesc}}</small>
          </td>
        </tr>
      </table>  
    </div>

    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        结算信息
      </div>
      <div class="card-body bg-info text-white py-0"></div>
      <my-price-input psgTypeName="成人" v-bind.sync="adultPrice" key="adultPriceInput" v-if="adultCount > 0">
          </my-price-input>
      <my-price-input psgTypeName="儿童" v-bind.sync="childPrice" key="childPriceInput" v-if="childCount > 0">
          </my-price-input>  
      <my-price-input psgTypeName="婴儿" v-bind.sync="infantPrice" key="infantPriceInput" v-if="infantCount > 0">
          </my-price-input>  
      <table class="table bg-info text-white">
        <tr>
          <td>总计</td>
          <td>人数：{{psgCount}}</td>
          <td>总应收：{{totalAmount}}</td>
        </tr>
      </table>
    </div>


    <div class="card col-12 bg-white">
      <div class="card-header bg-warning text-white py-0">
          <span>联系人</span>
        </div>
      <div class="card-body px-0">
        <div class="form-group">
          <input type="text" class="form-control" v-model.trim="linkman" placeholder="联系人"/>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model.trim="linkPhone" placeholder="联系电话"/>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model.trim="remark" placeholder="备注" />
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model.trim="address" placeholder="地址"/>
          <span class="text-muted small">行程单或发票邮寄的地址、邮编等</span>
        </div>
      </div>   
    </div>

    <div class="card col-12">
      <div class="card-body text-center">
        <a class="btn btn-success text-white" @click.stop="createFlightOrder();">保存订单</a>
      </div>
    </div>

    <div class="clear"></div>
    <my-psg-picker :show="showPicker" @close="psgPickerClosed"></my-psg-picker>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import $ from 'jquery'
  import { addDate } from '../../common/common.js'
  import { searchInsuranceProducts } from '../../api/product.js'
  import MyPsgPicker from '../../components/my-psg-picker.vue'
  import MyPriceInput from '../../components/flight-price-input.vue'
  import PriceInfo from '../../common/PriceInfo.js'
  import { createFlightOrder } from '../../api/flight.js'
  import MySelectCustomer from '../../components/my-select2-customer.vue'
  import MySelectIncome from '../../components/my-select-income.vue'
   
  export default {
    components: {
      MyPsgPicker,
      MyPriceInput,
      MySelectCustomer,
      MySelectIncome
    },
    data () {
      return {
        psgSelected: -1,

        idTypes: [
          { idType: 1, idName: '身份证' },
          { idType: 2, idName: '护照' },
          { idType: 10, idName: '其它' }
        ],
        showPicker: false,

        insurances: [],

        adultPrice: new PriceInfo(),
        childPrice: new PriceInfo(),
        infantPrice: new PriceInfo(),
        adultCount: 0,
        childCount: 0,
        infantCount: 0,

        // 0 - 国内票; 1 - 国际或港澳台
        intlTicket: 0,


        costCenter: '',
        projectName: '',
        costCenters: [],
        projectNames: [],
        payType: 1,
        itineraryType: 0,
        linkman: '',
        linkPhone: '',
        remark: '',
        address: '',
        serviceProductCodes: [],

        //服务产品总额
        serviceProductTotal: 0,
      }
    },
    computed: mapState({
      flights: state => state.order.flights,
      psgInfos: state => state.order.psgs,
      policyId: state => state.order.policyId,
      ddate: state => state.searchParams.ddate,
      fltCount () {
        return this.flights.length 
      },
      psgCount: function () {
        let count = 0
        this.adultCount = 0
        this.childCount = 0
        this.infantCount = 0

        for (const psg of this.psgInfos) {
          count++

          if (psg.psgType === 1) {
            this.childCount++
          } else if (psg.psgType === 2) {
            this.infantCount++
          } else {
            this.adultCount++
          }
        }

        return count
      },
      totalAmount: function () {
        return this.adultPrice.amount * this.adultCount +
          this.childPrice.amount * this.childCount +
          this.infantPrice.amount * this.infantCount
          + this.serviceProductTotal
      }
    }),    
    watch: {
      serviceProductCodes: function (newVal, oldVal) {
        console.log("oldVal:" + oldVal)
        console.log("newVal:" + newVal)
        console.log("serviceProductCodes: " + this.serviceProductCodes)
        this.calcServiceProductTotal()
      }
    }, 
    mounted: function () {
      this.calc()
      this.searchInsurances()
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
      addPsg: function () {
        this.$store.dispatch('addPsg')
      },
      deletePsg: function (index) {
        this.$store.dispatch('deletePsg', index)
      },
      removeFlightInfo: function (index) {
        this.$store.commit('deleteFlt', index)
        if (this.flights.length === 0) {
          this.$router.replace('/flt/search')
        }
        this.calc()
      },
      createFlightOrder: function () {
        if (this.intlTicket !== 0 && this.intlTicket !== 1) {
          this.showErrMsg('请确定订单为国内订单，还是国际订单', 'danger')
          return
        }

        let flights = []
        let policyCode = null
        for(let info of this.flights) {
          flights.push({
              'dport': info.dport,
              'aport': info.aport,
              'ddate': info.ddate,
              'flightNo': info.flightNo,
              'subclass': info.subclass,
              'price': info.price,
              'dterm': info.dterm,
              'aterm': info.aterm,
              'dtime': info.dtime,
              'atime': info.atime,
              'changeRule': info.changeRule,
              'refundRule': info.refundRule
          })

          console.log(info.policyCode)

          if (info.policyCode !== null  && policyCode === null) {
            policyCode = info.policyCode
          }
        }

        this.adultPrice.priceType = 0
        this.childPrice.priceType = 1
        this.infantPrice.priceType = 2

        let prices = []
        prices.push(this.adultPrice)
        prices.push(this.childPrice)
        prices.push(this.infantPrice)

        const params = {
          'prices': prices,
          'costCenter': this.costCenter,
          'projectName': this.projectName,
          'payType': this.payType,
          'payRemark': this.payRemark,

          'totalAmount': this.totalAmount,
         
          'linkman': this.linkman,
          'linkPhone': this.linkPhone,
          'intlTicket': this.intlTicket,
          
          'policyCode': policyCode,
          'itineraryType': this.itineraryType,
          'address': this.address,
          'remark': this.remark,

          'serviceProductCodes': this.serviceProductCodes,
          'flights': flights,
          'passengers': this.psgInfos
        }

        const jsonParams = JSON.stringify(params)

        this.showLoading('保存中')

        createFlightOrder(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg, 'danger')
            } else {
              this.showErrMsg('保存成功，跳转到订单详情页面')
              this.$router.push('/flt/order/' + jsonResult.returnCode)
            }
          },
          () => { this.hideLoading() }
        )
      },
      selectPsg: function (index) {
        this.psgSelected = index
        this.showPicker = true
      },
      psgPickerClosed: function (status, name, idType, idNo) {
        this.showPicker = false
        if (status === 1) {
          this.$store.commit('updatePsg', { 'index': this.psgSelected, 'name': name, 'idType': idType, 'idNo': idNo })
        }
      },
      searchReturn: function () {
        this.$store.commit('switchCity')

        var newDate = addDate(this.ddate, 1)
        this.$store.commit('setDdate', newDate)
        this.$router.push('/flt/search')
      },
      searchInsurances: function () {
        const params = {
          'pageNo': 1,
          'pageSize': 10
        }
        searchInsuranceProducts(params, v => {
          this.insurances = v.dataList
        })
      },
      calcServiceProductTotal: function () {
        this.serviceProductTotal = 0
        for(const code of this.serviceProductCodes) {
          for(const insurance of this.insurances) {
            if (insurance.productCode === code) {
              this.serviceProductTotal = this.serviceProductTotal + (insurance.price - insurance.discount) * this.psgCount * this.fltCount
            }
          }
        }
        console.log('serviceProductTotal: ' + this.serviceProductTotal)
      },
      calc: function () {
        // this.adultCount = this.psgCount - this.childCount - this.infantCount

        this.adultPrice.ticketCount = this.adultCount
        this.childPrice.ticketCount = this.childCount
        this.infantPrice.ticketCount = this.infantCount

        this.adultPrice.price = 0
        this.adultPrice.parValue = 0
        this.adultPrice.tax = 0

        for(let flt of this.flights) {
          this.adultPrice.price += flt.price
          this.adultPrice.parValue += flt.price
          this.adultPrice.tax += flt.tax
        }
      }
    }
  }
</script>
