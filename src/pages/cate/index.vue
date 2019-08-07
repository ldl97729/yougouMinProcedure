<template>
  <div>
    <!-- 头部搜索 -->
    <div class="topHead">
      <!-- html5 中的新的标签 -->
      <input class="search" type="search">
      <div class="icon">
        <icon type="search" size="20"></icon>
        <span>搜索</span>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="left">
        <ul>
          <li @click="changeActive(index)" :class="{active: selectedIndex === index}" v-for="(item,index) in cateList" :key="index">
            {{ item.cat_name }}
          </li>
        </ul>
      </div>
      <div class="right">
        <img class="topImg" src="https://img.alicdn.com/tps/i4/TB1OKgFXvb2gK0jSZK9SuuEgFXa.jpg_q90_.webp" alt="" />
        <div class="item-box" v-for="(item, index) in contentList" :key="index">
          <div class="title">
            <span>/</span>
            {{ item.cat_name }}
            <span>/</span>
          </div>
          <div class="box">
            <div class="item" v-for="(item1, index1) in item.children" :key="index1">
              <a :href="'/pages/searchList/main?query=' + item1.cat_name">
                <img :src="'https://autumnfish.cn/wx/' + item1.cat_icon" alt="">
                <span>{{ item1.cat_name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 wxreqst
import wxreqst from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      // 设置默认选中的 li 标签的下标
      selectedIndex: 0,
      // 分类数据源
      cateList: [],
      // 内容数据源
      contentList: []
    }
  },
  methods: {
    // 点击 li 标签时触发
    changeActive(index) {
      // 修改选中下标
      this.selectedIndex = index
      // 根据下标得到右侧的数据源
      this.contentList = this.cateList[index].children
      console.log(this.contentList)
    },
    // 获取分类数据源
    async getCateList() {
      wx.showLoading({
        title: '正在加载'
      })
      var res = await wxreqst({
        url: 'api/public/v1/categories'
      })
      // 解构
      let { meta, message } = res.data
      // 判断
      if (meta.status === 200) {
        this.cateList = message
        // 在打开页面时也需要给 contentList 赋值
        this.contentList = this.cateList[this.selectedIndex].children
      }
      wx.hideLoading()
    }
  },
  mounted() {
    // 获取数据
    this.getCateList()
  }
}
</script>

<style lang="less">
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

.content {
  width: 100%;
  position: absolute;
  top: 100rpx;
  left: 0px;
  bottom: 0px;
  display: flex;
  .left {
    width: 198rpx;
    height: 100%;
    background-color: #eee;
    overflow: auto;
    ul {
      li {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        &.active {
          color: #eb4450;
          position: relative;
          background-color: #fff;
          &:before {
            content: '';
            position: absolute;
            top: 20rpx;
            left: 0;
            width: 8rpx;
            height: 60rpx;
            background-color: #eb4450;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    overflow: auto;
    padding: 20rpx 16rpx;
    box-sizing: border-box;
    .topImg {
      width: 100%;
      height: 180rpx;
    }
    .item-box {
      .title {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        span {
          color: #e4e4e4;
          margin: 0px 10rpx;
        }
      }
      .box {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 33.333%;
          text-align: center;
          margin-top: 30rpx;
          img {
            width: 80%;
            height: 66rpx;
          }
          span {
            display: block;
            line-height: 70rpx;
          }
        }
      }
    }
  }
}
</style>
