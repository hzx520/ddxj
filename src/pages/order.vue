<template>
  <div class="order" id="order">
      <div class="name">联系人</div>
        <i-input class="order_input" v-model="addForm.name" size="large" placeholder="请输入联系人(可选)"  style="width: 100%;"></i-input>
      <hr>
      <div class="name">联系方式</div>
      <i-input class="order_input" v-model="addForm.phoneNo" size="large" @on-blur="inputBlur" placeholder="请输入联系方式(可选)" :disabled="!!id" style="width: 100%;"></i-input>
      <hr>
      <div class="name">所在小区</div>
      <!-- <i-select class="order_input" :model.sync="city" @on-change="cityChange" :label-in-value="true" size="large" placeholder="请选择所在小区" :disabled="!!id">
          <i-option v-for="(item, index) in cityList" :key="index" :value="item.villageName">{{item.villageName}}</i-option>
          <i-option value="shanghai">上海</i-option>
          <i-option value="hangzhou">杭州</i-option>
      </i-select> -->
      <Select class="order_input" v-model="addForm.city" @on-change="cityChange" size="large" placeholder="请选择所在小区" :disabled="!!id">
        <Option v-for="(item, index) in cityList" :key="index" :value="item.villageName">{{item.villageName}}</Option>
      </Select>
      <hr>
      <div class="name">详细地址</div>
      <i-input class="order_input" v-model="addForm.address" size="large" @on-blur="inputBlur" placeholder="请输入详细地址" :disabled="!!id" style="width: 100%;"></i-input>
      <hr>
      <div class="open">
          <i-switch v-model="addForm.open" size="large" @on-change="getTime" style="width:80px;">
              <span slot="open">￥480/年</span>
              <span slot="close">￥50/月</span>
          </i-switch>
          <Icon class="grey" type="md-alert"/>
          <span class="huise">点击选择服务周期</span>
      </div>
      <div class="name" style="padding-bottom:8px;">服务周期 （{{startTime}} ~ {{endTime}}）</div>
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
            <span class="huise">{{item.msg}}</span>
        </div>
      </div>

      <div v-if="!id" class="payBtn">
        <Button size="large" type="warning" long style="height:40px;width:90%;" @click="submitPay">支付</Button>
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
      addForm: {
        name: '',
        phoneNo: '',
        city: '',
        address: '',
      },
      startTime: '',
      endTime: '',
      open: true,
      isWXIos: false,
      id: '',
      code: null,
      openid: '',
      res: '',
      tipList: [],
      cityList: [],
      price: ''
    }
  },
  created() {
    this.id = this.$route.query.id;
    if(!this.id) {
      this.getCode();
      if(!this.getCode()) {
        this.authorize();
      }else {
        this.getOpenid();
      }
    }else {
      this.queryOrderDetail();
    }
  },
  mounted() {
    if(!this.id) {
      this.getTime();
    }else {

    }
    this.getTips();
    this.getCityList();
    this.isWXIos = this.isWeiXinAndIos();
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
        id: this.id
      }
      
      this.$http.post(this.$baseUrl + '/api/order/query', params).then(res => {
        this.addForm = {
          name: res.name,
          phoneNo: res.mobile,
          city: res.village,
          address: addr
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitPay() {
      console.log(this.addForm.name)
      if(!this.addForm.city) {
        this.$Message.warning('请选择小区');
        return;
      }
      if(!this.addForm.address) {
        this.$Message.warning('请输入地址');
        return;
      }
      let params = {
        name: this.addForm.name,
        mobile: this.addForm.phoneNo,
        village: this.addForm.city,
        addr: this.addForm.address
      }
      this.$http.post(this.$baseUrl + '/api/order/save', params).then(res => {

      }).catch(err => {
        console.log(err)
      })
    },
    authorize() {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2forder';
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
      // this.getOpenid();
      return this.code;
    },
    getOpenid() {
      // this.$http.get(url).then(res => {
      //   this.openid = res.openid;
      //   this.res = res;
      // }).catch(err => {
      //   console.log(err)
      // })
      this.$http.post(this.$baseUrl + '/api/wechat/getOpenId' + '?code=' + this.code,{code: this.code}).then(res => {

      }).catch(err => {
        console.log(err)
      })
    },
    getTips() {
      this.$http.post(this.$baseUrl + '/api/remind/queryList', {current: 1}).then(res => {
        this.tipList = res.data.list || [];
      }).catch(err => {
        console.log(err)
      })
    },
    getCityList() {
      this.$http.post(this.$baseUrl + '/api/serviceInfo/queryNameList', {current: 1,pageSize:1000}).then(res => {
        this.cityList = res.data.list || [];
      }).catch(err => {
        console.log(err)
      })
    },
    cityChange(item) {
      // if(this.addForm.city == item.villageName) {
      //   return;
      // }
      // this.addForm.city = item.villageName;
      console.log(this.addForm.city)
      this.$http.post(this.$baseUrl + '/api/serviceInfo/queryTypeList', {serviceName: this.addForm.city}).then(res => {
        this.price = res;
      }).catch(err => {
        console.log(err)
      })
    },
    getTime() {
      this.startTime =  moment().add(1, 'days').format('YYYY-MM-DD');
      if(this.addForm.open) {
        this.endTime = moment().add(1, 'years').format('YYYY-MM-DD');
      }else {
        this.endTime = moment().add(1, 'months').format('YYYY-MM-DD');
      }
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
    }
</style>
