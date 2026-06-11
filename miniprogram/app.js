// app.js
App({
  onLaunch: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
            }
          })
        }
      }
    })

    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'your-cloud-env-id' // 替换为你的云开发环境ID
      });
    }

    // 监听用户登录
    this.watchLogin();
  },

  watchLogin: function() {
    if (wx.getStorageSync('openid')) {
      this.globalData.openid = wx.getStorageSync('openid');
    } else {
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          wx.setStorageSync('openid', res.result.openid);
          this.globalData.openid = res.result.openid;
        }
      });
    }
  },

  globalData: {
    userInfo: null,
    openid: null,
    userRole: null
  }
});
