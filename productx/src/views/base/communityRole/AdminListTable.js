import React from 'react'
import { Tag, Tooltip, Popconfirm, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../../utils/dateUtils'
import DefaultAvatar from 'src/components/DefaultAvatar'

const AdminListTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleRemoveAdmin,
  handleEditClick,
}) => {
  const { t } = useTranslation()

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
          <th>{t('用户ID')}</th>
          <th>{t('用户信息')}</th>
          <th>{t('角色名称')}</th>
          <th>{t('角色标识')}</th>
          <th>{t('过期时间')}</th>
          <th>{t('授权时间')}</th>
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
            <td>{item.userId}</td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt="avatar"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <DefaultAvatar name={item.username || item.nickname || 'U'} size={32} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{item.username}</span>
                  {item.nickname && (
                    <span style={{ color: '#666', fontSize: '12px' }}>{item.nickname}</span>
                  )}
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag color={item.isOfficial ? 'gold' : 'blue'}>{item.roleName}</Tag>
                {item.isOfficial && <span style={{ color: '#faad14' }}>✓</span>}
              </div>
            </td>
            <td>{item.roleCode}</td>
            <td>
              {item.expiredTime ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{formatDate(item.expiredTime)}</span>
                  {item.expired && <Tag color="red">已过期</Tag>}
                </div>
              ) : (
                <Tag color="green">永久</Tag>
              )}
            </td>
            <td>{formatDate(item.createTime)}</td>
            <td>
              <Button type="link" size="small" onClick={() => handleEditClick(item)}>
                编辑
              </Button>
              <Popconfirm
                title="确定要移除这个管理员吗？"
                onConfirm={() => handleRemoveAdmin(item.userId, item.roleId)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                  移除
                </Button>
              </Popconfirm>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AdminListTable

