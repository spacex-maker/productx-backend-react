import React from 'react'
import { Tag, Tooltip, Popconfirm, Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../../utils/dateUtils'

const RoleSettingsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDelete,
}) => {
  const { t } = useTranslation()

  const renderPermissions = (permissionsStr) => {
    if (!permissionsStr) return '-'
    try {
      const permissions = JSON.parse(permissionsStr)
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {permissions.map((perm, index) => (
            <Tag key={index} color="blue">
              {perm}
            </Tag>
          ))}
        </div>
      )
    } catch (e) {
      return permissionsStr
    }
  }

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
          <th>{t('角色信息')}</th>
          <th>{t('权限配置')}</th>
          <th>{t('描述')}</th>
          <th>{t('创建时间')}</th>
          <th>{t('操作')}</th>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: '500' }}>{item.roleName}</span>
                  {item.isOfficial && <Tag color="gold">官方</Tag>}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  <span>ID: {item.id}</span>
                  <span style={{ margin: '0 8px' }}>|</span>
                  <span>标识: {item.roleCode}</span>
                </div>
              </div>
            </td>
            <td>{renderPermissions(item.permissions)}</td>
            <td>
              <Tooltip title={item.description}>
                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                  {item.description || '-'}
                </div>
              </Tooltip>
            </td>
            <td>{formatDate(item.createTime)}</td>
            <td>
              <Space>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(item)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确定要删除这个角色吗？"
                  onConfirm={() => handleDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RoleSettingsTable

