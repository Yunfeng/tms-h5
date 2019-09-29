<template>
  <select class="form-control"  v-model.number="supplierId0" :id="id">
    <option value="0">请选择供应商</option>  
    <template v-for="info in suppliers">
      <option :value="info.id">{{info.name}}</option>  
    </template>      
  </select>
</template>


<script>
  import $ from 'jquery'
  import { searchSuppliers } from '../api/basic-data.js'

  export default {
    props: {
      id: '',
      supplierId: 0,
      paymentMethodId: 0,
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
    mounted: function () {
      this.searchSuppliers()
      this.supplierId0 = this.supplierId

      const vm = this
      $(this.$el)
        // init select2
        .select2({ data: this.suppliers })
        .val(this.supplierId0)
        .trigger('change')
        // emit event on change.
        .on('change', function () {
          // vm.$emit('input', this.value) // this - select object
          // console.log('change supplierId0: ' + this.value)
          // console.log('change supplierId0: ' + vm.supplierId0)
          // vm.$emit('update:supplierId', this.value)
          vm.supplierId0 = parseInt(this.value)
        })      
    },
    watch: {
      supplierId: function (value) {
        // update value
        $(this.$el)
          .val(value)
          .trigger('change')
      },      
      supplierId0: function (newVal) {
        // console.log('watch supplierId0: ' + newVal)
        this.$emit('update:supplierId', newVal)
        //计算默认的 支付方式id
        for(const info of this.suppliers) {
          if (info.id === newVal) {
            if (info.paymentMethodId > 0) {
              console.log(info.paymentMethodId + ', ' + info.name)
              this.$emit('update:paymentMethodId', info.paymentMethodId)
            }
          }
        }
      },
      supplierType: function () {
        this.searchSuppliers()
      }
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    },
    methods: {
      searchSuppliers: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 1000,
          'sc.type': this.supplierType,
          'sc.status': 1
        }

        searchSuppliers(params, (jsonResult) => {
          this.suppliers = jsonResult.dataList
        })
      }
    }
  }
</script>
