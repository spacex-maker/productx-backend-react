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
          {['ID', '标题', '类型', '状态', '优先级', '报告人', '处理人', '操作'].map((field) => (
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
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">
              <div style={{ fontWeight: 500 }}>{item.title}</div>
              <small style={{ color: '#666' }}>#{item.id}</small>
            </td>
            <td>
              <CBadge color={getTypeColor(item.type)}>
                {item.type}
              </CBadge>
            </td>
            <td>
              <CBadge color={getStatusColor(item.status)}>
                {item.status === 'Open' ? '待处理' :
                 item.status === 'In Progress' ? '处理中' :
                 item.status === 'Resolved' ? '已解决' :
                 item.status === 'Closed' ? '已关闭' :
                 item.status === 'Reopened' ? '重新打开' : item.status}
              </CBadge>
            </td>
            <td>
              <CBadge color={getPriorityColor(item.priority)}>
                {item.priority === 'Low' ? '低优先级' :
                 item.priority === 'Medium' ? '中优先级' :
                 item.priority === 'High' ? '高优先级' :
                 item.priority === 'Critical' ? '紧急' : item.priority}
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