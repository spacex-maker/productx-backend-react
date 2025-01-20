import React from 'react'
import { Modal, Descriptions, Tag, Avatar, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import IssueComments from './IssueComments'
import { useTranslation } from 'react-i18next'
import { UserOutlined } from '@ant-design/icons'

const { Title } = Typography

const IssueDetailModal = ({ visible, issue, onCancel }) => {
  const { t } = useTranslation()

  if (!issue) return null

  const getTypeColor = (type) => {
    const colorMap = {
      'Bug': 'error',
      'Feature Request': 'processing',
      'Discussion': 'warning',
      'Improvement': 'success',
      'Memo': 'default'
    }
    return colorMap[type] || 'default'
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'Open': 'blue',
      'In Progress': 'orange',
      'Resolved': 'green',
      'Closed': 'default',
      'Reopened': 'red',
    }
    return colorMap[status] || 'default'
  }

  const getPriorityColor = (priority) => {
    const colorMap = {
      'Low': 'success',
      'Medium': 'processing',
      'High': 'warning',
      'Critical': 'error',
    }
    return colorMap[priority] || 'default'
  }

  const toTranslationKey = (text) => {
    if (!text) return ''

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

  const tags = Array.isArray(issue.tags) ? issue.tags : [];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={getTypeColor(issue.type)}>
            {t(toTranslationKey(issue.type))}
          </Tag>
          <span>{issue.title}</span>
          <Tag>#{issue.id}</Tag>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label={t('status')}>
          <Tag color={getStatusColor(issue.status)}>
            {t(toTranslationKey(issue.status))}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('priority')}>
          <Tag color={getPriorityColor(issue.priority)}>
            {t(toTranslationKey(issue.priority))}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('reporter')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar  src={issue.reporterInfo?.avatar} icon={<UserOutlined />} />
            <span>{issue.reporterInfo?.username}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t('assignee')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar  src={issue.assigneeInfo?.avatar} icon={<UserOutlined />} />
            <span>{issue.assigneeInfo?.username}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t('createTime')} span={2}>
          {dayjs(issue.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label={t('tags')} span={2}>
          {tags.length > 0 ? tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          )) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label={t('description')} span={2}>
          <div style={{ whiteSpace: 'pre-wrap', minHeight: 50 }}>
            {issue.description || '-'}
          </div>
        </Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ margin: '24px 0 16px' }}>{t('issueTimeline')}</Title>
      <Timeline style={{ marginBottom: 24 }}>
        {issue.timeline?.map((item, index) => (
          <Timeline.Item key={index}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>{item.action}</span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>

      <Title level={5} style={{ margin: '24px 0 16px' }}>{t('comments')}</Title>
      <IssueComments issueId={issue?.id} />
    </Modal>
  )
}

export default IssueDetailModal
