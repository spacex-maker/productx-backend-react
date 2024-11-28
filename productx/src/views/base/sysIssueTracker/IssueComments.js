import React, { useState, useEffect } from 'react'
import { List, Avatar, Form, Button, Input, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import api from 'src/axiosInstance'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const { TextArea } = Input

const StyledListItem = styled(List.Item)`
  padding: 4px 0 !important;

  .comment-content {
    font-size: 10px;
    line-height: 1.4;
    margin-top: 2px;
  }

  .comment-meta {
    font-size: 10px;
    color: #8c8c8c;
    line-height: 1;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
  }

  .comment-author {
    margin-right: 8px;
    font-weight: 500;
    color: #333;
  }

  .comment-time {
    color: #999;
    font-size: 9px;
  }
`

const StyledList = styled(List)`
  .ant-list-pagination {
    margin-top: 8px;
    text-align: right;

    .ant-pagination-item,
    .ant-pagination-prev,
    .ant-pagination-next {
      min-width: 24px;
      height: 24px;
      line-height: 22px;

      a {
        font-size: 10px;
      }
    }
  }
`

const CommentForm = styled(Form)`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .ant-form-item {
    margin-bottom: 4px;
  }

  .comment-input-wrapper {
    flex: 1;
    max-width: 500px;
  }

  .ant-input {
    font-size: 10px;
    padding: 4px 8px;
    resize: none;
    color: rgba(0, 0, 0, 0.85) !important;

    &::placeholder {
      color: #bfbfbf;
    }
  }

  .ant-btn {
    font-size: 10px;
    height: 22px;
    padding: 0 8px;
    margin-top: 1px;
  }

  .ant-form-item-explain {
    font-size: 10px;
    min-height: 16px;
    padding-top: 2px;
  }
`

const CommentWrapper = styled.div`
  .ant-avatar {
    width: 20px;
    height: 20px;
    line-height: 20px;

    .anticon {
      font-size: 12px;
    }
  }
`

const IssueComments = ({ issueId }) => {
  const { t } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchComments = async (page = 1) => {
    setLoading(true)
    try {
      const response = await api.get('/manage/sys-issue-comments/page-by-issueId', {
        params: {
          current: page,
          size: pageSize,
          issueId
        }
      })
      setComments(response.records || [])
      setTotal(response.total)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      message.error(t('comments.fetchFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (issueId) {
      fetchComments()
    }
  }, [issueId])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      await api.post('/manage/sys-issue-comments/create', {
        issueId,
        commentText: values.comment,
        parentId: values.parentId
      })

      message.success(t('submitSuccess'))
      form.resetFields()
      fetchComments()
    } catch (error) {
      console.error('Failed to submit comment:', error)
      message.error(t('submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrent(page)
    fetchComments(page)
  }

  return (
    <CommentWrapper>
      <CommentForm form={form}>
        <div className="comment-input-wrapper">
          <Form.Item
            name="comment"
            rules={[{ required: true, message: t('required') }]}
            style={{ marginBottom: 0 }}
          >
            <TextArea
              rows={2}
              maxLength={500}
              showCount={{
                formatter: ({ count, maxLength }) => (
                  <span style={{ fontSize: '9px', color: '#999' }}>{count}/{maxLength}</span>
                )
              }}
            />
          </Form.Item>
        </div>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            size="small"
          >
            {t('submit')}
          </Button>
        </Form.Item>
      </CommentForm>

      <StyledList
        loading={loading}
        dataSource={comments}
        pagination={{
          current,
          pageSize,
          total,
          onChange: handlePageChange,
          size: 'small',
          simple: true
        }}
        renderItem={item => (
          <StyledListItem>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                size={20}
                icon={<UserOutlined />}
                src={item.commenterInfo.avatar}
                style={{ flexShrink: 0 }}
              />
              <div style={{ marginLeft: 6, flex: 1, overflow: 'hidden' }}>
                <div className="comment-meta">
                  <span className="comment-author">{item.commenter}</span>
                  <span className="comment-time">
                    {dayjs(item.createTime).format('MM-DD HH:mm')}
                  </span>
                </div>
                <div className="comment-content">
                  {item.commentText}
                </div>
              </div>
            </div>
          </StyledListItem>
        )}
      />
    </CommentWrapper>
  )
}

export default IssueComments
