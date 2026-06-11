# 数据库设计文档

## 集合结构

### 1. users（用户集合）
```
{
  _id: string                    // 用户ID（微信openid）
  nickname: string               // 昵称
  avatar: string                 // 头像URL
  role: string                   // 角色: 'super_admin' | 'admin' | 'user'
  grids: array                   // 所属网格ID列表
  managed_grids: array           // 管理的网格ID列表（技术经理）
  department: string             // 部门：'direct_sales' | 'technical' | 'grid_mgmt'
  status: string                 // 状态：'active' | 'inactive'
  created_at: timestamp
  updated_at: timestamp
}
```

### 2. grids（网格集合）
```
{
  _id: string                    // 网格ID
  name: string                   // 网格名称
  code: string                   // 网格代码
  description: string            // 网格描述
  grid_master: string            // 网格长ID
  vice_grid_master: string       // 副网格长ID
  technical_managers: array      // 技术经理ID列表
  region: string                 // 地区
  status: string                 // 状态：'active' | 'inactive'
  created_at: timestamp
  updated_at: timestamp
}
```

### 3. tickets（工单集合）
```
{
  _id: string
  ticket_no: string
  status: string                 // 'pending' | 'processing' | 'resolved'
  priority: string
  broadband_account: string
  business_type: string
  order_date: timestamp
  order_address: string
  customer_demand: string
  installation_issue: string
  report_grid_id: string
  actual_grid_id: string
  construction_team: string
  reporter_id: string
  reporter_name: string
  assigned_managers: array
  replies: array
  created_at: timestamp
  updated_at: timestamp
}
```

## 权限规则

- 用户只能读写自己的文档
- 管理员可以查看所属网格的工单
- 技术经理可以查看和回复多个网格的工单
- 直销队员只能看自己上报的工单
