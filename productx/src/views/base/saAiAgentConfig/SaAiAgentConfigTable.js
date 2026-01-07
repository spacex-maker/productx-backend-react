import React from 'react';
import { Button, Space, Switch, Tag } from 'antd';
import PropTypes from 'prop-types';

const SaAiAgentConfigTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDelete,
}) => {
  const renderTags = (tags) => {
    if (!tags) return '-';
    return tags.split(',').map((tag) => (
      <Tag key={tag} color="blue" style={{ marginRight: 4 }}>
        {tag.trim()}
      </Tag>
    ));
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th style={{ width: 40 }}>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all_config"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all_config"></label>
            </div>
          </th>
          {[
            'ID',
            'Agent UUID',
            '名称',
            '厂商/模型',
            '标签',
            '状态',
            '公开',
            '创建时间',
            '操作',
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
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
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>{item.id}</td>
            <td className="text-truncate" style={{ maxWidth: 160 }} title={item.agentUuid}>
              {item.agentUuid || '-'}
            </td>
            <td className="text-truncate" style={{ maxWidth: 200 }} title={item.name}>
              <div style={{ fontWeight: 600 }}>{item.name || '-'}</div>
              <div style={{ color: '#999', fontSize: 12 }}>{item.description || '-'}</div>
            </td>
            <td className="text-truncate" style={{ maxWidth: 200 }}>
              <div>{item.provider || '-'}</div>
              <div style={{ color: '#999', fontSize: 12 }}>{item.model || '-'}</div>
            </td>
            <td style={{ maxWidth: 220 }}>{renderTags(item.tags)}</td>
            <td>
              <Switch
                checked={item.status === 1}
                onChange={(checked) => handleStatusChange(item.id, checked)}
              />
            </td>
            <td>{item.isPublic === 1 ? '是' : '否'}</td>
            <td>{item.createTime || '-'}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  编辑
                </Button>
                <Button type="link" danger onClick={() => handleDelete(item.id)}>
                  删除
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SaAiAgentConfigTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default SaAiAgentConfigTable;


