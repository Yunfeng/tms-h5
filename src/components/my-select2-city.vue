<template>
  <select class="form-control"  v-model.number="cityId0" :id="id">
    <option value="0">请选择城市</option>  
    <template v-for="info in cityList">
      <option :value="info.id">{{info.cityName}}</option>  
    </template>      
  </select>
</template>


<script>
  import $ from 'jquery'
  import { getAllCity } from '../api/hotel.js'

  export default {
    props: {
      id: '',
      cityId: 0,
    },
    data () {
      return {
        cityList: [],
        cityId0: 0
      }
    },
    mounted: function () {
      this.getAllCity()
      this.cityId0 = this.cityId

      const vm = this
      $(this.$el)
        // init select2
        .select2({ data: this.cityList })
        .val(this.cityId0)
        .trigger('change')
        // emit event on change.
        .on('change', function () {
          // vm.$emit('input', this.value) // this - select object
          // console.log('change supplierId0: ' + this.value)
          // console.log('change supplierId0: ' + vm.supplierId0)
          // vm.$emit('update:supplierId', this.value)
          vm.cityId0 = parseInt(this.value)
        })      
    },
    watch: {
      cityId: function (value) {
        // update value
        $(this.$el)
          .val(value)
          .trigger('change')
      },      
      cityId0: function (newVal) {
        // console.log('watch supplierId0: ' + newVal)
        this.$emit('update:cityId', newVal)
      }
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    },
    methods: {
      getAllCity: function () {
        getAllCity(v => {
          this.cityList = v
          console.log(this.cityList)
        })
      }
    }
  }
</script>
