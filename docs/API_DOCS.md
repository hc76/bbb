# API 文档

## 云函数接口

### 1. createTicket - 创建工单

**权限**: 直销队员、超级管理员

**请求**:
```javascript
cloud.callFunction({
  name: 'createTicket',
  data: {
    broadband_account: string,
    business_type: string,
    order_date: number,
    order_address: string,
    customer_demand: string,
    installation_issue: string,
    report_grid_id: string,
    actual_grid_id: string,
    construction_team: string
  }
})
```

**响应**:
```javascript
{
  success: true,
  ticket_id: string,
  ticket_no: string,
  message: '工单创建成功'
}
```

### 2. updateTicket - 回复工单

**权限**: 技术经理、超级管理员

**请求**:
```javascript
cloud.callFunction({
  name: 'updateTicket',
  data: {
    ticket_id: string,
    status: string,           // 'processing' | 'resolved'
    reply_content: string,
    attachments: array        // 可选
  }
})
```

**响应**:
```javascript
{
  success: true,
  message: '工单已更新'
}
```

### 3. getTickets - 获取工单列表

**权限**: 认证用户

**请求**:
```javascript
cloud.callFunction({
  name: 'getTickets',
  data: {
    status: string,           // 'pending' | 'processing' | 'resolved'
    grid_id: string,          // 可选
    page: number,
    limit: number
  }
})
```

**响应**:
```javascript
{
  success: true,
  tickets: array,
  total: number,
  page: number
}
```

### 4. getTicketDetail - 获取工单详情

**权限**: 认证用户

**请求**:
```javascript
cloud.callFunction({
  name: 'getTicketDetail',
  data: {
    ticket_id: string
  }
})
```

### 5. setAdmin - 设置管理员

**权限**: 超级管理员

**请求**:
```javascript
cloud.callFunction({
  name: 'setAdmin',
  data: {
    user_id: string,
    grid_id: string,
    role: string,             // 'grid_master' | 'vice_grid_master' | 'technical_manager'
    action: string            // 'add' | 'remove'
  }
})
```

### 6. getMyTickets - 获取我的工单

**权限**: 认证用户

**请求**:
```javascript
cloud.callFunction({
  name: 'getMyTickets',
  data: {
    ticket_type: string,      // 'reported' | 'assigned' | 'resolved'
    page: number,
    limit: number
  }
})
```

## 权限矩阵

| 操作 | 超级管理员 | 网格长 | 副网格长 | 技术经理 | 直销队员 |
|------|----------|--------|---------|---------|----------|
| 创建工单 | ✓ | ✗ | ✗ | ✗ | ✓ |
| 查看工单 | ✓ | ✓* | ✓* | ✓** | ✓*** |
| 回复工单 | ✓ | ✗ | ✗ | ✓ | ✗ |
| 设置管理员 | ✓ | ✗ | ✗ | ✗ | ✗ |
| 归档工单 | ✓ | ✗ | ✗ | ✓ | ✗ |

**注**: 
- `*` 仅能查看所属网格的工单
- `**` 能查看所管理的多个网格的工单
- `***` 仅能查看自己上报的工单
