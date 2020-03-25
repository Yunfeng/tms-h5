<template>
	<div id="newVasOrder" >
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/vaas/orders'>机场服务订单（第三方服务）</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card">
      <div class="card-body">
        <div class="form-group row">
          <label class="control-label col-md-4 text-right">
              服务项目    
          </label>
          <div class="col-md-6">
            <select class="form-control" v-model="productCode">
              <option value="">请选择服务项目</option>
              <option :value="info.productCode" v-for="info in extras">{{info.productName}}</option>
            </select>
            <span class="text-muted small">{{productDesc}}</span>
          </div>
        </div>
        <div class="form-group row">
            <label class="control-label col-md-4 text-right">
                价格    
            </label>
            <div class="col-md-6">
                <input type="text" class="form-control" v-model.number="price">
            </div>
        </div>
        <div class="form-group row">
            <label class="control-label col-md-4 text-right">
                折扣
            </label>
            <div class="col-md-6">
                <input type="text" class="form-control" v-model.number="discount">
            </div>
        </div>
        <div class="form-group row">
            <label class="control-label col-md-4 text-right">
                数量    
            </label>
            <div class="col-md-6">
                <input type="text" class="form-control" v-model.number="count" readonly="">
            </div>
        </div>
        <div class="form-group row">
            <label class="control-label col-md-4 text-right">
                备注    
            </label>
            <div class="col-md-6">
                <input type="text" class="form-control" v-model.trim="remark">
            </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body py-1 bg-info text-white">
      	航班信息

      	<a href="javascript:void(0);" @click.stop="importPnr()" class="btn btn-primary float-right">编码导入</a>
      </div>                  
      <table class="table table-sm">
        <thead>
        <tr>
            <th>出发</th>
            <th>到达</th>
            <th>日期</th>
            <th>航班号</th>
            <th>舱位</th>
            <th></th>
        </tr>
        </thead>
        <tr v-for="(flt, index) in flights">
          <td>{{flt.dport}}{{flt.dportName}}</td>
          <td>{{flt.aport}}{{flt.aportName}}</td>
          <td>{{flt.ddate}}</td>
          <td>{{flt.flightNo}}</td>
          <td>{{flt.subclass}}</td>
          <td>
                <a href="javascript:void(0)" @click.stop="deleteFlt(index)"  class="btn btn-sm btn-danger float-right">删除</a>
          </td>
        </tr>
      </table>
      <div class="card-body py-0 bg-info text-white">客人信息</div>                  
      <table class="table table-sm">
        <thead>
        <tr>
            <th>姓名</th>
            <th>证件号</th>
            <th>证件类型</th>
            <th>常旅客号</th>
            <th>联系电话</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in passengers">
            <tr>
              <td>
                <input type="text" class="form-control" placeholder="客人姓名" v-model.trim="info.name"/>
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
                  <input type="text" class="form-control" placeholder="常旅客号" v-model.trim="info.ffpNo" />
              </td>
              <td>
                  <input type="text" class="form-control" placeholder="联系电话" v-model.trim="info.mobile" />
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
          <a href="javascript:void(0);" @click.stop="addPsg()" class="btn btn-sm btn-success">增加客人</a>
        </span>
      </div>
    </div>
    <div class="card">
      <div class="card-body">      
        <div class="form-group row">

          <label class="col-2 control-label text-right">付款方式</label>
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="1" v-model.number="payType">
              <label class="form-check-label">现金</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="8" v-model.number="payType">
              <label class="form-check-label">账单</label>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <span class="ml-auto mr-auto">订单总额：<b>{{total}}</b></span>
        </div>
      </div>
      <div class="card-footer">        
        <button type="button" class="btn btn-primary" @click.stop.prevent="createVasOrder(0)">创建</button>  
        <button type="button" class="btn btn-primary ml-2" @click.stop.prevent="createVasOrder(1)">创建并继续</button>  
      </div>
    </div>
    
    <modal-pnr-content ref="modalPnrContent"></modal-pnr-content>
  </div>
</template>

