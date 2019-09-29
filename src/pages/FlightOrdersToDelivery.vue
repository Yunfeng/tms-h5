<template>
  <div id="flight-orders">
    <div class="card">
      <div class="card-header bg-info text-white">
        机票送票单
      </div>
      <div class="card-body">
        <form class="form-inline">
          <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
          <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          <button type="button" class="btn btn-primary ml-2" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
        </form>
      </div>
    </div>
  <table id="flight-order-list" class="table table-sm table-striped table-hover small">
    <thead>
        <tr>
            <th>送票日期</th>
            <th>地址</th>
            <th>乘机人</th>
            <th colspan="6" class="bg-info text-center text-white">行程</th>
            <th>订单金额</th>
            <th>付款方式</th>
            <th>行程单?</th>
            <th>状态</th>
            <th></th>
        </tr>                        
    </thead>
    <tbody>
      <template v-for="(info, index) in dataList">
        <tr :class="{'text-muted': info.status === 4}">
            <td>{{info.deliveryDate}}</td>
            <td>{{info.itineraryMailingAddress}}</td>
            <td>
              <template v-if="info.psgCount > 3">
                {{info.psgCount}}人
              </template>
              <template v-else>
                <template v-for="(psg, index) in info.passengers">
                  {{psg.name}}<template v-if="index < info.passengers.length - 1">,</template>
                </template>
              </template>              
            </td>
            <td>
              <template v-for="(flt, index) in info.flights">
                <small class="text-success">{{flt.flight.departureAirport}}</small>
                {{flt.flight.departureAirportName}}
                <template v-if="index < info.flights.length - 1 "><br/></template>
              </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  <small class="text-success">{{flt.flight.arrivalAirport}}</small>
                  {{flt.flight.arrivalAirportName}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  {{flt.flight.departureDate}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  {{flt.flight.flightNo}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
            </td>
            <td>
                <template v-for="(flt, index) in info.flights">
                  {{flt.flight.subclass}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
            </td>
            <td class="text-center">
                <template v-for="(flt, index) in info.flights">
                  {{flt.flight.departureTime}}-{{flt.flight.arrivalTime}}
                  <template v-if="index < info.flights.length - 1 "><br/></template>
                </template>
            </td>
            <td class="text-right">{{info.totalAmount}}</td>
            <td>
              {{getPayTypeDesc(info.payType)}}
              <span class="small text-danger" v-if="info.payType !== 8 && info.payStatus ===0">(未收)</span>
            </td>
            <td>
              {{getItineraryTypeDesc(info.itineraryType)}}
              <span class="small text-danger" v-if="info.itineraryMailingStatus === 0">(未寄)</span>
              <span class="small text-success" v-if="info.itineraryMailingStatus === 1">(已送)</span>
            </td>
            <td>{{getStatusDesc(info.status)}}</td>
            <td>
              <template v-if="info.status !== 4 && info.status !== 32">
                <router-link :to="`/flt/order/` + info.id" class="small">处理</router-link>  
              </template>
              <template v-else>
                <router-link :to="`/flt/order/` + info.id" class="small text-info">查看</router-link>  
              </template>

              <router-link :to="`/flt/order/` + info.id + `/print`" target="_blank" class="float-right">打印</router-link>
            </td>
        </tr>
    
      </template>

    </tbody>
  </table>
          
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
    </nav>
  </div>
</template>

<script>
  import { searchFlightOrdersToDelivery } from '../api/flight.js'
  import { showFlightOrderStatus, showPayType, showItineraryType } from '../common/common.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    name: 'MyDeliveryFlightOrders',
    components: {
      MyDatePicker,
      MyPagination
    },
    data () {
      return {
        dataList: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
        },

        beginDate: '',
        endDate: '',
        name: '',
        idno: '',
        status: -1
      }
    },
    mounted: function () {
      // console.log('mounted')
      // this.search()
    },
    activated: function () {
      // console.log('activated')
      this.search()
    },
    methods: {
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate
        }
        searchFlightOrdersToDelivery(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          }
        )
      },
      quickSearch: function (status) {
        this.status = status
        this.search()
      },
      reset: function () {
        this.name = ''
        this.idno = ''
        this.beginDate = ''
        this.endDate = ''
        this.status = -1
        this.sc.pageNo = 1
        this.search()
      },
      getStatusDesc: function (status) {
        return showFlightOrderStatus(status)
      },
      getPayTypeDesc: function (payType) {
        return showPayType(payType)
      },
      getItineraryTypeDesc: function (itineraryType) {
        return showItineraryType(itineraryType)
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.search()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.search()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.search()
      }
    }
  }
</script>