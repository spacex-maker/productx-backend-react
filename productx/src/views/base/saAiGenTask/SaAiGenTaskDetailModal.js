import React, { useState, useEffect, useMemo } from 'react'
import api from 'src/axiosInstance'
import { Modal, Image, Spin, Tag, Space, Collapse, Typography, theme, Avatar, Card, Row, Col } from 'antd'

const { Text } = Typography

const MAX_PREVIEW_IMAGES = 12

const addImageCompressSuffix = (url, width = 400) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
}

const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  const path = url.split('?')[0].toLowerCase()
  return /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(path)
}

const STATUS_MAP = { 0: '排队', 1: '进行中', 2: '成功', 3: '失败', 4: '超时' }
const BILLING_MAP = { 0: '未扣费', 1: '已扣费', 2: '已退款' }

const parseJsonUrls = (str) => {
  if (!str) return []
  try {
    const arr = typeof str === 'string' ? JSON.parse(str) : str
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const InfoRow = ({ label, children, span = 1 }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '6px 0',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
  }}>
    <span style={{ flex: '0 0 90px', color: 'var(--ant-color-text-secondary)', fontSize: 13 }}>{label}</span>
    <span style={{ flex: 1, fontSize: 13 }}>{children ?? '-'}</span>
  </div>
)

const SectionCard = ({ title, children, style = {} }) => (
  <Card
    size="small"
    title={title}
    style={{
      marginBottom: 16,
      borderRadius: 10,
      overflow: 'hidden',
      ...style,
    }}
    styles={{
      header: { fontSize: 14, fontWeight: 600, padding: '12px 16px' },
      body: { padding: '8px 16px 16px' },
    }}
  >
    {children}
  </Card>
)

