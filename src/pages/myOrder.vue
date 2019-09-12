<template>
  <div class="myOrder">
    <Scroll :on-reach-bottom="loadMore" :on-reach-top="refresh" :distance-to-edge="[20,13]" :height="height">
      <div v-if="list && list.length > 0" class="order-list">
        <div class="order-th">
          <div class="td" style="width: 40%;padding:0;line-height:32px;">服务时间</div>
          <div class="td" style="width: 20%;padding:0;line-height:32px;">服务周期</div>
          <div class="td" style="width: 20%;padding:0;line-height:32px;">服务状态</div>
          <div class="td" style="width: 16%;padding:0;line-height:32px;">评价</div>
        </div>
        <div class="order-body">
          <div class="order-tr" v-for="(item, index) in list" :key="index">
            <div style="font-size:13px;line-height:16px;text-align:center;padding-top:10px;color:#888;">订单号：{{item.orderNo}}</div>
            <div class="td" style="width: 40%;" @click="$router.push({path: 'order', query:{orderNo: item.orderNo}})">
              <div>{{item.startTime}}</div>
              <div>{{item.endTime}}</div>
            </div>
            <div class="td" style="width: 20%;" @click="$router.push({path: 'order', query:{orderNo:item.orderNo}})">{{item.serviceName}}</div>
            <div class="td" style="width: 20%;" @click="$router.push({path: 'order', query:{orderNo:item.orderNo}})">
              <Icon v-if="item.status == 0" type="ios-information-circle-outline" style="color:#ff0000;"/>
              <Icon v-if="item.status == 1" type="ios-information-circle-outline" style="color:#FF8000;"/>
              <Icon v-if="item.status == 2" type="ios-radio-button-on" style="color:#76EE00;"/>
              <Icon v-if="item.status == 3" type="ios-time-outline" style="color:#9C9C9C;"/>
              <span>{{item.statusName}}</span>
            </div>
            <div class="td" style="width: 16%;color: blue;" @click="$router.push({path: 'feedbackDetail', query:{orderNo: item.orderNo, view:item.evaluateStatus==0?'':'1'}})">{{item.evaluateStatus == 0 ? '评价' : '查看'}}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-order" @click="$router.push({path: 'order'})">暂无订单，快去下单吧</div>
    </Scroll>
  </div>
</template>

<script>
import utils from '../utils';
import $ from 'jquery';
import wx from 'weixin-js-sdk';
export default {
  name: 'myorder',
  data () {
    return {
      msg: '首页',
      list: [],
      page: 1,
      openid: '',
      height: '',
      total: 0
    }
  },
  created() {
    // utils.dbSet('openid', 'opQDEvkDdan-WKZ0YoZY5MVEtliE');
    // utils.dbSet('code', '011PQrpg0bmPfw1tLRrg0CuJpg0PQrpa');
    let openid = utils.dbGet('openid');
    this.openid = openid && openid.data ? openid.data : openid;
    this.queryList();
    let params1 = {
      url: location.href
    }
    this.$http.post(this.$baseUrl + '/api/wechat/jsToken', params1).then(res => {
      let data = res.data;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
  mounted(){
    let h = $('.myOrder').height();
    this.height = h;
  },
  methods: {
    queryList(isRefresh) {
      let params = {
        pageNo: this.page,
        pageSize: 10,
        openId: this.openid
      }
      this.$http.post(this.$baseUrl + '/api/order/queryList', params).then(res => {
        let list = res.data.list || [];
        this.total = res.data.total;
        if(isRefresh) {
          this.list = list;
          return;
        }
        this.list.push(...list);
        if(list && list.length < 10) {
          return;
        }
        this.page++;
      }).catch(err => {
        console.log(err)
      })
    },
    loadMore() {
      if(this.total > this.list.length) {
        this.queryList();
      }
    },
    refresh() {
      this.page = 1;
      this.queryList(true);
    }
  }
}
</script>

<style lang="scss">
.myOrder .ivu-scroll-container .ivu-scroll-loader{
  height: 0;
}
</style>
<style lang="scss" scoped>
    .myOrder {
      height: 100%;
      .order-list {
        padding-bottom: 10px;
        .order-th {
          background: #393D49;
          color: #fff;
          border-radius: 2px;
        }
        .order-tr {
          border-bottom: 1px solid #e6e6e6;
          &:last-child {
            border-bottom: none;
          }
        }
        .td {
          text-align: center;
          display: inline-block;
          vertical-align: middle;
          padding: 0 2px 10px 2px;
        }
        .daifuwu {
          color: red;
        }
        .fuwuzhong {
          color: green;
        }
      }
      .no-order {
        text-align: center;
        padding-top: 80px;
        font-size: 18px;
      }
    }
</style>
