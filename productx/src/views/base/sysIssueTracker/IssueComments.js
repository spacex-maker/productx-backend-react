import React, { useState, useEffect } from 'react'
import { List, Avatar, Form, Button, Input, message } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'
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

const CommentEditor = styled.div`
  margin-bottom: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
`

const EditorContent = styled.div`
  .ant-input {
    border: none !important;
    box-shadow: none !important;
    font-size: 10px !important;
    padding: 8px !important;
    background: transparent !important;
    resize: vertical !important;
    min-height: 60px !important;
    max-height: 200px !important;

    &:focus {
      box-shadow: none !important;
    }

    &::placeholder {
      color: #bfbfbf !important;
      font-size: 10px !important;
    }
  }
`

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .counter {
    font-size: 9px;
    color: #999;
  }
`

const SubmitButton = styled(Button)`
  font-size: 10px !important;
  height: 22px !important;
  padding: 0 8px !important;
  border-radius: 2px !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;

  .anticon {
    font-size: 10px !important;
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
          currentPage: page,
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
    <div>
      <Form form={form}>
        <CommentEditor>
          <EditorContent>
            <Form.Item
              name="comment"
              rules={[{ required: true, message: t('required') }]}
              style={{ marginBottom: 0 }}
            >
              <TextArea
                maxLength={2000}
                placeholder={t('enterComment')}
                autoSize={{ minRows: 3, maxRows: 8 }}
              />
            </Form.Item>
          </EditorContent>
          <EditorFooter>
            <span className="counter">
              {Form.useWatch('comment', form)?.length || 0}/2000
            </span>
            <SubmitButton
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              icon={<SendOutlined />}
            >
              {t('submit')}
            </SubmitButton>
          </EditorFooter>
        </CommentEditor>
      </Form>

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
                src={item.commenterInfo?.avatar}
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
    </div>
  )
}

export default IssueComments
