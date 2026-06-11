// pages/reportTicket/reportTicket.js
Page({
  data: {
    form: {
      broadband_account: '',
      business_type: 'broadband',
      order_date: '',
      order_address: '',
      customer_demand: '',
      installation_issue: '',
      report_grid_id: '',
      actual_grid_id: '',
      construction_team: ''
    },
    grids: [],
    businessTypes: [
      { value: 'broadband', label: '宽带' },
      { value: 'iptv', label: 'IPTV' },
      { value: 'phone', label: '电话' }
    ]
  },

  onLoad: function() {
    this.getGrids();
    const today = new Date();
    this.setData({
      'form.order_date': this.formatDate(today)
    });
  },

  getGrids: function() {
    wx.cloud.callFunction({
      name: 'getGrids',
      success: res => {
        if (res.result.success) {
          this.setData({
            grids: res.result.grids
          });
        }
      }
    });
  },

  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  onDateChange: function(e) {
    this.setData({
      'form.order_date': e.detail.value
    });
  },

  onSubmit: function() {
    if (!this.validateForm()) {
      return;
    }

    const app = getApp();
    wx.showLoading({
      title: '提交中...'
    });

    wx.cloud.callFunction({
      name: 'createTicket',
      data: {
        ...this.data.form,
        openid: app.globalData.openid
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          wx.showToast({
            title: '工单提交成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.result.error || '提交失败',
            icon: 'error'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        });
      }
    });
  },

  validateForm: function() {
    const form = this.data.form;
    if (!form.broadband_account) {
      wx.showToast({ title: '请填写宽带账号', icon: 'error' });
      return false;
    }
    if (!form.order_address) {
      wx.showToast({ title: '请填写下单地址', icon: 'error' });
      return false;
    }
    if (!form.customer_demand) {
      wx.showToast({ title: '请填写客户诉求', icon: 'error' });
      return false;
    }
    if (!form.installation_issue) {
      wx.showToast({ title: '请填写装机疑难问题', icon: 'error' });
      return false;
    }
    if (!form.report_grid_id) {
      wx.showToast({ title: '请选择上报网格', icon: 'error' });
      return false;
    }
    if (!form.actual_grid_id) {
      wx.showToast({ title: '请选择实际网格', icon: 'error' });
      return false;
    }
    return true;
  },

  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
