<template>
  <div class="order">
      <div class="name">联系人</div>
      <i-input class="input" :value.sync="name" size="large" placeholder="请输入联系人" :disabled="id" style="width: 100%;"></i-input>
      <div class="name mt10">联系方式</div>
      <i-input class="input" :value.sync="phoneNo" size="large" @on-blur="inputBlur" placeholder="请输入联系方式" :disabled="id" style="width: 100%;"></i-input>
      <div class="name mt10">所在小区</div>
      <i-select :model.sync="city" size="large" placeholder="请选择所在小区" :disabled="id">
          <i-option value="beijing">北京</i-option>
          <i-option value="shanghai">上海</i-option>
          <i-option value="hangzhou">杭州</i-option>
      </i-select>
      <div class="name mt10">详细地址</div>
      <i-input class="input" :value.sync="address" size="large" @on-blur="inputBlur" placeholder="请输入详细地址" :disabled="id" style="width: 100%;"></i-input>
      <div class="open mt10">
          <i-switch v-model="open" size="large" style="width:80px;">
              <span slot="open">￥480/年</span>
              <span slot="close">￥50/月</span>
          </i-switch>
          <Icon class="grey" type="md-alert"/>
          <span class="huise">点击选择服务周期</span>
      </div>
      <div class="name">服务周期 （2019-08-30 ~ 2019-08-30）</div>
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
      <div v-if="!id" class="payBtn">
        <Button size="large" type="warning" long style="height:40px;width:90%;">支付</Button>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'order',
  data () {
    return {
      name: '',
      phoneNo: '',
      city: '',
      address: '',
      open: true,
      isWXIos: false,
      id: ''
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.isWXIos = this.isWeiXinAndIos();
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