<script>
  import { createVaasOrder } from '../../api/vas.js'
  import { searchFlightOrder } from '../../api/flight.js'
  import { searchProducts } from '../../api/product.js'
  import { processPnrDetail } from '../../api/user.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import ModalPnrContent from '../../components/my-modal-pnr-content.vue'

  export default {
    components: {
      MyDatePicker,
      ModalPnrContent
    },
    data () {
      return {
        costCenter: '',
        projectName: '',

        extras: [],
        passengers: [],
        flights: [],

        productCode: '',
        productName: '',
        productDesc: '',
        price: 0,
        discount: 0,
        remark: '',
        payType: 8,
        total: 0,
        flightOrderId: 0
      }
    },
    mounted: function () {
      this.searchExtraServices()

      const id = this.$route.query.flightOrderId
      if (id !== undefined) {
        this.flightOrderId = parseInt(id)
        // console.log(this.flightOrderId)
        
        let int1 = setInterval(() => {
          
          this.searchFlightOrder(this.flightOrderId)  
          
          clearInterval(int1)
        } ,100)
      }      
    },
    watch: {
      count: function () {
        this.calc()
      },
      price: function () {
        this.calc()
      },
      discount: function () {
        this.calc()
      },
      cost: function () {
        this.calc()
      },
      productCode: function (newVal) {
        this.setExtraInfo(newVal)
        this.calc()
      },
      customerId: function (newVal, oldVal) {
        console.log('customerId: ' + newVal + ', ' + oldVal)
        console.log('customerId: ' + typeof(newVal) + ', ' + oldVal)
      }
    },
    computed: {
      count: function () {
        return this.passengers.length
      }
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchFlightOrder: function (id) {
        searchFlightOrder(id,
          (jsonResult) => {
            // console.log(jsonResult)
            if (jsonResult !== null && jsonResult.id === id) {
              this.passengers.splice(0)
              for (let i = 0; i < jsonResult.passengers.length; i++) {
                const psg = jsonResult.passengers[i]
                this.passengers.push({
                  'name': psg.name, 
                  'idNo': psg.idNo, 
                  'idType': psg.idType, 
                  'ffpNo': psg.ffpNo, 
                  'mobile': psg.mobile
                })
              }

              if (jsonResult.customerType === 1) {
                console.log(this.customerId)
                this.customerId = jsonResult.customer.id
                console.log(this.customerId + '(' + typeof(this.customerId) + ')')
              }

              this.flights.splice(0)
              for (let i = 0; i < jsonResult.flights.length; i++) {
                this.flights.push(jsonResult.flights[i])
              }

              this.remark = jsonResult.orderDesc
            }
          }
        )
      },
      createVasOrder: function (next) {
        const params = {
          'flightOrderId': this.flightOrderId,
          'productCode': this.productCode,
          'productName': this.productName,
          'price': this.price,
          'discount': this.discount,
          'count': this.count,
          'costCenter': this.costCenter,
          'projectName': this.projectName,
          'payType': this.payType,
          'passengers': this.passengers,
          'flights': this.flights,
          'remark': this.remark
        }

        var jsonParams = JSON.stringify(params)

        createVaasOrder(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              if (next === 0) {                
                  this.$router.replace('/vaas/orders')
              } else if (next === 1) {
                this.reset()
              }
            }
          }
        )
      },
      calc: function () {
        this.total = this.count * (this.price - this.discount)
      },
      addPsg: function () {
        this.passengers.push({
          'name': '', 
          'idNo': '', 
          'idType': '', 
          'ffpNo': '', 
          'mobile': '' 
        })
      },
      deletePsg: function (index) {
        this.passengers.splice(index, 1)
      },
      addFlt: function () {
	      this.flights.push({
          'flightNo': '',
          'ddate': '',
          'subclass': '',
          'dport': '',
          'aport': '',
          'dtime': '',
          'atime': ''
	      })
      },
      deleteFlt: function (index) {
        this.flights.splice(index, 1)
      },
      reset: function () {
        // body...
        // this.customerId = 0
        this.productCode = ''
        this.productName = ''
        this.productDesc = ''
        this.price = 0
        this.discount = 0
        this.remark = ''
        // this.payType = 8
        this.total = 0
      },
      setExtraInfo: function (newCode) {
        this.productName = ''
        this.productDesc = ''
        this.price = 0
        this.discount = 0

        for (let i = 0; i < this.extras.length; i++) {
          const info = this.extras[i]
          if (info.productCode === newCode) {
            this.productName = info.productName
            this.productDesc = info.productDesc
            this.price = info.price
            this.discount = info.discount

			      let remark = ""
            if (info.excludedAirlines.length > 0) {
            	remark += "排除航司" + info.excludedAirlines
            }
            if (info.applicableAirlines.length > 0) {
            	if (remark.length > 0) {
            		remark += ", "
            	}
            	remark += "允许航司" + info.applicableAirlines
            }
            if (info.applicableAirports.length > 0) {
            	if (remark.length > 0) {
            		remark += ", "
            	}
            	remark += "允许机场" + info.applicableAirports
            }
            if (info.excludedAirports.length > 0) {
            	if (remark.length > 0) {
            		remark += ", "
            	}
            	remark += "排除机场" + info.excludedAirports
            }
            if (remark.length > 0) {
            	this.productDesc += "(" + remark + ")"
            }
          }
        }
      },
      searchExtraServices: function () {
        searchProducts(null, v => {
          this.extras = v.dataList
        })
      },
      importPnr: function () {
        this.$refs.modalPnrContent.modal().then((info) => {
          this.processPnrDetail(info.pnrContent)
        }).catch((ex) => {})
      },
      processPnrDetail: function (pnrDetail) {
        if (pnrDetail.length === 0) {
          this.showErrMsg('编码内容不能为空')
          return
        }
        const params = { 'pnrDetail': pnrDetail }

        processPnrDetail(params,
          v => {
            this.passengers.splice(0)
            this.flights.splice(0)

            for (const psg of v.passengers) {
              this.passengers.push({ 'name': psg.psgName, 'idNo': psg.idNo, 'idType': psg.idType })
            }

            for (const flt of v.flights) {
              this.flights.push({
                'flightNo': flt.flightNo,
                'ddate': flt.ddate,
                'subclass': flt.subclass,
                'dport': flt.dport,
                'aport': flt.aport,
                'dtime': flt.dtime,
                'atime': flt.dtime
              })
            }
          }
        )
      }

    }
  }

</script>