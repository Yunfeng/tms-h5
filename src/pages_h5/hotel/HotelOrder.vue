<template>
  <div id="hotel-order-detail" class="card col-12 px-0 mt-5 bg-transparent">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/h5/hotel/orders">酒店订单</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto mr-1" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card-body py-0">
        <dl class="row mb-2">
          <dt class="col-4 text-right">订单号</dt>
          <dd class="col-8">{{ detail.orderNo }}</dd>
          <dt class="col-4 text-right">客户</dt>
          <dd class="col-8">
            {{ detail.customerName }}
            <span class="text-danger small">{{ detail.customerCode }}</span>
          </dd>
        </dl>
      </div>
      <div class="card-body bg-info text-white py-0">酒店信息</div>
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>名称</th>
            <th>房型</th>
            <th>日期</th>
            <th>房间数</th>
            <th class="d-none d-md-table-cell">销售价</th>
            <th class="d-none d-md-table-cell">底价</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ detail.hotelName }}</td>
            <td>{{ detail.roomType }}</td>
            <td>
              {{ detail.checkInDate }}
              <br />
              {{ detail.checkOutDate }}
            </td>
            <td>{{ detail.roomCount }}</td>
            <td class="d-none d-md-table-cell">{{ detail.price }}</td>
            <td class="d-none d-md-table-cell">{{ detail.bottomPrice }}</td>
          </tr>
        </tbody>
      </table>
      <div class="card-body bg-info text-white py-0">客人信息</div>
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>姓名</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="detail.passengers.length > 0">
            <tr v-for="(info, index) of detail.passengers" :key="index">
              <td>{{ info.name }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>{{ detail.passengerName }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <template v-if="detail.hotelId > 0">
        <div class="card-body bg-info text-white py-1">每日价格信息</div>
        <div class="card-body py-1 small">
          <div class="card-group row">
            <div
              class="card bg-white mb-1"
              style="max-width: 10rem"
              v-for="(rp, index) of detail.prices"
              :key="index"
            >
              <div class="card-body py-0 px-1">
                <h6 class="card-title">{{ rp.effectiveDate }}</h6>
                <p class="card-text">
                  {{ rp.inclusiveAmount }}
                  <span
                    >{{ getMealTypeDesc(rp.mealType)
                    }}{{ rp.mealCount }}份</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="card-body bg-info text-white py-0">金额信息</div>
      <table class="table table-striped table-hover table-sm">
        <thead>
          <tr>
            <th>销售价</th>
            <th>服务费</th>
            <th>总金额</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ detail.price }}</td>
            <td>{{ detail.serviceCharge }}</td>
            <td>{{ detail.totalAmount }}</td>
          </tr>
        </tbody>
      </table>
      <ul class="nav nav-tabs nav-bordered mb-3" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link active"
            id="order-tab"
            data-bs-toggle="tab"
            href="#orderDetailTab"
            role="tab"
            aria-controls="home"
            aria-selected="true"
            >其它信息</a
          >
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="orderDetailTab"
          role="tabpanel"
          aria-labelledby="order-tab"
        >
          <div class="card">
            <dl class="row mb-2">
              <dt class="col-4 text-right">成本中心</dt>
              <dd class="col-8">{{ detail.costCenter }}</dd>
              <dt class="col-4 text-right">项目名称</dt>
              <dd class="col-8">{{ detail.projectName }}</dd>
              <dt class="col-4 text-right">预订人</dt>
              <dd class="col-8">{{ detail.operator }}</dd>
              <dt class="col-4 text-right">收款方式</dt>
              <dd class="col-8">
                {{ getPayTypeDesc(detail.payType) }}/{{ detail.payRemark }}
              </dd>

              <dt class="col-4 text-right">订单状态</dt>
              <dd class="col-8">
                {{ getStatusDesc(detail.status) }}
                <span class="text-danger" v-if="detail.payStatus === 0"
                  >未收款</span
                >
                <span class="text-info" v-else-if="detail.payStatus === 1"
                  >已收款</span
                >
                <span class="text-primary" v-else-if="detail.payStatus === 2"
                  >已销账</span
                >
              </dd>

              <dt class="col-4 text-right">备注</dt>
              <dd class="col-8">
                {{ detail.remark }}
              </dd>
              <dt class="col-4 text-right">最晚到店时间</dt>
              <dd class="col-8">{{ detail.lastArriveTime }}</dd>
              <dt class="col-4 text-right">联系人</dt>
              <dd class="col-8">{{ detail.linkman }}</dd>
              <dt class="col-4 text-right">联系电话</dt>
              <dd class="col-8">{{ detail.contactPhone }}</dd>
              <dt class="col-4 text-right">指定审批人</dt>
              <dd class="col-8">{{ detail.specifiedApprover }}</dd>
              <dt class="col-4 text-right">审批结果</dt>
              <dd class="col-8">
                {{ detail.approvalStatus }}, {{ detail.approvalDenyReason }}
              </dd>
              <dt class="col-4 text-right">合规性校验</dt>
              <dd class="col-8">
                {{ detail.violationStatus }}, {{ detail.violationReason }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex flex-row justify-content-around">
          <template
            v-if="
              detail.status === 0 ||
              detail.status === 10 ||
              detail.status === 20 ||
              detail.status === 1
            "
          >
            <button
              class="btn btn-primary btn-sm ml-auto mr-auto"
              @click.stop="submitOrder()"
              v-if="detail.status === 0"
            >
              提交订单
            </button>
            <button
              class="btn btn-primary btn-sm ml-auto mr-auto"
              @click.stop="approveOrder()"
              v-if="detail.status === 10"
            >
              审批订单
            </button>

            <button
              class="btn btn-danger btn-sm ml-automr-auto"
              @click.stop="cancelOrder()"
            >
              取消订单
            </button>
          </template>
        </div>
      </div>
    </template>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{ modalTitle }}</span>
    </my-modal-prompt>
    <my-modal-confirm ref="confirmModal"></my-modal-confirm>
  </div>
