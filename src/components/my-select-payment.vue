<template>
  <select class="form-control" v-model.number="paymentId0"  :id="id">
    <option value="0">请选择</option>
    <option :value="info.id" v-for="info in showingPayments">{{info.name}}</option>  
  </select>
</template>


<script>
import { searchPaymentMethods } from '../api/basic-data.js'

export default {
  props: {
    id: '',
    paymentId: 0
  },
  data () {
    return {
      payments: [],
      paymentId0: 0
    }
  },
  watch: {
    paymentId0: function (newVal) {
      // console.log('my-select-payment paymentId: ' + newVal)
      this.$emit('update:paymentId', newVal)
    },
    paymentId: function (newVal) {
      this.paymentId0 = this.paymentId
    }
  },
  computed: {
    showingPayments: function () {
      if (this.paymentId0 === 0) {
        this.paymentId0 = this.paymentId
      }            
      return this.payments.filter(function (info) {
        return true
      })
    }
  },
  mounted: function () {
    this.searchPayments()
  },
  methods: {
    searchPayments: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 1000,
        'sc.status': 1
      }

      searchPaymentMethods(params, (jsonResult) => {
        this.payments = jsonResult.dataList
      })
    }
  }
}
</script>
