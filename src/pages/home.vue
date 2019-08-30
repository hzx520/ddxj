<template>
  <div class="hello">
    <div style="margin-bottom:30px;">欢迎进入代丢小洁</div>
    <div>
      <router-link to="/order">下单</router-link>
      <hr>
      <router-link to="/my">个人中心</router-link>
      <hr>
      <router-link to="/myOrder">订单列表</router-link>
      <hr>
      <router-link to="/feedback">反馈列表</router-link>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: '首页'
    }
  },
  created() {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2forder';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      window.location.href = url;
  }
}
</script>

<style lang="scss">
    .hello {
        padding-top: 50px;
        font-size: 25px;
        text-align: center;        
    }
</style>
