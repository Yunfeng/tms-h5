<template>
  <div id="recharge">
      
    <div class="card">
      <div class="card-header bg-info text-white" >
          充值 
          <router-link to="/my/trans/histories" class="float-right">交易记录</router-link>
      </div>
      <div class="card-body py-1">
          <div class="row mb-2">
              <div class="col-3">
                  <label>当前账户</label>
                  <span id="curUsername">{{enterpriseName}}</span>
              </div>
              <div class="col-3">
                  <label>积分账户</label>
                  <span id="curBitcoinAmount">{{balance}}积分</span>
                  <small><a href="javascript:void(0);" @click.stop="buyPoints()" title="使用现金账户中的余额购买积分">购买</a></small>
              </div>
              <div class="col-3">
                  <label>现金账户</label>
                  <span id="curCashAmount">{{cashBalanceYuan}}元</span>
              </div>
          </div>
          
      </div>

      <ul class="nav nav-tabs mt-2" id="myTab">
          <li class="nav-item"><a href="#alipay" class="nav-link active">支付宝</a></li>
      </ul> 
      <div class="tab-content">
          <div class="tab-pane active" id="alipay">
              <div class="alert alert-info">支付宝可实时到账，支付前请确认您已开通支付宝，并确保金额不超过您的支付限额。</div>
              <div class="form-group row">
                  <label class="offset-md-2 col-2 control-label text-right" for="amount">金额(元)</label>
                  <div class="col-4">
                      <input type="textfield" name="amount" class="form-control" v-model.number="amount" />
                  </div>
              </div>
              <div class="form-group row">
                  <div class="offset-md-4 col-4 text-center">
                      <button type="button" class="btn btn-primary btn-block" @click.stop.prevent="recharge()">充值</button>
                  </div>
              </div>                  
              <div class="form-group row">
                  <div class="col-6 ml-auto mr-auto">
                      <span class="help-block">
                          <ul class="list-unstyled">
                              <li>&nbsp;</li>
                              <li><span class="text-danger">实际入账金额</span> = 充值金额 - (<span class="text-danger">1.5%</span> x 充值金额)</li>
                              <li>&nbsp;</li>
                              <li>如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。</li>                                    
                          </ul>
                      </span>
                  </div>
              </div>
          </div>
          <div id="paymentForm" ></div>
      </div>             

    </div>
  </div>
</template>

<script>
import { searchBalance, buyPoints, recharge, searchSoftProducts, searchSoftProductBuyInfo, buySoftProduct } from '../api/user.js'
import $ from 'jquery'

export default {
  data () {
    return {
      enterpriseName: '',
      balance: 0,
      cashBalanceYuan: 0,
      frozenBalanceYuan: 0,
      creditLimitYuan: 0,

      amount: 0.01,
      products: [],
      priceList: [],
      priceMode: 0,
      productCode: '',
      buyInfo: null
    }
  },
  computed: {
    sid () { return this.$store.state.sid }
  },  
  mounted: function () {
    this.searchBalance()
    this.searchSoftProducts()
  },
  watch: {
    productCode: function (newVal) {
      this.searchBuyInfo()
    }
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    searchBalance: function () {
      searchBalance(
        (jsonResult) => {
          this.enterpriseName = jsonResult.enterpriseName
          this.balance = jsonResult.balance
          this.cashBalanceYuan = jsonResult.cashBalanceYuan
          this.frozenBalanceYuan = jsonResult.frozenBalanceYuan
          this.creditLimitYuan = jsonResult.creditLimitYuan
        }
      )
    },
    buyPoints: function () {
      buyPoints(
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg(jsonResult.desc + jsonResult.errmsg)
            this.searchBalance()
          } else {
            this.showErrMsg('操作失败： ' + jsonResult.errmsg)
          }
        }
      )
    },
    recharge: function () {
      console.log(this.amount)
      const reg = new RegExp(/^\d*\.?\d{0,2}$/)
      if (!reg.test(this.amount)) {
        this.showErrMsg('请检查输入格式')
        return false
      }

      

      recharge(this.amount,
        v => {
          if (v.status === 'OK') {
            this.showErrMsg('如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。', 'info')
            console.log(v.url)
            $('#paymentForm').empty().html(v.url)
            document.forms['alipaysubmit'].submit()            
          } else {
            this.showErrMsg(v.errmsg, 'danger')
          }
        }
      )
    },
    searchSoftProducts: function () {
      searchSoftProducts( v => {
        this.products = v.dataList
      })
    },
    searchBuyInfo: function () {
      this.priceList.splice(0)
      // 查找购买信息
      const params = {
        'productCode': this.productCode
      }
      searchSoftProductBuyInfo(params, v => {
        // console.log(v)
        this.buyInfo = v

        const productInfo = v.product
        if (productInfo.chargeUnit === 2) {
          //按月付费          
          this.priceList.push({'id': 0, 'name': '零售价: ' + productInfo.retailPrice / 100 + '元/月'})
          if (productInfo.wholesalePrice !== null) {
            //有批发价
            this.priceList.push({'id': 1, 'name': '批发价: ' + productInfo.minWholesaleCount + ' * ' + productInfo.wholesalePrice / 100 + '元/月'})
          }
          this.priceMode = 0
        }
      })
    },
    buyProduct: function () {
      this.showLoading()
      const params = {
        'productCode': this.productCode,
        'priceMode': this.priceMode
      }
      buySoftProduct(params, v => {
        // console.log(v)
        if (v.status === 'OK') {
          this.showErrMsg('购买成功')
          this.searchBuyInfo()
        } else {
          this.showErrMsg(v.errmsg, 'danger')
        }
      }, () => {
        this.hideLoading()
      })      
    }
  }
}
</script>
