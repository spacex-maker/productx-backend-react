import React, { useState, useEffect } from 'react'
import { List, Avatar, Form, Button, Input, message } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const { TextArea } = Input

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
        <Form.Item
          name="comment"
          rules={[{ required: true, message: t('required') }]}
        >
          <TextArea
            maxLength={2000}
            placeholder={t('enterComment')}
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ marginBottom: 8 }}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 24, textAlign: 'right' }}>
          <span style={{ marginRight: 8, color: '#999' }}>
            {Form.useWatch('comment', form)?.length || 0}/2000
          </span>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            icon={<SendOutlined />}
            size="small"
          >
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>

      <List
        loading={loading}
        dataSource={comments}
        pagination={{
          current,
          pageSize,
          total,
          onChange: handlePageChange,
          size: 'small'
        }}
        renderItem={item => (
          <List.Item style={{ padding: '8px 0' }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={item.commenterInfo?.avatar}
                />
              }
              title={
                <div style={{ fontSize: 12 }}>
                  <span style={{ fontWeight: 500, marginRight: 8 }}>
                    {item.commenter}
                  </span>
                  <span style={{ color: '#999' }}>
                    {dayjs(item.createTime).format('MM-DD HH:mm')}
                  </span>
                </div>
              }
              description={
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {item.commentText}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default IssueComments
