<template>
  <div class="feedback">
    <!-- <Table :columns="columns" :data="list"></Table> -->
    <div v-if="list && list.length > 0" class="order-list">
      <div class="order-th">
        <div class="td" style="width: 48%;">反馈时间</div>
        <div class="td" style="width: 48%;">反馈状态</div>
      </div>
      <div class="order-body">
        <div class="order-tr" v-for="(item, index) in list" :key="index" @click="$router.push({path: 'feedbackDetail', query:{id:index}})">
          <div class="td" style="width: 48%;">
            <div>{{item.time}}</div>
          </div>
          <div class="td" style="width: 48%;">
            <div v-if="index == 0"class="daifuwu">未处理</div>
            <div v-if="index" class="fuwuzhong">已处理</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-order">暂无意见反馈</div>
    <div class="feedbackBtn">
      <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'feedbackDetail'})">我要反馈</Button>
    </div>
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
