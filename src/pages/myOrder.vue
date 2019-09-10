<template>
  <div class="myOrder">
    <!-- <Table :columns="columns" :data="list"></Table> -->
    <Scroll :on-reach-bottom="loadMore" :on-reach-top="refresh" :distance-to-edge="[10,10]" :height="height">
      <div v-if="list && list.length > 0" class="order-list">
        <div class="order-th">
          <div class="td" style="width: 40%;">服务时间</div>
          <div class="td" style="width: 20%;">服务周期</div>
          <div class="td" style="width: 20%;">服务状态</div>
          <div class="td" style="width: 16%;">评价</div>
        </div>
        <div class="order-body">
          <div class="order-tr" v-for="(item, index) in list" :key="index">
            <div class="td" style="width: 40%;" @click="$router.push({path: 'order', query:{orderNo: item.orderNo}})">
              <div style="display:flex;justify-content: center;">
                <div>
                  <Icon v-if="item.status == 0" type="ios-information-circle-outline" style="color:#ff0000;"/>
                  <Icon v-if="item.status == 1" type="ios-information-circle-outline" style="color:#FF8000;"/>
                  <Icon v-if="item.status == 2" type="ios-radio-button-on" style="color:#76EE00;"/>
                  <Icon v-if="item.status == 3" type="ios-time-outline" style="color:#9C9C9C;"/>
                </div>
                <div>
                  <div>{{item.startTime}}</div>
                  <div>{{item.endTime}}</div>
                </div>
              </div>
            </div>
            <div class="td" style="width: 20%;" @click="$router.push({path: 'order', query:{orderNo:item.orderNo}})">{{item.serviceName}}</div>
            <div class="td" style="width: 20%;" @click="$router.push({path: 'order', query:{orderNo:item.orderNo}})">
              <!-- <div v-if="index == 0" class="daifuwu">待服务</div>
              <div v-if="index == 1" class="fuwuzhong">服务中</div>
              <div v-if="index == 2">已过期</div> -->
              <div>{{item.statusName}}</div>
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
  },
  mounted(){
    let h = $('.myOrder').height();
    this.height = h;
    console.log('h' + h)
  },
  methods: {
    queryList(isRefresh) {
      let params = {
        pageNo: this.page,
        pageSize: 10,
        openId: this.openid
      }
      this.$http.post(this.$baseUrl + '/api/order/queryList', params).then(res => {
        console.log('列表', res)
        let list = res.data.list || [];
        this.total = res.data.total;
        if(isRefresh) {
          this.list = list;
          console.log(this.list)
          return;
        }
        this.list.push(...list);
        console.log(this.list)
        if(list && list.length < 10) {
          return;
        }
        this.page++;
      }).catch(err => {
        console.log(err)
      })
    },
    loadMore() {
      console.log('加载更多' + this.page);
      if(this.total > this.list.length) {
        this.queryList();
      }
    },
    refresh() {
      console.log('刷新')
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
          padding: 12px 2px;
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
