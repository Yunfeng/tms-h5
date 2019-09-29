<template>
  <select :id="id">
    <slot></slot>
  </select>
</template>


<script>
import $ from 'jquery'
import { searchCustomers } from '../api/customer.js'

export default {
  props: {
    id: '',
    value: '',
    workMode: '0'
  },
  data () {
    return {
      customers: []
    }
  },
  computed: {
    id0: function () {
      return '#' + this.id
    },
    customers0: function () {
      const s0 = []
      // if (this.workMode === 0) {
      //   // 0 - 用于查找功能时模式
      //   // 1 - 用于新建，修改内容时的模式
      //   s0.push({ 'id': -1, 'text': '全部' })
      // }
      s0.push({ 'id': 0, 'text': '散客' })
      for (const c of this.customers) {
        s0.push({ 'id': c.id, 'text': c.name })
      }
      return s0
    }
  },
  watch: {
    value: function (value) {
      // update value
      $(this.id0).val(value).trigger('change')
      console.log(value)
    },
    customers0: function () {
      $(this.id0).empty().select2({ data: this.customers0 })
    }
  },
  mounted: function () {
    const self = this
    $(this.id0)
      // init select2
      .select2({ data: this.customers0,
        // placeholder: '请选择',
        // allowClear: true,
        language: 'zh-CN',
        minimumInputLength: 2,
        ajax: {
          delay: 500,
          data: function (params) {
            const queryParams = {
              'sc.name': params.term,
              'sc.pageNo': 1,
              'sc.pageSize': 10
            }
            // console.log('data: ' + queryParams.q)
            return queryParams
          },
          processResults: function (data) {
            const s0 = []
            s0.push({ 'id': 0, 'text': '散客' })
            for (const c of data.dataList) {
              s0.push({ 'id': c.id, 'text': c.name })
            }
            console.log(data)
            return {
              results: s0
            }
          },
          transport: function (params, success, failure) {
            // console.log(params)
            // console.log(params.data)

            searchCustomers(params.data, success)
            // self.searchData(params)
            // var request = new AjaxRequest(params.url, params);
            // request.on('success', success);
            // request.on('failure', failure);
          }
        }
      })
      .val(this.value)
      .trigger('change')
      // emit event on change.
      .on('change', function () {
        self.$emit('input', this.value)
      })

    // this.searchData()
  },
  methods: {
    searchCustomer: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 10
      }

      searchCustomers(params, (jsonResult) => {
        this.customers = jsonResult.dataList
      })
    },
    searchData: function (params) {
      console.log(params)
      this.searchCustomer()
    }
  },
  destroyed: function () {
    $(this.id0).off().select2('destroy')
  }
}
</script>
