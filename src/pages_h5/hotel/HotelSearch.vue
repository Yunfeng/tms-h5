<template>
  <div id="hotel-search" class="card mt-5">
    <div class="card-header py-0 my-0">
      <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb py-1 my-0">
          <li class="breadcrumb-item" aria-current="page">酒店预订</li>
          <li class="breadcrumb-item active" aria-current="page">查询条件</li>
          <li class="breadcrumb-item ms-auto">
            <router-link to="/h5/hotel/orders">酒店订单</router-link>
          </li>
        </ol>
      </nav>
    </div>
    <div class="card-body">
      <form>
        <div class=" mb-1">
          <label class="col-3">城市</label>
          <div class="col-9">
            <my-select-city
              :cityId.sync="cityId"
              :cityList="cityList"
            ></my-select-city>
          </div>
        </div>

        <div class=" mb-1">
          <label class="col-3">入住日期</label>
          <div class="col-9">
            <my-date-picker
              id="checkInDate"
              v-model="checkIn"
              name="sc.beginDate"
              placeholder="入住日期"
            ></my-date-picker>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">离店日期</label>
          <div class="col-9">
            <my-date-picker
              id="checkOutDate"
              v-model="checkOut"
              name="sc.endDate"
              placeholder="离店日期"
            ></my-date-picker>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">房间数</label>
          <div class="col-9">
            <select
              class="form-control form-control-sm"
              v-model.number="roomCount"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">住客数</label>
          <div class="col-9">
            <select
              class="form-control form-control-sm"
              v-model.number="guestCount"
            >
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
            <span class="text-muted small">每间房入住的人数</span>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">酒店星级</label>
          <div class="col-9">
            <select
              class="form-control form-control-sm"
              v-model.number="hotelStar"
            >
              <option value="0">不限</option>
              <option value="1">一星</option>
              <option value="2">两星</option>
              <option value="3">三星</option>
              <option value="4">四星</option>
              <option value="5">五星</option>
            </select>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">早餐</label>
          <div class="col-9">
            <select
              class="form-control form-control-sm"
              v-model.number="breakfast"
            >
              <option value="0">不限</option>
              <option value="1">含早</option>
            </select>
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">酒店名称</label>
          <div class="col-9">
            <input
              type="textfield"
              class="form-control ml-1"
              size="10"
              placeholder="酒店名称"
              v-model.trim="hotelName"
            />
          </div>
        </div>
        <div class=" mb-1">
          <label class="col-3">行政区</label>
          <div class="col-9">
            <input
              type="textfield"
              class="form-control ml-1"
              size="10"
              placeholder="行政区"
              v-model.trim="district"
            />
          </div>
        </div>
        <div class=" mb-2">
          <label class="col-3">商圈</label>
          <div class="col-9">
            <input
              type="textfield"
              class="form-control ml-1"
              size="10"
              placeholder="商圈"
              v-model.trim="businessDistrict"
            />
          </div>
        </div>

        <div class="">
          <button
            type="button"
            class="btn btn-primary me-auto ms-auto"
            @click.stop="search()"
          >
            查找
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary me-auto ms-auto"
            @click.stop="reset()"
          >
            重置
          </button>
        </div>
      </form>
    </div>
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
    let date0 = new Date();
    let date1 = addDate(date0, 1);

    this.checkIn = date0.format("yyyy-MM-dd");
    this.checkOut = date1;

    this.getAllCity();
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
      });
    },
    search: function () {
      this.doSearch();
    },
    doSearch: function () {
      this.$router.push({
        path: "/h5/hotel/search-result",
        query: {
          cityId: this.cityId,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          roomCount: this.roomCount,
          guestCount: this.guestCount,
          hotelStar: this.hotelStar,
          hotelName: this.hotelName,
        },
      });
    },
    reset: function () {
      this.roomCount = 1;
      this.guestCount = 1;
      this.hotelStar = 0;
      this.hotelName = "";
      this.district = "";
      this.businessDistrict = "";
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
  },
};
</script>