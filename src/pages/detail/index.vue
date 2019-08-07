<template>
  <div class="bigbox">
    <!-- 轮播图 -->
    <swiper class="lb" indicator-dots autoplay interval="3000" duration="300" circular>
      <swiper-item v-for="(item, index) in obj.pics" :key="index">
        <image @click="preview(item.pics_big_url)" mode="aspectFill" :src="item.pics_big_url" />
      </swiper-item>
    </swiper>
    <!-- 商品信息 -->
    <div class="msg">
      <div class="price">
        ￥{{ obj.goods_price }}.00
      </div>
      <div class="word">
        <div class="left">{{ obj.goods_name }}</div>
        <div class="right">
          <i class="iconfont icon-fenxiang"></i>
          分享
          <button open-type="share"></button>
        </div>
      </div>
      <div class="isSend">快递： 免运费</div>
    </div>
    <!-- 满减 -->
    <div class="chuxiao">
      <div class="top">
        促销：
        <span class="color">满 300 减 30</span>
      </div>
      <div class="top">
        已选：
        <span>黑色/s/1件</span>
      </div>
    </div>
    <!-- tab选项 -->
    <div class="tab">
      <div @click="itemIndex = 0" class="item" :class="{active: itemIndex === 0}">图文介绍</div>
      <div @click="itemIndex = 1" class="item" :class="{active: itemIndex === 1}">规格参数</div>
    </div>
    <!-- tab选项对应的内容 -->
    <div class="content">
      <div v-if="itemIndex === 0" class="jieshao" v-html="obj.goods_introduce">
      </div>
      <div v-if="itemIndex === 1" class="canshu">
        <div class="item" v-for="(item, index) in obj.attrs" :key="index">
          <div class="key">{{ item.attr_name }}</div>
          <div class="value">{{ item.attr_value }}</div>
        </div>
      </div>
    </div>
    <!-- 底部选项 -->
    <div class="bottom">
      <div class="start kefu">
        <i class="iconfont icon-kefu"></i>
        联系客服
        <button open-type="contact"></button>
      </div>
      <div @click="toCart" class="start">
        <i class="iconfont icon-gouwuche"></i>
        购物车
      </div>
      <button @click="addToCart" class="end one">
        加入购物车
      </button>
      <button class="end two">立即购买</button>
    </div>
  </div>
</template>

<script>
// 引入
import wxreqest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      itemIndex: 0,
      // 展示详情数据的id
      id: 0,
      // 数据源:当前渲染页面的详情数据
      obj: {},
      // 保存购物车数据的数组
      cartList: {} // 当每次打开页面时，应该先去 storage 中取出数据，
    }
  },
  async onLoad(options) {
    this.id = options.id
    // 根据 id 去获取数据源
    var res = await wxreqest({
      url: `api/public/v1/goods/detail?goods_id=${options.id}`
    })
    let { meta, message } = res.data
    if (meta.status === 200) {
      this.obj = message
    }
    // 当页面打开时 需要从 storage 中取出原有的购物车数据
    this.cartList = wx.getStorageSync('cart') || {}
  },
  methods: {
    preview(url) {
      // 将 obj.pics 中的图片单独提取为一个数组
      var newPicArr = []
      this.obj.pics.forEach(item => {
        newPicArr.push(item.pics_big_url)
      })

      // console.log(newPicArr)
      // 调用 wx 自带的预览方法
      wx.previewImage({
        current: url, // 当前预览的图片地址
        urls: newPicArr // 要预览的所有图片
      })
    },
    toCart() {
      // 使用编程式导航进行路径的跳转
      // wx.navigateTo({
      //   url: '/pages/searchList/main?query=小米'
      // })
      console.log(111111)
      // 这个方法不能跳转到 tabBar 对应的页面
      // wx.navigateTo({
      //   url: '/pages/cart/main'
      // })
      // 跳转到 tabbar
      wx.switchTab({
        url: '/pages/cart/main'
      })
    },
    // 将商品信息保存到 storage 中
    addToCart() {
      // 判断是否存在这条数据：
      if (this.cartList[this.obj.goods_id]) {
        this.cartList[this.obj.goods_id].num++
      } else {
        // 以对象形式保存
        this.cartList[this.obj.goods_id] = {
          ...this.obj,
          num: 1, // 商品的数量
          status: true // 商品的状态（默认为选中状态）
        }
      }
      // 保存到 storage 中
      // 小程序中的 storage 可以保存任意类型的数据
      wx.setStorageSync('cart', this.cartList)
      // 添加一个保存成功的提示框
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    }
  },
  // 点击分享以后会触发的方法
  onShareAppMessage() {
    console.log('打开了分享页面')
  }
}
</script>

<style lang="less">
// 引入字体图标
@import '../../utils/css/iconfont.css';
@import './index.less';
</style>
