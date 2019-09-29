<template>
  <table class="table table-striped table-sm small">
    <thead>
      <tr>
          <th>手机号</th>
          <th>内容</th>
          <th>发送人</th>
          <th>发送状态</th>
          <th></th>
          <th></th>
      </tr>          
    </thead>
    <tbody>
      <tr v-for="info in dataList" :key="info.id">
          <td>{{info.recvPhoneNo}}</td>
          <td>{{info.smsContent}}</td>
          <td>{{info.operator}}</td>
          <td>
            <span v-if="info.smsType === 1">
              上行
            </span>
            <span v-else-if="info.sendStatus === '01'">
              已发
            </span>
            <span v-else-if="info.sendStatus === '02'" class="text-danger">
              IP限制
            </span>
            <span v-else-if="info.sendStatus === '07'" class="text-danger">
              太频繁
            </span>
            <span v-else-if="info.sendStatus === '08'" class="text-danger">
              余额不足
            </span>
            <span v-else-if="info.sendStatus === '97'"  class="text-danger">
              发送异常
            </span>
            <span v-else-if="info.sendStatus === '98'"  class="text-danger">
              不符合模板
            </span>
            <span v-else>
              {{info.sendStatus}}
            </span>                
          </td>
          <td>{{info.createTime}}</td>
          <td>{{info.lastUpdate}}</td>
      </tr>          
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      dataList: {
        type: Array
      }
    }
  }
</script>