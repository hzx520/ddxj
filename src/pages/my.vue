<template>
  <div class="my">
    <div class="wx-head" @click="modal = true;">
      <img src="../assets/touxiang.svg" class="wx-head-pic">
      <span class="wx-name">微信名</span>
      <img src="../assets/erweima.svg" class="wx-erweima-pic">
    </div>
    <div class="my-order" @click="$router.push({path: 'myOrder'})">
      <img src="../assets/order-icon.svg" class="icon-order">
      <span>我的订单</span>
    </div>
    <div class="line"></div>
    <div class="my-order" @click="$router.push({path: 'feedback'})">
      <img src="../assets/mes-icon.svg" class="icon-order">
      <span>意见反馈</span>
    </div>
    <Modal v-model="modal" class-name="my-modal" :closable="false" :footer-hide="true">
        <div class="qrcode-head">
            <img src="../assets/touxiang.svg" class="wx-avatar-pic">
            <div class="my-info">
                <div class="my-name">微信名</div>
                <div class="my-city">上海 徐汇</div>
            </div>
        </div>
        <div class="qrcode-body">
            <img src="../assets/erweima.svg" class="wx-qrcode-pic">
        </div>
        <div class="qrcode-footer">扫一扫上面的二维码图，关注公众号</div>
        
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      modal: false,
    }
  }
}
</script>

<style lang="scss">
    .my-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
            width: 90% !important;
        }
        .qrcode-head {
            padding: 10px;
            .wx-avatar-pic {
                width: 50px;
            }
            .my-info {
                display: inline-block;
                margin-left: 20px;
                .my-name {
                    font-size: 16px;
                }
                .my-city {
                  margin-top: 10px;
                  color: #999;
                }
            }
        }
        .qrcode-body {
            padding: 10px 0 10px 0;
            text-align: center;
            .wx-qrcode-pic {
                width: 60%;
            }
        }
        .qrcode-footer {
            text-align: center;
            color: #999;
        }
    }
    .my {
        padding: 0 15px;
        .wx-head {
            margin: 20px 0 37px 0;
        }
        img {            
            display: inline-block;
            vertical-align: middle;
        }
        .wx-head-pic {
            width: 50px;
        }
        .wx-erweima-pic {
            width: 30px;
            float: right;
            margin-top: 6px;
        }
        .wx-name {
            padding: 0px 19px;
            vertical-align: middle;
        }
        .my-order {
            // line-height: 30px;
            margin: 10px 2px;
            .icon-order {
                width: 22px;
                margin-right: 10px;
            }
        }
        .line {
            border-bottom: 1px solid #e6e6e6;
            margin: 12px 0;
        }
    }
</style>
