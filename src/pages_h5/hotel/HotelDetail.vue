<template>
  <div id="hotel-detail" class="card mt-5">
  <div class="card-header py-0 my-0">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb py-1 my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link to="/h5/hotel/search">酒店预订</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">酒店详情</li>
          <span class="ml-auto mr-1" @click.stop="back()">返回</span>
        </ol>
      </nav>
    </div>
    <template v-if="detail !== null">
      <div class="row no-gutters align-items-center">
        <div class="col-md-4">
          <img :src="detail.pictures[0].url" class="card-img" alt="..." />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{detail.hotelName}}</h5>
            <p class="card-text">
              {{detail.cityName}} {{detail.areaName}} {{detail.address}}
              <br />
              星级：{{detail.starRating}}
              <br />
              评星：{{detail.rstar}}
              <br />
              开业：{{detail.openYear}}
              <br />
              装修：{{detail.renovationYear}}
            </p>
          </div>
          <!-- end card-body-->
        </div>
        <!-- end col -->
      </div>
      <template v-for="(roomTypeInfo, index) in detail.roomTypes">
        <div
          class="accordion custom-accordion py-0"
          :id="`custom-accordion-` + roomTypeInfo.supplierRoomTypeId"
          :key="index"
        >
          <div
            class="row no-gutters align-items-center"
            :id="`heading-` + roomTypeInfo.supplierRoomTypeId"
          >
            <div class="col-4">
              <img
                src="http://images4.c-ctrip.com/target/fd/hotelcomment/g4/M02/E5/70/CggYHlXIXPyASTzdAAHLw6KzDK4053_Y_600_400.jpg"
                class="card-img"
                alt="..."
              />
            </div>
            <div class="col-8">
              <div class="card-body">
                <h5 class="card-title">{{roomTypeInfo.roomTypeName}}</h5>
                <p
                  class="card-text"
                >{{roomTypeInfo.areaRange}}m² {{showWindow(roomTypeInfo.hasWindow)}}</p>

                <a
                  class="custom-accordion-title d-block py-1"
                  :class="{collapsed: index !==0}"
                  data-bs-toggle="collapse"
                  :href="`#collapse-` + roomTypeInfo.supplierRoomTypeId"
                >
                  <i class="mdi mdi-chevron-down accordion-arrow"></i>
                </a>

                <p class="card-text">
                  <small
                    class="text-muted"
                  >房间数：{{roomTypeInfo.roomQuantity}} 楼层：{{roomTypeInfo.floorRange}}</small>
                </p>
              </div>
              <!-- end card-body-->
            </div>
            <!-- end col -->
          </div>

          <div class="card mb-0">
            <div
              :id="`collapse-` + roomTypeInfo.supplierRoomTypeId"
              class="collapse"
              :class="{show: index === 0}"
              :data-parent="`#custom-accordion-` + roomTypeInfo.supplierRoomTypeId"
            >
              <template v-for="(ratePlan, index) in roomTypeInfo.ratePlans">
                <div class="card-body" :key="index">
                  <!-- 早餐 -->
                  <template v-if="ratePlan.rates.length > 0">
                    <span v-if="ratePlan.rates[0].mealCount === 0">无餐食</span>
                    <span
                      class="text-success"
                      v-else
                    >{{ratePlan.rates[0].mealCount}}份{{getMealTypeDesc(ratePlan.rates[0].mealType)}}</span>
                  </template>

                  <span class="ml-1">可住{{ratePlan.maxAdultCount}}人</span>

                  <template v-if="ratePlan.cancelPolicies.length > 0">
                    <span
                      class="text-danger ml-1"
                      v-if="ratePlan.cancelPolicies[0].canCancel === false"
                    >不可取消</span>
                  </template>
                  <br />

                  <template v-for="(bedInfo, index) in ratePlan.beds">
                    <span>{{bedInfo.numberOfBeds}}张{{bedInfo.bedWidth}}m{{bedInfo.roomBedName}}</span>
                    <span v-if="index < ratePlan.beds.length-1">或</span>
                  </template>

                  <br />
                  <template v-if="ratePlan.rates.length > 0">
                    <span class="text-success" v-if="ratePlan.rates[0].instantConfirm === 1">立即确认</span>
                  </template>
                  

                  <!-- 
                    <template v-for="(rate, index) in ratePlan.rates">
                      <ul class="list-inline">
                        <li class="list-inline-item">{{rate.startDate}}</li>
                        <li class="list-inline-item">{{rate.currency}}</li>
                        <li class="list-inline-item"><strong>{{rate.inclusiveAmount}}</strong> (含税)</li>
                        <li class="list-inline-item">
                          <span v-if="rate.saleStatus === 0">满房</span>
                          <span v-if="rate.saleStatus === 1">销售(可超)</span>
                          <span v-if="rate.saleStatus === 2">限量(不可超)</span>
                        </li>
                        <li class="list-inline-item">
                          <span>{{rate.mealCount}}份{{getMealTypeDesc(rate.mealType)}}</span>
                        </li>
                        <li class="list-inline-item">
                          <span v-if="rate.instantConfirm === 1">立即确认</span>
                        </li>
                      </ul>
                      
                    </template>
                  
                  -->

                  <template v-if="ratePlan.saleStatus === 0">
                    <button class="btn btn-disabled float-right">满房</button>
                  </template>
                  <template v-else>
                    <span class="float-right">
                      <template v-if="ratePlan.rates.length > 0">
                        <span class="text-danger mr-2">
                          <small>¥</small>
                          <strong>{{ratePlan.rates[0].inclusiveAmount}}</strong>
                        </span>
                      </template>
                      
                      <button
                        class="btn btn-success"
                        @click.stop="getReservation(ratePlan.hotelId, detail.hotelName, roomTypeInfo.roomTypeId, roomTypeInfo.roomTypeName, ratePlan.roomId, ratePlan.roomName)"
                      >预订</button>
                    </span>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import {
  searchHotels,
  showHotelOrderStatus,
  showMealTypeDesc,
  getAllCity,
} from "../../api/hotel.js";
import MyDatePicker from "../../components/my-datepicker.vue";
import MySelectCity from "../../components/my-select2-city.vue";

