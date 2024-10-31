import React, {useState} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import WorkOrderStatus from "src/views/base/workOrder/WorkOrderStatus";
import {formatDate} from "src/components/common/Common";


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
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.title}</td>
            <td className="text-truncate">{item.description}</td>
            <td className="text-truncate">{item.createTime}</td>
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
          <Descriptions bordered size="small" column={1}>
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
