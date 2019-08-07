<template>
  <div>
    <!-- 收货地址 -->
    <div class="address">
      <!-- 没有地址 -->
      <div v-if="!addredss.userName" class="no-add">
        <span>没有地址</span>
        <span @click="setAddress">></span>
      </div>
      <!-- 有地址 -->
      <div v-else class="yes-add">
        <div class="msg">
          <span>收货人： {{ addredss.userName }}</span>
          <span>{{ addredss.telNumber }}
            <text @click="setAddress">></text>
          </span>
        </div>
        <div class="addmsg">
          {{ detailAddress }}
        </div>
      </div>
      <!-- 图片 -->
      <img src="../../../static/icon/cart_border@2x(1).png" alt="">
    </div>
    <!-- 商品数据 -->
    <div class="goodsList">
      <div class="top">
        优购生活馆
      </div>
      <div class="list">
        <div class="item" v-for="(value, key) in goodsList" :key="key">
          <div class="left">
            <icon @click="changeStatus(value)" type="success" :color="value.status ? 'red': 'gray'"></icon>
          </div>
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
                <div class="count">
                  <span @click="subOne(value)">-</span>
                  <input type="text" v-model="value.num">
                  <span @click="addOne(value)">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部总计区域 -->
    <div class="bottom">
      <div class="selAll">
        <icon @click="checkAll" type="success" :color="selectAll ? 'red' : 'gray'"></icon>
        <span>全选</span>
      </div>
      <div class="total">
        <span>合计: ￥{{total}}.00</span>
        <span>包运费</span>
      </div>
      <div class="pay">
        <button @click="pay">结算({{totalNum}})</button>
      </div>
    </div>
  </div>
</template>

<script>
import wxrequest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      // 收货地址
      addredss: {},
      // 购物车列表
      goodsList: {},
      // 登录信息
      token: null
    }
  },
  onShow() {
    // 从storage 中取出地址
    this.addredss = wx.getStorageSync('address') || {}
    //  从storage 中取出购物车列表
    this.goodsList = wx.getStorageSync('cart') || {}
    // 给 token 赋值
    this.token = wx.getStorageSync('token') || null
  },
  computed: {
    // 拼接的收货地址
    detailAddress() {
      return this.addredss ? this.addredss.provinceName + this.addredss.cityName + this.addredss.countyName + this.addredss.detailInfo : ''
    },
    // 得到总价
    total() {
      var count = 0
      // 遍历数据源，将价格相加
      // item: key
      // for (var item in this.goodsList) {
      //   if (this.goodsList[item].status === true) {
      //     count += this.goodsList[item].goods_price
      //   }
      // }
      Object.keys(this.goodsList).forEach(item => {
        if (this.goodsList[item].status === true) {
          count += this.goodsList[item].goods_price * this.goodsList[item].num
        }
      })
      // 提示，明天再来写的时候这个写会变为
      // Object.Keys(this.goodsList).forEach(item => { console.log(this.goodsList[item])})
      return count;
    },
    // 选中的状态
    selectAll() {
      var isAll = true
      // 遍历 goodsList 来得到当前元素的状态
      Object.keys(this.goodsList).forEach(item => {
        if (this.goodsList[item].status === false) {
          isAll = false
        }
      })
      return isAll
    },
    totalNum() {
      var num = 0;
      // 得到购物车中所有选中商品的数量的总和
      Object.keys(this.goodsList).forEach(item => {
        if (this.goodsList[item].status === true) {
          num += this.goodsList[item].num
        }
      })
      return num
    }
  },
  methods: {
    // 设置收货地址
    setAddress() {
      wx.chooseAddress({
        success: res => {
          this.addredss = res
          // 将数据保存到 storage 中
          wx.setStorageSync('address', this.addredss)
        }
      })
    },
    // 点击状态时，改变元素状态
    changeStatus(item) {
      // console.log(item)
      // 改变状态
      item.status = !item.status
      // 重新保存到 storage
      wx.setStorageSync('cart', this.goodsList)
    },
    // 数量减一
    subOne(value) {
      value.num--
      // 判断元素是否等于0，如果等于就访问用户是否要将商品删除
      if (value.num === 0) {
        wx.showModal({
          title: '提示',
          content: '您确定要删除此商品吗',
          success: res => {
            if (res.confirm) {
              // 将当商品（value）从 goodsList 中删除
              delete this.goodsList[value.goods_id]
              // console.log(this.goodsList)
              // 重新给  goodsList 赋值:更新视图
              this.goodsList = { ...this.goodsList }
            } else if (res.cancel) {
              // 重新将数据变为 1
              value.num = 1
            }
            // 将数据重新保存到 storage 中
            wx.setStorageSync('cart', this.goodsList)
          }
        })
      }
    },
    // 数据加一
    addOne(value) {
      value.num++
      wx.setStorageSync('cart', this.goodsList)
    },
    // 改变状态
    checkAll() {
      // 得到当前全选的状态
      var status = !this.selectAll
      // 给所有的元素都设置为这个状态
      Object.keys(this.goodsList).forEach(item => {
        this.goodsList[item].status = status
      })
      // 保存到 storage 中
      wx.setStorageSync('cart', this.goodsList)
    },
    // 结算逻辑
    async pay() {
      // 判断购物车中是否有内容
      if (this.totalNum === 0) {
        wx.showToast({
          title: '您还没有选中商品',
          icon: 'none',
          duration: 1000
        })
        return
      }
      // 判断是否登录
      if (!this.token) {
        var time = 500
        // 跳转到 me
        wx.showToast({
          title: '您还没有登录',
          icon: 'none',
          duration: time
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/me/main'
          })
        }, time)
      }
      // 生成一个 goods 数组
      var goods = []
      for (var item in this.goodsList) {
        goods.push({
          goods_id: this.goodsList[item].goods_id,
          goods_number: this.goodsList[item].num,
          goods_price: this.goodsList[item].goods_price
        })
      }
      // 下单
      var res = await wxrequest({
        url: 'api/public/v1/my/orders/create',
        method: 'POST',
        header: {
          Authorization: this.token
        },
        data: {
          order_price: this.total,
          consignee_addr: this.detailAddress,
          goods
        }
      })
      let { meta, message } = res.data
      if (meta.status === 200) {
        // 将订单号&订单中的商品数据进行保存
        // 保存订单号
        wx.setStorageSync('orderId', message.order_number)
        // 保存订单中的商品数据
        wx.setStorageSync('goods_detail', message.goods)

        // 跳转到订单支付
        wx.navigateTo({
          url: '/pages/pay/main'
        })
        // 提示下单成功
        wx.showToast({
          title: '下单成功',
          icon: 'success',
          duration: 1000
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
