<template>
  <div>
    <button @click="login">点我登录</button>
    <button @getuserinfo="getInfo" open-type="getUserInfo">点我获取用户信息</button>
  </div>
</template>

<script>
import wxrequest from '../../utils/wxrequest.js'

export default {
  data() {
    return {
      obj: {
        code: '',
        encryptedData: '',
        iv: '',
        rawData: '',
        signature: ''
      },
      token: ''
    }
  },
  methods: {
    login() {
      // wx 中提供的登录方法
      wx.login({
        success: res => {
          this.obj.code = res.code
          console.log(res)
          // 再调用 wx.getUserInfo 得到剩余四个参数
          console.log(111111111111111111111)
          wx.getUserInfo({
            success: async res => {
              this.obj.encryptedData = res.encryptedData
              this.obj.iv = res.iv
              this.obj.rawData = res.rawData
              this.obj.signature = res.signature
              console.log('-------------------------------------')
              console.log(res)
              console.log('-------------------------------------')
              // 登录
              var loginRes = await wxrequest({
                url: 'api/public/v1/users/wxlogin',
                method: 'POST',
                data: this.obj
              })
              let { meta, message } = loginRes.data
              if (meta.status === 200) {
                this.token = message.token
                // 将 token 保存到本地
                wx.setStorageSync('token', this.token)
              }
            }
          })
        }
      })
    },
    // 测试获取用户信息的方式
    getInfo(res) {
      this.obj.encryptedData = res.mp.detail.encryptedData
      this.obj.iv = res.mp.detail.iv
      this.obj.rawData = res.mp.detail.rawData
      this.obj.signature = res.mp.detail.signature
      // 登录
      wx.login({
        success: async res => {
          // 得到 code
          this.obj.code = res.code
          // 得到 token
          var loginRes = await wxrequest({
            url: 'api/public/v1/users/wxlogin',
            method: 'POST',
            data: this.obj
          })
          console.log(loginRes)
          let { meta, message } = loginRes.data
          if (meta.status === 200) {
            this.token = message.token
            // 将 token 保存到本地
            wx.setStorageSync('token', this.token)
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
