<template>
  <div id="hotel-search-result" class="card mt-5">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb py-2 my-0">
          <li class="breadcrumb-item" aria-current="page"><router-link to="/h5/hotel/search">酒店预订</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">查询结果</li>
          <span class="ms-auto mr-1" @click.stop="back()">返回</span>
        </ol>
      </nav>

    <template v-for="info in dataList">
      <div
        class="row no-gutters align-items-center"
        @click.stop="showHotelDetail(info)"
        :key="info.id"
      >
        <div class="col-md-4">
          <img :src="info.pictures[0].url" class="card-img" alt="..." />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ info.hotelName }}</h5>
            <p class="card-text">
              {{ info.cityName }} {{ info.areaName }} {{ info.address }}
              <br />
              星级：{{ info.starRating }}
              <br />
              评星：{{ info.rstar }}
              <br />
              开业：{{ info.openYear }}
              <br />
              装修：{{ info.renovationYear }}
              <br />
              <span class="float-right text-danger">
                <small>¥</small>
                <strong>{{ info.lowestPrice }}</strong> 起
              </span>
            </p>
            <p class="card-text">
              <small class="text-muted"></small>
            </p>
          </div>
          <!-- end card-body-->
        </div>
        <!-- end col -->
      </div>
    </template>

    <nav id="pagination-box" class="float-right">
      <my-pagination
        name="pagination"
        :row-count="sc.rowCount"
        :page-total="sc.pageTotal"
        :page-no="sc.pageNo"
        @next-page="nextPage"
        @prev-page="prevPage"
        @direct-page="directPage"
      ></my-pagination>
    </nav>
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
import MyPagination from "../../components/my-pagination_h5.vue";
import MySelectCity from "../../components/my-select2-city.vue";

import { addDate } from "../../common/common.js";

export default {
  components: {
    MyDatePicker,
    MyPagination,
    MySelectCity,
  },
  data() {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
      },
      cityId: 2,
      checkIn: "",
      checkOut: "",
      roomCount: 1,
      guestCount: 1,
      hotelStar: 0,
      hotelName: "",
      district: "",
      businessDistrict: "",
      breakfast: 0,

      cityList: [],
    };
  },
  mounted: function () {
    console.log(this.$route.query);

    this.cityId = this.$route.query.cityId;
    this.checkIn = this.$route.query.checkIn;
    this.checkOut = this.$route.query.checkOut;
    this.roomCount = this.$route.query.roomCount;
    this.guestCount = this.$route.query.guestCount;
    this.hotelStar = this.$route.query.hotelStar;
    this.hotelName = this.$route.query.hotelName;
    this.district = this.$route.params.district;
    this.businessDistrict = this.$route.query.businessDistrict;
    this.breakfast = this.$route.query.breakfast;

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
    getAllCity: function () {
      getAllCity((v) => {
        this.cityList = v;
        console.log(this.cityList);
      });
    },
    search: function () {
      this.sc.pageNo = 1;
      this.doSearch();
    },
    doSearch: function () {
      this.dataList.splice(0);
      this.showLoading();

      const params = {
        "sc.pageNo": this.sc.pageNo,
        "sc.pageSize": this.sc.pageSize,
        "sc.cityId": this.cityId,
        "sc.checkInDate": this.checkIn,
        "sc.checkOutDate": this.checkOut,
        "sc.roomCount": this.roomCount,
        "sc.guestCount": this.guestCount,
        "sc.hotelStar": this.hotelStar,
        "sc.hotelName": this.hotelName,
        "sc.district": this.district,
        "sc.businessDistrict": this.businessDistrict,
        "sc.breakfast": this.breakfast,
      };

      console.log(params);

      const dateBegin = new Date(); //获取当前时间

      searchHotels(
        params,
        (v) => {
          if (v.rowCount > 0) {
            this.dataList = v.masterHotels;

            this.sc.pageTotal = v.pageTotal;
            this.sc.rowCount = v.rowCount;
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
      this.sc.pageNo = 1;
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
        path: "/hotel/order_v2",
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
    showHotelDetail: function (info) {
      this.$router.push({
        path: "/h5/hotel/detail",
        query: {
          cityId: this.cityId,
          hotelId: info.id,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          roomCount: this.roomCount,
          guestCount: this.guestCount,
        },
      });
    },
    prevPage: function () {
      this.sc.pageNo = this.sc.pageNo - 1;
      if (this.sc.pageNo < 1) this.sc.pageNo = 1;
      this.doSearch();
    },
    nextPage: function () {
      this.sc.pageNo = this.sc.pageNo + 1;
      this.doSearch();
    },
    directPage: function (pageNo) {
      this.sc.pageNo = pageNo;
      this.doSearch();
    },
  },
};
</script>