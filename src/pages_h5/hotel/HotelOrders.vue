<template>
  <div id="hotel-orders" class="card mt-5 row bg-transparent">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item ml-2" aria-current="page">
          <router-link to='/h5/home'>主页</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">酒店订单</li>
        <li class="breadcrumb-item ml-auto mr-2"><router-link to='/h5/hotel/search'>国内酒店</router-link></li>
      </ol>
    </nav>
    <template v-if="searchOption === false">
      <div class="card-header">

        <button
          type="button"
          class="btn btn-primary float-right"
          @click.stop="showSearchOption()"
        >查找</button>
      </div>
      <hotel-order-list :dataList="dataList"  ></hotel-order-list>

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
    </template>
    <template v-else>
      <div class="card-body py-1" v-show="searchOption">
        <form>
          
          <div class="form-group">
            <my-date-picker
              id="beginDate"
              v-model="beginDate"
              name="sc.beginDate"
              placeholder="开始日期"
            ></my-date-picker>
          </div>
          <div class="form-group">
            <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              size="6"
              placeholder="订单号"
              v-model.trim="orderNo"
            />
          </div>
          <div class="form-group">
            <my-select-customer :customerId.sync="customerId" :enterpriseType="1"></my-select-customer>
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control ml-1"
              size="10"
              placeholder="入住人"
              v-model.trim="name"
            />
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control ml-1"
              size="10"
              placeholder="酒店名称"
              v-model.trim="hotelName"
            />
          </div>
          <div class="form-group">
            <select class="form-control form-control-sm" v-model.number="status" name="sc.status">
              <option value="-1">订单状态</option>
              <option value="0">未提交</option>
              <option value="10">待审批</option>
              <option value="20">待处理</option>
              <option value="1">处理中</option>
              <option value="2">已完成</option>
              <option value="4">已取消</option>
            </select>
          </div>

          <div class="form-group">
            <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
            <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
      
    </template>
  </div>
</template>

<script>
import { searchHotelOrders, showHotelOrderStatus } from "../../api/hotel.js";
import MyDatePicker from "../../components/my-datepicker.vue";
import MyPagination from "../../components/my-pagination.vue";

import MySelectCustomer from "../../components/my-select2-customer.vue";
import HotelOrderList from '../../components/list/hotel-order-list_h5.vue'

export default {
  components: {
    MyDatePicker,
    MyPagination,
    MySelectCustomer,
    HotelOrderList
  },
  data() {
    return {
      dataList: [],
      customers: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
      },
      beginDate: "",
      endDate: "",
      orderNo: "",
      customerId: -1,
      name: "",
      hotelName: "",
      status: -1,

      searchOption: false,
    };
  },
  mounted: function () {
    // this.search()
  },
  activated: function () {
    this.search();
  },
  methods: {
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
    showSearchOption: function () {
      this.searchOption = true;
    },
    search: function () {
      this.showLoading();
      this.searchOption = false;
      const params = {
        "sc.pageNo": this.sc.pageNo,
        "sc.pageSize": this.sc.pageSize,
        "sc.beginDate": this.beginDate,
        "sc.orderNo": this.orderNo,
        "sc.endDate": this.endDate,
        "sc.customerId": this.customerId,
        "sc.name": this.name,
        "sc.hotelName": this.hotelName,
        "sc.status": this.status,
      };
      searchHotelOrders(
        params,
        (v) => {
          this.dataList = v.dataList;
          this.sc = v.page;

          // if (v.dataList.length === 0) {
          //   this.showErrMsg('没找到任何东西')
          // }
        },
        () => {
          this.hideLoading();
        }
      );
    },
    reset: function () {
      this.beginDate = "";
      this.endDate = "";
      this.orderNo = "";
      this.customerId = -1;
      this.name = "";
      this.hotelName = "";
      this.status = -1;
    },
    getStatusDesc: function (status) {
      return showHotelOrderStatus(status);
    },
    prevPage: function () {
      this.sc.pageNo = this.sc.pageNo - 1;
      if (this.sc.pageNo < 1) this.sc.pageNo = 1;
      this.search();
    },
    nextPage: function () {
      this.sc.pageNo = this.sc.pageNo + 1;
      this.search();
    },
    directPage: function (pageNo) {
      this.sc.pageNo = pageNo;
      this.search();
    },
  },
};
</script>