<template>
  <div id="flight-refund-orderss" class="card mt-5 row bg-transparent">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item ml-2" aria-current="page">
          <router-link to="/h5/home">主页</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">退票单</li>
      </ol>
    </nav>

    <template v-if="filterShowing">
      <div class="card-body">
        <form>
          <div class="row mb-2">
            <my-date-picker
              id="beginDate"
              v-model="beginDate"
              placeholder="开始日期"
            ></my-date-picker>
          </div>
          <div class="row mb-2">
            <my-date-picker
              id="endDate"
              v-model="endDate"
              placeholder="截止日期"
            ></my-date-picker>
          </div>
          <div class="row mb-2">
            <input
              type="textfield"
              class="form-control"
              size="8"
              placeholder="退票单号"
              v-model.trim="refundOrderNo"
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
              size="10"
              placeholder="票号"
              v-model.trim="ticketNo"
            />
          </div>
          <div class="row mb-2">
            <select class="form-select" v-model.number="intlTicket">
              <option value="-1">属性</option>
              <option value="0">国内</option>
              <option value="1">国际</option>
            </select>
          </div>
          <div class="row mb-2">
            <select class="form-select" v-model.number="sc.pageSize">
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
              class="btn btn-secondary"
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

      <flight-refund-list :dataList="dataList"></flight-refund-list>

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
import {
  showRefundOrderStatus,
  searchRefundOrders,
} from "@/api/flight-refund.js";
import MyDatePicker from "@/components/my-datepicker.vue";
import MyPagination from "@/components/my-pagination_h5.vue";
import FlightRefundList from "@/components/flight-order-refund-list_h5.vue";

export default {
  name: "MyFlightRefundOrders",
  components: {
    MyDatePicker,
    MyPagination,
    FlightRefundList,
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
      intlTicket: -1,
      ticketNo: "",
      pnrNo: "",
      status: -1,
      airRefundStatus: -1,
      name: "",
      idno: "",
      refundOrderNo: "",
    };
  },
  mounted: function () {
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
        "sc.ticketNo": this.ticketNo,
        "sc.pnrNo": this.pnrNo,
        "sc.status": this.status,
        "sc.airRefundStatus": this.airRefundStatus,
        "sc.name": this.name,
        "sc.idno": this.idno,
        "sc.refundOrderNo": this.refundOrderNo,
      };
      searchRefundOrders(
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
      this.sc.pageNo = 1;
      this.beginDate = "";
      this.endDate = "";
      this.status = -1;
      this.ticketNo = "";
      this.pnrNo = "";
      this.name = "";
      this.idno = "";
      this.refundOrderNo = "";
    },
    getStatus: function (status) {
      return showRefundOrderStatus(status);
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
    doCreateRefundOrder: function (info) {
      createRefundOrder(JSON.stringify(info), (jsonResult) => {
        if (jsonResult.status !== "OK") {
          this.showErrMsg(jsonResult.errmsg);
        } else {
          console.log(jsonResult);
          this.$router.push("/flt/refund/order/" + jsonResult.returnCode);
        }
      });
    },
  },
};
</script>