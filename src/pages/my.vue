<template>
  <div></div>  
</template>

<script>
import utils from '../utils';
export default {
  data () {
    return {}
  },
  beforeCreate() {
    let openid = utils.dbGet('openid');
    if(!openid) {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2fme';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      window.location.href = url;
    }else {
      this.$router.push({path: 'me'})
    }
  }
}
</script>
