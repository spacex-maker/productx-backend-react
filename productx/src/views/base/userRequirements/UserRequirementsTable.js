import React from 'react';
import { Button, Space } from 'antd';

const UserRequirementsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusClick,
  t
}) => {
  return (
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
          {[
            t('需求标题'),
            t('需求描述'),
            t('提交用户ID'),
            t('优先级'),
            t('状态'),
            t('类别'),
            t('预计完成日期'),
            t('拒绝原因'),
            t('完成说明'),
            t('创建时间'),
            t('更新时间')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">{t('operations')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.title}</td>
            <td className="text-truncate">{item.description}</td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.priority}</td>
            <td className="text-truncate">{item.status}</td>
            <td className="text-truncate">{item.category}</td>
            <td className="text-truncate">{item.expectedCompletionDate}</td>
            <td className="text-truncate">{item.rejectedReason}</td>
            <td className="text-truncate">{item.completionNotes}</td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Button type="link" onClick={() => handleStatusClick(item)}>
                  {t('更新状态')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserRequirementsTable;
