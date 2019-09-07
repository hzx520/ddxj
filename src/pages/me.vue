<template>
  <div class="my">
    <div class="wx-head" @click="modal = true;">
      <!-- <img src="../assets/touxiang.svg" class="wx-head-pic"> -->
      <img :src="info.headimgurl || '../assets/touxiang.svg'" class="wx-head-pic">
      <span class="wx-name">{{info.nickname}}</span>
      <img src="../assets/erweima.svg" class="wx-erweima-pic">
    </div>
    <div class="my-order" @click="$router.push({path: 'myOrder'})">
      <img src="../assets/order-icon.svg" class="icon-order">
      <span>我的订单</span>
    </div>
    <div class="line"></div>
    <div class="my-order" @click="$router.push({path: 'feedback'})">
      <img src="../assets/mes-icon.svg" class="icon-order">
      <span>我的评价</span>
    </div>
    <Modal v-model="modal" class-name="my-modal" :closable="false" :footer-hide="true">
        <div class="qrcode-head">
            <img :src="info.headimgurl || '../assets/touxiang.svg'" class="wx-avatar-pic">
            <div class="my-info">
                <div class="my-name">{{info.nickname}}</div>
                <div class="my-city">{{info.city}}</div>
            </div>
        </div>
        <div class="qrcode-body">
            <img :src="qrCodeUrl" class="wx-qrcode-pic">
        </div>
        <div class="qrcode-footer">扫一扫上面的二维码图，关注公众号</div>
        
    </Modal>
  </div>
</template>

<script>
import utils from '../utils';
export default {
  name: 'my',
  data () {
    return {
      openid: '',
      code: '',
      modal: false,
      info: {

      },
      qrCodeUrl: ''
    }
  },
  created(){
      let openid = utils.dbGet('openid') || '';
      openid = openid && openid.data ? openid.data : openid;
      if(openid && openid != 'undefined') {
        this.getUserInfo(openid)
      }else {
        if(!this.getCode()) {
          this.authorize();
        }else {
          this.getOpenid();
        }
      }
    this.getQRCode();

  },
  methods: {
    getUserInfo(openid) {
        this.$http.post(this.$baseUrl + '/api/wechat/getUserInfo', {openId: openid}).then(res => {
          console.log('xinxi',res)
          this.info = res.data;
        }).catch(err => {
          console.log(err)
        })
    },
    getQRCode() {
      this.$http.post(this.$baseUrl + '/api/wechat/getQRCode', {}).then(res => {
        console.log(res)
        this.qrCodeUrl = res.data.qrcodeUrl;
      }).catch(err => {
        console.log(err)
      })
    },
    authorize() {
      let appId = 'wx1ea6607052b21894';
      let redirect = 'http%3a%2f%2fwww.cx-tech.co%2f%23%2fme';
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
      this.$http.post(this.$baseUrl + '/api/wechat/getOpenId' + '?code=' + this.code,{code: this.code}).then(res => {
        this.openid = res;
        this.getUserInfo(this.openid)
        utils.dbSet('openid', this.openid);
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss">
    .my-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
            width: 90% !important;
        }
        .qrcode-head {
            padding: 10px;
            .wx-avatar-pic {
                width: 50px;
            }
            .my-info {
                display: inline-block;
                margin-left: 20px;
                .my-name {
                    font-size: 16px;
                }
                .my-city {
                  margin-top: 10px;
                  color: #999;
                }
            }
        }
        .qrcode-body {
            padding: 10px 0 10px 0;
            text-align: center;
            .wx-qrcode-pic {
                width: 60%;
            }
        }
        .qrcode-footer {
            text-align: center;
            color: #999;
        }
    }
    .my {
        padding: 0 15px;
        .wx-head {
            margin: 20px 0 37px 0;
        }
        img {            
            display: inline-block;
            vertical-align: middle;
        }
        .wx-head-pic {
            width: 50px;
        }
        .wx-erweima-pic {
            width: 30px;
            float: right;
            margin-top: 6px;
        }
        .wx-name {
            padding: 0px 19px;
            vertical-align: middle;
        }
        .my-order {
            // line-height: 30px;
            margin: 10px 2px;
            .icon-order {
                width: 22px;
                margin-right: 10px;
            }
        }
        .line {
            border-bottom: 1px solid #e6e6e6;
            margin: 12px 0;
        }
    }
</style>
