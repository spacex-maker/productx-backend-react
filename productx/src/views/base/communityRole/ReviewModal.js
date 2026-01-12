import React, { useEffect } from 'react'
import { Modal, Form, Input, Radio, DatePicker, Row, Col, Descriptions, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import DefaultAvatar from 'src/components/DefaultAvatar'

const { TextArea } = Input

const ReviewModal = ({ visible, application, onCancel, onSubmit }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && application) {
      form.resetFields()
      // 如果已经审核过，设置为只读模式
      if (application.status !== 0) {
        form.setFieldsValue({
          status: application.status,
          reviewComment: application.reviewComment,
        })
      }
    }
  }, [visible, application, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // 格式化日期
      if (values.expiredTime) {
        values.expiredTime = dayjs(values.expiredTime).format('YYYY-MM-DD HH:mm:ss')
      }
      onSubmit(values)
    })
  }

  const getStatusTag = (status) => {
    const statusConfig = {
      0: { color: 'processing', text: t('待审核') },
      1: { color: 'success', text: t('审核通过') },
      2: { color: 'error', text: t('审核拒绝') },
      3: { color: 'default', text: t('已撤回') },
    }
    const config = statusConfig[status] || { color: 'default', text: t('未知') }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const isPending = application?.status === 0
  const isApproved = application?.status === 1

  return (
    <Modal
      title={isPending ? t('审核申请') : t('查看申请详情')}
      open={visible}
      onCancel={onCancel}
      onOk={isPending ? handleSubmit : onCancel}
      okText={isPending ? t('提交审核') : t('关闭')}
      cancelText={t('取消')}
      width={800}
      cancelButtonProps={{ style: isPending ? {} : { display: 'none' } }}
    >
      {application && (
        <>
          {/* 申请信息 */}
          <Descriptions title={t('申请信息')} bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label={t('申请人')} span={2}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DefaultAvatar src={application.avatar} size={40} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {application.nickname || application.username}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    ID: {application.userId} | {application.username}
                  </div>
                </div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t('申请角色')} span={2}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{application.roleName}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  角色码: {application.roleCode}
                </div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t('申请理由')} span={2}>
              {application.applyReason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('经验描述')} span={2}>
              {application.experienceDescription || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('联系方式')} span={2}>
              {application.contactInfo || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('申请时间')}>
              {application.createTime}
            </Descriptions.Item>
            <Descriptions.Item label={t('当前状态')}>
              {getStatusTag(application.status)}
            </Descriptions.Item>
            {!isPending && (
              <>
                <Descriptions.Item label={t('审核人')}>
                  {application.reviewerUsername || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('审核时间')}>
                  {application.reviewTime || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('审核意见')} span={2}>
                  {application.reviewComment || '-'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>

          {/* 审核表单（仅待审核状态显示） */}
          {isPending && (
            <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
              <Form.Item
                name="status"
                label={t('审核结果')}
                rules={[{ required: true, message: t('请选择审核结果') }]}
              >
                <Radio.Group>
                  <Radio value={1}>{t('通过')}</Radio>
                  <Radio value={2}>{t('拒绝')}</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}>
                {({ getFieldValue }) =>
                  getFieldValue('status') === 1 ? (
                    <Form.Item name="expiredTime" label={t('角色过期时间（留空表示永久有效）')}>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={t('选择过期时间')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                name="reviewComment"
                label={t('审核意见')}
                rules={[{ required: true, message: t('请填写审核意见') }]}
              >
                <TextArea rows={4} placeholder={t('请输入审核意见')} />
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </Modal>
  )
}

export default ReviewModal

