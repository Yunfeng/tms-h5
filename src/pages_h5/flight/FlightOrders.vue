<template>
  <div id="flight-orders" class="card mt-5 row bg-transparent">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item ml-2" aria-current="page">
          <router-link to="/h5/home">主页</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">机票订单</li>
        <li class="breadcrumb-item ml-auto mr-2">
          <router-link to="/h5/flt/search">国内预订</router-link>
        </li>
      </ol>
    </nav>
    <template v-if="filterShowing">
      <div class="card-body">
        <form>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              placeholder="订单号"
              v-model.trim="orderNo"
            />
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              placeholder="姓名"
              v-model.trim="name"
            />
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              placeholder="证件号"
              v-model.trim="idno"
            />
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              placeholder="票号"
              v-model.trim="ticketNo"
            />
          </div>
          <div class="form-group">
            <input
              type="textfield"
              class="form-control"
              placeholder="航班号"
              v-model.trim="flightNo"
            />
          </div>
          <div class="form-group">
            <my-date-picker
              id="ddate"
              v-model="ddate"
              placeholder="航班日期"
              sizing="sm"
            ></my-date-picker>
          </div>
          <div class="form-group">
            <my-date-picker
              id="beginDate"
              name="sc.beginDate"
              v-model="beginDate"
              placeholder="开始日期"
              sizing="sm"
            ></my-date-picker>
          </div>
          <div class="form-group">
            <my-date-picker
              id="endDate"
              name="sc.endDate"
              v-model="endDate"
              placeholder="截止日期"
              sizing="sm"
            ></my-date-picker>
          </div>
          <div class="form-group">
            <select
              class="form-control form-control-sm"
              v-model.number="intlTicket"
            >
              <option value="-1">所有</option>
              <option value="0">国内</option>
              <option value="1">国际</option>
            </select>
          </div>
          <div class="form-group">
            <select class="form-control" v-model.number="status">
              <option value="-1">订单状态</option>
              <option value="0">暂不开票</option>
              <option value="1">待开票审核</option>
              <option value="2">待开票</option>
              <option value="4">已取消</option>
              <option value="8">开票中</option>
              <option value="16">已开票</option>
              <option value="32">已完成</option>
            </select>
          </div>
          <div class="form-group">
            <select
              class="form-control form-control-sm"
              v-model.number="sc.pageSize"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="form-group row">
            <button
              type="button"
              class="btn btn-primary btn-lg ml-auto mr-auto"
              @click.stop="search()"
            >
              查找
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm ml-auto mr-auto"
              @click.stop="reset()"
            >
              重置
            </button>
          </div>
        </form>
      </div>
    </template>
    <template v-else>
      <div class="card-header">
        <button
          type="button"
          class="btn btn-primary float-right"
          @click.stop="showSearchOption()"
        >
          查找
        </button>
      </div>

      <flight-order-list :dataList="dataList"></flight-order-list>

      <nav id="pagination-box" class="float-right mr-2">
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
  </div>
</template>

<script>
import { searchFlightOrders } from "../../api/flight.js";
import MyDatePicker from "../../components/my-datepicker.vue";
import MyPagination from "../../components/my-pagination_h5.vue";
import FlightOrderList from "../../components/list/flight-order-list_h5.vue";

export default {
  name: "MyFlightOrders",
  components: {
    MyDatePicker,
    MyPagination,
    FlightOrderList,
  },
  data() {
    return {
      filterShowing: false,
      dataList: [],

      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
      },

      beginDate: "",
      endDate: "",
      name: "",
      idno: "",
      ticketNo: "",
      pnrNo: "",
      status: -1,
      customerId: -1,
      customerType: -1,
      intlTicket: -1,
      workStatus: 0,
      onlyMine: 0,
      op1: "",
      orderNo: "",
      payStatus: -1,
      flightNo: "",
      ddate: "",

      stat: null,
    };
  },
  activated: function () {
    this.search();
  },
  methods: {
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
      this.filterShowing = true;
    },
    search: function () {
      this.filterShowing = false;
      const params = {
        "sc.pageNo": this.sc.pageNo,
        "sc.pageSize": this.sc.pageSize,
        "sc.beginDate": this.beginDate,
        "sc.endDate": this.endDate,
        "sc.name": this.name,
        "sc.idno": this.idno,
        "sc.status": this.status,
        "sc.customerId": this.customerId,
        "sc.customerType": this.customerType,
        "sc.ticketNo": this.ticketNo,
        "sc.intlTicket": this.intlTicket,
        "sc.pnrNo": this.pnrNo,
        "sc.workStatus": this.workStatus,
        "sc.onlyMine": this.onlyMine,
        "sc.op1": this.op1,
        "sc.orderNo": this.orderNo,
        "sc.payStatus": this.payStatus,
        "sc.departureDate": this.ddate,
        "sc.flightNo": this.flightNo,
      };
      this.showLoading("查询中");
      searchFlightOrders(
        params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList;
          this.sc = jsonResult.page;
        },
        () => {
          this.hideLoading();
        }
      );
    },
    reset: function () {
      this.beginDate = "";
      this.endDate = "";
      this.name = "";
      this.idno = "";
      this.ticketNo = "";
      this.pnrNo = "";
      this.status = -1;
      this.sc.pageNo = 1;
      this.onlyMine = 0;
      this.op1 = "";
      this.orderNo = "";

      this.ddate = "";
      this.flightNo = "";

      this.customerId = -1;
      // this.search()
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