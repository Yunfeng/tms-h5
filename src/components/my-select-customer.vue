<template>
  <div class="input-group" :id="id">
    <select class="form-control input-group-addon" v-model.number="customerId0"  :disabled="disabled">      
      <option :value="-1" v-if="minId === -1">所有客户</option>  
      <option :value="0" v-if="minId <= 0">散客</option>  
      <template v-for="info in showingCustomers">
        <option :value="info.id">{{info.name}}</option>  
      </template>      
    </select>
    <input type="text" class="form-control col-4" placeholder="快搜客户" v-model.trim="val"  :disabled="disabled">
  </div>
</template>


<script>
import { searchCustomers } from '../api/customer.js'

export default {
  props: {
    id: '',
    customerId: 0,
    minId: {
      type: Number,
      default: -1
    },
    status: {
      type: Number,
      default: -1
    },
    enterpriseType: {
      type: Number,
      default: -1
    },
    disabled: false
  },
  data () {
    return {
      customers: [],
      val: '',
      customerId0: -1
    }
  },
  watch: {
    customerId: function () {
      // console.log(this.customerId)
      this.customerId0 = this.customerId
    },
    customerId0: function (newVal) {
      this.$emit('update:customerId', newVal)
    },
    val: function (newVal) {
      this.val = newVal.toUpperCase()

      if (this.val !== '' && this.showingCustomers.length > 0) {
        this.customerId0 = this.showingCustomers[0].id
      }
    }
  },
  computed: {
    showingCustomers: function () {
      const self = this
      return this.customers.filter(function (info) {
        return self.val === '' ||
          (info.customerCode !== null && info.customerCode.indexOf(self.val) >= 0) ||
          info.name.indexOf(self.val) >= 0 ||
          (info.pinyin !== null && info.pinyin.indexOf(self.val) >= 0)
      })
    }
  },
  mounted: function () {
    this.searchCustomer()
  },
  methods: {
    searchCustomer: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 10000,
        'sc.status': this.status,
        'sc.enterpriseType': this.enterpriseType
      }

      searchCustomers(params, (jsonResult) => {
        this.customers = jsonResult.dataList
      })
    }
  }
}
</script>
