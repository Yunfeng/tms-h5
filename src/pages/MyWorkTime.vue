<!-- 工作时间设置 -->
<template>
  <div id="my-worktime">
    <div class="card">
      <div class="card-body">        
        <div class=" row">
          <div class="col-5 offset-md-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="customCheck1" v-model="oneStepCreateOrder">
              <label class="form-check-label" for="customCheck1">新建订单时一步完成</label>
            </div>
          </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">工作日</label>
            <div class="col-9">
              <input type="textfield" class="form-control" name="configDto.workDay" v-model="workDay" />
              <span class="form-text text-muted small">格式：12345 表示周一到周五上班, 1234567 表示天天上班</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">上班时间</label>
            <div class="col-9">
              <input type="textfield" class="form-control" name="configDto.workBeginTime" v-model="workBeginTime" />
              <span class="form-text text-muted small">时间格式：0830</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">下班时间</label>
            <div class="col-9">
              <input type="textfield" class="form-control" name="configDto.workEndTime" v-model="workEndTime" />          
              <span class="form-text text-muted small">时间格式：2200</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">收款账号</label>
            <div class="col-9">
              <input type="textfield" class="form-control" v-model="receivingAccount" />          
              <span class="form-text text-muted small">设置一次，以后将不能修改</span>
            </div>
        </div>

        <div class=" row">
            <label class="control-label col-3 text-right">默认底价</label>
            <div class="col-9">
                <input type="textfield" class="form-control" v-model.number="defaultBottomPrice" />
                <span class="text-muted small">取当前价格的百分之几生成底价，仅用于特殊政策。取值范围：1-100 。</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">减价幅度</label>
            <div class="col-9">
                <input type="textfield" class="form-control" v-model.number="priceAdjustment" />                        
                <span class="text-muted small">调整政策价格时价格减少的幅度，此值须在1至1000之间，单位: 分。</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">疯狂航空</label>
            <div class="col-9">
                <input type="textfield" class="form-control" v-model.trim="crazyAirlines" />                        
                <span class="text-muted small">航司代码<span class="text-info">(MU,CZ)</span>或航班号<span class="text-info">(MU789,ZH123)</span>，逗号分隔; 此模式下的航司政策每次比价周期都会减价。</span>
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">国内政策监控数量</label>
            <div class="col-9">
                <input type="textfield" class="form-control" :value="monitorDomPolicyCount" disabled />                        
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">国际政策监控数量</label>
            <div class="col-9">
                <input type="textfield" class="form-control" :value="monitorIntlPolicyCount" disabled/>                        
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">携程订单最大亏损</label>
            <div class="col-9">
                <input type="textfield" class="form-control" v-model.number="tbookingMaxLoss"/>  
                <span class="text-muted small">来自携程的订单的利润小于该值时，自动将该航司的该航线政策停用</span>                                            
            </div>
        </div>
        <div class=" row">
            <label class="control-label col-3 text-right">BSP打票机号</label>
            <div class="col-9">
                <input type="textfield" class="form-control" v-model="bspPrinterNo" />  
                <span class="text-muted small">自动出票时所用到的打票机号,只允许有一个</span>                      
            </div>
        </div>


        <div class=" row">
          <div class="col-4 offset-4">
              <button type="button" @click.stop="save();" class="btn btn-success btn-block">保存</button>
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
  import { APP_FLIGHT_PATH } from '../common/common.js'
  import { searchEntConfig, saveEntConfig } from '../api/admin.js'
  import $ from 'jquery'

  export default {
    data () {
      return {
        workDay: '',
        workBeginTime: '',
        workEndTime: '',
        receivingAccount: '',
        oneStepCreateOrder: false,

        defaultBottomPrice: 100,
        priceAdjustment: 25,
        crazyAirlines: '',

        monitorDomPolicyCount: 0,
        monitorIntlPolicyCount: 0,

        tbookingMaxLoss: 0,
        bspPrinterNo: 0
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        searchEntConfig(v => {
          this.workDay = v.workDay
          this.workBeginTime = v.workBeginTime
          this.workEndTime = v.workEndTime
          this.receivingAccount = v.receivingAccount
          this.oneStepCreateOrder = v.oneStepCreateOrder

          this.defaultBottomPrice = v.bottomPrice
          this.priceAdjustment = v.priceAdjustment
          this.crazyAirlines = v.crazyAirlines

          this.monitorIntlPolicyCount = v.monitorIntlPolicyCount
          this.monitorDomPolicyCount = v.monitorDomPolicyCount

          this.tbookingMaxLoss = v.tbookingMaxLoss
          this.bspPrinterNo = v.bspPrinterNo
        })
      },
      save: function () {
        const params = { 'workDay': this.workDay,
          'workBeginTime': this.workBeginTime,
          'workEndTime': this.workEndTime,
          'receivingAccount': this.receivingAccount,
          'oneStepCreateOrder': this.oneStepCreateOrder,
          'defaultBottomPrice': this.defaultBottomPrice,
          'priceAdjustment': this.priceAdjustment,
          'crazyAirlines': this.crazyAirlines,
          'tbookingMaxLoss': this.tbookingMaxLoss,
          'bspPrinterNo': this.bspPrinterNo
        }

        saveEntConfig(params, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg)
          } else {
            this.showErrMsg('保存成功')
            this.search()
          }          
        })
      }
    }
  }
</script>