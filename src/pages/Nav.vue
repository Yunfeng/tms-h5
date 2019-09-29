<template>
</template>

<script>
import { getURLParameter } from '../common/common.js'

export default {
  mounted: function () {
    // console.log("/")
    let to = getURLParameter('to')
    const id = getURLParameter('id')
    if (to !== undefined) {
      // console.log(to)
      to = decodeURIComponent(to)
    }

    const code = getURLParameter('code')
    const state = getURLParameter('state')

    if (code !== undefined && code !== null && code.length > 0) {
      this.$store.dispatch('getWorkWxUserId', {code, state}).finally(() => {
        this.jumpToPage(to, id)
      })
    } else {
      this.jumpToPage(to, id)
    }
  },
  methods: {
    jumpToPage: function (to, id) {
      if (to !== undefined && to.length > 0) {
        if (to === 'alert') {
          this.$store.dispatch('showAlertMsg', { 'errMsg': id, 'errMsgType': 'danger' })
        } else {
          let path = to
          if (id !== undefined && id.length > 0) {
            path = path + '/' + id
          }
          this.$router.push(path)
        }
      } else {
        this.$router.push('/home')
      }      
    }
  }
}
</script>
