<script>
  import Vue from 'vue'
  import {
    pick
  } from 'lodash'

  export default {
    onLaunch: function() {
      // #ifdef APP-PLUS
      try{
        plus.screen.lockOrientation("portrait-primary");
      }catch(e){

      }
      uni.getSystemInfo({
        success: function(e) {
          // #ifndef MP
          Vue.prototype.$StatusBar = e.statusBarHeight;
          if (e.platform == 'android') {
            Vue.prototype.$CustomBar = e.statusBarHeight + 50;
          } else {
            Vue.prototype.$CustomBar = e.statusBarHeight + 45;
          }
          // #endif

          // #ifdef MP-WEIXIN
          Vue.prototype.$StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          Vue.prototype.$Custom = custom;
          Vue.prototype.$CustomBar = custom.bottom + custom.top - e.statusBarHeight;
          // #endif

          // #ifdef MP-ALIPAY
          Vue.prototype.$StatusBar = e.statusBarHeight;
          Vue.prototype.$CustomBar = e.statusBarHeight + e.titleBarHeight;
          // #endif
        }
      })

    },
    onShow: function() {},
    onHide: function() {}

  }
</script>

<style>
  @import "colorui/main.css";
  @import "colorui/icon.css";
  @import "colorui/animation.css";

  .safe-bottom {
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
    /* min-height: 15px; */
  }

  page {
    height: 100%;
    color: #333;
    overflow: hidden;
  }

  /* #ifdef H5 */
  html,
  body {
    height: 100%;
    overflow: hidden;
  }

  /* #endif */
  .page-container {
    height: 100%;
    position: relative;
  }

  .page-content {
    height: 0;
    flex-grow: 1;
    position: relative;
  }

  .page-scroll {
    height: 100%;
    box-sizing: border-box;
    padding: 1px;
  }

  .txt-one {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  * {
    cursor: pointer;
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .bg-blue2 {
    background-color: #199eff;
  }
  
  .uni-picker-item {
    font-size: 24rpx !important;
  }
  
  .h100 {
    height: 100%;
  }
</style>
