<template>
  <div id="flight-change-orders" class="card mt-5 row bg-transparent">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item ml-2" aria-current="page">
          <router-link to="/h5/home">主页</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">改签单</li>
      </ol>
    </nav>
    <template v-if="filterShowing">
      <div class="card-body">
        <form class="">
          <div class="row mb-2">
            <my-date-picker
              id="beginDate"
              v-model="beginDate"
              name="sc.beginDate"
              placeholder="开始日期"
            ></my-date-picker>
          </div>
          <div class="row mb-2">
            <my-date-picker
              id="endDate"
              v-model="endDate"
              name="sc.endDate"
              placeholder="截止日期"
            ></my-date-picker>
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="8"
              placeholder="改签单号"
              v-model.trim="changeOrderNo"
            />
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="6"
              placeholder="姓名"
              v-model.trim="name"
            />
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="10"
              placeholder="证件号"
              v-model.trim="idno"
            />
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="6"
              placeholder="票号"
              v-model.trim="ticketNo"
            />
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="6"
              placeholder="编码"
              v-model.trim="pnrNo"
            />
          </div>
          <div class="row mb-2">
            <select class="form-select" v-model.number="intlTicket">
              <option value="-1">所有</option>
              <option value="0">国内</option>
              <option value="1">国际</option>
            </select>
          </div>
          <div class="row mb-2">
            <select class="form-select" v-model.number="status">
              <option value="-1">所有状态</option>
              <option value="0">待处理</option>
              <option value="1">处理中</option>
              <option value="2">已完成</option>
              <option value="4">已取消</option>
            </select>
          </div>
          <div class="row mb-2">
            <select
              class="form-select"
              v-model.number="sc.pageSize"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="row mb-2">
            <button
              type="button"
              class="btn btn-primary mb-2"
              @click.stop="search()"
            >
              查找
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm ml-1"
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
      <flight-change-list :dataList="dataList"></flight-change-list>

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
  </div>
</template>

<script>
import { searchChangeOrders } from "@/api/flight-change.js";
import MyDatePicker from "@/components/my-datepicker.vue";
import MyPagination from "@/components/my-pagination_h5.vue";
import FlightChangeList from "@/components/flight-order-change-list_h5.vue";

export default {
  name: "MyFlightChangeOrders",
  components: {
    MyDatePicker,
    MyPagination,
    FlightChangeList,
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

      showMode: 0,
      modalTitle: "",
      intlTicket: -1,
      status: -1,
      ticketNo: "",
      pnrNo: "",
      name: "",
      idno: "",
      changeOrderNo: "",
      customerId: -1,
    };
  },
  mounted: function () {
    this.search();
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
      this.filterShowing = true;
    },
    search: function () {
      this.filterShowing = false;
      this.showLoading();

      const params = {
        "sc.pageNo": this.sc.pageNo,
        "sc.pageSize": this.sc.pageSize,
        "sc.beginDate": this.beginDate,
        "sc.endDate": this.endDate,
        "sc.intlTicket": this.intlTicket,
        "sc.status": this.status,
        "sc.pnrNo": this.pnrNo,
        "sc.ticketNo": this.ticketNo,
        "sc.name": this.name,
        "sc.idno": this.idno,
        "sc.changeOrderNo": this.changeOrderNo,
        "sc.customerId": this.customerId,
      };

      searchChangeOrders(
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
      this.ticketNo = "";
      this.pnrNo = "";
      this.status = -1;
      this.intlTicket = -1;
      this.sc.pageNo = 1;
      this.beginDate = "";
      this.endDate = "";
      this.name = "";
      this.idno = "";
      this.changeOrderNo = "";
      this.customerId = -1;
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
    commonShowMessage: function (jsonResult) {
      if (jsonResult.status !== "OK") {
        this.showErrMsg("失败：" + jsonResult.errmsg);
      } else {
        if (jsonResult.desc !== "") {
          this.showErrMsg(jsonResult.desc);
        } else {
          this.showErrMsg("操作成功");
        }
        this.search();
      }
    },
  },
};
</script>