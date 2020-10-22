<template>
  <table id="flight-order-list" class="table table-sm table-striped">
    <thead>
      <tr>
        <th class="d-none d-lg-table-cell">订单号</th>
        <th class="d-none d-md-table-cell">客户</th>
        <th class="d-none d-md-table-cell">编码</th>
        <th>乘机人</th>
        <th>出发</th>
        <th>到达</th>
        <th>日期</th>
        <th>航班</th>
        <th class="d-none d-sm-table-cell">
          舱位
        </th>
        <th class="d-none d-lg-table-cell">操作员</th>
        <th class="d-none d-lg-table-cell">发票</th>
        <th class="d-none d-md-table-cell">订单日期</th>
        <th class="text-right d-none d-md-table-cell">金额</th>
        <th class="text-right d-none d-md-table-cell">成本</th>
        <th class="text-right d-none d-md-table-cell">利润</th>
        <th class="d-none d-md-table-cell">订单状态</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="info in dataList">
        <tr
          :class="{ 'bg-info text-white': info.orderStatus !== 32 }"
          :key="info.id"
          @click.stop="showDetail(info.id)"
        >
          <td class="d-none d-lg-table-cell">
            {{ info.orderNo }}
            <span class="text-danger" v-if="info.intlTicket === 1"
              ><br />国际</span
            >
          </td>
          <td class="d-none d-md-table-cell">
            {{ showCustomerName(info) }}
          </td>
          <td class="d-none d-md-table-cell">
            {{ info.pnrNo }}
            <span class="text-danger" title="大客户代码"
              ><strong>{{ info.keyCustomerNo }}</strong></span
            >
          </td>
          <td>
            <template v-for="(psg, index) in info.passengers">
              {{ showPassengerName(psg.name) }}
              <template v-if="index < info.passengers.length - 1"
                ><br
              /></template>
            </template>
          </td>
          <td class="px-0">
            <template v-for="(flt, index) in info.flights">
              {{ flt.dportName
              }}<span class="text-success d-none">{{ flt.dport }}</span>
              <template v-if="index < info.flights.length - 1"><br /></template>
            </template>
          </td>
          <td class="px-0">
            <template v-for="(flt, index) in info.flights">
              {{ flt.aportName
              }}<span class="text-success d-none">{{ flt.aport }}</span>
              <template v-if="index < info.flights.length - 1"><br /></template>
            </template>
          </td>
          <td class="px-0">
            <template v-for="(flt, index) in info.flights">
              {{ flt.ddate.substring(5) }}
              <template v-if="index < info.flights.length - 1"><br /></template>
            </template>
          </td>
          <td class="px-0">
            <template v-for="(flt, index) in info.flights">
              {{ flt.flightNo }}
              <template v-if="index < info.flights.length - 1"><br /></template>
            </template>
          </td>
          <td class="px-0 text-center d-none d-sm-table-cell">
            <template v-for="(flt, index) in info.flights">
              {{ flt.subclass }}
              <template v-if="index < info.flights.length - 1"><br /></template>
            </template>
          </td>
          <td class="d-none d-lg-table-cell">{{ info.operator }}</td>
          <td class="d-none d-lg-table-cell">
            <span
              :class="{
                'text-danger':
                  info.itineraryType !== 0 && info.itineraryMailingStatus === 0,
              }"
            >
              {{ getItineraryTypeDesc(info.itineraryType) }}
            </span>
          </td>
          <td class="d-none d-md-table-cell">
            {{ info.createDate.substring(5) }}
          </td>
          <td class="text-right d-none d-md-table-cell">
            {{ info.totalAmount }}
          </td>
          <td class="text-right d-none d-md-table-cell">
            {{ info.totalCost }}
          </td>
          <td class="text-right d-none d-md-table-cell">{{ info.profit }}</td>
          <td class="d-none d-md-table-cell">
            {{ getStatusDesc(info.status) }}

            <template v-if="info.status !== 32">
              <span
                class="text-danger small"
                v-if="info.priceCheckedStatus === 0 && info.intlTicket === 1"
                >待验价</span
              >
            </template>

            <span class="text-info small" v-if="info.payStatus === 1"
              >已收</span
            >
            <span class="text-primary small" v-else-if="info.payStatus === 2"
              >已销</span
            >
          </td>
          <td class="text-center">
            <i class="mdi mdi-arrow-right fa-2"></i>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import {
  showFlightOrderStatus,
  showPayType,
  showItineraryType,
} from "../../common/common.js";
import { showCustomerName, showPassengerName } from "../../common/common.js";

export default {
  props: {
    dataList: {
      type: Array,
    },
  },
  methods: {
    showDetail: function (id) {
      this.$router.push("/h5/flt/order/" + id);
    },
    getStatusDesc: function (status) {
      return showFlightOrderStatus(status);
    },
    getPayTypeDesc: function (payType) {
      return showPayType(payType);
    },
    getItineraryTypeDesc: function (itineraryType) {
      return showItineraryType(itineraryType);
    },
    showCustomerName: function (info) {
      return showCustomerName(info, 0);
    },
    showPassengerName: function (info) {
      return showPassengerName(info, 0);
    },
  },
};
</script>