import { addDate } from "../../common/common.js";

export default {
  components: {
    MyDatePicker,
    MySelectCity,
  },
  data() {
    return {
      detail: null,
      cityId: 2,
      hotelId: 0,
      checkIn: "",
      checkOut: "",
      roomCount: 1,
      guestCount: 1,
      breakfast: 0,
    };
  },
  mounted: function () {
    this.cityId = this.$route.query.cityId;
    this.hotelId = this.$route.query.hotelId;
    this.checkIn = this.$route.query.checkIn;
    this.checkOut = this.$route.query.checkOut;
    this.roomCount = this.$route.query.roomCount;
    this.guestCount = this.$route.query.guestCount;

    this.search();
  },
  methods: {
    back: function () {
      this.$router.go(-1);
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch("showAlertMsg", {
        errMsg: msg,
        errMsgType: msgType,
      });
    },
    showLoading: function (loadingText) {
      this.$store.commit("showLoading", {
        loading: true,
        loadingText: loadingText,
      });
    },
    hideLoading: function () {
      this.$store.commit("showLoading", { loading: false });
    },
    search: function () {
      this.showLoading();

      const params = {
        "sc.cityId": this.cityId,
        "sc.hotelId": this.hotelId,
        "sc.checkInDate": this.checkIn,
        "sc.checkOutDate": this.checkOut,
        "sc.roomCount": this.roomCount,
        "sc.guestCount": this.guestCount,
        "sc.breakfast": this.breakfast,
      };

      const dateBegin = new Date(); //获取当前时间

      searchHotels(
        params,
        (v) => {
          console.log(v);
          if (v.masterHotels.length === 1) {
            this.detail = v.masterHotels[0];
          } else {
            console.log("error");
          }
        },
        () => {
          this.hideLoading();
          const dateDiff = new Date().getTime() - dateBegin.getTime(); //时间差的毫秒数
          console.log("search elapsed: " + dateDiff);
        }
      );
    },
    reset: function () {
      this.roomCount = 1;
      this.guestCount = 1;
      this.hotelStar = 0;
      this.hotelName = "";
      this.district = "";
      this.businessDistrict = "";
    },
    getStatusDesc: function (status) {
      return showHotelOrderStatus(status);
    },
    getMealTypeDesc: function (type) {
      return showMealTypeDesc(type);
    },
    showWindow: function (status) {
      if (status == "2") {
        return "有窗";
      } else {
        return status;
      }
    },
    getReservation: function (
      hotelId,
      hotelName,
      roomTypeId,
      roomTypeName,
      roomId,
      roomName,
      price
    ) {
      const checkIn = this.checkIn;
      const checkOut = this.checkOut;
      const roomCount = this.roomCount;

      // router.push({ path: 'register', query: { plan: 'private' } })
      this.$router.push({
        path: "/h5/hotel/order",
        query: {
          hotelId,
          hotelName,
          roomId,
          roomName,
          checkIn,
          checkOut,
          roomCount,
        },
      });
    },
  },
};
</script>