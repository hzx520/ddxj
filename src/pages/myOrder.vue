<template>
  <div class="myOrder">
    <!-- <Table :columns="columns" :data="list"></Table> -->
    <div v-if="list && list.length > 0" class="order-list">
      <div class="order-th">
        <div class="td" style="width: 48%;">服务时间</div>
        <div class="td" style="width: 24%;">服务周期</div>
        <div class="td" style="width: 24%;">服务状态</div>
      </div>
      <div class="order-body">
        <div class="order-tr" v-for="(item, index) in list" :key="index" @click="$router.push({path: 'order', query:{id:index}})">
          <div class="td" style="width: 48%;">
            <div>{{item.time}}</div>
            <div>{{item.time}}</div>
          </div>
          <div class="td" style="width: 24%;">{{item.period}}</div>
          <div class="td" style="width: 24%;">
            <div v-if="index == 0"class="daifuwu">待服务</div>
            <div v-if="index == 1" class="fuwuzhong">服务中</div>
            <div v-if="index == 2">已过期</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-order" @click="$router.push({path: 'order'})">暂无订单，快去下单吧</div>
  </div>
</template>

<script>
export default {
  name: 'home',
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
    }
</style>
