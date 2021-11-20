<template>
  <div id="flight-order-detail" class="card mt-5 row bg-transparent">
    <nav aria-label="breadcrumb" role="navigation" v-if="!isReadOnly">
      <ol class="breadcrumb">
        <li class="breadcrumb-item ml-1">
          <router-link to="/h5/flt/orders">机票订单</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ms-auto mr-1" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <template v-if="detail !== null">
      <div class="card-header">
        <dl class="row">
          <dt class="col-4 text-end">订单号</dt>
          <dd class="col-8">{{ detail.orderNo }}</dd>
          
        </dl>
      </div>
      <ul class="nav nav-tabs nav-bordered mb-3" id="myTab0" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link active"
            id="flight-tab"
            data-bs-toggle="tab"
            href="#orderFlightTab"
            role="tab"
            aria-controls="flight"
            aria-selected="true"
          >
            航班信息
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="passenger-tab"
            data-bs-toggle="tab"
            href="#orderPassengerTab"
            role="tab"
            aria-controls="passenger"
            aria-selected="false"
          >
            乘客信息
          </a>
        </li>
      </ul>
      <div class="tab-content px-0" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="orderFlightTab"
          role="tabpanel"
          aria-labelledby="flight-tab"
          v-if="detail !== null"
        >
          <template v-if="detail.tickets.length > 0">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>出发机场</th>
                  <th>到达机场</th>
                  <th>出发日期</th>
                  <th>航班号</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(info, index) in detail.tickets">
                  <tr :key="`ticket_info_psg_` + index">
                    <td colspan="2">{{ info.passengerName }}</td>
                    <td colspan="3" class="text-end small">
                      {{ info.ticketNo }}
                    </td>
                  </tr>
                  <tr :key="`ticket_info_flt_` + index">
                    <td>
                      <template v-if="info.dportName === null">
                        {{ info.dport }}
                      </template>
                      {{ info.dportName }}
                    </td>
                    <td>
                      <template v-if="info.aportName === null">
                        {{ info.aport }}
                      </template>
                      {{ info.aportName }}
                    </td>
                    <td>{{ info.ddate }}<br />{{ info.dtime }}</td>
                    <td>{{ info.flightNo }}</td>
                    <td>{{ showTicketStatus(info.ticketStatus) }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
          <template v-else>
            <div class="card-body d-md-none">
              <template v-for="(info, index) in detail.flights">
                <dl :key="`flt_info_` + index" class="row">
                  <h5 v-if="detail.flights.length > 1">
                    第 {{ index + 1 }} 程
                  </h5>
                  <dt class="col-4 text-end">出发机场</dt>
                  <dd class="col-8">
                    {{ info.dportName }}
                    <span class=""> {{ info.dterm }}</span>
                  </dd>
                  <dt class="col-4 text-end">到达机场</dt>
                  <dd class="col-8">
                    {{ info.aportName }}
                    <span class=""> {{ info.aterm }}</span>
                  </dd>
                  <dt class="col-4 text-end">出发时间</dt>
                  <dd class="col-8">
                    {{ info.ddate }} {{ info.dtime }} - {{ info.atime }}
                  </dd>
                  <dt class="col-4 text-end">航班号</dt>
                  <dd class="col-8">
                    {{ info.flightNo }}
                  </dd>
                  <dt class="col-4 text-end">舱位</dt>
                  <dd class="col-8">
                    {{ info.subclass }} ({{ info.cabinClass }})
                  </dd>
                </dl>
              </template>
            </div>
            <table
              class="
                table table-striped table-hover table-sm
                mb-1
                d-none d-md-table
              "
            >
              <thead>
                <tr>
                  <th>出发</th>
                  <th>到达</th>
                  <th>日期</th>
                  <th>航班号</th>
                  <th>起飞</th>
                  <th class="d-none d-md-table-cell">落地</th>
                  <th class="d-none d-md-table-cell">舱位</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="info in detail.flights" :key="info.id">
                  <td>
                    {{ info.dportName }}
                    <span class="d-none d-md-inline"> {{ info.dterm }}</span>
                  </td>
                  <td>
                    {{ info.aportName }}
                    <span class="d-none d-md-inline"> {{ info.aterm }}</span>
                  </td>
                  <td>{{ info.ddate }}</td>
                  <td>{{ info.flightNo }}</td>
                  <td>{{ info.dtime }}</td>
                  <td class="d-none d-md-table-cell">{{ info.atime }}</td>
                  <td class="d-none d-md-table-cell">{{ info.subclass }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
        <div
          class="tab-pane fade"
          id="orderPassengerTab"
          role="tabpanel"
          aria-labelledby="passenger-tab"
          v-if="detail !== null"
        >
          <div class="card-body d-md-none">
            <template v-for="(info, index) in detail.passengers">
              <dl :key="`flt_info_` + index" class="row">
                <template v-if="detail.passengers.length > 1">
                  <h5>乘机人{{ index + 1 }}</h5>
                </template>
                <dt class="col-4 text-end">姓名</dt>
                <dd class="col-8">
                  {{ info.name }}
                </dd>
                <dt class="col-4 text-end">证件号</dt>
                <dd class="col-8">
                  {{ info.idNo }}
                </dd>
                <dt class="col-4 text-end">手机号</dt>
                <dd class="col-8">
                  {{ info.mobile }}
                </dd>
                <dt class="col-4 text-end">票号</dt>
                <dd class="col-8">
                  {{ info.ticketNo }}
                </dd>
              </dl>
            </template>
          </div>
          <table
            class="
              table table-striped table-hover table-sm
              mb-1
              d-none d-md-table
            "
          >
            <thead>
              <tr>
                <th>姓名</th>
                <th class="d-none d-md-table-cell">证件号</th>
                <th class="d-none d-md-table-cell">手机号</th>
                <th>票号</th>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(info, index) in detail.passengers" :key="info.id">
                <td>{{ info.name }}</td>
                <td class="d-none d-md-table-cell">{{ info.idNo }}</td>
                <td class="d-none d-md-table-cell">{{ info.mobile }}</td>
                <td>{{ info.ticketNo }}</td>
                <td class="px-0">
                  <template v-if="detail.status === 0">
                    <a
                      href="javascript:void(0)"
                      @click.stop="editPsg(index)"
                      class="small ms-auto me-auto d-none"
                      >修改</a
                    >
                  </template>
                  <template v-if="detail.status === 32">
                    <a
                      href="javascript:void(0)"
                      @click.stop="changeTicket(index)"
                      class="btn btn-sm btn-warning ms-auto"
                      >改签</a
                    >
                    <a
                      href="javascript:void(0)"
                      @click.stop="multiRefundTicket(index)"
                      class="btn btn-sm btn-danger ms-auto"
                      >退票</a
                    >
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-body bg-info text-white py-1">价格信息</div>
      <div class="card-body d-md-none">
        <template v-for="(p, index) of detail.prices">
          <dl class="row" :key="`price` + index">
            <h5>销售价格<span v-if="p.priceType === 0" class="text-info">(成人)</span></h5>
            <dt class="col-4 text-end">销售价</dt>
            <dd class="col-8">
              {{ p.parValue }}
            </dd>
            <dt class="col-4 text-end">税</dt>
            <dd class="col-8">
              {{ p.tax }}
            </dd>
            <dt class="col-4 text-end">服务费</dt>
            <dd class="col-8">
              {{ p.serviceCharge }}
            </dd>
            <dt class="col-4 text-end">让利</dt>
            <dd class="col-8">
              {{ p.discount }}
            </dd>
          </dl>
        </template>
        <template v-for="(info, index) of detail.changes">
          <dl class="row" :key="`price_change_` + index">
            <h5>改签费用({{ info.orderNo }})</h5>
            <dt class="col-4 text-end">姓名</dt>
            <dd class="col-8">
              {{ info.psgName }}
            </dd>
            <dt class="col-4 text-end">票号</dt>
            <dd class="col-8">{{ info.balanceCode }}-{{ info.ticketNo }}</dd>
            <dt class="col-4 text-end">改签费</dt>
            <dd class="col-8">
              {{ info.airChangeCharge }}
            </dd>
            <dt class="col-4 text-end">服务费</dt>
            <dd class="col-8">
              {{ info.serviceCharge }}
            </dd>
          </dl>
        </template>
        <template v-for="(info, index) of detail.refunds">
          <dl class="row" :key="`price_refund_` + index">
            <h5>退票费用({{ info.orderNo }})</h5>
            <dt class="col-4 text-end">姓名</dt>
            <dd class="col-8">
              {{ info.psgName }}
            </dd>
            <dt class="col-4 text-end">票号</dt>
            <dd class="col-8">{{ info.balanceCode }}-{{ info.ticketNo }}</dd>
            <dt class="col-4 text-end">实际退款</dt>
            <dd class="col-8">
              {{ info.passengerRefundAmount }}
            </dd>
          </dl>
        </template>
      </div>
      <table
        class="table table-striped table-hover table-sm mb-1 d-none d-md-table"
      >
        <thead>
          <tr>
            <th></th>
            <th>销售价</th>
            <th>税</th>
            <th>服务费</th>
            <th class="d-none d-md-table-cell">让利</th>
            <th class="d-none d-md-table-cell">人数</th>
            <th class="d-none d-md-table-cell">应收</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="detail.adultCount > 0">
            <td>成人</td>
            <td>{{ adultPrice.parValue }}</td>
            <td>{{ adultPrice.tax }}</td>
            <td>{{ adultPrice.serviceCharge }}</td>
            <td class="d-none d-md-table-cell">
              {{ adultPrice.discount }}
            </td>
            <td class="d-none d-md-table-cell">
              {{ adultPrice.ticketCount }}
            </td>
            <td class="d-none d-md-table-cell">{{ adultPrice.amount }}</td>
          </tr>
          <tr v-if="detail.childCount > 0">
            <td>儿童</td>
            <td>{{ childPrice.parValue }}</td>
            <td>{{ childPrice.tax }}</td>
            <td>{{ childPrice.serviceCharge }}</td>
            <td>{{ childPrice.commission }}</td>
            <td>{{ childPrice.discount }}</td>
            <td class="d-none">{{ childPrice.ticketCount }}</td>
            <td class="d-none">{{ childPrice.amount }}</td>
          </tr>
        </tbody>
      </table>
      <table
        class="table table-striped table-hover table-sm mb-1 d-none d-md-table"
        v-if="detail.changes.length > 0"
      >
        <tr>
          <th></th>
          <th>姓名</th>
          <th>票号</th>
          <th>改签费</th>
          <th>服务费</th>
        </tr>
        <tr
          :key="`price_change_` + index"
          v-for="(info, index) of detail.changes"
        >
          <td>改签({{ info.orderNo }})</td>
          <td>
            {{ info.psgName }}
          </td>
          <td>{{ info.balanceCode }}-{{ info.ticketNo }}</td>
          <td>
            {{ info.airChangeCharge }}
          </td>
          <td>
            {{ info.serviceCharge }}
          </td>
        </tr>
      </table>
      <table
        class="table table-striped table-hover table-sm mb-1 d-none d-md-table"
        v-if="detail.refunds.length > 0"
      >
        <tr>
          <th></th>
          <th>姓名</th>
          <th>票号</th>
          <th>实退金额</th>
        </tr>
        <template v-for="(info, index) of detail.refunds">
          <tr :key="`price_refund_` + index">
            <td>退票({{ info.orderNo }})</td>
            <td>{{ info.psgName }}</td>
            <td>{{ info.balanceCode }}-{{ info.ticketNo }}</td>
            <td>{{ info.passengerRefundAmount }}</td>
          </tr>
        </template>
      </table>
      <div class="card-body p-0" v-if="!isReadOnly">
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
          <li class="nav-item">
            <a
              class="nav-link"
              id="pnr-tab"
              data-bs-toggle="tab"
              href="#pnrDetailTab"
              role="tab"
              aria-controls="pnr"
              aria-selected="false"
              >编码内容</a
            >
          </li>
          <li
            class="nav-item"
            v-if="detail !== null && detail.refunds.length > 0"
          >
            <a
              class="nav-link"
              id="refund-tab"
              data-bs-toggle="tab"
              href="#refundTab"
              role="tab"
              aria-controls="refund"
              aria-selected="false"
              >退票({{ detail.refunds.length }})</a
            >
          </li>
          <li
            class="nav-item"
            v-if="detail !== null && detail.changes.length > 0"
          >
            <a
              class="nav-link"
              id="change-tab"
              data-bs-toggle="tab"
              href="#changeTab"
              role="tab"
              aria-controls="change"
              aria-selected="false"
              >改签({{ detail.changes.length }})</a
            >
          </li>
          <li
            class="nav-item"
            v-if="detail !== null && detail.services.length > 0"
          >
            <a
              class="nav-link"
              id="service-tab"
              data-bs-toggle="tab"
              href="#serviceTab"
              role="tab"
              aria-controls="service"
              aria-selected="false"
              >服务及保险({{ detail.services.length }})</a
            >
          </li>
          <li class="nav-item" v-if="detail !== null">
            <a
              class="nav-link"
              id="comment-tab"
              data-bs-toggle="tab"
              href="#commentTab"
              role="tab"
              aria-controls="comment"
              aria-selected="false"
              >留言({{ comments.length }})</a
            >
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="orderDetailTab"
            role="tabpanel"
            aria-labelledby="order-tab"
            v-if="detail !== null"
          >
            <dl class="row mb-2">
              <dt class="col-4 text-right">GP机票</dt>
              <dd class="col-8">
                <span v-if="detail.gpTicket === 1">是</span>
                <span v-else>否</span>
              </dd>
              <dt class="col-4 text-right">编码</dt>
              <dd class="col-8">{{ detail.pnrNo }}</dd>
              <dt class="col-4 text-right">预订人</dt>
              <dd class="col-8">{{ detail.operator }}</dd>
              <dt class="col-4 text-right">出票日期</dt>
              <dd class="col-8">{{ detail.etdzDate }}</dd>
              <dt class="col-4 text-right">付款方式</dt>
              <dd class="col-8">{{ getPayTypeDesc(detail.payType) }}</dd>
              <dt class="col-4 text-right">付款状态</dt>
              <dd class="col-8">
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
              <dt class="col-4 text-right">订单状态</dt>
              <dd class="col-8">{{ getStatusDesc(detail.orderStatus) }}</dd>
              <dt class="col-4 text-right">联系人</dt>
              <dd class="col-8">{{ detail.linkman }}</dd>
              <dt class="col-4 text-right">联系电话</dt>
              <dd class="col-8">{{ detail.linkPhone }}</dd>
              <dt class="col-4 text-right">备注</dt>
              <dd class="col-8">{{ detail.remark }}</dd>
            </dl>
          </div>
          <div
            class="tab-pane fade"
            id="pnrDetailTab"
            role="tabpanel"
            aria-labelledby="pnr-tab"
            v-if="detail !== null"
          >
            <div
              class="card-block bg-faded"
              v-if="detail.pnrDetail != null"
              style="padding: 0"
            >
              <div v-html="'<pre>' + detail.pnrDetail + '</pre>'"></div>
            </div>
          </div>

          <div
            class="tab-pane fade"
            id="refundTab"
            role="tabpanel"
            aria-labelledby="refund-tab"
            v-if="detail !== null && detail.refunds.length > 0"
          >
            <flight-refund-list :dataList="detail.refunds"></flight-refund-list>
          </div>
          <div
            class="tab-pane fade"
            id="changeTab"
            role="tabpanel"
            aria-labelledby="change-tab"
            v-if="detail !== null && detail.changes.length > 0"
          >
            <flight-change-list :dataList="detail.changes"></flight-change-list>
          </div>
          <div
            class="tab-pane fade"
            id="serviceTab"
            role="tabpanel"
            aria-labelledby="service-tab"
            v-if="detail !== null && detail.services.length > 0"
          >
            <vas-order-list :dataList="detail.services"></vas-order-list>
          </div>
          <div
            class="tab-pane fade"
            id="commentTab"
            role="tabpanel"
            aria-labelledby="comment-tab"
            v-if="detail !== null"
          >
            <div class="row mb-2">
              <div class="col-12">
                <ul class="nav nav-tabs nav-bordered mb-3" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="detail-tab"
                      data-bs-toggle="tab"
                      href="#newComment"
                      >新建留言</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="login-tab"
                      data-bs-toggle="tab"
                      href="#comments"
                      >留言列表</a
                    >
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane fade show" id="newComment">
                    <div class="card">
                      <div class="card-body">
                        <div class="row mb-2">
                          <textarea
                            class="form-control"
                            rows="3"
                            v-model.trim="commentContent"
                          ></textarea>
                        </div>
                        <button
                          class="btn btn-primary"
                          @click.stop="saveComment()"
                        >
                          保存
                        </button>
                      </div>
                      <table></table>
                    </div>
                  </div>
                  <div class="tab-pane fade show active" id="comments">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>留言内容</th>
                          <th>留言人</th>
                          <th>留言时间</th>
                        </tr>
                      </thead>
                      <tr v-for="info in comments">
                        <td>{{ info.comment }}</td>
                        <td>{{ info.username }}</td>
                        <td>{{ info.createTime }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body" v-if="!isReadOnly">
        <button
          class="btn btn-sm btn-success ml-2"
          @click.stop="onlinePay()"
          v-if="detail.orderStatus === 0 && detail.payType === 1"
        >
          支付
        </button>

        <template v-if="detail.orderStatus === 0">
          <button
            class="btn btn-primary btn-sm ml-2 me-auto"
            :disabled="btnDisabled"
            @click.stop="submitOrder()"
          >
            申请开票
          </button>
        </template>
        <template v-if="detail.orderStatus === 1">
          <button
            class="btn btn-primary btn-sm ml-2 me-auto"
            :disabled="btnDisabled"
            @click.stop="approveOrder()"
          >
            审批
          </button>
        </template>

        <button
          class="btn btn-sm btn-primary ml-2 float-right d-none"
          @click.stop="addExtraService2()"
          v-if="detail.orderStatus !== 4"
        >
          增加机场服务
        </button>
      </div>
    </template>

    <div id="paymentForm"></div>

    <my-modal-refund-ticket-multi
      ref="multiRefundTicketModal"
    ></my-modal-refund-ticket-multi>
    <my-modal-change-ticket ref="changeTicketModal"></my-modal-change-ticket>
    <my-modal-confirm ref="confirmModal"></my-modal-confirm>
  </div>
</template>

<script>
import $ from "jquery";
import { APP_FLIGHT_PATH } from "../../common/const.js";
import {
  searchFlightOrder,
  searchFlightOrderDetailByOrderNo,
  searchFlightOrderByAuthCode,
} from "../../api/flight.js";
import {
  payForFlightOrder,
  submitFlightOrder,
  approveFlightOrder,
} from "../../api/flight.js";
import {
  showFlightOrderStatus,
  showPayType,
  showPsgType,
  showIdTypeDesc,
  showOrderTypeDesc,
  showItineraryType,
  showTicketStatus,
} from "../../common/common.js";
import { createRefundOrderMulti } from "../../api/flight-refund.js";
import { createChangeOrderMulti } from "../../api/flight-change.js";
import { saveComment, searchComments } from "../../api/comment.js";

import PriceInfo from "../../common/PriceInfo.js";

import MyModalConfirm from "../../components/my-modal-prompt-confirm.vue";
import FlightRefundList from "../../components/flight-order-refund-list.vue";
import FlightChangeList from "../../components/flight-order-change-list.vue";
import VasOrderList from "../../components/vas-order-list.vue";
import MyModalRefundTicketMulti from "../../components/my-modal-refund-ticket-multi.vue";
import MyModalChangeTicket from "../../components/my-modal-change-ticket-multi.vue";

export default {
  components: {
    MyModalConfirm,
    FlightRefundList,
    FlightChangeList,
    VasOrderList,
    MyModalRefundTicketMulti,
    MyModalChangeTicket,
  },
  data() {
    return {
      detail: null,
      id: 0,
      orderNo: "",
      authCode: null,
      mobile: null,

      adultPrice: new PriceInfo(),
      childPrice: new PriceInfo(),
      infantPrice: new PriceInfo(),

      remark: "",
      commentContent: "",
      comments: [],
      extras: [],
      modalTitle: "",
      modalTitle2: "",
      modalNullable: false,

      btnDisabled: false,
    };
  },
  computed: {
    logined() {
      return this.$store.state.logined;
    },
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
    isReadOnly: function () {
      return this.authCode !== null;
    },
  },
  mounted: function () {
    this.id = parseInt(this.$route.params.id);
    if (this.id === 0) {
      this.orderNo = this.$route.query.orderNo;
    }
    let authCode = this.$route.query.auth_code;
    let mobile = this.$route.query.mobile;
    if (authCode !== undefined) {
      this.authCode = authCode;
    }
    if (mobile !== undefined) {
      this.mobile = mobile;
    }
    this.searchOrderDetail();
  },
  updated: function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
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
    showTicketStatus: function (status) {
      return showTicketStatus(status);
    },
    searchOrderDetail: function () {
      console.log("this.authCode: " + this.authCode);
      if (this.authCode !== null) {
        //使用授权码查看订单信息
        const params = {
          authCode: this.authCode,
          mobile: this.mobile,
        };
        searchFlightOrderByAuthCode(this.id, params, (v) => {
          if (v.errcode === 0) {
            this.detail = v;
            this.id = this.detail.id;
            this.setAdultPrice();
          } else {
            this.showErrMsg(v.errmsg, "danger");
          }
        });
        return;
      }
      if (this.id > 0) {
        searchFlightOrder(this.id, (val) => {
          this.detail = val;
          this.setAdultPrice();
          this.searchComments();
        });
      } else {
        searchFlightOrderDetailByOrderNo(this.orderNo, (v) => {
          this.detail = v;
          this.id = this.detail.id;
          this.setAdultPrice();
          this.searchComments();
        });
      }
    },
    getStatusDesc: function (status) {
      return showFlightOrderStatus(status);
    },
    getPayTypeDesc: function (payType) {
      return showPayType(payType);
    },
    showPsgType: function (psgType) {
      return showPsgType(psgType);
    },
    showGender: function (val) {
      switch (val) {
        case 1:
          return "男";
        case 2:
          return "女";
        default:
          return "";
      }
    },
    showIdTypeDesc: function (idType) {
      return showIdTypeDesc(idType);
    },
    showItineraryType: function (itineraryType) {
      return showItineraryType(itineraryType);
    },
    commonShowMessage: function (jsonResult) {
      if (jsonResult.status !== "OK") {
        this.showErrMsg("失败：" + jsonResult.errmsg, "danger");
      } else {
        if (jsonResult.desc !== "") {
          this.showErrMsg(jsonResult.desc);
        } else {
          this.showErrMsg("操作成功");
        }
        this.searchOrderDetail();
      }
    },
    printItinerary: function () {
      const url =
        "/" + APP_FLIGHT_PATH + "/order/flight/" + this.id + "/itinerary";
      window.open(url);
    },
    multiRefundTicket: function (index) {
      // 多人同时退废
      const psgInfo = this.detail.passengers[index];
      const psgType = psgInfo.psgType;

      let psgPrice;
      if (psgType === 0) {
        this.setAdultPrice();
        psgPrice = this.adultPrice;
      } else if (psgType === 1) {
        this.setChildPrice();
        psgPrice = this.childPrice;
      } else if (psgType === 2) {
        this.setInfantPrice();
        psgPrice = this.infantPrice;
      }

      // 找到同类型的乘机人：成人，儿童，婴儿
      const psgList = [];
      for (const info of this.detail.passengers) {
        if (info.psgType === psgType) {
          psgList.push({
            ticketNo: info.ticketNo,
            name: info.name,
            idNo: info.idNo,
            selected: false,
          });
        }
      }

      this.$refs.multiRefundTicketModal
        .modal(
          psgList,
          this.id,
          this.detail.orderNo,
          this.detail.flights,
          this.detail.intlTicket,
          psgPrice.amount,
          psgPrice.cost,
          psgPrice.parvalue,
          psgPrice.tax
        )
        .then((info) => {
          this.doCreateRefundOrderMulti(info);
        })
        .catch((ex) => {});
    },
    doCreateRefundOrderMulti: function (info) {
      createRefundOrderMulti(JSON.stringify(info), (jsonResult) => {
        if (jsonResult.status !== "OK") {
          this.showErrMsg(jsonResult.errmsg, "danger");
        } else {
          this.showErrMsg("操作成功");
          this.$router.push("/flt/refund/order/" + jsonResult.returnCode);
        }
      });
    },
    changeTicket: function (index) {
      // 多人同时签转
      const psgInfo = this.detail.passengers[index];
      const psgType = psgInfo.psgType;

      let psgPrice;
      if (psgType === 0) {
        this.setAdultPrice();
        psgPrice = this.adultPrice;
      } else if (psgType === 1) {
        this.setChildPrice();
        psgPrice = this.childPrice;
      } else if (psgType === 2) {
        this.setInfantPrice();
        psgPrice = this.infantPrice;
      }

      // 找到同类型的乘机人：成人，儿童，婴儿
      const psgList = [];
      let onlyOneTicketAllowed = false;
      for (const info of this.detail.passengers) {
        if (info.psgType === psgType) {
          if (info.ticketNos.length == 0) {
            psgList.push({
              ticketNo: info.ticketNo,
              name: info.name,
              idNo: info.idNo,
              selected: false,
            });
          } else {
            onlyOneTicketAllowed = true;
            for (const ticketNo of info.ticketNos) {
              psgList.push({
                ticketNo: ticketNo,
                name: info.name,
                idNo: info.idNo,
                selected: false,
              });
            }
          }
        }
      }

      const params = {
        orderId: this.id,
        orderNo: this.detail.orderNo,
        intlTicket: this.detail.intlTicket,
        oldPnrNo: this.detail.pnrNo,
        amount: psgPrice.amount,
        cost: psgPrice.cost,
        parvalue: psgPrice.parvalue,
        tax: psgPrice.tax,
        flights: this.detail.flights,
        onlyOneTicketAllowed: onlyOneTicketAllowed,
      };
      this.$refs.changeTicketModal
        .modal(psgList, params)
        .then((v) => this.doCreateChangeOrder(v))
        .catch((ex) => {});
    },
    doCreateChangeOrder: function (info) {
      createChangeOrderMulti(JSON.stringify(info), (jsonResult) => {
        if (jsonResult.status !== "OK") {
          this.showErrMsg(jsonResult.errmsg, "danger");
        } else {
          this.showErrMsg("操作成功");
          this.$router.push("/flt/change/order/" + jsonResult.returnCode);
        }
      });
    },
    setAdultPrice: function () {
      let priceInfo = null;
      // console.log(this.detail.prices);
      for (let i = 0; i < this.detail.prices.length; i++) {
        if (this.detail.prices[i].priceType === 0) {
          priceInfo = this.detail.prices[i];
          break;
        }
      }

      // console.log(priceInfo);

      if (priceInfo === null) {
        return;
      }

      this.adultPrice.price = priceInfo.price;
      this.adultPrice.parValue = priceInfo.parValue;
      this.adultPrice.tax = priceInfo.tax;
      this.adultPrice.insurance = priceInfo.insurance;
      this.adultPrice.serviceCharge = priceInfo.serviceCharge;
      this.adultPrice.commRate = 0;
      this.adultPrice.commission = priceInfo.commission;
      this.adultPrice.discountRate = 0;
      this.adultPrice.discount = priceInfo.discount;
      this.adultPrice.amount = priceInfo.amount;
      this.adultPrice.cost = priceInfo.cost;
      this.adultPrice.ticketCount = this.detail.adultCount;

      // console.log(this.adultPrice);
    },
    setChildPrice: function () {
      this.childPrice.price = this.detail.chdPrice;
      this.childPrice.parValue = this.detail.chdParvalue;
      this.childPrice.tax = this.detail.chdTax;
      this.childPrice.insurance = this.detail.chdInsurance;
      this.childPrice.serviceCharge = this.detail.chdServiceCharge;
      this.childPrice.commRate = 0;
      this.childPrice.commission = this.detail.chdCommission;
      this.childPrice.discountRate = 0;
      this.childPrice.discount = this.detail.chdDiscount;
      this.childPrice.amount = this.detail.chdAmount;
      this.childPrice.cost = this.detail.chdCost;
      this.childPrice.ticketCount = this.detail.childCount;
    },
    setInfantPrice: function () {
      this.infantPrice.price = this.detail.infPrice;
      this.infantPrice.parValue = this.detail.infParvalue;
      this.infantPrice.tax = this.detail.infTax;
      this.infantPrice.insurance = this.detail.infInsurance;
      this.infantPrice.serviceCharge = this.detail.infServiceCharge;
      this.infantPrice.commRate = 0;
      this.infantPrice.commission = this.detail.infCommission;
      this.infantPrice.discountRate = 0;
      this.infantPrice.discount = this.detail.infDiscount;
      this.infantPrice.amount = this.detail.infAmount;
      this.infantPrice.cost = this.detail.infCost;
      this.infantPrice.ticketCount = this.detail.infantCount;
    },
    addExtraService2: function () {
      this.$router.push({
        path: "/vaas/order",
        query: { flightOrderId: this.id },
      });
    },
    showOrderType: function (orderType) {
      return showOrderTypeDesc(orderType);
    },
    onlinePay: function () {
      payForFlightOrder(this.detail.id, (v) => {
        if (v.status === "OK") {
          this.showErrMsg(
            "如果没有打开在线支付新窗口，请检查您的浏览器是否阻止本网页打开新窗口。",
            "info"
          );
          console.log(v.url);
          $("#paymentForm").empty().html(v.url);
          document.forms["alipaysubmit"].submit();
        } else {
          this.showErrMsg(v.errmsg, "danger");
        }
      });
    },
    submitOrder: function () {
      // this.btnDisabled = true
      this.showLoading("处理中");
      submitFlightOrder(
        this.id,
        (v) => this.commonShowMessage(v),
        () => {
          // this.btnDisabled = false
          this.hideLoading();
        }
      );
    },
    approveOrder: function () {
      this.$refs.confirmModal
        .modal("机票订单审批")
        .then((v) => {
          this.showLoading("处理中");
          const params = {
            denyCode: v.denyCode,
            denyReason: v.denyReason,
          };
          approveFlightOrder(
            this.id,
            params,
            (v) => this.commonShowMessage(v),
            () => this.hideLoading()
          );
        })
        .catch((ex) => {});
    },
    saveComment: function () {
      const params = {
        orderType: 1000,
        orderId: this.id,
        content: this.commentContent,
      };
      saveComment(params, (v) => {
        this.commonShowMessage(v);
        if (v.status === "OK") {
          //刷新评论
          this.searchComments();
        }
      });
    },
    searchComments: function () {
      const params = {
        orderType: 1000,
        orderId: this.id,
      };
      searchComments(params, (v) => {
        this.comments = v.dataList;
      });
    },
  },
};
// 874
</script>