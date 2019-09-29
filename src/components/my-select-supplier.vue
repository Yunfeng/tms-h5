<template>
  <select class="form-control" v-model.number="supplierId0" :id="id">
    <option value="0">请选择</option>  
    <template v-for="info in showingSuppliers">
      <option :value="info.id">{{info.name}}</option>  
    </template>      
  </select>
</template>


<script>
import { searchSuppliers } from '../api/basic-data.js'

export default {
  props: {
    id: '',
    supplierId: 0,
    supplierType: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      suppliers: [],
      supplierId0: 0
    }
  },
  watch: {
    supplierId0: function (newVal) {
      this.$emit('update:supplierId', newVal)
    },
    supplierType: function () {
      this.searchSuppliers()
    }
  },
  computed: {
    showingSuppliers: function () {
      return this.suppliers.filter(function (info) {
        return true
      })
    }
  },
  mounted: function () {
    this.searchSuppliers()
  },
  activated: function () {
    console.log('my-select-supplier: activated')
  },
  methods: {
    searchSuppliers: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 1000,
        'sc.type': this.supplierType
      }

      searchSuppliers(params, (jsonResult) => {
        this.suppliers = jsonResult.dataList
      })
    }
  }
}
</script>
