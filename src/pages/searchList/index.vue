<template>
  <div>
    <!-- 头部搜索 -->
    <div class="myHead" :style="{position: position}">
      <div class="topHead">
        <input class="search" v-model="query" type="search" placeholder="搜索">
        <div class="icon">
          <icon type="search" size="20"></icon>
        </div>
      </div>
      <div class="nav">
        <div @click="changeIndex(index)" class="n-item" :class="{active: selectedIndex === index }" v-for="(item, index) in navList" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <!-- 商品列表 -->
    <div class="goodsList" :style="{marginTop: marginTop}">
      <a :href="'/pages/detail/main?id=' + item.goods_id" class="g-item" v-for="(item, index) in searchList" :key="index">
        <div class="left">
          <img :src="item.goods_small_logo" alt="">
        </div>
        <div class="right">
          <div class="word">
            {{ item.goods_name }}
          </div>
          <div class="price">￥
            <span>{{ item.goods_price }}</span>.00</div>
        </div>
      </a>
      <div v-if="searchList.length === total" class="bottomLine">
        ---我是有底线的---
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
      // 搜索的关键字
      query: '',
      // 导航中的 文本
      navList: ['综合', '销量', '价格'],
      // 激活的下标
      selectedIndex: 0,
      // 页容量
      pagesize: 10,
      // 当前页
      pagenum: 1,
      // 搜索数据源
      searchList: [],
      // 数据总条数
      total: -1, // 为了保存页面打开时两个数据不相等
      // bool值
      isEnd: true,
      // 设置头部的定位
      position: 'static',
      marginTop: '0px'
    }
  },
  methods: {
    changeIndex(index) {
      // 设置了当前的激活导航的下标
      this.selectedIndex = index
      // 判断点击的是否是价格
      if (index === 2) {
        // 将数据源通过价格排序
        this.searchList.sort((a, b) => {
          return b.goods_price - a.goods_price // 升序
        })
      }
    },
    // 请求搜索列表数据
    async getSearchList() {
      // 判断当前数据源的长度，是否与总数相同，如果相同，不再发送请求
      if (this.searchList.length === this.total) {
        return
      }
      if (!this.isEnd) {
        this.pagenum--
        return;
      }
      // 将状态改为 false
      this.isEnd = false
      wx.showLoading({
        title: '加载中'
      })
      var res = await wxrequest({
        url: 'api/public/v1/goods/search',
        data: {
          query: this.query,
          pagesize: this.pagesize,
          pagenum: this.pagenum  // 5s
        }
      })
      let { meta, message } = res.data
      if (meta.status === 200) {
        this.total = message.total
        // 不应该直接赋值，应该进行追加
        this.searchList = [...this.searchList, ...message.goods]
      }
      this.isEnd = true
      wx.hideLoading()

    }
  },
  // 得到上一个页面传递过来的参数
  onLoad(options) {
    console.log('onLoad')
    // 清除缓存数据
    this.selectedIndex = 0
    this.pagenum = 1
    this.searchList = []
    this.total = -1
    this.isEnd = true
    
    this.query = options.query
    // 请求数据
    this.getSearchList()
  },
  onShow() {
    console.log('onShow')
  },
  onReady() {
    console.log('onReady')
  },
  onHide() {
    console.log('onHide')
  },
  onUnload() {
    console.log('onUnload')
  },
  // 上拉触底事件：
  onReachBottom() {
    // 修改当前页
    this.pagenum++
    // 重新请求数据
    this.getSearchList()
  },
  // 下拉刷新
  onPullDownRefresh() {
    // 更新数据
    this.pagenum = 1
    this.searchList = []
    this.total = -1
    // 重新请求数据
    this.getSearchList()
    // 关闭刷新背景
    wx.stopPullDownRefresh()
  },
  // 当页面滚动时触发
  onPageScroll(scroll) {
    if (scroll.scrollTop === 0) {
      this.position = 'static'
      this.marginTop = '0px'
    } else {
      this.position = 'fixed'
      this.marginTop = '200rpx'
    }
  }
}
</script>

<style scoped lang="less">
// 引入： 小程序中允许我们通过关键字 @import 来引入样式
@import './index.less';
</style>
