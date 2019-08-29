<template>
  <div class="order">
      <div class="name">联系人</div>
      <i-input class="input" :value.sync="name" size="large" placeholder="请输入联系人" :disabled="!!id" style="width: 100%;"></i-input>
      <div class="name mt10">联系方式</div>
      <i-input class="input" :value.sync="phoneNo" size="large" @on-blur="inputBlur" placeholder="请输入联系方式" :disabled="!!id" style="width: 100%;"></i-input>
      <div class="name mt10">所在小区</div>
      <i-select :model.sync="city" size="large" placeholder="请选择所在小区" :disabled="!!id">
          <i-option value="beijing">北京</i-option>
          <i-option value="shanghai">上海</i-option>
          <i-option value="hangzhou">杭州</i-option>
      </i-select>
      <div class="name mt10">详细地址</div>
      <i-input class="input" :value.sync="address" size="large" @on-blur="inputBlur" placeholder="请输入详细地址" :disabled="!!id" style="width: 100%;"></i-input>
      <div class="open mt10">
          <i-switch v-model="open" size="large" @on-change="getTime" style="width:80px;">
              <span slot="open">￥480/年</span>
              <span slot="close">￥50/月</span>
          </i-switch>
          <Icon class="grey" type="md-alert"/>
          <span class="huise">点击选择服务周期</span>
      </div>
      <div class="name">服务周期 （{{startTime}} ~ {{endTime}}）</div>
      <div class="tip mt10">
          <Icon class="grey" type="md-alert"/>
          <span class="huise">代丢服务自购买成功后次日生效</span>
      </div>
      <div class="tip">
          <Icon class="grey" type="md-alert"/>
          <span class="huise">请您早上8点前，晚上7点后将垃圾放置门口处,专业保洁人员会上门回收处理</span>
      </div>
      <div class="tip">
          <Icon class="grey" type="md-alert"/>
          <span class="huise">【温馨提醒】：亲~ 请做好垃圾分类哦~~</span>
      </div>

      <!-- <div>openid:{{openid}} code:{{code}} res:{{res}}</div> -->
      <div>{{openid}}</div>
      <div v-if="!id" class="payBtn">
        <Button size="large" type="warning" long style="height:40px;width:90%;" @click="authorize">支付</Button>
      </div>
  </div>
</template>

<script>
import $ from 'jquery';
import wx from 'weixin-js-sdk';
import moment from 'moment';
export default {
  name: 'order',
  data () {
    return {
      name: '',
      phoneNo: '',
      city: '',
      address: '',
      startTime: '',
      endTime: '',
      open: true,
      isWXIos: false,
      id: '',
      code: null,
      openid: '',
      res: '',
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.isWXIos = this.isWeiXinAndIos();
    if(this.id) {
      this.queryOrderDetail();
    }
    this.getTime();
  },
  mounted() {
  },
  watch:{
    $route(to,from){
      console.log(to.path);
      if(this.getCode()) {
        this.getOpenid();
      }
    }
  },
  methods: {
    inputBlur() {
      if(this.isWXIos) {        
        setTimeout(function(){
          window.scrollTo(0, 0);
        },100);
      }
    },
    isWeiXinAndIos () {
      let ua = '' + window.navigator.userAgent.toLowerCase()
      let isWeixin = /MicroMessenger/i.test(ua)
      let isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)
      return isWeixin && isIos
    },
    queryOrderDetail() {
      let params = {
        id: this.id
      }
      // this.$http.post('https://cnodejs.org/api/v1/topics',params).then(res => {
      //   this.isLoading = false;
      //   this.items = res.data.data;
      //   console.log(this.items);   
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    authorize() {
      let appId = 'wx1ea6607052b21894';
      // let redirect = 'http%3a%2f%2f10.3.149.90%3a8080%2f%23%2forder';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2fdist%2f%23%2forder';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;      
      // let redirect2 = 'https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60';
      // let url2 = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
      window.location.href = url;
    },
    getCode() {
      var url_str = location.href // 获取整个地址栏的url_str
      var num = url_str.indexOf("?")
      url_str = url_str.substr(num + 1) // 获取url中的参数
      var arr = url_str.split("&") // 获取url参数数组
      // 获取code
      for(var i=0;i<arr.length;i++){
        num = arr[i].indexOf('=')
        if(arr[i].substring(0, num) == 'code'){
          this.code = arr[i].substr(num+1)
        }
      }
      return this.code;
      // this.getOpenid();
    },
    getOpenid() {
      let appId = 'wx1ea6607052b21894';
      let secret = '9d54f7a93ad9884e404072e8011e73c4';
      let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${this.code}&grant_type=authorization_code`;
      this.$http.get(url).then(res => {
        console.log(res);
        this.openid = res.openid;
        this.res = res;
      }).catch(err => {
        console.log(err)
      })
    },
    getTime() {
      this.startTime =  moment().add(1, 'days').format('YYYY-MM-DD');
      if(this.open) {
        this.endTime = moment().add(1, 'years').format('YYYY-MM-DD');
      }else {
        this.endTime = moment().add(1, 'months').format('YYYY-MM-DD');
      }
    }
  },
}
</script>

<style lang="scss" scoped>
    .order {
      padding: 10px 15px;
      .name {
        line-height: 42px;
        text-indent: 10px;
      }
      .open {
         padding-top: 10px;
      }
      .huise {
         color: #d2d2d2;
         line-height: 25px;
      }
      .mt10 {
        margin-top: 10px;
      }
      .mt20 {
        margin-top: 20px;
      }
      .grey {
        color: grey;
      }
      .payBtn {
        width: 100%;
        text-align: center;
        height: 40px;
        position: fixed;
        bottom: 10px;
        left: 0;
      }
    }
</style>
<style lang="scss">
    // .ivu-switch-checked .ivu-switch-inner {
    //   width: 70px;
    // }
    .ivu-switch-large.ivu-switch-checked:after {
        left: 58px;
    }
    .ivu-switch {
        border-color: #FF8000;
        background-color: #FF8000;
    }
    .ivu-btn-warning {
      border-color: #FF8000;
      background-color: #FF8000;
    }
  
</style>
