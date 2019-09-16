<template>
  <div class="order" id="order">
      <div v-if="!!orderNo">
        <div class="name">订单号</div>
        <div style="font-size:14px;color:#666;line-height:35px;">{{orderNo}}</div>
        <hr>
      </div>
      <div class="name">联系人</div>
        <i-input class="order_input" v-model="addForm.name" size="large" placeholder="请输入联系人" :readonly="!!orderNo"  style="width: 100%;"></i-input>
      <hr>
      <div class="name">联系方式</div>
      <i-input class="order_input" v-model="addForm.mobile" size="large" @on-blur="inputBlur" placeholder="请输入联系方式" :readonly="!!orderNo" style="width: 100%;"></i-input>
      <hr>
      <div class="name">所在小区</div>
      <Select class="order_input" v-model="addForm.village" @on-change="villageChange" size="large" placeholder="请选择所在小区" :disabled="!!orderNo">
        <Option v-for="(item, index) in villageList" :key="index" :value="item.id">{{item.villageName}}</Option>
      </Select>
      <hr>
      <div class="name">详细地址</div>
      <i-input class="order_input" v-model="addForm.addr" size="large" @on-blur="inputBlur" placeholder="请输入具体门牌号" :readonly="!!orderNo" style="width: 100%;"></i-input>
      <hr>


      <div class="name">服务方式</div>
      <div class="service">
        <div class="service-inner">
          <div v-for="(item, index) in priceList" :key="index" class="service-btn" :class="{active: priceIndex == index}" @click="changePrice(index)">￥{{item.cost + '/' + item.serviceName}}</div>
        </div>
      </div>
      
      <div class="name" style="line-height:22px;padding-bottom:10px;font-size:13px;color:#666;">预计服务周期 （{{price.startTime}} ~ {{price.endTime}}）</div>
      <hr>
      <div style="padding-top:3px;">
        <div class="tip" v-for="(item, index) in tipList" :key="index">
            <Icon class="grey" type="md-alert"/>
            <span class="huise">{{item.content}}</span>
        </div>
      </div>

      <div v-if="!orderNo" class="payBtn">
        <Button size="large" type="warning" long style="height:40px;width:90%;" :disabled="!villageList || villageList.length == 0" @click="submitPay">支付</Button>
      </div>
  </div>
</template>

