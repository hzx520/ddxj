<template>
  <div class="feedback-detail">
    <div v-if="!id">
      <div v-if="!isSubmit" class="feedback-form">
        <div class="feedfack-tip">请提出您宝贵的意见</div>
        <Input v-model="text" type="textarea" :autosize="{minRows: 4,maxRows: 7}" placeholder="欢迎反馈，我们将为您不断改进" :disabled="id"/>
        <div class="phone">
          <span class="phone-txt">联系方式：</span>
            <i-input class="phone-input" :value.sync="phoneNo" size="large" placeholder="请输入手机号或邮箱" :disabled="id" style=""></i-input>
        </div>
      </div>
      <div v-else class="submit-tip">我们会第一时间处理您的反馈，并第一时间给您回复</div>
      <div class="feedbackBtn">
        <!-- <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'order'})">取消</Button>
        <Button size="large" type="warning" long style="height:40px;width:90%;" @click="$router.push({path: 'order'})">提交</Button> -->
        <ButtonGroup  size="large" style="width: 100%;">
            <Button style="width:50%;" @click="$router.go(-1)">取消</Button>
            <Button type="warning" style="width:50%;">提交</Button>
        </ButtonGroup>
      </div>
    </div>
    <div v-if="id" class="result">
      <div class="result-tip">反馈结果</div>
      <div class="result-txt">我是反馈结果我是反馈结果我是反馈结果我是反馈结果</div>
      <!-- <div class="">正在紧急处理中</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'feedbackdetail',
  data () {
    return {
      msg: '首页',
      text: '',
      phoneNo: '',
      id: ''
    }
  },
  mounted() {
    this.id = this.$route.query.id
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
