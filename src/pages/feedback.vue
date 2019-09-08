<template>
  <div class="feedback">
    <!-- <Table :columns="columns" :data="list"></Table> -->
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
  </div>
</template>

<script>
import utils from '../utils';
export default {
  name: 'feedback',
  data () {
    return {
      msg: '首页',
      list: [
        {
            time: '2019-08-30',
            status: '服务中',
        },
        {
            time: '2019-08-30',
            status: '服务中',
        },
        {
            time: '2019-08-30',
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
    this.$http.post(this.$baseUrl + '/api/evaluate/queryList', params).then(res => {
      console.log(res)
      this.list = res.data.list || [];
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style lang="scss" scoped>
  .feedback {
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
