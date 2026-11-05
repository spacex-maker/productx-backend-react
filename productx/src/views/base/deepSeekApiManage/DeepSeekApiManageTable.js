import React from 'react';
import { Tag, Tooltip } from 'antd';
import { formatDate } from '../../../utils/dateUtils';

const DeepSeekApiManageTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
}) => {
  const getSuccessTag = (success) => {
    if (success) {
      return <Tag color="success">成功</Tag>;
    }
    return <Tag color="error">失败</Tag>;
  };

  const splitSource = (stack) => {
    if (!stack) return { scene: '-', business: '-' };
    const idx = stack.indexOf(' | ');
    if (idx < 0) return { scene: stack, business: '-' };
    return { scene: stack.slice(0, idx), business: stack.slice(idx + 3) };
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all_ds"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all_ds"></label>
            </div>
          </th>
          <th>用户</th>
          <th>模型</th>
          <th>业务来源</th>
          <th>场景码</th>
          <th>Tokens</th>
          <th>费用</th>
          <th>耗时</th>
          <th>错误/IP</th>
          <th>时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        {(data || []).map((item) => {
          const src = splitSource(item.requestStackInfo);
          return (
            <tr key={item.id} className="record-font">
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_ds_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label className="custom-control-label" htmlFor={`td_checkbox_ds_${item.id}`}></label>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt="avatar"
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                    />
                  ) : null}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{item.nickname || '-'}</span>
                    <span style={{ color: '#666', fontSize: '12px' }}>{item.username || '-'}</span>
                  </div>
                  <span style={{ color: '#999', fontSize: '12px' }}>({item.userId})</span>
                </div>
              </td>
              <td>{item.modelName}</td>
              <td>
                <Tooltip title={item.requestStackInfo || ''}>
                  <span>{src.business}</span>
                </Tooltip>
              </td>
              <td>
                <span style={{ fontSize: '12px', color: '#666' }}>{src.scene}</span>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                  <span>P: {item.promptTokens ?? 0}</span>
                  <span>C: {item.completionTokens ?? 0}</span>
                  <span>T: {item.totalTokens ?? 0}</span>
                </div>
              </td>
              <td>
                {item.cost ?? 0} {item.currency || 'USD'}
              </td>
              <td>{item.durationMs ?? 0}ms</td>
              <td>
                <Tooltip title={item.errorMessage || ''}>
                  <div style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.errorMessage || item.ipAddress || '-'}
                  </div>
                </Tooltip>
              </td>
              <td>{formatDate(item.createTime || item.requestTime)}</td>
              <td>{getSuccessTag(item.success)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DeepSeekApiManageTable;