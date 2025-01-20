import React, {useState} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import WorkOrderStatus from "src/views/base/workOrder/WorkOrderStatus";
import {formatDate, formatTimeDifference} from "src/components/common/Common";
import WorkOrderRow from "src/views/base/workOrder/WorkOrderRow";


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

const WorkOrderTable = ({
                          data,
                          selectAll,
                          selectedRows,
                          handleSelectAll,
                          handleSelectRow,
                          handleStatusChange,
                          handleEditClick,
                        }) => {

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // 查看详情
  const handleViewDetails = (item) => {
    setDetailData(item);
    setDetailModalVisible(true);
  };

  // 关闭详情模态框
  const handleModalClose = () => {
    setDetailModalVisible(false);
    setDetailData(null);
  };
  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {['工单 ID', '标题', '描述', '提交时间', '当前状态'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column" key='操作'>操作</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item) => (
            <WorkOrderRow
              key={item.id}
              item={item}
              selectedRows={selectedRows}
              handleSelectRow={handleSelectRow}
              handleEditClick={handleEditClick}
              handleViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </table>

      <Modal
        title={detailData?.title || '工单详情'}
        open={detailModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            关闭
          </Button>,
        ]}
      >
        {detailData && (
          <Descriptions bordered  column={1}>
            <Descriptions.Item label="工单 ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="用户">{detailData.username}</Descriptions.Item>
            <Descriptions.Item label="描述">{detailData.description}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{formatDate(detailData.createTime)}</Descriptions.Item>
            <Descriptions.Item label="当前状态">{getStatusLabel(detailData.status)}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>


    </div>
  );
};

export default WorkOrderTable;
