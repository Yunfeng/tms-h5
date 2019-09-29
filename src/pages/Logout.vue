<template></template>
<script>
import { logout } from '../api/user.js'
export default {
  mounted: function () {
    this.logout()
  },
  methods: {
    logout: function () {
      logout((jsonResult) => {
        if (jsonResult.status === 'OK') {
          this.$store.commit('logout')
          this.$router.replace('/login')
        } else {
          this.$router.replace('/home')
        }
      })
    }
  }
}
</script>