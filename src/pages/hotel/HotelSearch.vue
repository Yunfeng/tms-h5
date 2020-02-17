<template>
  <div id="hotel-search">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/hotel/orders'>酒店</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">查找</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>  

    
                                                 

    <div class="card">
      <div class="card-body py-1">
        <form class="form-inline" id="frmSearch">
          城市
          <div class="form-group col-1"> 
            <my-select-city :cityId.sync="cityId"></my-select-city>
          </div>
           
          <div class="form-group">      
            <my-date-picker id="checkInDate" v-model="checkIn" name="sc.beginDate" placeholder="入住日期"></my-date-picker>
            <my-date-picker id="checkOutDate" v-model="checkOut" name="sc.endDate" placeholder="离店日期"></my-date-picker>
          </div>
          房间数
          <select class="form-control form-control-sm" v-model.number="roomCount">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          住客数/间 
          <select class="form-control form-control-sm" v-model.number="guestCount">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          酒店星级
          <select class="form-control form-control-sm" v-model.number="hotelStar">
            <option value="0">不限</option>
            <option value="1">一星</option>
            <option value="2">两星</option>
            <option value="3">三星</option>
            <option value="4">四星</option>
            <option value="5">五星</option>
          </select>
          <input type="textfield" class="form-control ml-1" size="10" placeholder="酒店名称" v-model.trim="hotelName">
          <input type="textfield" class="form-control ml-1" size="10" placeholder="行政区" v-model.trim="district">
          <input type="textfield" class="form-control ml-1" size="10" placeholder="商圈" v-model.trim="businessDistrict">

          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div> 
        </form>
      </div>
      <div class="card-body py-0">
        <nav id="pagination-box" class="float-right">
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
      </nav>
      </div>
      <table class="table table-sm small">
        <tbody>
          <template v-for="info in dataList" >
            <tr :key="info.id">
              <td class="col-1">
                <h5>{{info.hotelName}}</h5>
                {{info.brandName}}<br/>
                {{info.cityName}} {{info.areaName}} {{info.address}}<br/>
                星级：{{info.starRating}}<br/>
                评星：{{info.rstar}}<br/>
                开业：{{info.openYear}}<br/>
                装修：{{info.renovationYear}}<br/>
                HotelId: {{info.supplierHotelId}}<br />
                MasterHotelId: {{info.supplierMasterHotelId}}
              </td>
              <td class="col-2">
                <div :id="`carouselExampleIndicators` + info.id" class="carousel slide" data-ride="carousel">
                  <ol class="carousel-indicators">
                    <li :data-target="`#carouselExampleIndicators` + info.id" :data-slide-to="index" :class="{active: index === 0}" v-for="(pic, index) in info.pictures" :key="index"></li>
                  </ol>
                  <div class="carousel-inner">
                    <div class="carousel-item" :class="{active: index === 0}" v-for="(pic, index) in info.pictures" :key="index">
                      <img :src="pic.url" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                             <h5>{{pic.caption}}</h5>
                          </div>
                    </div>
                  </div>
                  <a class="carousel-control-prev" :href="`#carouselExampleIndicators` + info.id" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" :href="`#carouselExampleIndicators` + info.id" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
              </td>
              <td class="">
                <template v-if="info.roomTypes.length > 0">
                  <template v-for="(roomTypeInfo, index) in info.roomTypes">
                    <div class="accordion custom-accordion py-0" :id="`custom-accordion-` + roomTypeInfo.roomTypeId" :key="index">
                      <div class="card mb-0">
                        <div class="card-header" :id="`heading-` + roomTypeInfo.roomTypeId">
                            <h5 class="m-0">
                                <a class="custom-accordion-title d-block py-1" :class="{collapsed: index !==0}"
                                    data-toggle="collapse" :href="`#collapse-` + roomTypeInfo.roomTypeId">
                                    {{roomTypeInfo.roomTypeName}} ({{roomTypeInfo.ratePlans.length}}) <i class="mdi mdi-chevron-down accordion-arrow"></i>
                                </a>
                            </h5>
                        </div>
                            
                        <div :id="`collapse-` + roomTypeInfo.roomTypeId" class="collapse" :class="{show: index === 0}"
                            :data-parent="`#custom-accordion-` + roomTypeInfo.roomTypeId">
                            <div class="card-body py-0">
                              <table class="table table-sm py-0 my-0">
                                <tr v-for="(ratePlan, index) in roomTypeInfo.ratePlans" :key="index">
                                  <td class="col-2">{{ratePlan.roomName}}</td>
                                  <td class="col-1">
                                    <template v-if="ratePlan.cancelPolicies.length > 0">
                                      <span class="text-danger" v-if="ratePlan.cancelPolicies[0].canCancel === false">不可取消</span>
                                    </template>
                                  </td>
                                  <td class="py-0">
                                    <table>
                                      <tr v-for="(rate, index) in ratePlan.rates" class="py-0" :key="index">
                                        <td class="col-1">{{rate.startDate}}</td>
                                        <td class="col-1">{{rate.currency}}</td>
                                        <td class="col-1">{{rate.exclusiveAmount}}</td>
                                        <td class="col-1"><strong>{{rate.inclusiveAmount}}</strong> (含税)</td>
                                        <td class="col-1">
                                          <span v-if="rate.saleStatus === 0">满房</span>
                                          <span v-if="rate.saleStatus === 1">销售(可超)</span>
                                          <span v-if="rate.saleStatus === 2">限量(不可超)</span>
                                        </td>
                                        <td class="col-1">
                                          <span>{{getMealTypeDesc(rate.mealType)}}</span> 
                                        </td>
                                        <td class="col-1">
                                          份数：{{rate.mealCount}}
                                        </td>
                                        <td class="col-1">
                                          <span v-if="rate.instantConfirm === 1">立即确认</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td class="col-1">
                                    <template v-if="ratePlan.saleStatus === 0">
                                      <button class="btn btn-disabled">满房</button>
                                    </template>
                                    <template v-else>
                                      <button class="btn btn-success" @click.stop="getReservation(info.id, info.hotelName, roomTypeInfo.roomTypeId, roomTypeInfo.roomTypeName, ratePlan.roomId, ratePlan.roomName)">预订</button>
                                    </template>
                                    
                                  </td>
                                </tr>
                              </table>
                            </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <span class="float-right text-danger ml-auto">无可用价格</span>
                </template>  
              </td>
            </tr>
          </template>
            <tr v-if="dataList.length ===0">
              <td colspan="18" class="text-center">未找到符合的数据</td>
            </tr>
        </tbody>
      </table>
    </div>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>	
