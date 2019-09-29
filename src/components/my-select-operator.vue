<template>
  <select class="form-control" v-model.trim="username0" :class="className">      
    <option value="">
      <slot name="title">所有人</slot>      
    </option>  
    <template v-for="info in users">
      <option :value="info.username">{{info.username}}</option>  
    </template>      
  </select>
</template>


<script>
import { searchUsers2 } from '../api/user.js'

export default {
  props: {
    id: '',
    username: '',
    sizing: ''
  },
  data () {
    return {
      users: [],
      username0: ''
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
    username: function () {
      this.username0 = this.username
    },
    username0: function (newVal) {
      this.$emit('update:username', newVal)
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 200,
      }
      searchUsers2(params, (jsonResult) => {
        this.users = jsonResult.dataList
      })
    }
  }
}
</script>
