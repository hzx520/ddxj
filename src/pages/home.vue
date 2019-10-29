<template>
  <div style="text-align: center;">
    <div style="margin-bottom:30px;">欢迎进入代丢小洁</div>
    <div>
      <router-link to="/order">下单</router-link>
      <hr>
      <router-link to="/me">个人中心</router-link>
      <hr>
      <router-link to="/myOrder">订单列表</router-link>
      <hr>
      <router-link to="/feedback">反馈列表</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
