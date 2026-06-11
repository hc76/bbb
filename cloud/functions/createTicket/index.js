// 创建工单
exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: context.callbackWaitsForEmptyEventLoop });
  
  const db = cloud.database();
  const _ = db.command;
  
  try {
    const {
      broadband_account,
      business_type,
      order_date,
      order_address,
      customer_demand,
      installation_issue,
      report_grid_id,
      actual_grid_id,
      construction_team
    } = event;

    // 生成工单号
    const ticket_no = 'TK' + Date.now();
    
    // 获取当前用户信息
    const user = await db.collection('users').doc(event.openid).get();
    const userData = user.data;

    // 创建工单
    const result = await db.collection('tickets').add({
      data: {
        ticket_no,
        status: 'pending',
        priority: 'medium',
        broadband_account,
        business_type,
        order_date: new Date(order_date),
        order_address,
        customer_demand,
        installation_issue,
        report_grid_id,
        actual_grid_id,
        construction_team,
        reporter_id: event.openid,
        reporter_name: userData.nickname,
        assigned_managers: [],
        replies: [],
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // 获取网格管理员并分配
    const grid = await db.collection('grids').doc(actual_grid_id).get();
    const gridData = grid.data;
    
    const managers = [
      gridData.grid_master,
      gridData.vice_grid_master,
      ...gridData.technical_managers
    ].filter(id => id);

    // 更新工单分配管理员
    await db.collection('tickets').doc(result._id).update({
      data: {
        assigned_managers: managers
      }
    });

    // 发送通知给管理员
    for (const managerId of managers) {
      await db.collection('messages').add({
        data: {
          type: 'ticket_created',
          receiver_id: managerId,
          ticket_id: result._id,
          content: `新工单：${broadband_account} - ${customer_demand}`,
          read: false,
          created_at: new Date()
        }
      });
    }

    return {
      success: true,
      ticket_id: result._id,
      ticket_no: ticket_no,
      message: '工单创建成功'
    };
  } catch (error) {
    console.error('createTicket error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
