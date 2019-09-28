<template>
  <div id="loadingToast" v-show="loading">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-loading weui-icon_toast"></i>
      <p class="weui-toast__content">{{loadingText}}</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loading () { return this.$store.state.loading },
    loadingText () { return this.$store.state.loadingText }
  }
}
</script>

<style>
.weui-toast {
  position: fixed;
  z-index: 5000;
  width: 7.6em;
  min-height: 7.6em;
  top: 180px;
  left: 50%;
  margin-left: -3.8em;
  background: rgba(40, 40, 40, 0.75);
  text-align: center;
  border-radius: 5px;
  color: #FFFFFF;
}
.weui-icon_toast {
  margin: 22px 0 0;
  display: block;
}
.weui-icon_toast.weui-icon-success-no-circle:before {
  color: #FFFFFF;
  font-size: 55px;
}
.weui-icon_toast.weui-loading {
  margin: 30px 0 0;
  width: 38px;
  height: 38px;
  vertical-align: baseline;
}
.weui-toast__content {
  margin: 0 0 15px;
}
.weui-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.weui-mask_transparent {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

</style>
