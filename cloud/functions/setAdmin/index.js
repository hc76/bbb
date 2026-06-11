// 设置管理员
exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: context.callbackWaitsForEmptyEventLoop });
  
  const db = cloud.database();
  const _ = db.command;
  
  try {
    const { user_id, grid_id, role, action, adminOpenid } = event;

    // 验证超级管理员权限
    const adminRes = await db.collection('users').where({
      _openid: adminOpenid
    }).get();
    
    if (!adminRes.data || adminRes.data[0].role !== 'super_admin') {
      return {
        success: false,
        error: '只有超级管理员可以设置管理员'
      };
    }

    const gridRes = await db.collection('grids').doc(grid_id).get();
    const gridData = gridRes.data;

    if (action === 'add') {
      // 添加管理员
      const updateData = {};
      if (role === 'grid_master') {
        updateData.grid_master = user_id;
      } else if (role === 'vice_grid_master') {
        updateData.vice_grid_master = user_id;
      } else if (role === 'technical_manager') {
        updateData.technical_managers = _.push(user_id);
      }

      await db.collection('grids').doc(grid_id).update({
        data: updateData
      });

      // 更新用户管理的网格列表
      if (role === 'technical_manager') {
        await db.collection('users').where({
          _openid: user_id
        }).update({
          data: {
            managed_grids: _.push(grid_id)
          }
        });
      }
    } else if (action === 'remove') {
      // 移除管理员
      const updateData = {};
      if (role === 'grid_master') {
        updateData.grid_master = '';
      } else if (role === 'vice_grid_master') {
        updateData.vice_grid_master = '';
      } else if (role === 'technical_manager') {
        const managers = gridData.technical_managers.filter(id => id !== user_id);
        updateData.technical_managers = managers;
      }

      await db.collection('grids').doc(grid_id).update({
        data: updateData
      });

      // 更新用户管理的网格列表
      if (role === 'technical_manager') {
        await db.collection('users').where({
          _openid: user_id
        }).update({
          data: {
            managed_grids: _.pull(grid_id)
          }
        });
      }
    }

    return {
      success: true,
      message: `${action === 'add' ? '添加' : '移除'}管理员成功`
    };
  } catch (error) {
    console.error('setAdmin error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