<script>
import $ from 'jquery';
import wx from 'weixin-js-sdk';
import moment from 'moment';
import utils from '../utils';
export default {
  name: 'order',
  data () {
    return {
      orderNo: '',
      addForm: {
        name: '',
        mobile: '',
        village: '',
        addr: '',
      },
      open: true,
      isWXIos: false,
      code: null,
      openid: '',
      tipList: [],
      villageList: [],
      price: {},
      priceIndex: 0,
      priceList: [{
        cost: 50,
        serviceName: '月度',
        serviceType: 1,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(1, 'months').format('YYYY-MM-DD')
      },{
        cost: 145,
        serviceName: '季度',
        serviceType: 3,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(3, 'months').format('YYYY-MM-DD')
      },{
        cost: 270,
        serviceName: '半年',
        serviceType: 4,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(6, 'months').format('YYYY-MM-DD')
      },{
        cost: 499,
        serviceName: '年度',
        serviceType: 2,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(1, 'months').format('YYYY-MM-DD')
      }]
    }
  },
  created() {
    // utils.dbSet('openid', 'opQDEvkDdan-WKZ0YoZY5MVEtliE');
    this.orderNo = this.$route.query.orderNo;
    let openid = utils.dbGet('openid') || '';
    this.openid = openid && openid.data ? openid.data : openid;
    this.price = this.priceList[0] || {};
    if(this.orderNo) {
      this.queryOrderDetail();
    }
    if(!this.openid || this.openid == 'undefined' || this.openid == 'null') {
      if(!this.getCode()) {
        this.authorize();
      }else {
        this.getOpenid();
      }
    } else {
      if(!this.orderNo) {
        this.getOrderInit();
      }
      this.getTips();
      this.getVillageList();
    }
    this.isWXIos = this.isWeiXinAndIos();
    
    let params = {
      url: location.href
    }
    this.$http.post(this.$baseUrl + '/api/wechat/jsToken', params).then(res => {
      let data = res.data;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['hideMenuItems','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function() {
        wx.hideMenuItems({// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          menuList: ['menuItem:copyUrl', 'menuItem:openWithSafari', 'menuItem:openWithQQBrowser', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:readMode']
        });
      })
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {

  },
  watch:{
    
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
        orderNo: this.orderNo
      }
      
      this.$http.post(this.$baseUrl + '/api/order/query', params).then(res => {
        this.addForm = {
          name: res.data.data.name,
          mobile: res.data.data.mobile,
          village: res.data.data.village,
          addr: res.data.data.addr
        }
        this.price = {
          startTime: res.data.data.startTime,
          endTime: res.data.data.endTime,
          serviceName: res.data.data.serviceName,
        }
        this.priceList.forEach((item, index) => {
          if(item.serviceName == this.price.serviceName) {
            this.priceIndex = index;
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    submitPay() {
      if(!this.addForm.name) {
        this.$Message.warning('请输入联系人');
        return;
      }
      if(!this.addForm.mobile) {
        this.$Message.warning('请输入联系方式');
        return;
      }
      if(!this.addForm.village) {
        this.$Message.warning('请选择小区');
        return;
      }
      if(!this.addForm.addr) {
        this.$Message.warning('请输入地址');
        return;
      }
      // let payNo = Math.ceil(Math.random()*1000000)
      let code = utils.dbGet('code') || '';
      let params = {
        openId: this.openid,
        code: code,
        name: this.addForm.name,
        mobile: this.addForm.mobile,
        village: this.addForm.village,
        addr: this.addForm.addr,
        serviceType: this.price.serviceType,
        startTime: this.price.startTime,
        endTime: this.price.endTime,
        cost: this.price.cost
      }
      this.$http.post(this.$baseUrl + '/api/order/pay', params).then(res => {
        this.weixinPay(res.data);
      }).catch(err => {
        console.log(err)
      })
    },
    weixinPay(json) {
      // wx.config({
      //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //   appId: data.appId, // 必填，公众号的唯一标识
      //   timestamp: data.timeStamp, // 必填，生成签名的时间戳
      //   nonceStr: data.nonceStr, // 必填，生成签名的随机串
      //   signature: data.signature, // 必填，签名，见附录1
      //   jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      // });
      let that = this;
      wx.chooseWXPay({
        timestamp: json.timeStamp, // 支付签名时间戳，
        nonceStr: json.nonceStr, // 支付签名随机串，不长于 32 位
        package: json.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=xxxx）
        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: json.sign, // 支付签名
        success: function (res) {
          // 支付成功后的回调函数
          console.log("支付成功！");
          // that.$Message.success('支付成功！');
          that.$router.push({path: 'myOrder'});
        },
        cancel:function(res){
          //支付取消
          console.log("支付取消");
        },
        fail:function(res){
          //支付失败
          console.log("支付失败");
          that.$router.push({path: 'myOrder'});
        }
      })
    },
    queryJsToken(json) {
      // let params = {
      //   url: location.href
      // }
      // this.$http.post(this.$baseUrl + '/api/wechat/jsToken', params).then(res => {
      //   console.log(res)
      //   // this.$Message.success('成功调通接口api/wechat/jsToken');
      //   // debugger
      //   this.weixinPay(res.data, json);
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    authorize() {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2forder';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      window.location.replace(url);
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
    },
    getOpenid() {
      this.$http.post(this.$baseUrl + '/api/wechat/getOpenId', {code: this.code}).then(res => {
        this.openid = res.data.openId;
        this.getTips();
        this.getOrderInit();
        this.getVillageList();
        utils.dbSet('openid', this.openid);
        utils.dbSet('code', this.code);
      }).catch(err => {
        console.log(err)
      })
    },
    getTips() {
      this.$http.post(this.$baseUrl + '/api/remind/queryList', {pageNo: 1, pageSize: 10, remindType: 1}).then(res => {
        this.tipList = res.data.list || [];
      }).catch(err => {
        console.log(err)
      })
    },
    getOrderInit() {
      this.$http.post(this.$baseUrl + '/api/order/init', {openId: this.openid}).then(response => {
        let res = response.data;
        this.addForm = {
          name: res.data.name,
          mobile: res.data.mobile,
          village: res.data.village,
          addr: res.data.addr
        }
        this.getVillageService();
      }).catch(err => {
        console.log(err)
      })
    },
    getVillageService() {      
      if(!this.villageList || this.villageList.length == 0 || !this.addForm.village) {
        return
      }
      this.villageList.forEach(item => {
        if(this.addForm.village == item.id) {
          this.priceList = item.serviceInfoList || [];
          this.price = this.priceList[0];
        }
      })
    },
    getVillageList() {
      this.$http.post(this.$baseUrl + '/api/village/queryList', {pageNo: 1,pageSize: 9999,openId: this.openid}).then(res => {
        this.villageList = res.data.list || [];
        this.getVillageService();
      }).catch(err => {
        console.log(err)
      })
    },
    villageChange() {
      let obj = this.villageList.find(item => {
        return item.id == this.addForm.village;
      }) || {}
      let res = obj.serviceInfoList || [];
      this.priceList = res;
      this.price = this.priceList[0]
      this.priceIndex = 0;
      this.price = this.priceList[0];
    },
    changePrice(index) {
      if(!!this.orderNo) {
        return;
      }
      this.priceIndex = index;
      this.price = this.priceList[index];
    },
  },
}
</script>

<style lang="scss">
    // .ivu-switch-checked .ivu-switch-inner {
    //   width: 70px;
    // }
    #order {
      .ivu-switch-large.ivu-switch-checked:after {
            left: 72px;
        }
        .ivu-switch {
            border-color: #FF8000;
            background-color: #FF8000;
        }
        .ivu-btn-warning {
          border-color: #FF8000;
          background-color: #FF8000;
        }
        
      .order_input {
        .ivu-input {
          border: none;
          outline: none;
          padding-top: 0;
          padding-bottom: 0;
          &:focus {
            border: none;
            box-shadow: none;
          }
        }
        .ivu-select-selection {
          border: none;
          box-shadow: none;
        }
      }

    }
  
</style>
<style lang="scss" scoped>
    .order {
      padding: 5px 15px;
      .name {
        line-height: 32px;
        text-indent: 15px;
        padding-top: 5px;
      }
      hr {
        background: #e6e6e6;
        height: 1px;
        border: none;
        margin-bottom: 12px;
      }
      .open {
         padding-top: 10px;
      }
      .huise {
         color: #999;
         line-height: 25px;
      }
      .tip {
        line-height: 18px;
      }
      .tip .huise {
        line-height: 18px;
        font-size: 13px;
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
        margin-top: 20px;
      }
      .service {
        padding: 10px 0 0 10px;
        .service-inner {
          display: flex;
          overflow: hidden;        
          .service-btn {
            flex: 1;
            text-align: center;
            line-height: 25px;
            color: #FF8800;
            font-size: 13px;
            border: 1px solid #FF8800;
            border-left: none;
            &:first-child {
              border-left: 1px solid #FF8800;
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }
            &:last-child {
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
            }
            &.active {
              background: #FF8800;
              color: #fff;
            }
          }
        }
      }
    }
</style>
