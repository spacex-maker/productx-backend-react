import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Radio, Descriptions, Tag, Image, Spin, message, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import DefaultAvatar from 'src/components/DefaultAvatar'
import api from 'src/axiosInstance'

const { TextArea } = Input

const KYC_STATUS_MAP = {
  0: { color: 'default', text: '未认证' },
  1: { color: 'processing', text: '审核中' },
  2: { color: 'success', text: '已通过' },
  3: { color: 'error', text: '审核失败' },
  4: { color: 'warning', text: '需重新认证' },
  5: { color: 'processing', text: '解绑审核中' },
  6: { color: 'warning', text: '解绑未通过' },
}

const ID_TYPE_MAP = {
  CHINA_ID_CARD: '中国身份证',
  PASSPORT: '护照',
  HK_ID_CARD: '香港身份证',
  OTHER: '其他证件',
}

/** 常见实名认证拒绝原因，供管理员快捷选择 */
const KYC_REJECT_REASON_PRESETS = [
  '证件照片模糊，无法辨认信息，请重新上传清晰照片',
  '证件信息与填写的姓名不一致，请核对后重新提交',
  '证件已过期，请使用有效证件重新认证',
  '证件照片不完整，请上传完整的证件正反面',
  '证件存在遮挡、反光或裁剪，请重新拍摄上传',
  '非本人证件，请勿使用他人证件进行认证',
  '提交的证件类型与所选国家/地区不符',
  '疑似伪造或篡改证件，无法通过审核',
  '手持证件照不符合要求，请按要求重新拍摄',
  '未满法定年龄，暂不支持实名认证',
]

const UserKycReviewModal = ({ visible, user, onCancel, onSuccess }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!visible || !user?.id) {
      setDetail(null)
      form.resetFields()
      return
    }

    const fetchDetail = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/manage/user/kyc/${user.id}`)
        setDetail(response || null)
        form.resetFields()
        if (response?.kycStatus === 1 || response?.kycStatus === 5) {
          form.setFieldsValue({ status: 2 })
        }
      } catch (error) {
        message.error(error?.response?.data?.message || '加载实名认证信息失败')
        setDetail(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [visible, user, form])

  const isPending = detail?.kycStatus === 1 || detail?.kycStatus === 5
  const isUnbind = detail?.requestType === 'UNBIND'

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        await api.post('/manage/user/kyc/review', {
          userId: user.id,
          status: values.status,
          rejectReason: values.rejectReason,
        })
        message.success('审核成功')
        onSuccess?.()
      } catch (error) {
        message.error(error?.response?.data?.message || '审核失败')
      }
    })
  }

  const handlePresetReasonClick = (reason) => {
    form.setFieldsValue({ rejectReason: reason })
  }

  const statusConfig = KYC_STATUS_MAP[detail?.kycStatus] || { color: 'default', text: '未知' }

  return (
    <Modal
      title={isPending ? (isUnbind ? '实名解绑审核' : '实名认证审核') : '实名认证详情'}
      open={visible}
      onCancel={onCancel}
      onOk={isPending ? handleSubmit : onCancel}
      okText={isPending ? '提交' : '关闭'}
      cancelText={t('cancel') || '取消'}
      width={860}
      cancelButtonProps={{ style: isPending ? {} : { display: 'none' } }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {detail ? (
          <>
            <Descriptions title="用户信息" bordered column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="用户" span={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {detail.avatar ? (
                    <img
                      src={detail.avatar}
                      alt=""
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <DefaultAvatar name={detail.username} size={40} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>{detail.nickname || detail.username}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      ID: {detail.userId} | {detail.username}
                    </div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="实名状态">
                <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="认证国家">{detail.countryCode || detail.kycCountry || '—'}</Descriptions.Item>
            </Descriptions>

            {(detail.fullName || detail.idNumber || detail.idFrontPhoto || detail.reason) && (
              <Descriptions title={isUnbind ? '解绑申请资料' : '认证资料'} bordered column={2} style={{ marginBottom: 20 }}>
                {isUnbind ? (
                  <Descriptions.Item label="解绑原因" span={2}>
                    {detail.reason || detail.fullName || '—'}
                  </Descriptions.Item>
                ) : (
                  <>
                    <Descriptions.Item label="真实姓名">{detail.fullName || '—'}</Descriptions.Item>
                    <Descriptions.Item label="证件类型">
                      {ID_TYPE_MAP[detail.idType] || detail.idType || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="证件号码" span={2}>
                      {detail.idNumber || '—'}
                    </Descriptions.Item>
                  </>
                )}
                <Descriptions.Item label="提交时间">{detail.submittedAt || '—'}</Descriptions.Item>
                <Descriptions.Item label="审核通过时间">{detail.verifiedAt || '—'}</Descriptions.Item>
                {detail.rejectReason ? (
                  <Descriptions.Item label="拒绝原因" span={2}>
                    {detail.rejectReason}
                  </Descriptions.Item>
                ) : null}
                {!isUnbind ? (
                  <>
                    <Descriptions.Item label="证件正面" span={1}>
                      {detail.idFrontPhoto ? (
                        <Image src={detail.idFrontPhoto} width={160} style={{ borderRadius: 8 }} />
                      ) : (
                        '—'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="证件反面" span={1}>
                      {detail.idBackPhoto ? (
                        <Image src={detail.idBackPhoto} width={160} style={{ borderRadius: 8 }} />
                      ) : (
                        '—'
                      )}
                    </Descriptions.Item>
                  </>
                ) : null}
              </Descriptions>
            )}

            {isPending ? (
              <Form form={form} layout="vertical" initialValues={{ status: 2 }}>
                <Form.Item
                  name="status"
                  label="审核结果"
                  rules={[{ required: true, message: '请选择审核结果' }]}
                >
                  <Radio.Group>
                    <Radio value={2}>通过</Radio>
                    <Radio value={3}>拒绝</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.status !== curr.status}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('status') === 3 ? (
                      <>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                            常见原因（点击填入）
                          </div>
                          <Space wrap size={[6, 6]}>
                            {KYC_REJECT_REASON_PRESETS.map((reason) => (
                              <Tag
                                key={reason}
                                style={{ cursor: 'pointer', margin: 0, whiteSpace: 'normal', lineHeight: 1.5 }}
                                onClick={() => handlePresetReasonClick(reason)}
                              >
                                {reason}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                        <Form.Item
                          name="rejectReason"
                          label="拒绝原因"
                          rules={[{ required: true, message: '请填写拒绝原因' }]}
                        >
                          <TextArea rows={3} placeholder="请输入或点击上方常见原因，将展示给用户" />
                        </Form.Item>
                      </>
                    ) : null
                  }
                </Form.Item>
              </Form>
            ) : null}

            {!isPending && detail.kycStatus === 0 ? (
              <div style={{ color: '#888' }}>该用户尚未提交实名认证资料。</div>
            ) : null}
          </>
        ) : (
          !loading && <div style={{ color: '#888' }}>暂无实名认证信息</div>
        )}
      </Spin>
    </Modal>
  )
}

export default UserKycReviewModal
