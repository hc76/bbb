// pages/my/my.js
Page({
  data: {
    userInfo: null,
    userRole: null,
    myTickets: [],
    tabActive: 0,
    tabs: ['已上报', '处理中', '已解决']
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo,
      userRole: app.globalData.userRole
    });
    this.getMyTickets();
  },

  getMyTickets: function() {
    const app = getApp();
    const types = ['reported', 'processing', 'resolved'];
    
    wx.cloud.callFunction({
      name: 'getMyTickets',
      data: {
        ticket_type: types[this.data.tabActive],
        openid: app.globalData.openid,
        page: 1,
        limit: 20
      },
      success: res => {
        if (res.result.success) {
          this.setData({
            myTickets: res.result.tickets
          });
        }
      }
    });
  },

  onTabChange: function(e) {
    this.setData({
      tabActive: e.currentTarget.dataset.index
    });
    this.getMyTickets();
  },

  onTicketTap: function(e) {
    const ticketId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/ticketDetail/ticketDetail?id=${ticketId}`
    });
  },

  onLogout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出吗?',
      success: res => {
        if (res.confirm) {
          wx.clearStorage();
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
});
