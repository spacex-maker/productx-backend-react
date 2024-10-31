import React from 'react';
import {formatDate, formatTimeDifference} from "src/components/common/Common";
import WorkOrderStatus from "src/views/base/workOrder/WorkOrderStatus";
import {Button} from "antd"; // 根据您使用的UI库调整

function WorkOrderRow({ item, selectedRows, handleSelectRow, handleEditClick, handleViewDetails }) {
  const timeDifference = formatTimeDifference(item.createTime); // 使用自定义 Hook
// 获取状态标签方法
  const getStatusLabel = (status) => {
    const statusEntry = Object.values(WorkOrderStatus).find(
      (entry) => entry.value === status
    );
    return statusEntry ? (
      <span style={{color: statusEntry.color}}>
        {statusEntry.label}
      </span>
    ) : (
      <span style={{color: 'black'}}>未知状态</span>
    );
  };
  return (
    <tr key={item.id} className="record-font">
      <td>
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            checked={selectedRows.includes(item.id)}
            onChange={() => handleSelectRow(item.id)}
          />
          <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
        </div>
      </td>
      <td className="text-truncate">{item.id}</td>
      <td className="text-truncate">{item.title}</td>
      <td className="text-truncate">{item.description}</td>
      <td className="text-truncate">
        {formatDate(item.createTime)}
        {
          (item.status === WorkOrderStatus.CANCELLED.value
            || item.status === WorkOrderStatus.CLOSED.value
            || item.status === WorkOrderStatus.RESOLVED.value
          ) ? "" : <span className="text-muted">({timeDifference})</span>
        }
      </td>
      <td>
        {getStatusLabel(item.status)}
      </td>
      <td className="fixed-column">
        <Button type="link" onClick={() => handleEditClick(item)}>
          修改
        </Button>
        <Button type="link" onClick={() => handleViewDetails(item)}>
          查看详情
        </Button>
      </td>
    </tr>
  );
}

export default WorkOrderRow;
