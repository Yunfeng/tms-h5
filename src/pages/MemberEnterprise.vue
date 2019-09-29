<template>
  <div id="customers">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/admin/members'>会员</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">会员企业信息</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card"  v-if="info !== null">
      <dl class="row">
        <dt class="col-3 text-right">ID</dt>
        <dd class="col-9">{{info.id}}</dd>
        <dt class="col-3 text-right">名称</dt>
        <dd class="col-9">{{info.name}}</dd>
        <dt class="col-3 text-right">全称</dt>
        <dd class="col-9">{{info.fullName}}</dd>
        <dt class="col-3 text-right">企业微信ID</dt>
        <dd class="col-9">{{info.wwCorpId}}</dd>
        <template v-if="customers.length > 0">        
          <dt class="col-3 text-right">关联的客户信息</dt>
          <dd class="col-9">            
            <dl class="row bg-secondary text-white">
              <template v-for="(info, index) in customers">
                <dt class="col-3 text-warning">名称</dt>
                <dd class="col-9 text-left">{{info.vipName}} <router-link :to="`/customer/` + info.id" class="small text-white">详情</router-link></dd>
                <dt class="col-3  text-warning">备注</dt>
                <dd class="col-9">{{info.remark}}</dd>
              </template>
            </dl>
          </dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<script>
  import { searchEnterpriseById, searchCustomerByEnterpriseId } from '../api/customer.js'

  export default {
    data () {
      return {
        id: 0,
        info: null,
        customers: []
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
      search: function () {
        searchEnterpriseById(this.id,
          (jsonResult) => {
            this.info = jsonResult
            this.searchCustomer()
          }
        )
      },
      searchCustomer: function () {
        searchCustomerByEnterpriseId(this.id, v => this.customers = v)
      }
    }
  }
</script>