// WorkOrderStatus.js

const WorkOrderStatus = {
  NEW: { value: "NEW", label: '新建', description: '工单刚创建，尚未处理', color: 'gray' },
  PENDING_ASSIGNMENT: { value: "PENDING_ASSIGNMENT", label: '待分配', description: '工单已创建，等待分配给客服人员', color: 'orange' },
  IN_PROGRESS: { value: "IN_PROGRESS", label: '处理中', description: '工单已分配给客服人员，正在处理', color: 'blue' },
  PENDING_CUSTOMER_RESPONSE: { value: "PENDING_CUSTOMER_RESPONSE", label: '待客户响应', description: '客服已回复，等待客户进一步反馈或确认', color: 'purple' },
  RESOLVED: { value: "RESOLVED", label: '已解决', description: '工单问题已解决，等待客户确认关闭', color: 'green' },
  CLOSED: { value: "CLOSED", label: '已关闭', description: '工单已完成并关闭，不再需要任何操作', color: 'darkgray' },
  CANCELLED: { value: "CANCELLED", label: '已取消', description: '工单被客户或客服取消，不再处理', color: 'red' },
  UNDER_REVIEW: { value: "UNDER_REVIEW", label: '待复查', description: '工单需要进一步复查或二次确认', color: 'teal' },
  ESCALATED: { value: "ESCALATED", label: '升级处理', description: '工单已上报或升级至更高级别的支持团队', color: 'darkred' },
};

export default WorkOrderStatus;
