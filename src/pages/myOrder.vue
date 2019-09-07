<template>
  <div class="myOrder">
    <!-- <Table :columns="columns" :data="list"></Table> -->
    <div v-if="list && list.length > 0" class="order-list">
      <div class="order-th">
        <div class="td" style="width: 36%;">服务时间</div>
        <div class="td" style="width: 22%;">服务周期</div>
        <div class="td" style="width: 22%;">服务状态</div>
        <div class="td" style="width: 16%;">评价</div>
      </div>
      <div class="order-body">
        <div class="order-tr" v-for="(item, index) in list" :key="index">
          <div class="td" style="width: 40%;" @click="$router.push({path: 'order1', query:{orderNo: item.orderNo}})">
            <div style="display:flex;">
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
          <div class="td" style="width: 20%;" @click="$router.push({path: 'order1', query:{orderNo:item.orderNo}})">{{item.serviceName}}</div>
          <div class="td" style="width: 20%;" @click="$router.push({path: 'order1', query:{orderNo:item.orderNo}})">
            <!-- <div v-if="index == 0" class="daifuwu">待服务</div>
            <div v-if="index == 1" class="fuwuzhong">服务中</div>
            <div v-if="index == 2">已过期</div> -->
            <div>{{item.statusName}}</div>
          </div>
          <div class="td" style="width: 16%;color: blue;" @click="$router.push({path: 'feedbackDetail', query:{orderNo: item.orderNo, view:item.evaluateStatus==0?'':'1'}})">{{item.evaluateStatus == 0 ? '评价' : '查看'}}</div>
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
      pageNo: 1,
      pageSize: 10,
      openId: openid
    }
    this.$http.post(this.$baseUrl + '/api/order/queryList', params).then(res => {
      console.log('列表', res)
      this.list = res.data.list || [];
      console.log(this.list)
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
