<template>
  <select class="form-control" v-model.trim="productCode0" :class="className">      
    <option value="">所有产品</option>  
    <template v-for="info in products">
      <option :value="info.productCode">{{info.productName}}</option>  
    </template>      
  </select>
</template>


<script>
import { searchProducts } from '../api/product.js'

export default {
  props: {
    id: '',
    productCode: '',
    sizing: ''
  },
  data () {
    return {
      products: [],
      productCode0: ''
    }
  },
  computed: {
    className: function () {
      return {
        'form-control-sm': this.sizing === 'sm'
      }
    }
  },
  watch: {
    productCode: function () {
      this.productCode0 = this.productCode
    },
    productCode0: function (newVal) {
      this.$emit('update:productCode', newVal)
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 500,
        'sc.status': 1
      }

      searchProducts(params,
        (jsonResult) => {
          this.products = jsonResult.dataList
        }
      )
    }
  }
}
</script>
