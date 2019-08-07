<template>
  <div>
    <!-- 头部搜索 -->
    <div class="topHead">
      <!-- html5 中的新的标签 -->
      <input @input="thinkSearch" @confirm="toSearch" v-model="key" placeholder="请输入要搜索的内容" class="search" type="search">
      <div class="thinkbox" v-if="thinkList.length != 0">
        <div @click="lianxiangSearch(item.goods_name)" class="think" v-for="(item, index) in thinkList" :key="index">
          {{item.goods_name}}
        </div>
      </div>
      <button @click="clearkey" v-if="key.length !== 0">取消</button>
      <div class="icon">
        <icon type="search" size="20"></icon>
      </div>
    </div>
    <div class="bigbox">
      <div class="title">
        <span>搜索历史</span>
        <icon @click="clearsearch" type="clear" size="16"></icon>
      </div>
      <div class="list">
        <div @click="opensearch(item)" class="item" v-for="(item, index) in searchList" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 wxreqest
import wxrequest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      // 搜索的关键字
      key: '',
      // 搜索的列表
      searchList: [],
      // 联想的数据源
      thinkList: [],
      // 定时器：用来发送联想请求
      timer: null
    }
  },
  mounted() {
    // 从 storage 中取出
    var res = wx.getStorageSync('key')
    this.searchList = res ? JSON.parse(res) : []
  },
  methods: {
    // 清除key
    clearkey() {
      this.key = ''
    },
    // 定义一个方法用来将数据进行去重
    // 当敲击回车时触发，跳转到搜索页面
    toSearch() {
      // 跳转到搜索页面
      if (this.key != '') {
        wx.navigateTo({
          url: `/pages/searchList/main?query=${this.key}`,
          success: () => {
            this.thinkList = []
          }
        })
        // 将 key 保存到数组中
        this.searchList.unshift(this.key)
        // 去重
        this.searchList = [...new Set([...this.searchList])]
        // 将 数组转为 字符串
        var searchListStr = JSON.stringify(this.searchList)
        // 使用 Storage 来保存
        wx.setStorageSync('key', searchListStr)

      }
    },
    // 将搜索数据放到输入框，并且跳转到搜索列表
    // 点击搜索记录时触发
    opensearch(item) {
      this.key = item
      // 跳转
      wx.navigateTo({
        url: `/pages/searchList/main?query=${this.key}`,
        success: () => {
          this.thinkList = []
        }
      })
    },
    // 清除搜索历史
    clearsearch() {
      // 显示一个模态框
      wx.showModal({
        title: '警告',
        content: '是否清空搜索历史',
        success: res => {
          if (res.confirm) {
            // 将 storage 中的数据清除
            wx.removeStorageSync('key')
            // 将 key 清空'
            this.key = ''
            this.searchList = []
          }
        }
      })
    },
    // 在输入框中只要输入内容就需要进行联想
    thinkSearch() {
      // 进来以后先判断 timer 是否存在 ，如果存在 先清空
      if (this.timer) {
        clearTimeout(this.timer)
      }

      // 将内容添加到一个定时器中
      this.timer = setTimeout(async () => {
        // 获取到输入的内容：
        // 根据输入的进行联想
        var res = await wxrequest({
          // 最多只联想10条
          url: `api/public/v1/goods/search?query=${this.key}&pagenum=1&pagesize=10`
        })
        let { meta, message } = res.data
        if (meta.status === 200) {
          this.thinkList = message.goods
        }
      }, 500)
    },
    // 点击联想出来的数据进行搜索
    lianxiangSearch(item) {
      this.key = item
      // 跳转
      wx.navigateTo({
        url: `/pages/searchList/main?query=${this.key}`,
        success: () => {
          this.thinkList = []
        }
      })
      // 将数据保存到 storage
      // 将 key 保存到数组中
      this.searchList.unshift(this.key)
      // 去重
      this.searchList = [...new Set([...this.searchList])]
      // 将 数组转为 字符串
      var searchListStr = JSON.stringify(this.searchList)
      // 使用 Storage 来保存
      wx.setStorageSync('key', searchListStr)
    }
  }
}
</script>

<style scoped lang="less">
.topHead {
  width: 100%;
  height: 100rpx;
  padding: 20rpx 16rpx;
  background-color: #eeeeee;
  box-sizing: border-box;
  position: relative;
  display: flex;
  .thinkbox {
    position: absolute;
    top: 80rpx;
    left: 16rpx;
    right: 16rpx;
    box-sizing: border-box;
    background-color: #ccc;
    .think {
      font-size: 16px;
      line-height: 60rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .search {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    border-radius: 5px;
    padding-left: 70rpx;
    font-size: 16px;
    box-sizing: border-box;
  }
  button {
    width: 160rpx;
    height: 64rpx;
    padding: 0;
    line-height: 60rpx;
    font-size: 16px;
    margin-left: 20rpx;
  }
  .icon {
    position: absolute;
    top: 50%;
    left: 30rpx;
    transform: translate(0, -50%);
  }
}

.bigbox {
  width: 100%;
  padding: 0 16rpx;
  box-sizing: border-box;
  .title {
    display: flex;
    justify-content: space-between;
    height: 88rpx;
    line-height: 88rpx;
    span {}
    icon {
      margin-top: 25rpx;
      margin-right: 20rpx;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      padding: 20rpx 25rpx;
      background-color: #ddd;
      margin: 0px 30rpx 18rpx 0px;
    }
  }
}
</style>
