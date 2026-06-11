// 更新工单状态和添加回复
exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: context.callbackWaitsForEmptyEventLoop });
  
  const db = cloud.database();
  const _ = db.command;
  
  try {
    const { ticket_id, status, reply_content, openid } = event;

    // 获取当前用户信息
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get();
    const userData = userRes.data[0];

    // 创建回复记录
    const replyData = {
      _id: Date.now().toString(),
      handler_id: openid,
      handler_name: userData.nickname,
      status: status,
      content: reply_content,
      attachments: [],
      created_at: new Date()
    };

    // 更新工单
    await db.collection('tickets').doc(ticket_id).update({
      data: {
        status: status,
        replies: _.push(replyData),
        updated_at: new Date()
      }
    });

    // 获取工单信息用于通知
    const ticketRes = await db.collection('tickets').doc(ticket_id).get();
    const ticketData = ticketRes.data;

    // 发送通知给上报人
    await db.collection('messages').add({
      data: {
        type: 'ticket_replied',
        receiver_id: ticketData.reporter_id,
        ticket_id: ticket_id,
        content: `工单已${status === 'resolved' ? '解决' : '更新处理进度'}`,
        read: false,
        created_at: new Date()
      }
    });

    return {
      success: true,
      message: '工单已更新'
    };
  } catch (error) {
    console.error('updateTicket error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
