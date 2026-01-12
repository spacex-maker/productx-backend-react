import React from 'react';
import { Button, Switch, Tag, Popconfirm, Space } from 'antd';

const AiImageScenariosTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDelete,
  handleStatusChange,
  t
}) => {
  // 移除 getCategoryTag 函数，因为现在使用分类ID

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
            t('场景信息'),
            t('排序权重'),
            t('默认尺寸'),
            t('VIP专属'),
            t('启用状态'),
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
            <td>
              <div>
                <div style={{ marginBottom: '4px' }}>
                  <Tag color="cyan">{item.sceneKey}</Tag>
                  <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{item.sceneName}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <span>ID: {item.id}</span>
                  <span style={{ marginLeft: '12px' }}>
                    {t('分类')}: <Tag color="blue" style={{ fontSize: '11px' }}>{item.categoryId || t('未分类')}</Tag>
                  </span>
                </div>
              </div>
            </td>
            <td className="text-truncate">{item.sortOrder || 0}</td>
            <td className="text-truncate">
              {item.width} × {item.height}
            </td>
            <td className="text-truncate">
              {item.isVip ? (
                <Tag color="gold">{t('是')}</Tag>
              ) : (
                <Tag>{t('否')}</Tag>
              )}
            </td>
            <td>
              <Switch
                checked={item.isActive}
                onChange={(checked) => handleStatusChange(item.id, checked)}
              />
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)} size="small">
                  {t('edit')}
                </Button>
                <Popconfirm
                  title={t('确定要删除吗？')}
                  onConfirm={() => handleDelete(item.id)}
                  okText={t('confirm')}
                  cancelText={t('cancel')}
                >
                  <Button type="link" danger size="small">
                    {t('delete')}
                  </Button>
                </Popconfirm>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AiImageScenariosTable;
