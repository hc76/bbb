// pages/index/index.js
Page({
  data: {
    userRole: null,
    grids: [],
    stats: {
      pending: 0,
      processing: 0,
      resolved: 0
    }
  },

  onLoad: function() {
    this.getUserRole();
    this.getTicketStats();
  },

  getUserRole: function() {
    const app = getApp();
    wx.cloud.callFunction({
      name: 'getUserRole',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        if (res.result.success) {
          this.setData({
            userRole: res.result.role,
            grids: res.result.grids || []
          });
          app.globalData.userRole = res.result.role;
        }
      }
    });
  },

  getTicketStats: function() {
    const app = getApp();
    wx.cloud.callFunction({
      name: 'getTickets',
      data: {
        openid: app.globalData.openid,
        userRole: this.data.userRole,
        limit: 1
      },
      success: res => {
        if (res.result.success) {
          this.setData({
            'stats.pending': res.result.pending || 0,
            'stats.processing': res.result.processing || 0,
            'stats.resolved': res.result.resolved || 0
          });
        }
      }
    });
  },

  onReportTicket: function() {
    wx.navigateTo({
      url: '/pages/reportTicket/reportTicket'
    });
  },

  onViewTickets: function() {
    wx.navigateTo({
      url: '/pages/ticketList/ticketList'
    });
  },

  onAdminSettings: function() {
    if (this.data.userRole === 'super_admin') {
      wx.navigateTo({
        url: '/pages/admin/admin'
      });
    } else {
      wx.showToast({
        title: '无权限访问',
        icon: 'error'
      });
    }
  }
});
