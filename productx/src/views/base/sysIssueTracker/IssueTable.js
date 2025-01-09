import React from 'react'
import { Avatar, Tooltip, Button } from 'antd'
import { CBadge } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserOutlined } from '@ant-design/icons'

const getStatusColor = (status) => {
  const colorMap = {
    'Open': 'info',
    'In Progress': 'warning',
    'Resolved': 'success',
    'Closed': 'secondary',
    'Reopened': 'danger',
  }
  return colorMap[status] || 'primary'
}

const getPriorityColor = (priority) => {
  const colorMap = {
    'Low': 'success',
    'Medium': 'info',
    'High': 'warning',
    'Critical': 'danger',
  }
  return colorMap[priority] || 'primary'
}

const getTypeColor = (type) => {
  const colorMap = {
    'Bug': 'danger',
    'Feature Request': 'info',
    'Discussion': 'success',
    'Improvement': 'primary',
    'Memo': 'warning',
  }
  return colorMap[type] || 'primary'
}

const toTranslationKey = (text) => {
  if (!text) return ''
  
  // 特殊处理 Feature Request
  if (text === 'Feature Request') {
    return 'featureRequest'
  }
  
  return text
    .split(' ')
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')
}

const IssueTable = ({ 
  data, 
  loading, 
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDetailClick,
}) => {
  const navigate = useNavigate()
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
          {['标题', '状态', '优先级', '报告人', '处理人'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">操作</th>
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
              <Tooltip title={item.title}>
                <div style={{ 
                  maxWidth: '400px',
                  minWidth: '200px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                  margin: '0'
                }}>
                  <small style={{ color: '#666', marginRight: '8px' }}>#{item.id}</small>
                  <CBadge color={getTypeColor(item.type)} style={{ marginRight: '8px' }}>
                    {t(toTranslationKey(item.type))}
                  </CBadge>
                  <span style={{ fontWeight: 500 }}>{item.title}</span>
                </div>
              </Tooltip>
            </td>
            <td>
              <CBadge color={getStatusColor(item.status)}>
                {t(toTranslationKey(item.status))}
              </CBadge>
            </td>
            <td>
              <CBadge color={getPriorityColor(item.priority)}>
                {t(toTranslationKey(item.priority))}
              </CBadge>
            </td>
            <td>
              {item.reporterInfo ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    size={16} 
                    src={item.reporterInfo.avatar} 
                    icon={<UserOutlined />}
                    style={{ marginRight: 4 }}
                  />
                  <span>{item.reporterInfo.username}</span>
                </div>
              ) : '-'}
            </td>
            <td>
              {item.assigneeInfo ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    size={16} 
                    src={item.assigneeInfo.avatar} 
                    icon={<UserOutlined />}
                    style={{ marginRight: 4 }}
                  />
                  <span>{item.assigneeInfo.username}</span>
                </div>
              ) : '-'}
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('update')}
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                {t('detail')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default IssueTable 