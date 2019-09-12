<template>
  <div class="feedback">
    <Scroll :on-reach-bottom="loadMore" :on-reach-top="refresh" :distance-to-edge="[20,15]" :height="height">
      <div v-if="list && list.length > 0" class="order-list">
        <div class="order-th">
          <div class="td" style="width: 38%;">订单号</div>
          <div class="td" style="width: 38%;">评价时间</div>
          <div class="td" style="width: 20%;">状态</div>
        </div>
        <div class="order-body">
          <div class="order-tr" v-for="(item, index) in list" :key="index" @click="$router.push({path: 'feedbackDetail', query:{orderNo:item.orderNo, view: 1}})">
            <div class="td" style="width: 38%;">
              <div style="word-wrap:break-word;word-break:break-all">{{item.orderNo}}</div>
            </div>
            <div class="td" style="width: 38%;">
              <div>{{item.createTime}}</div>
            </div>
            <div class="td" style="width: 20%;">{{item.evaluateStatus}}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-order">暂无评价</div>
    <div class="feedbackBtn">
      <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'myOrder'})">我要评价</Button>
    </div>
    </Scroll>
  </div>
</template>

<script>
import utils from '../utils';
import $ from 'jquery';
import wx from 'weixin-js-sdk';
export default {
  name: 'feedback',
  data () {
    return {
      msg: '首页',
      list: [],
      height: '',
      openid: '',
      page: 1,
      total: 0
    }
  },
  created() {
    let openid = utils.dbGet('openid');
    this.openid = openid && openid.data ? openid.data : openid;
    this.queryList();
  },
  mounted(){
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
    let h = $('.feedback').height();
    this.height = h;
  },
  methods: {
    queryList(isRefresh) {
      let params = {
        pageNo: this.page,
        pageSize: 10,
        openId: this.openid
      }
      this.$http.post(this.$baseUrl + '/api/evaluate/queryList', params).then(res => {
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
  },
}
</script>

<style lang="scss">
.feedback .ivu-scroll-container .ivu-scroll-loader{
  height: 0;
}
</style>
<style lang="scss" scoped>
  .feedback {
    height: 100%;
    padding-bottom: 55px;
    .order-list {
      .order-th {
        background: #393D49;
        color: #fff;
        border-radius: 2px;
      }
      .order-tr {
        border-bottom: 1px solid #e6e6e6;
      }
      .td {
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        padding: 8px;
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
    .feedbackBtn {
      width: 100%;
      text-align: center;
      height: 40px;
      position: fixed;
      bottom: 10px;
      left: 0;
    }
  }
</style>
