<template>
  <div>
    <!-- 商品数据 -->
    <div class="goodsList">
      <div class="list">
        <div class="item" v-for="(value, key) in goodsList" :key="key">
          <div class="right">
            <div class="img">
              <img :src="value.goods_small_logo" alt="">
            </div>
            <div class="word">
              <div class="msg">
                {{ value.goods_name }}
              </div>
              <div class="price">
                <div class="money">￥{{ value.goods_price }}.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 支付按钮 -->
    <button @click="payMoney">微信支付</button>
  </div>
</template>

<script>
// 引入 wxrequest
import wxrequest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      goodsList: {}
    }
  },
  onLoad() {
    // 购物车中的所有数据
    var cartList = wx.getStorageSync('cart') || {}
    // 筛选出选中的数据
    Object.keys(cartList).forEach(item => {
      if (cartList[item].status === true) {
        this.goodsList[item] = cartList[item]
      }
    })
  },
  methods: {
    async payMoney() {
      // // 判断当前订单是否支付（有 bugs）
      // var isPayRes = await wxrequest({
      //   url: 'api/public/v1/my/orders/chkOrder',
      //   method: 'POST',
      //   header: {
      //     Authorization: wx.getStorageSync('token')
      //   },
      //   data: {
      //     order_number: wx.getStorageSync('orderId')
      //   }
      // })
      // 请求预支付交易接口
      var res = await wxrequest({
        url: 'api/public/v1/my/orders/req_unifiedorder',
        method: 'POST',
        header: {
          Authorization: wx.getStorageSync('token')
        },
        data: {
          order_number: wx.getStorageSync('orderId')
        }
      })
      let { meta, message } = res.data
      if (meta.status === 200) {
        // 开启一个支付界面
        wx.requestPayment({
          timeStamp: message.wxorder.timeStamp,
          nonceStr: message.wxorder.nonceStr,
          package: message.wxorder.package,
          signType: message.wxorder.signType,
          paySign: message.wxorder.paySign,
          success(res) {

            // 清除购物车：
            Object.keys(this.goodsList).forEach(item => {
              if (this.goodsList[item].status === true) {
                delete this.goodsList[item]
              }
            })
            // 更新视图
            this.goodsList = { ...this.goodsList }
            // 重新存在本地
            wx.setStorageSync('cart', this.goodsList)
            // 提示
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 500
            })
            setTimeout(function() {
              // 跳转到我的页面
              wx.switchTab({
                url: '/pages/me/main'
              })
            }, 500);
          },
          fail(res) {
            wx.showToast({
              title: '支付不成功',
              icon: 'none',
              duration: 500
            })
          }
        })
      }

    }
  }
}
</script>

<style scoped lang="less">
.goodsList {
  .list {
    .item {
      .right {
        display: flex;
        height: 165rpx;
        padding: 20rpx 20rpx;
        border-bottom: 1px solid #dddddd;
        .img {
          img {
            width: 160rpx;
            height: 160rpx;
          }
        }
        .word {
          .msg {
            padding: 0 20rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price {
            display: flex;
            margin-top: 20rpx;
            padding: 0px 20rpx;
            justify-content: space-between;
            .money {}
            .count {
              display: flex;
              span {
                width: 52rpx;
                height: 42rpx;
                border: 1px solid #666;
                text-align: center;
                line-height: 42rpx;
              }
              input {
                width: 80rpx;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
