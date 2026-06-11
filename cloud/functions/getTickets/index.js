// 获取工单列表
exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: context.callbackWaitsForEmptyEventLoop });
  
  const db = cloud.database();
  const _ = db.command;
  
  try {
    const { status, grid_id, page = 1, limit = 10, openid, userRole } = event;
    const skip = (page - 1) * limit;

    let query = db.collection('tickets');

    // 根据角色和状态筛选
    if (status) {
      query = query.where({ status: status });
    }

    // 根据用户角色筛选
    if (userRole === 'direct_sales') {
      // 直销队员只能看自己上报的工单
      query = query.where({ reporter_id: openid });
    } else if (userRole === 'grid_master' || userRole === 'vice_grid_master') {
      // 网格长/副网格长只能看自己网格的工单
      query = query.where({ actual_grid_id: grid_id });
    } else if (userRole === 'technical_manager') {
      // 技术经理可以看分配给自己的工单
      query = query.where({ assigned_managers: _.in([openid]) });
    }

    // 获取总数
    const countRes = await query.count();
    const total = countRes.total;

    // 获取数据
    const res = await query
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(limit)
      .get();

    return {
      success: true,
      tickets: res.data,
      total: total,
      page: page
    };
  } catch (error) {
    console.error('getTickets error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
