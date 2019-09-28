<template>
  <div class="alert fixed-top text-center" :class="bgClassName" style="display:block; z-index: 1060;" v-show="errAlert">{{errMsg}}</div>
</template>

<script>
export default {
  computed: {
    errAlert () { return this.$store.state.errAlert },
    errMsg () { return this.$store.state.errMsg },
    errMsgType () { return this.$store.state.errMsgType },
    bgClassName () {
      var val
      var msgType = this.$store.state.errMsgType
      // console.log(msgType)
      if (msgType === undefined || msgType === null) {
        val = 'alert-info'
      } else if (msgType === 'danger') {
        val = 'bg-danger text-white fa-2'
      } else {
        val = 'alert-' + msgType
      }

      return val
    }
  }
}
</script>
