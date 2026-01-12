import React from 'react'
import { Tag, Button, Space, Tooltip, Avatar } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import DefaultAvatar from 'src/components/DefaultAvatar'

const ApplicationListTable = ({ data, selectedRows, selectAll, onSelectAll, onSelectRow, onReviewClick }) => {
  const { t } = useTranslation()

  const getStatusTag = (status) => {
    const statusConfig = {
      0: { color: 'processing', text: t('待审核'), icon: <ClockCircleOutlined /> },
      1: { color: 'success', text: t('审核通过'), icon: <CheckCircleOutlined /> },
      2: { color: 'error', text: t('审核拒绝'), icon: <CloseCircleOutlined /> },
      3: { color: 'default', text: t('已撤回'), icon: null },
    }
    const config = statusConfig[status] || { color: 'default', text: t('未知') }
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    )
  }

  return (
    <div className="table-responsive" style={{ marginTop: '10px' }}>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input type="checkbox" checked={selectAll} onChange={onSelectAll} />
            </th>
            <th>{t('申请ID')}</th>
            <th>{t('申请人')}</th>
            <th>{t('申请角色')}</th>
            <th>{t('申请理由')}</th>
            <th>{t('经验描述')}</th>
            <th>{t('联系方式')}</th>
            <th>{t('状态')}</th>
            <th>{t('审核人')}</th>
            <th>{t('审核时间')}</th>
            <th>{t('审核意见')}</th>
            <th>{t('申请时间')}</th>
            <th style={{ width: '150px' }}>{t('操作')}</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => onSelectRow(item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DefaultAvatar
                      src={item.avatar}
                      size={32}
                      style={{ flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {item.nickname || item.username}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        ID: {item.userId}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.roleName}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {item.roleCode}
                    </div>
                  </div>
                </td>
                <td>
                  <Tooltip title={item.applyReason}>
                    <div
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.applyReason || '-'}
                    </div>
                  </Tooltip>
                </td>
                <td>
                  <Tooltip title={item.experienceDescription}>
                    <div
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.experienceDescription || '-'}
                    </div>
                  </Tooltip>
                </td>
                <td>{item.contactInfo || '-'}</td>
                <td>{getStatusTag(item.status)}</td>
                <td>{item.reviewerUsername || '-'}</td>
                <td>{item.reviewTime || '-'}</td>
                <td>
                  <Tooltip title={item.reviewComment}>
                    <div
                      style={{
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.reviewComment || '-'}
                    </div>
                  </Tooltip>
                </td>
                <td>{item.createTime}</td>
                <td>
                  <Space size="small">
                    {item.status === 0 && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => onReviewClick(item)}
                      >
                        {t('审核')}
                      </Button>
                    )}
                    {item.status !== 0 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => onReviewClick(item)}
                      >
                        {t('查看详情')}
                      </Button>
                    )}
                  </Space>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" style={{ textAlign: 'center', padding: '20px' }}>
                {t('暂无数据')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationListTable

