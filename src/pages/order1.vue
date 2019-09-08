<template>
  <div class="order" id="order">
      <div class="name">联系人</div>
        <i-input class="order_input" v-model="addForm.name" size="large" placeholder="请输入联系人(可选)"  style="width: 100%;"></i-input>
      <hr>
      <div class="name">联系方式</div>
      <i-input class="order_input" v-model="addForm.phoneNo" size="large" @on-blur="inputBlur" placeholder="请输入联系方式(可选)" :disabled="!!orderNo" style="width: 100%;"></i-input>
      <hr>
      <div class="name">所在小区</div>
      <!-- <i-select class="order_input" :model.sync="village" @on-change="villageChange" :label-in-value="true" size="large" placeholder="请选择所在小区" :disabled="!!orderNo">
          <i-option v-for="(item, index) in villageList" :key="index" :value="item.villageName">{{item.villageName}}</i-option>
          <i-option value="shanghai">上海</i-option>
          <i-option value="hangzhou">杭州</i-option>
      </i-select> -->
      <Select class="order_input" v-model="addForm.village" @on-change="villageChange" size="large" placeholder="请选择所在小区" :disabled="!!orderNo">
        <Option v-for="(item, index) in villageList" :key="index" :value="item.id">{{item.villageName}}</Option>
      </Select>
      <hr>
      <div class="name">详细地址</div>
      <i-input class="order_input" v-model="addForm.address" size="large" @on-blur="inputBlur" placeholder="请输入具体门牌号" :disabled="!!orderNo" style="width: 100%;"></i-input>
      <hr>
      <!-- <div class="open">
          <i-switch v-model="addForm.open" size="large" @on-change="getTime" style="width:94px;">
              <span slot="open">￥{{price1.cost}}/{{price1.serviceName}}</span>
              <span slot="close">￥{{price2.cost}}/{{price2.serviceName}}</span>
          </i-switch>
          <Icon class="huise" type="md-arrow-back" style="font-size:16px;"/>
          <span class="huise">点击选择服务周期</span>
      </div> -->


      <div class="name">服务方式</div>
      <div class="service">
        <div class="service-inner">
          <div v-for="(item, index) in priceList" :key="index" class="service-btn" :class="{active: priceIndex == index}" @click="changePrice(index)">￥{{item.cost + '/' + item.serviceName}}</div>
        </div>
      </div>
      
      <div class="name" style="line-height:22px;padding-bottom:10px;font-size:13px;color:#666;">预计服务周期 （{{price.startTime}} ~ {{price.endTime}}）</div>
      <!-- <div style="padding:3px 0 0 15px;font-size:13px;line-height:15px;">具体服务周期请至：我的-个人中心-我的订单 中查看</div>
      <div class="huise" style="padding:0 0 15px 15px;font-size:13px;">首单优惠：月付前三天免费，年付前10天免费</div> -->
      <hr>
      <!-- <div class="tip" style="padding-top:3px;">
          <Icon class="grey" type="md-alert"/>
          <span class="huise">代丢服务自购买成功后次日生效</span>
      </div>
      <div class="tip">
          <Icon class="grey" type="md-alert"/>
          <span class="huise">请您早上8点前，晚上7点后将垃圾放置门口处,专业保洁人员会上门回收处理</span>
      </div> -->
      <div style="padding-top:3px;">
        <div class="tip" v-for="(item, index) in tipList" :key="index">
            <Icon class="grey" type="md-alert"/>
            <span class="huise">{{item.content}}</span>
        </div>
      </div>

      <div v-if="!orderNo" class="payBtn">
        <Button size="large" type="warning" long style="height:40px;width:90%;" @click="submitPay">支付</Button>
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
        phoneNo: '',
        village: '',
        address: '',
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
        cost: 480,
        serviceName: '包年',
        serviceType: 1,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(1, 'years').format('YYYY-MM-DD')
      },{
        cost: 50,
        serviceName: '包月',
        serviceType: 2,
        startTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().add(1, 'months').format('YYYY-MM-DD')
      }],
      orderNoInit: ''
    }
  },
  created() {
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
      // this.getTime();
      this.getTips();
      this.getOrderInit();
      this.getCityList();
    }
    this.isWXIos = this.isWeiXinAndIos();
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
        console.log(res)
        this.addForm = {
          name: res.data.data.name,
          phoneNo: res.data.data.mobile,
          village: res.data.data.village,
          address: res.data.data.addr
        }
        this.price = {
          startTime: res.data.data.startTime,
          endTime: res.data.data.endTime
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitPay() {
      console.log('price',this.price)
      console.log(this.addForm.name)
      if(!this.addForm.village) {
        this.$Message.warning('请选择小区');
        return;
      }
      if(!this.addForm.address) {
        this.$Message.warning('请输入地址');
        return;
      }
      let payNo = Math.ceil(Math.random()*1000000)
      let params = {
        openId: this.openid,
        orderNo: this.orderNoInit,
        name: this.addForm.name,
        mobile: this.addForm.phoneNo,
        village: this.addForm.village,
        addr: this.addForm.address,
        serviceType: this.price.serviceType,
        startTime: this.price.startTime,
        endTime: this.price.endTime,
        cost: this.price.cost,
        payNo: payNo
      }
      this.$http.post(this.$baseUrl + '/api/order/save', params).then(res => {
        this.$Message.success('成功');
      }).catch(err => {
        console.log(err)
      })
    },
    weixinPay(data) {
      let appId = 'wx1ea6607052b21894';
      let timestamp = new Date().getTime();
      let nonceStr = '5K8264ILTKCH16CQ2502SI8ZNMTM67VS';
      let signature = 'C380BEC2BFD727A4B6845133519F3AD6';
      let packages = data.package;
      let paySign = data.paySign;
      wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名，见附录1
      jsApiList: ['chooseWXPay',"updateAppMessageShareData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

      });
    },
    authorize() {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2forder1';
      // let redirect = 'http%3a%2f%2fwww.cx-tech.co%3a8010%2f%23%2forder1';
      let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
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
      console.log(this.code)
      return this.code;
    },
    getOpenid() {
      this.$http.post(this.$baseUrl + '/api/wechat/getOpenId', {code: this.code}).then(res => {
        this.openid = res.data.openId;
        console.log(res)
        console.log(this.openid)
        // this.getTime();
        this.getTips();
        this.getOrderInit();
        this.getCityList();
        utils.dbSet('openid', this.openid);
        // debugger
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
        console.log(response)
        let res = response.data;
        this.addForm = {
          name: res.data.name,
          phoneNo: res.data.mobile,
          village: res.data.village,
          address: res.data.addr
        }
        this.getVillageService();
        this.orderNoInit = res.data.orderNo;
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
    getCityList() {
      this.$http.post(this.$baseUrl + '/api/village/queryList', {pageNo: 1,pageSize: 9999,openId: this.openid}).then(res => {
        this.villageList = res.data.list || [];
        this.getVillageService();
      }).catch(err => {
        console.log(err)
      })
    },
    villageChange() {
      console.log(this.addForm.village)
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
      this.priceIndex = index;
      this.price = this.priceList[index];
    },
    getTime() {
      
    }
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
         color: #d2d2d2;
         line-height: 25px;
      }
      .tip .huise {
        line-height: 20px;
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
