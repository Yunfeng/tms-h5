<template>
  <div id="hotel-order-new" class="mt-5">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/h5/hotel/orders">酒店订单</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">新建</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <div class="card">
      <div class="card-body bg-info text-white py-1">酒店信息</div>
      <div class="card-body">
        <dl class="row mb-2">
          <dt class="col-3 text-right">酒店名称</dt>
          <dd class="col-9">
            <input type="text" class="form-control" v-model="hotelName" />
          </dd>
          <dt class="col-3 text-right">房型</dt>
          <dd class="col-9">
            <input type="text" class="form-control" v-model="roomType" />
          </dd>
          <dt class="col-3 text-right">房间数量</dt>
          <dd class="col-9">
            <input type="text" class="form-control" v-model.number="roomCount" />
          </dd>
          <dt class="col-3 text-right">入住日期</dt>
          <dd class="col-9">
            <my-date-picker id="checkInDate" v-model="checkInDate"></my-date-picker>
          </dd>
          <dt class="col-3 text-right">离店日期</dt>
          <dd class="col-9">
            <my-date-picker id="checkOutDate" v-model="checkOutDate"></my-date-picker>
          </dd>
        </dl>
      </div>
      <div class="card-body bg-info text-white py-1">入住人信息</div>
      <table class="table table-sm mb-0">
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in passengers">
            <td>
              <input type="text" class="form-control" v-model="info.name" />
            </td>
            <td>
              <input type="text" class="form-control" v-model="info.mobile" />
            </td>
            <th>
              <a
                href="javascript:void(0);"
                @click.stop="addPsg()"
                class="btn btn-sm btn-success"
                v-if="index ===0"
              >增加</a>
              <a
                href="javascript:void(0);"
                @click.stop="delPsg(index)"
                class="btn btn-sm btn-danger"
                v-if="index > 0"
              >移除</a>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-body bg-info text-white py-1">价格信息</div>
    <div class="card-body py-1">
      <div class="card-group">
        <div
          class="card bg-white mb-3"
          style="max-width: 10rem;"
          v-for="(rp, index) of roomPrices"
          :key="index"
        >
          <div class="card-body py-0 px-1">
            <h5 class="card-title">{{rp.effectiveDate}}</h5>
            <p class="card-text">{{rp.inclusiveAmount}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body bg-info text-white py-1">价格信息</div>
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>
              销售价/间夜
              <input type="text" class="form-control" v-model.number="price" />
            </td>
            <td>
            </td>
            <td>
              服务费
              <input type="text" class="form-control" v-model.number="serviceCharge" />
            </td>
          </tr>
          <tr>
            <td>
              实收总额:
              <big class="text-success">{{totalAmount}}</big>
            </td>
            <td></td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="card-body py-2">
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
       <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  最晚到店时间    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model.trim="lastArriveTime" />
                  <span class="small text-muted">格式示例:  18:30</span>
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  联系人    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model.trim="linkman" />
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  联系电话    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model.trim="contactPhone" />
              </div>
          </div>
          <div class="form-group row  mb-1">
              <label class="control-label col-3 text-right">
                  备注    
              </label>
              <div class="col-9">
                  <input type="text" class="form-control" v-model="remark" />
              </div>
          </div>
      </div>
      <div class="card-footer text-center">
        <button type="button" class="btn btn-success btn-lg" @click.stop="save($event.target)">保存</button>
        <button type="button" class="btn btn-secondary btn-sm ml-5" @click.stop="cancel()">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import moment from 'moment'
  import { SUPPLIER_HOTEL } from '../../common/const.js'
  import { createHotelOrder, searchRoomPrices } from '../../api/hotel.js'
                             
  import { searchNotesByCustomer } from '../../api/customer.js'

  import MyDatePicker from '../../components/my-datepicker.vue'
  import MySelectIncome from '../../components/my-select-income.vue'

  import SelectCustomer from '../../components/select-customer-costcenter.vue'
  import MySupplierPayment from '../../components/my-supplier-payment.vue'

  export default {
    props: {
      id: {
        type: String,
        default: 'modalPrompt'
      }
    },
    components: {
      MyDatePicker,
      MySelectIncome,

      SelectCustomer,
      MySupplierPayment
    },
    data () {
      return {
        roomPrices: [],

        supplierId: 0,
        paymentId: 0,

        customerId: 0,
        costCenter: '',
        projectName: '',
        passengers: [],
        hotelId: 0,
        hotelName: '',
        roomId: 0,
        roomType: '',
        roomCount: 1,
        checkInDate: '',
        checkOutDate: '',
        price: 0,
        bottomPrice: 0,
        serviceCharge: 0,
        remark: '',
        payType: 8,
        payRemark: '',
        count: 0,
        totalAmount: 0,
        totalCost: 0,
        profit: 0,

        nights: 0,
        lastArriveTime: '18:30',
        linkman: '',
        contactPhone: ''
      }
    },
    computed: {
      supplierType: function () {
        return SUPPLIER_HOTEL
      },
      psgCount: function () { return this.passengers.length }
    },
    watch: {
      customerId: function (newVal) {
        this.getCostCenters()
      },
      serviceCharge: function () {
        this.calc()
      },
      price: function () {
        this.calc()
      },
      bottomPrice: function () {
        this.calc()
      },
      checkInDate: function () {
        this.calcNights()
      },
      checkOutDate: function () {
        this.calcNights()
      },
      roomCount: function () {
        this.calc()
      }
    },
    mounted: function () {
      // console.log('mounted')
      // this.init()
      this.addPsg()
      // ?hotelId=1&hotelName=上海虹桥元一希尔顿酒店&roomId=8&roomName=单卧室儿童套房(中宾)(特价)(双早)&checkIn=2019-12-24&checkOut=2019-12-25
      this.hotelId = this.$route.query.hotelId
      this.hotelName = this.$route.query.hotelName
      this.roomId = this.$route.query.roomId
      this.roomType = this.$route.query.roomName
      this.checkInDate = this.$route.query.checkIn
      this.checkOutDate = this.$route.query.checkOut
      this.roomCount = this.$route.query.roomCount
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      searchRoomPrice: function () {
        const params = {
          'roomId': this.roomId,
          'checkInDate': this.checkInDate,
          'checkOutDate': this.checkOutDate
        }

        searchRoomPrices(params, v => {
          this.roomPrices = v
          // console.log(this.roomPrices)
          this.calc()
        })
      },
      init: function () {
        this.customerId = 0
        this.hotelName = '上海便宜酒店'
        this.passengerName = '张三'
        this.checkInDate = '2018-12-28'
        this.checkOutDate = '2018-12-31'
        this.roomType = "标准间"

        this.calc()
      },
      addPsg: function () {
        this.passengers.push({
          'name': '',
          'mobile': '',
          'coachNo': '',
          'seatNo': ''
        })
      },
      delPsg: function (index) {
        this.passengers.splice(index, 1)
      },
      save: function (btn) {
        $(btn).attr('disabled', true)
        const params = {
          'customerId': this.customerId,
          'costCenter': this.costCenter,
          'projectName': this.projectName,
          // 'passengerName': this.passengerName,
          'hotelId': this.hotelId,
          'hotelName': this.hotelName,
          'roomId': this.roomId,
          'roomType': this.roomType,
          'roomCount': this.roomCount,
          'checkInDate': this.checkInDate,
          'checkOutDate': this.checkOutDate,
          'price': this.price,
          'bottomPrice': this.bottomPrice,
          'serviceCharge': this.serviceCharge,
          'remark': this.remark,
          'supplierId': this.supplierId,
          'paymentMethodId': this.paymentId,
          'payType': this.payType,
          'payRemark': this.payRemark,
          'count': this.count,
          'totalAmount': this.totalAmount,
          'totalCost': this.totalCost,
          'profit': this.profit,
          'passengers': this.passengers,
          'lastArriveTime': this.lastArriveTime,
          'linkman': this.linkman,
          'contactPhone': this.contactPhone,
          'prices': this.roomPrices
        }

        createHotelOrder(JSON.stringify(params),
          (v) => {
            console.log(v)
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('创建成功')
              const url = '/h5/hotel/order/' + v.returnCode
              console.log(url)
              this.$router.push(url)
            }
          },
          () => { $(btn).attr('disabled', false) }
        )
      },
      reset: function () {
        this.customerId = 0
        this.costCenter = ''
        this.projectName = ''
        this.hotelName = ''
        this.roomType = ''
        this.roomCount = 1
        this.ddate = ''
        this.leaveDate = ''
        this.price = 0
        this.serviceCharge = 0
        this.remark = ''
        this.payType = 0
        this.payRemark = ''
        this.linkman = ''
        this.contactPhone = ''
      },
      calcNights: function () {
        //根据入住日期和离店日期计算入住几晚
        console.log("calcNights: " + this.checkInDate + ", " + this.checkOutDate)

        const days = moment(this.checkOutDate).diff(moment(this.checkInDate), 'days')
        if (isNaN(days) || days < 1) {
          console.error('Nights is invalid for ' + this.checkInDate + ', ' + this.checkOutDate)
          this.nights = 0
        } else {
          this.nights = days
          this.searchRoomPrice()
        }
      },
      calc: function () {
        console.log('calc')
        if (isNaN(this.roomCount) || !moment(this.checkInDate).isValid() || !moment(this.checkOutDate).isValid) {
          console.error(this.roomCount + ', ' + this.checkInDate + ', ' + this.checkOutDate)
          return
        }

        //计算每晚均价
        this.calcAvgPrice();

        this.count = this.roomCount * this.nights
        
        this.totalAmount = this.count * this.price + this.serviceCharge
        this.totalAmount = Math.round(this.totalAmount * 100) / 100

        this.totalCost = this.bottomPrice * this.count
        this.totalCost = Math.round(this.totalCost * 100) / 100

        this.profit = this.totalAmount - this.totalCost
        this.profit = Math.round(this.profit * 100) / 100
      },
      calcAvgPrice: function () {
        let total = 0
        for(let info of this.roomPrices) {
          // console.log(info)
          total = total + info.inclusiveAmount
          // console.log(total)
        }

        this.bottomPrice = Math.round(total * 100 / this.nights) / 100
        this.price = this.bottomPrice
      }
    }
  }
</script>
