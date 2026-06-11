// 获取工单详情
exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: context.callbackWaitsForEmptyEventLoop });
  
  const db = cloud.database();
  
  try {
    const { ticket_id } = event;

    const ticketRes = await db.collection('tickets').doc(ticket_id).get();
    
    if (!ticketRes.data) {
      return {
        success: false,
        error: '工单不存在'
      };
    }

    return {
      success: true,
      ticket: ticketRes.data,
      replies: ticketRes.data.replies || []
    };
  } catch (error) {
    console.error('getTicketDetail error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
