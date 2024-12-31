import React from 'react'
import { Modal, Descriptions, Tag, Avatar, Timeline, Button } from 'antd'
import dayjs from 'dayjs'
import styled from 'styled-components'
import IssueComments from './IssueComments'
import { useTranslation } from 'react-i18next'

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    width: 60px;
    font-weight: 500;
    padding: 4px 8px !important;
    font-size: 10px;
  }
  .ant-descriptions-item-content {
    padding: 4px 8px !important;
    font-size: 10px;
  }
  .ant-descriptions-row > th,
  .ant-descriptions-row > td {
    padding-bottom: 4px !important;
  }
  .ant-tag {
    font-size: 10px;
    line-height: 16px;
    padding: 0 4px;
    margin-right: 4px;
  }
`

const StyledTimeline = styled(Timeline)`
  margin-top: 4px !important;

  .ant-timeline-item {
    padding-bottom: 8px;

    &-content {
      font-size: 10px;

      p {
        margin-bottom: 1px;
      }

      small {
        color: #999;
      }
    }
  }
`

const SectionTitle = styled.h4`
  font-size: 11px;
  margin: 8px 0 4px 0;
  font-weight: 500;
  color: #666;
`

const IssueDetailModal = ({ visible, issue, onCancel }) => {
  const { t } = useTranslation()

  if (!issue) return null

  const getStatusColor = (status) => {
    const colorMap = {
      'Open': 'blue',
      'In Progress': 'orange',
      'Resolved': 'green',
      'Closed': 'gray',
      'Reopened': 'red',
    }
    return colorMap[status] || 'default'
  }

  const getPriorityColor = (priority) => {
    const colorMap = {
      'Low': 'green',
      'Medium': 'blue',
      'High': 'orange',
      'Critical': 'red',
    }
    return colorMap[priority] || 'default'
  }

  const tags = Array.isArray(issue.tags) ? issue.tags : [];

  return (
    <Modal
      title={<span style={{ fontSize: '12px' }}>问题详情</span>}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={null}
      bodyStyle={{ padding: '8px 12px' }}
    >
      <StyledDescriptions column={2} bordered size="small">
        <Descriptions.Item label="标题" span={2}>
          <span style={{ fontWeight: 500 }}>{issue.title}</span>
        </Descriptions.Item>
        <Descriptions.Item label="编号">
          #{issue.id}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {dayjs(issue.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={getStatusColor(issue.status)} style={{ margin: 0 }}>
            {issue.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="优先级">
          <Tag color={getPriorityColor(issue.priority)} style={{ margin: 0 }}>
            {issue.priority}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="类型" span={2}>
          {issue.type}
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={2}>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="报告人">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={16} src={issue.reporterInfo?.avatar} />
            <span style={{ marginLeft: 4, fontSize: '10px' }}>{issue.reporterInfo?.username}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="处理人">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={16} src={issue.assigneeInfo?.avatar} />
            <span style={{ marginLeft: 4, fontSize: '10px' }}>{issue.assigneeInfo?.username}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          <div style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{issue.description}</div>
        </Descriptions.Item>
      </StyledDescriptions>

      <SectionTitle>问题时间线</SectionTitle>
      <StyledTimeline>
        {issue.timeline?.map((item, index) => (
          <Timeline.Item key={index}>
            <p>{item.action}</p>
            <small>{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</small>
          </Timeline.Item>
        ))}
      </StyledTimeline>

      <SectionTitle>{t('评论')}</SectionTitle>
      <IssueComments issueId={issue?.id} />
    </Modal>
  )
}

export default IssueDetailModal
