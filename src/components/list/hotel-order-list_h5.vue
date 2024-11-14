<template>
  <table class="table table-sm table-striped table-hover">
    <thead>
      <tr>
        <th class="d-none d-lg-table-cell">订单号</th>
        <th class="d-none d-lg-table-cell">公司名称</th>
        <th>入住人</th>
        <th>酒店</th>
        <th class="d-none d-lg-table-cell">房型</th>
        <th>入离日期</th>
        <th class="d-none d-md-table-cell">间数</th>
        <th class="d-none d-lg-table-cell">价格</th>
        <th class="d-none d-lg-table-cell">服务费</th>
        <th class="d-none d-lg-table-cell">预订人</th>
        <th class="d-none d-lg-table-cell">总金额</th>
        <th class="d-none d-lg-table-cell">总成本</th>
        <th class="d-none d-lg-table-cell">利润</th>
        <th class="d-none d-lg-table-cell">生成时间</th>
        <th class="d-none d-md-table-cell">状态</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="info in dataList">
        <tr  :key="info.id">
          <td class="d-none d-lg-table-cell">
            <router-link :to="`/hotel/order/` + info.id">{{info.orderNo}}</router-link>
          </td>
          <td class="d-none d-lg-table-cell">{{info.customerName}}</td>
          <td>
            <template v-if="info.passengers.length > 0">
              {{info.passengers[0].name}}
              <span
                v-if="info.passengers.length > 1"
              >等{{info.passengers.length}}人</span>
            </template>
            <template v-else>{{info.passengerName}}</template>
          </td>
          <td>{{info.hotelName}}</td>
          <td class="d-none d-lg-table-cell">{{info.roomType}}</td>
          <td>{{info.checkInDate}}<br />{{info.checkOutDate}}</td>
          <td class="d-none d-md-table-cell">{{info.roomCount}}</td>
          <td class="d-none d-lg-table-cell">{{info.price}}</td>
          <td class="d-none d-lg-table-cell">{{info.serviceCharge}}</td>
          <td class="d-none d-lg-table-cell">{{info.operator}}</td>
          <td class="d-none d-lg-table-cell">{{info.totalAmount}}</td>
          <td class="d-none d-lg-table-cell">{{info.totalCost}}</td>
          <td class="d-none d-lg-table-cell">{{info.profit}}</td>
          <td class="d-none d-lg-table-cell">{{info.createTime}}</td>
          <td class="d-none d-lg-table-cell">{{getStatusDesc(info.status)}}</td>
          <td class>
            <router-link :to="`/h5/hotel/order/` + info.id" :class="{'bg-info text-white': info.status !== 2 && info.status !== 4}"><i class="mdi mdi-arrow-right fa-2"></i></router-link>
          </td>
        </tr>
      </template>
      <tr v-if="dataList.length ===0">
        <td colspan="18" class="text-center">未找到符合的数据</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { showCustomerName } from "../../common/common.js";
import { showHotelOrderStatus } from "../../api/hotel.js";

export default {
  props: {
    dataList: {
      type: Array,
    },
  },
  methods: {
    showDetail: function (id) {
      this.$router.push("/hotel/order/" + id);
    },
    showCustomerName: function (info) {
      return showCustomerName(info);
    },
    getStatusDesc: function (status) {
      return showHotelOrderStatus(status);
    },
  },
};
</script>