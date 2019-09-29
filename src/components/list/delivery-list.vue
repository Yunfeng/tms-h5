<template>
  <table class="table table-striped table-sm">
    <thead>
      <tr>
        <th>单号</th>
        <th>内容</th>
        <th>配送日期</th>
        <th>收件人</th>
        <th>电话</th>
        <th>地址</th>
        <th>备注</th>
        <th>生成时间</th>
        <th>状态</th>
        <th></th>
      </tr>                        
    </thead>
    <tbody>
      <template v-for="info in dataList" >
        <tr :class="{'table-dark': info.status === 4}" style="color: black">
          <td>{{info.orderNo}}</td>
          <td>
              {{info.deliveredContent}}  
          </td>
          <td>{{info.deliveryDate}}</td>
          <td>{{info.receiver}}</td>
          <td>{{info.mobile}}</td>
          <td>{{info.address}}</td>
          <td>{{info.remark}}</td>
          <td>{{info.createTime}}</td>
          <td>{{getStatusDesc(info.status)}}</td>
          <td class="">
            <router-link :to="`/delivery/note/` + info.id">详情<i class="mdi mdi-arrow-right"></i></router-link>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
  import { showDeliveryNoteStatus } from '../../api/delivery.js'
  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getStatusDesc: function (status) {
        return showDeliveryNoteStatus(status)
      }
    }
  }
</script>