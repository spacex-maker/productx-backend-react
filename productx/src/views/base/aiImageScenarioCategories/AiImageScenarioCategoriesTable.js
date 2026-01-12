import React from 'react';
import { Button, Switch, Tag, Popconfirm, Space, Badge } from 'antd';

const AiImageScenarioCategoriesTable = ({
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
  const getLevelTag = (level) => {
    const levelMap = {
      1: { text: t('一级'), color: 'blue' },
      2: { text: t('二级'), color: 'cyan' }
    };
    const config = levelMap[level] || levelMap[1];
    return <Tag color={config.color}>{config.text}</Tag>;
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
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {[
            t('分类标识'),
            t('分类名称'),
            t('层级'),
            t('父分类ID'),
            t('排序权重'),
            t('场景数量'),
            t('热门'),
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
            <td className="text-truncate">
              <Tag color="purple">{item.categoryKey}</Tag>
            </td>
            <td className="text-truncate">{item.categoryName}</td>
            <td className="text-truncate">{getLevelTag(item.level)}</td>
            <td className="text-truncate">
              {item.parentId === 0 ? (
                <Tag color="gold">{t('根分类')}</Tag>
              ) : (
                item.parentId
              )}
            </td>
            <td className="text-truncate">{item.sortOrder || 0}</td>
            <td className="text-truncate">
              <Badge count={item.scenarioCount || 0} showZero color="#52c41a" />
            </td>
            <td className="text-truncate">
              {item.isHot ? (
                <Tag color="red">{t('热门')}</Tag>
              ) : (
                <Tag>{t('普通')}</Tag>
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
                  description={t('删除前请确保该分类下没有子分类和场景')}
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

export default AiImageScenarioCategoriesTable;
