<template>
  <select class="form-control select2" data-bs-toggle="select2" :id="id" :disabled="disabled" :class="className">      
    <option :value="-1" v-if="minId === -1">所有客户</option>  
    <option :value="0" v-if="minId <= 0">散客</option>  
    <template v-for="info in showingCustomers">
      <option :value="info.id" :title="info.customerCode + info.pinyin">{{info.name}}</option>  
    </template>      
  </select>
</template>


<script>
  import $ from 'jquery'
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
      disabled: false,
      sizing: ''
    },
    data () {
      return {        
        filterTerm: ''
      }
    },
    computed: {
      customers ()  {
        if (this.status === 1) {
          //启用状态的客户
          return this.$store.getters.customers.filter(function (t) {
            return t.status === 1
          })
        } else {
          return this.$store.getters.customers  
        }        
      },
      showingCustomers: function () {
        const self = this

        return this.customers.filter(function (info) {
          return self.filterTerm === '' ||
            (info.customerCode !== null && info.customerCode.indexOf(self.filterTerm) >= 0) ||
            info.name.indexOf(self.filterTerm) >= 0 ||
            (info.pinyin !== null && info.pinyin.indexOf(self.filterTerm) >= 0)
        })
      },
      className: function () {
        return {
          'form-control-sm': this.sizing === 'sm'
        }
      }
    },
    mounted: function () {
      if (this.customers.length === 0) {        
          this.$store.dispatch('searchCustomer')
      }

      const vm = this
      // console.log($(this.$el))
      $(this.$el)
        // init select2
        .select2({
          data: this.customers,
          placeholder: '请选择客户',
          matcher: this.matchCustomSelect2
        })
        .val(this.customerId)
        .trigger('change')
        // emit event on change.
        .on('change', function () {
          // vm.$emit('input', this.value) // this - select object
          vm.$emit('update:customerId', this.value)
        })          
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    },
    watch: {
      customerId: function (value) {
        // update value
        $(this.$el)
          .val(value)
          .trigger('change')
      }
    },
    methods: {
      // searchCustomer: function () {
      //   const params = {
      //     'sc.pageNo': 1,
      //     'sc.pageSize': 10000,
      //     'sc.status': this.status,
      //     'sc.enterpriseType': this.enterpriseType
      //   }

      //   searchCustomers(params, (jsonResult) => {
      //     this.customers = jsonResult.dataList
      //   })
      // },
      matchCustomSelect2: function (params, data) {        
        // If there are no search terms, return all of the data
        
        if ($.trim(params.term) === '') {
          return data;
        }

        // console.log(params.term)

        // Do not display the item if there is no 'text' property
        if (typeof data.text === 'undefined') {
          return null;
        }

        // `params.term` should be the term that is used for searching
        // `data.text` is the text that is displayed for the data object
        if (data.text.indexOf(params.term.toUpperCase()) > -1 || data.title.indexOf(params.term.toUpperCase()) > -1) {
          // console.log(data)
          return data;
          // var modifiedData = $.extend({}, data, true);
          // modifiedData.text += ' (matched)';

          // You can return modified objects from here
          // This includes matching the `children` how you want in nested data sets
          // return modifiedData;
        }

        // Return `null` if the term should not be displayed
        return null;
      }
    }
  }
</script>