const SaAiGenTaskDetailModal = ({ visible, taskId, onClose, t }) => {
  const { token } = theme.useToken()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible || !taskId) {
      setDetail(null)
      return
    }
    setLoading(true)
    api.get(`/manage/sa-ai-gen-task/${taskId}/detail`)
      .then((res) => setDetail(res))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [visible, taskId])

  const outputUrls = (() => {
    if (detail?.outputFiles?.length) {
      return detail.outputFiles.map((f) => f.fileUrl).filter(Boolean)
    }
    return parseJsonUrls(detail?.resultUrls) || []
  })()
  const inputUrls = parseJsonUrls(detail?.inputUrls) || []

  const blockStyle = {
    background: token.colorFillTertiary,
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.6,
    maxHeight: 120,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }

  return (
    <Modal
      title={
        <span style={{ fontSize: 16, fontWeight: 600 }}>{t('任务详情')}</span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={820}
      destroyOnClose
      styles={{
        body: { padding: '20px 24px', maxHeight: '75vh', overflowY: 'auto' },
        header: { paddingBottom: 12 },
      }}
    >
      <Spin spinning={loading}>
        {detail && (
          <div style={{ fontSize: 13 }}>
            {/* 概览：任务 + 用户 + 状态 */}
            <SectionCard title={t('基本信息')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <div>
                  <InfoRow label={t('任务ID')}>{detail.id}</InfoRow>
                  <InfoRow label={t('任务类型')}>
                    <Tag color="blue">{detail.taskType || '-'}</Tag>
                  </InfoRow>
                  <InfoRow label={t('状态')}>
                    <Tag color={detail.status === 2 ? 'success' : detail.status === 3 ? 'error' : 'default'}>
                      {STATUS_MAP[detail.status] ?? detail.status}
                    </Tag>
                  </InfoRow>
                  <InfoRow label={t('输入类型')}>{detail.inputType || '-'}</InfoRow>
                  <InfoRow label={t('输出类型')}>{detail.outputType || '-'}</InfoRow>
                </div>
                <div>
                  <InfoRow label={t('用户')}>
                    {(detail.userAvatar != null || detail.userNickname != null || detail.userName != null) ? (
                      <Space size="small">
                        <Avatar src={detail.userAvatar} size={28}>
                          {detail.userNickname?.[0] || detail.userName?.[0] || '-'}
                        </Avatar>
                        <span>{detail.userNickname || detail.userName || detail.userId}</span>
                        {detail.userName && detail.userNickname && detail.userName !== detail.userNickname && (
                          <Text type="secondary" style={{ fontSize: 12 }}>({detail.userName})</Text>
                        )}
                      </Space>
                    ) : (
                      detail.userId ?? '-'
                    )}
                  </InfoRow>
                  <InfoRow label={t('创建时间')}>{detail.createTime || '-'}</InfoRow>
                  <InfoRow label={t('开始时间')}>{detail.startTime || '-'}</InfoRow>
                  <InfoRow label={t('结束时间')}>{detail.endTime || '-'}</InfoRow>
                  <InfoRow label={t('供应商')}>{detail.provider || '-'}</InfoRow>
                  <InfoRow label={t('第三方任务ID')}>{detail.thirdPartyId || '-'}</InfoRow>
                </div>
              </div>
            </SectionCard>

            {/* 提示词 */}
            <SectionCard title={t('提示词')}>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>{t('中文/原文')}</Text>
                <div style={blockStyle}>{detail.prompt || '-'}</div>
              </div>
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>{t('英文')}</Text>
                <div style={blockStyle}>{detail.enPrompt || '-'}</div>
              </div>
            </SectionCard>

            {/* 模型与参数 */}
            <SectionCard title={t('模型与参数')}>
              <Row gutter={[0, 0]}>
                <Col span={12}><InfoRow label={t('模型名称')}>{detail.modelName || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('模型代码')}>{detail.modelCode || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('LoRA名称')}>{detail.loraModelName || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('LoRA代码')}>{detail.loraModelCode || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('模型版本')}>{detail.version || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('随机种子')}>{detail.seed ?? '-'}</InfoRow></Col>
              </Row>
            </SectionCard>

            {/* 计费与执行 */}
            <SectionCard title={t('计费与执行')}>
              <Row gutter={[0, 0]}>
                <Col span={12}><InfoRow label={t('消耗积分')}>{detail.creditsCost ?? 0}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('计费状态')}>{BILLING_MAP[detail.billingStatus] ?? detail.billingStatus ?? '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('耗时(ms)')}>{detail.durationMs ?? '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('执行节点')}>{detail.workerNode || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('GPU型号')}>{detail.gpuType || '-'}</InfoRow></Col>
                <Col span={12}><InfoRow label={t('队列')}>{detail.queueName || '-'}</InfoRow></Col>
              </Row>
            </SectionCard>

            {(detail.errorCode || detail.errorMessage) && (
              <SectionCard title={t('错误信息')} style={{ borderColor: token.colorErrorBorder }}>
                {detail.errorCode && <InfoRow label={t('错误码')}>{detail.errorCode}</InfoRow>}
                {detail.errorMessage && <InfoRow label={t('错误信息')}>{detail.errorMessage}</InfoRow>}
              </SectionCard>
            )}

            {inputUrls.length > 0 && (
              <SectionCard title={t('输入资源')}>
                <Image.PreviewGroup>
                  <Space wrap size={12}>
                    {inputUrls.map((url, i) =>
                      isVideoUrl(url) ? (
                        <video
                          key={i}
                          src={url}
                          controls
                          width={120}
                          style={{ maxHeight: 120, objectFit: 'contain', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        />
                      ) : (
                        <Image
                          key={i}
                          src={addImageCompressSuffix(url, 200)}
                          width={88}
                          height={88}
                          style={{ objectFit: 'cover', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        />
                      )
                    )}
                  </Space>
                </Image.PreviewGroup>
              </SectionCard>
            )}

            {outputUrls.length > 0 && (
              <SectionCard title={t('输出结果')}>
                <Image.PreviewGroup>
                  <Space wrap size={12}>
                    {outputUrls.map((url, i) =>
                      isVideoUrl(url) ? (
                        <video
                          key={i}
                          src={url}
                          controls
                          width={180}
                          style={{ maxHeight: 180, objectFit: 'contain', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        />
                      ) : (
                        <Image
                          key={i}
                          src={addImageCompressSuffix(url, 200)}
                          width={110}
                          height={110}
                          style={{ objectFit: 'cover', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        />
                      )
                    )}
                  </Space>
                </Image.PreviewGroup>
              </SectionCard>
            )}

            {detail.metadata && (
              <SectionCard title={t('扩展信息 (metadata)')}>
                <Collapse
                  size="small"
                  ghost
                  items={[
                    {
                      key: '1',
                      label: t('查看 JSON'),
                      children: (
                        <pre style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: 1.5,
                          maxHeight: 180,
                          overflow: 'auto',
                          background: token.colorFillTertiary,
                          padding: 12,
                          borderRadius: 8,
                        }}>
                          {(() => {
                            let str = detail.metadata
                            if (typeof str === 'string') {
                              try {
                                str = JSON.stringify(JSON.parse(str), null, 2)
                              } catch { /* 非 JSON 则原样 */ }
                            } else if (str != null) {
                              str = JSON.stringify(str, null, 2)
                            }
                            return str ?? '-'
                          })()}
                        </pre>
                      ),
                    },
                  ]}
                />
              </SectionCard>
            )}
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default SaAiGenTaskDetailModal
