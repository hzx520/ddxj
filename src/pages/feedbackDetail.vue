<template>
  <div class="feedback-detail">
    <div v-if="!view">
      <div v-if="!isSubmit" class="feedback-form">
        <div class="feedfack-tip">请提出您宝贵的意见</div>
        <Input v-model="text" type="textarea" :autosize="{minRows: 4,maxRows: 7}" placeholder="欢迎反馈，我们将为您不断改进"/>
        <!-- <div class="phone">
          <span class="phone-txt">联系方式：</span>
            <i-input class="phone-input" :value.sync="phoneNo" size="large" placeholder="请输入手机号或邮箱" :disabled="orderNo" style=""></i-input>
        </div> -->
      </div>
      <div v-else class="submit-tip" style="text-align:center;">我们会第一时间处理您的反馈，并给您回复</div>
      <div class="feedbackBtn">
        <!-- <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'order'})">取消</Button>
        <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'order'})">提交</Button> -->
        <ButtonGroup  size="large" style="width: 100%;">
            <Button style="width:50%;" @click="$router.go(-1)">取消</Button>
            <Button type="warning" style="width:50%;" @click="submit">提交</Button>
        </ButtonGroup>
      </div>
    </div>
    <div v-if="view" class="result">
      <div class="result-tip">反馈结果</div>
      <div>订单号：{{orderNo}}</div>
      <div>评价时间：{{result.createTime}}</div>
      <div>评价内容：{{result.content}}</div>
      <div>反馈时间：{{result.updateTime}}</div>
      <div>反馈内容：{{result.feedBack}}</div>
      <!-- <div class="result-txt">我是反馈结果我是反馈结果我是反馈结果我是反馈结果</div> -->
      <!-- <div class="">正在紧急处理中</div> -->
    </div>
  </div>
</template>

<script>
import utils from '../utils';
export default {
  name: 'feedbackdetail',
  data () {
    return {
      text: '',
      phoneNo: '',
      orderNo: '',
      view: 1,
      openid: '',
      isSubmit: false,
      result: {}
    }
  },
  mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.view = this.$route.query.view;
    let openid = utils.dbGet('openid');
    this.openid = openid && openid.data ? openid.data : openid;
    if(!this.view) {
      return;
    }
    let params = {
      orderNo: this.orderNo
    }
    this.$http.post(this.$baseUrl + '/api/evaluate/query', params).then(res => {
      // this.text = res;
      console.log(res);
      this.result = res.data.data;
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    submit() {
      let params = {
        orderNo: this.orderNo,
        content: this.text,
        openId: this.openid
      }
      this.$http.post(this.$baseUrl + '/api/evaluate/save', params).then(res => {
        this.isSubmit = true;
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .feedback-detail {
    padding: 15px;
    .feedfack-tip {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .phone {
      padding-top: 15px;
      display: flex;
      align-items: center;
      .phone-txt {
        width: auto;
      }
      .phone-input {
        flex: 1;
      }
    }
    .submit-tip {
      padding-top: 50px;
      color: #777;
    }
    .feedbackBtn {
      width: 100%;
      text-align: center;
      height: 40px;
      position: fixed;
      bottom: 10px;
      left: 0;
    }
    .result {
      // padding-top: 10px;
      .result-tip {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
      }
    }
  }
</style>
