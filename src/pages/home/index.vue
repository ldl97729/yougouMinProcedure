<template>
  <div>
    <!-- 头部搜索 -->
    <div class="topHead">
      <!-- html5 中的新的标签 -->
      <input @click="toSearch" class="search" type="search">
      <div class="icon">
        <icon type="search" size="20"></icon>
        <span>搜索</span>
      </div>
    </div>
    <!-- 轮播图 -->
    <swiper class="lunbo" indicator-dots autoplay interval="3000" duration="300" circular>
      <swiper-item class="lb-item" v-for="(item, index) in lunboList" :key="index">
        <image :src="item.image_src" class="slide-image" />
      </swiper-item>
    </swiper>
    <!-- 导航区域 -->
    <div class="nav">
      <div class="n-item" v-for="(item, index) in navList" :key="index">
        <img :src="item.image_src" alt="">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 楼层区域 -->
    <div class="floor" v-for="(item, index) in floorList" :key="index">
      <div class="title">
        <img mode="scaleToFill" :src="item.floor_title.image_src" alt="">
        <span>{{ item.floor_title.name }}</span>
      </div>
      <div class="f-item">
        <img v-for="(item1, index1) in item.product_list" :key="index1" :src="item1.image_src" :alt="item1.name">
      </div>
    </div>
  </div>
</template>

<script>
// 引入 wxrequest
import wxrequest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      // 保存轮播图的数据
      lunboList: [],
      // 导航数据
      navList: [],
      // 楼层数据
      floorList: []
    }
  },
  // 当 data 和 methods 初始化完成之后执行
  methods: {
    // 获取轮播图的数据
    async getlunboList() {
      var res = await wxrequest({
        url: 'api/public/v1/home/swiperdata'
      })
      // 解构
      let { message, meta } = res.data
      // 判断
      if (meta.status === 200) {
        this.lunboList = message
      }
    },
    // 获取导航的数据
    async getNavList() {
      var res = await wxrequest({
        url: 'api/public/v1/home/catitems'
      })
      // 解构
      let { meta, message } = res.data
      // 判断
      if (meta.status === 200) {
        this.navList = message
      }
    },
    // 获取楼层数据
    async getFloorList() {
      var res = await wxrequest({
        url: 'api/public/v1/home/floordata'
      })
      let { meta, message } = res.data
      if (meta.status === 200) {
        this.floorList = message
      }
      console.log(this.floorList)
    },
    // 跳转到搜索页面
    toSearch() {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    }
  },
  onLoad() {
    // 发送请求
    this.getlunboList()
    this.getNavList()
    this.getFloorList()
  }
}
</script>

<style scoped lang="less">
.topHead {
  width: 100%;
  height: 100rpx;
  padding: 20rpx 16rpx;
  background-color: #ff2d4a;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  .search {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    border-radius: 5px;
  }
  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    span {
      margin-left: 6px;
      font-size: 16px;
      color: #cecece;
    }
  }
}

.lunbo {
  margin-top: 100rpx;
  width: 100%;
  height: 340rpx;
  .lb-item {
    width: 100%;
    height: 340rpx;
    image {
      width: 100%;
      height: 340rpx;
    }
  }
}

.nav {
  width: 100%;
  height: 193rpx;
  display: flex;
  .n-item {
    flex: 1;
    text-align: center;
    margin-top: 24rpx;
    img {
      width: 100rpx;
      height: 100rpx;
    }
    span {
      display: block;
      font-size: 14px;
      color: #333333;
    }
  }
}

.floor {
  .title {
    margin: 20rpx 0px;
    width: 100%;
    height: 90rpx;
    position: relative;
    img {
      width: 100%;
      height: 90rpx;
    }
    span {
      position: absolute;
      top: 50%;
      left: 50rpx;
      transform: translate(0, -50%);
      color: #ff7b94;
      font-weight: 700;
    }
  }
  .f-item {
    padding: 0px 16rpx;
    overflow: hidden;
    img {
      float: left;
      width: 233rpx;
      height: 185rpx;
      margin-bottom: 10rpx;
      border-radius: 4px;
      &:first-child {
        height: 380rpx;
        margin-right: 10rpx;
      }
      &:nth-child(2n) {
        margin-right: 10rpx;
      }
    }
  }
}
</style>
