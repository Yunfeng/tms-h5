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
          <tr v-for="(flt, index) in flights">
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
          <tr v-if="fltCount === 1">
            <td colspan="9">
              <a href="javascript:void(0)" @click.stop="searchReturn()" class="btn btn-success">搜索返程</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="card col-12">
      <div class="card-header bg-warning text-white py-0">
        客户
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

    <div class="card col-12 bg-white border-0 mt-1 px-0" v-if="insurances.length > 0">
      <div class="card-header bg-warning text-white py-0">
        <span>保险</span>
      </div>
      <table class="table">
        <tr v-for="(info, index) in insurances">                
          <input type="hidden" :name="'tmcPolicyApply.insurances[' + index + '].productCode'" :value="info.productCode" />
          <input type="hidden" :name="'tmcPolicyApply.insurances[' + index + '].productName'" :value="info.productName" />
          <input type="hidden" :name="'tmcPolicyApply.insurances[' + index + '].price'" :value="info.price" />
          <input type="hidden" :name="'tmcPolicyApply.insurances[' + index + '].discount'" :value="info.discount" />
          <input type="hidden" :name="'tmcPolicyApply.insurances[' + index + '].count'" :value="psgInfos.length" />

          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" :name="'tmcPolicyApply.insurances[' + index + '].buyed'" value="1">
              <label class="form-check-label">{{info.productName}}</label>                 
            </div>
          </td>
          <td>
            <i class="fa fa-rmb text-warning"></i>{{info.price-info.discount}}/份
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
          <td>总应付：{{totalCost}}</td>
          <td><span class="text-success">利润：{{totalProfit}}</span></td>
        </tr>
      </table>
    </div>


    <div class="card col-12 bg-white">
      <div class="card-header bg-warning text-white py-0">
          <span>联系人</span>
        </div>
      <div class="card-body px-0">
        <div class="form-group">
          <input type="text" class="form-control" name="linkman" placeholder="联系人"/>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" name="linkPhone" placeholder="联系电话"/>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" name="remark" placeholder="备注" />
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
        linkman: '',
        linkPhone: '',
        remark: ''
      }
    },
    computed: mapState({
      flights: state => state.order.flights,
      psgInfos: state => state.order.psgs,
      policyId: state => state.order.policyId,
      ddate: state => state.searchParams.ddate,
      fltCount () { return this.flights.length },
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
          }
        }

        this.adultCount = count - this.childCount - this.infantCount

        this.adultPrice.ticketCount = this.adultCount
        this.childPrice.ticketCount = this.childCount
        this.infantPrice.ticketCount = this.infantCount

        if (this.adultPrice.price === 0) {

          this.adultPrice.price = 0
          this.adultPrice.parValue = 0
          this.adultPrice.tax = 0

          for(let flt of this.flights) {
            this.adultPrice.price += flt.price
            this.adultPrice.parValue += flt.price
            this.adultPrice.tax += flt.tax
          }
        }

        return count
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
    }),      
    mounted: function () {
      // this.searchInsurances()
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
      },
      createFlightOrder: function () {
        if (this.intlTicket !== 0 && this.intlTicket !== 1) {
          this.showErrMsg('请确定订单为国内订单，还是国际订单', 'danger')
          return
        }

        let flights = []
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
              'atime': info.atime
          })
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
          'totalProfit': this.totalProfit,

         
          'linkman': this.linkman,
          'linkPhone': this.linkPhone,
          'intlTicket': this.intlTicket,
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
      }
    }
  }
</script>