</template>

<script>
import { APP_FLIGHT_PATH, SUPPLIER_HOTEL } from "../../common/const.js";
import {
  showPayType,
  showPsgType,
  showPriceCheckedStatus,
  showCustomerName,
} from "../../common/common.js";

import {
  searchHotelOrder,
  showHotelOrderStatus,
  showMealTypeDesc,
} from "../../api/hotel.js";
import {
  cancelHotelOrder,
  submitHotelOrder,
  approveHotelOrder,
  checkHotelAvail,
} from "../../api/hotel.js";

import MyModalPrompt from "../../components/my-modal-prompt.vue";
import MyModalConfirm from "../../components/my-modal-prompt-confirm.vue";

export default {
  components: {
    MyModalConfirm,
    MyModalPrompt,
  },
  data() {
    return {
      detail: null,
      id: 0,
      orderNo: "",

      modalTitle: "",
      modalNullable: false,

      histories: [],

      commentCount: 0, //留言数量
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    psgCount: function () {
      if (this.detail !== null) {
        this.priceInfo.ticketCount = this.detail.passengers.length;
        return this.priceInfo.ticketCount;
      } else {
        this.priceInfo.ticketCount = 1;
        return 1;
      }
    },
    supplierId: function () {
      return this.detail.supplierId;
    },
    payMethodId: function () {
      return this.detail.paymentMethodId;
    },
  },
  mounted: function () {
    this.id = parseInt(this.$route.params.id);
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
      searchHotelOrder(this.id, (val) => {
        this.detail = val;
      });
    },
    getStatusDesc: function (status) {
      return showHotelOrderStatus(status);
    },
    getPayTypeDesc: function (payType) {
      return showPayType(payType);
    },
    cancelOrder: function () {
      this.modalTitle = "请输入取消订单的理由：";
      this.$refs.modalPrompt
        .modal()
        .then((remark) => {
          // 点击确定按钮的回调处理
          if (remark === "") {
            this.showErrMsg("请填写取消订单的理由");
            return;
          }
          cancelHotelOrder(this.id, { remark }, (v) =>
            this.commonShowMessage(v)
          );
        })
        .catch((r) => {});
    },
    submitOrder: function () {
      submitHotelOrder(this.id, (v) => this.commonShowMessage(v));
    },
    approveOrder: function () {
      this.$refs.confirmModal
        .modal("酒店订单审批")
        .then((v) => {
          this.showLoading("处理中");
          const params = {
            denyCode: v.denyCode,
            denyReason: v.denyReason,
          };
          approveHotelOrder(
            this.id,
            params,
            (v) => this.commonShowMessage(v),
            () => this.hideLoading()
          );
        })
        .catch((ex) => {});
    },
    commonShowMessage: function (jsonResult) {
      if (jsonResult.status !== "OK") {
        this.showErrMsg("操作失败：" + jsonResult.errmsg, "danger");
      } else {
        if (jsonResult.desc !== "") {
          this.showErrMsg(jsonResult.desc);
        } else {
          this.showErrMsg("操作成功");
        }
        this.search();
      }
    },
    checkAvail: function () {
      checkHotelAvail(this.id, (v) => {
        if (v.status !== "OK") {
          this.showErrMsg(v.errmsg);
        } else {
          this.showErrMsg("可定 " + v.desc);
        }
      });
    },
    getMealTypeDesc: function (type) {
      return showMealTypeDesc(type);
    },
    showCustomerName: function (info) {
      return showCustomerName(info);
    },
  },
};
</script>