<template>
  <div id="component-supplier-payment">
    <div class="form-group row">
        <label class="control-label col-3 text-right">
            供应商
        </label>
        <div class="col-9">
            <my-select-supplier :supplierId.sync="supplierId0" :supplierType="supplierType" :paymentMethodId.sync="paymentMethodId0"></my-select-supplier>
        </div>
    </div>
    <div class="form-group row">
        <label class="control-label col-3 text-right">
            支付方式    
        </label>
        <div class="col-9">
          <my-select-payment :paymentId.sync="paymentMethodId0"></my-select-payment>
        </div>
    </div>                     
  </div>
</template>

<script>
import $ from 'jquery'
import MySelectSupplier from '../components/my-select2-supplier.vue'
import MySelectPayment from '../components/my-select-payment.vue'

export default {
  components: {
    MySelectSupplier,
    MySelectPayment
  },
  props: {
    supplierId: 0,
    paymentMethodId: 0,
    supplierType: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      supplierId0: 0,
      paymentMethodId0: 0
    }
  },
  watch: { 
    supplierId0: function (newVal) {
      this.$emit('update:supplierId', newVal)      
    },
    paymentMethodId0: function (newVal) {
      this.$emit('update:paymentMethodId', newVal) 
    }
  },
  mounted: function () {
    this.supplierId0 = this.supplierId
    this.paymentMethodId0 = this.paymentMethodId
  }
}
</script>