</template>

<script>
  import { searchHotels, showHotelOrderStatus, showMealTypeDesc, getAllCity } from '../../api/hotel.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MyPagination from '../../components/my-pagination.vue'
  import MySelectCity from '../../components/my-select2-city.vue'

  import { addDate } from '../../common/common.js'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCity
    },
    data () {
      return {
        dataList: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        cityId: 2,
        checkIn: '',
        checkOut: '',
        roomCount: 1,
        guestCount: 1,
        hotelStar: 0,
        hotelName: '',
        district: '',
        businessDistrict: '',
        hotelType: 0,

        cityList: []
      }
    },
    mounted: function () {
      let date0 = new Date()
      let date1 = addDate(date0, 1)

      console.log(date0)
      console.log(date1)

      this.checkIn = date0.format('yyyy-MM-dd')
      this.checkOut = date1

      this.getAllCity()
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
      getAllCity: function () {
        getAllCity(v => {
          this.cityList = v
          console.log(this.cityList)
        })
      }, 
      search: function () {
        this.sc.pageNo = 1
        this.doSearch()
      },
      doSearch: function () {
        this.dataList.splice(0)
        this.showLoading()

        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.cityId': this.cityId,
          'sc.checkInDate': this.checkIn,
          'sc.checkOutDate': this.checkOut,
          'sc.roomCount': this.roomCount,
          'sc.guestCount': this.guestCount,
          'sc.hotelStar': this.hotelStar,
          'sc.hotelName': this.hotelName,
          'sc.district': this.district,
          'sc.businessDistrict': this.businessDistrict,
          'sc.hotelType': this.hotelType
        }

        const dateBegin = new Date();//获取当前时间


        searchHotels(params, 
          v => {
            if (v.rowCount > 0) {
              this.dataList = v.hotels

              this.sc.pageTotal = v.pageTotal
              this.sc.rowCount = v.rowCount
            }
          },
          () => { 
            this.hideLoading() 
            const dateDiff = new Date().getTime() - dateBegin.getTime();//时间差的毫秒数
            console.log("search elapsed: " + dateDiff)
          }
        )
      },
      reset: function () {
        this.sc.pageNo = 1
        this.roomCount = 1
        this.guestCount = 1
        this.hotelStar = 0
        this.hotelName = ''
        this.district = ''
        this.businessDistrict = ''
      },
      getStatusDesc: function (status) {
        return showHotelOrderStatus(status)
      },   
      getMealTypeDesc: function (type) {
        return showMealTypeDesc(type)
      },
      getReservation: function (hotelId, hotelName, roomTypeId, roomTypeName, roomId, roomName, price) {
        const checkIn = this.checkIn
        const checkOut = this.checkOut
        const roomCount = this.roomCount

        // router.push({ path: 'register', query: { plan: 'private' } })
        this.$router.push({path: "/hotel/order_v2", query: {hotelId, hotelName, roomId, roomName, checkIn, checkOut, roomCount}})
      },  
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.doSearch()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.doSearch()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.doSearch()
      }
    }
  }
</script>