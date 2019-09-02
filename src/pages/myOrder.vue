<template>
  <div class="myOrder">
    <!-- <Table :columns="columns" :data="list"></Table> -->
    <div v-if="list && list.length > 0" class="order-list">
      <div class="order-th">
        <div class="td" style="width: 36%;">服务时间</div>
        <div class="td" style="width: 22%;">服务周期</div>
        <div class="td" style="width: 22%;">服务状态</div>
        <div class="td" style="width: 16%;">操作</div>
      </div>
      <div class="order-body">
        <div class="order-tr" v-for="(item, index) in list" :key="index">
          <div class="td" style="width: 40%;" @click="$router.push({path: 'order1', query:{id:index}})">
            <div>{{item.time}}</div>
            <div>{{item.time}}</div>
          </div>
          <div class="td" style="width: 20%;" @click="$router.push({path: 'order1', query:{id:index}})">{{item.period}}</div>
          <div class="td" style="width: 20%;" @click="$router.push({path: 'order1', query:{id:index}})">
            <div v-if="index == 0" class="daifuwu">待服务</div>
            <div v-if="index == 1" class="fuwuzhong">服务中</div>
            <div v-if="index == 2">已过期</div>
          </div>
          <div class="td" style="width: 16%;color: blue;" @click="$router.push({path: 'feedback', query:{orderId:index}})">评价</div>
        </div>
      </div>
    </div>
    <div v-else class="no-order" @click="$router.push({path: 'order1'})">暂无订单，快去下单吧</div>
  </div>
</template>

<script>
import utils from '../utils';
export default {
  name: 'myorder',
  data () {
    return {
      msg: '首页',
      list: [
        {
            time: '2019-08-30',
            period: '记月',
            status: '服务中',
        },
        {
            time: '2019-08-30',
            period: '记月',
            status: '服务中',
        },
        {
            time: '2019-08-30',
            period: '记月',
            status: '服务中',
        }
      ]
    }
  },
  created() {
    let openid = utils.dbGet('openid');
    openid = openid && openid.data ? openid.data : openid;
    let params = {
      current: 1,
      pageSize: 10,
      openId: 'openId'
    }
    this.$http.post(this.$baseUrl + '/api/order/queryList', params).then(res => {
      // this.list = res.data.list || [];
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style lang="scss" scoped>
    .myOrder {
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
          padding: 8px 2px;
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
