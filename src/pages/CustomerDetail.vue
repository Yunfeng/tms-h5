<template>
  <div id="customers">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/customers'>客户</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card">
      <table class="table table-striped table-sm small" id="tmcDetail" v-if="customer !== null">
        <tr>
          <td class="text-right text-info">公司名称</td>
          <td>
            {{customer.vipName}}
            <template v-if="customer.customerEnterpriseId > 0">
              <router-link :to="`/admin/member/enterprise/` + customer.customerEnterpriseId" class="small ml-5">会员信息</router-link>
            </template>
          </td>
        </tr>
        <tr>
          <td class="text-right text-info">公司全称</td>
          <td>{{customer.fullName}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">客户编号</td>
          <td>{{customer.customerCode}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">客户类型</td>
          <td>
            <span v-if="customer.enterpriseType === 1">企业客户</span>
            <span v-else>企业散客</span>
          </td>
        </tr>
        <tr>
          <td class="text-right text-info">排序拼音</td>
          <td>{{customer.pinyin}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">服务项目</td>
          <td>{{customer.serviceItem}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">销售员</td>
          <td>{{customer.salesStaff}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">客户维护人</td>
          <td>{{customer.customerMaintainer}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">协议开始日期</td>
          <td>{{customer.agreementBeginDate}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">协议结束日期</td>
          <td>{{customer.agreementEndDate}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">合同负责人</td>
          <td>{{customer.contractLinkman}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">合同负责人联系电话</td>
          <td>{{customer.contractLinkPhone}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">账单联系人</td>
          <td>{{customer.linkman}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">联系电话</td>
          <td>{{customer.phone}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">电子邮箱</td>
          <td>{{customer.email}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">邮寄地址</td>
          <td>{{customer.address}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">结算方式</td>
          <td>{{getSettlementTypeDesc(customer.settlementType)}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">结算方式</td>
          <td>{{customer.settlementMode}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">结算周期</td>
          <td>{{customer.settlementPeriod}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">出票是否需审核</td>
          <td>
            <span v-if="customer.approvalTicket === 1">是</span>
            <span v-else>否</span>
          </td>
        </tr>
        <tr>
          <td class="text-right text-info">出票审核方式</td>
          <td>{{getApprovalTypeDesc(customer.approvalType)}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">审核方式备注</td>
          <td>{{customer.approvalMode}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">行程单</td>
          <td>{{getItineraryTypeDesc(customer.itineraryType)}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">备注</td>
          <td>{{customer.remark}}</td>
        </tr>
        <tr>
          <td class="text-right text-info">短网址</td>
          <td>
            <span v-if="customer.shortUrl === 0" class="text-danger">未启用</span>
            <span v-if="customer.shortUrl === 1" class="text-success">启用</span>
          </td>
        </tr>
        <tr>
          <td class="text-right text-info">状态</td>
          <td>
            <span v-if="customer.status === 0" class="text-danger">停用</span>
            <span v-if="customer.status === 1" class="text-success">启用</span>
          </td>
        </tr>
          <tr>
              <td class="text-right text-info">发布时间</td>
              <td>{{customer.createTime}}</td>
          </tr>
          <tr>
              <td class="text-right text-info">修改时间</td>
              <td>{{customer.lastUpdate}}</td>
          </tr>
      </table>
      <div class="card-footer"  v-if="customer !== null">
        <router-link :to="`/customer?id=` + id">修改</router-link>
      </div>      
    </div>
  </div>
</template>

<script>
  import { searchCustomerDetail, getSettlementTypeDesc, getApprovalTypeDesc, getItineraryTypeDesc } from '../api/customer.js'

  export default {
    data () {
      return {
        id: 0,
        customer: null
      }
    },
    mounted: function () {
      this.id = this.$route.params.id
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (msg) {
        this.$store.dispatch('showLoading', { 'loadingText': msg })
      },
      hideLoading: function () {
        this.$store.dispatch('hideLoading')
      },
      search: function () {
        searchCustomerDetail(this.id,
          (jsonResult) => {
            this.customer = jsonResult
          }
        )
      },
      getSettlementTypeDesc: function (val) {
        return getSettlementTypeDesc(val)
      },
      getApprovalTypeDesc: function (val) {
        return getApprovalTypeDesc(val)
      },
      getItineraryTypeDesc: function (val) {
        return getItineraryTypeDesc(val)
      }
    }
  }
</script>