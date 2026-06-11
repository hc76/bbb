// pages/ticketList/ticketList.js
Page({
  data: {
    tickets: [],
    status: 'pending',
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    hasMore: true,
    userRole: null
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      userRole: app.globalData.userRole
    });
    this.getTickets();
  },

  getTickets: function() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    const app = getApp();
    wx.cloud.callFunction({
      name: 'getTickets',
      data: {
        status: this.data.status,
        page: this.data.page,
        limit: this.data.limit,
        openid: app.globalData.openid,
        userRole: this.data.userRole
      },
      success: res => {
        this.setData({ loading: false });
        if (res.result.success) {
          const newTickets = this.data.page === 1 ? res.result.tickets : this.data.tickets.concat(res.result.tickets);
          this.setData({
            tickets: newTickets,
            total: res.result.total,
            hasMore: newTickets.length < res.result.total
          });
        }
      },
      fail: err => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'error' });
      }
    });
  },

  onStatusChange: function(e) {
    this.setData({
      status: e.detail.value,
      page: 1,
      tickets: []
    });
    this.getTickets();
  },

  onTicketTap: function(e) {
    const ticketId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/ticketDetail/ticketDetail?id=${ticketId}`
    });
  },

  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.getTickets();
    }
  }
});
