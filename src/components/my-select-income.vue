<template>
  <div class="input-group" :id="id">
    <select class="form-control input-group-addon" v-model="incomeRemark0">
      <option value="">如需要，请选择客户付款备注</option>  
      <template v-for="info in dataList">
        <option :value="info.name">{{info.name}}</option>  
      </template>      
    </select>
  </div>
</template>


<script>
import { searchIncomeMethods } from '../api/basic-data.js'

export default {
  props: {
    id: '',
    incomeRemark: ''
  },
  data () {
    return {
      dataList: [],
      incomeRemark0: ''
    }
  },
  watch: {
    incomeRemark0: function (newVal) {
      this.$emit('update:incomeRemark', newVal)
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 1000
      }

      searchIncomeMethods(params, (jsonResult) => {
        this.dataList = jsonResult.dataList
      })
    }
  }
}
</script>
