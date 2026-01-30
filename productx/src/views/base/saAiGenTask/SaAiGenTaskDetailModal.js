import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Descriptions, Image, Spin, Tag, Space, Divider, Collapse, Typography, theme, Avatar } from 'antd'

const { Text } = Typography

const addImageCompressSuffix = (url, width = 400) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
}

/** 根据 URL 判断是否为视频文件（用 video 标签展示，不加图片压缩） */
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

const boxStyle = (bg) => ({
  background: bg,
  padding: 8,
  borderRadius: 4,
  maxHeight: 100,
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: 12,
})
const sectionDividerStyle = { margin: '8px 0 6px' }
const sectionBlockStyle = { marginBottom: 10 }

const SaAiGenTaskDetailModal = ({ visible, taskId, onClose, t }) => {
  const { token } = theme.useToken()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const promptBg = token.colorFillTertiary

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

  return (
    <Modal
      title={t('任务详情')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={780}
      destroyOnClose
      styles={{ body: { paddingTop: 8, maxHeight: '70vh', overflowY: 'auto' } }}
    >
      <Spin spinning={loading}>
        {detail && (
          <div style={{ fontSize: 12 }}>
            <Descriptions column={2} bordered size="small" column={{ xs: 1, sm: 2 }} labelStyle={{ paddingBlock: 4, paddingInline: 8 }} contentStyle={{ paddingBlock: 4, paddingInline: 8 }}>
              <Descriptions.Item label={t('任务ID')}>{detail.id}</Descriptions.Item>
              <Descriptions.Item label={t('用户')}>
                {(detail.userAvatar != null || detail.userNickname != null || detail.userName != null) ? (
                  <Space>
                    <Avatar src={detail.userAvatar} size="small">{detail.userNickname?.[0] || detail.userName?.[0] || '-'}</Avatar>
                    <span>{detail.userNickname || detail.userName || detail.userId}</span>
                    {detail.userName && detail.userNickname && detail.userName !== detail.userNickname && (
                      <Text type="secondary" style={{ fontSize: 12 }}>({detail.userName})</Text>
                    )}
                  </Space>
                ) : (
                  detail.userId ?? '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('任务类型')}>
                <Tag color="blue">{detail.taskType || '-'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('状态')}>
                <Tag color={detail.status === 2 ? 'green' : detail.status === 3 ? 'red' : 'default'}>
                  {STATUS_MAP[detail.status] ?? detail.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('输入类型')}>{detail.inputType || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('输出类型')}>{detail.outputType || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('创建时间')} span={2}>{detail.createTime || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('开始时间')}>{detail.startTime || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('结束时间')}>{detail.endTime || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('第三方任务ID')}>{detail.thirdPartyId || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('供应商')}>{detail.provider || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" style={sectionDividerStyle}>{t('提示词')}</Divider>
            <div style={sectionBlockStyle}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: 12 }}>{t('中文/原文')}</div>
              <div style={{ ...boxStyle(promptBg), wordBreak: 'break-word' }}>
                {detail.prompt || '-'}
              </div>
            </div>
            <div style={sectionBlockStyle}>
              <div style={{ marginBottom: 4, fontWeight: 500, fontSize: 12 }}>{t('英文')}</div>
              <div style={{ ...boxStyle(promptBg), wordBreak: 'break-word' }}>
                {detail.enPrompt || '-'}
              </div>
            </div>

            <Divider orientation="left" style={sectionDividerStyle}>{t('模型与参数')}</Divider>
            <Descriptions column={2} bordered size="small" labelStyle={{ paddingBlock: 4, paddingInline: 8 }} contentStyle={{ paddingBlock: 4, paddingInline: 8 }}>
              <Descriptions.Item label={t('模型名称')}>{detail.modelName || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('模型代码')}>{detail.modelCode || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('LoRA名称')}>{detail.loraModelName || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('LoRA代码')}>{detail.loraModelCode || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('模型版本')}>{detail.version || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('随机种子')}>{detail.seed ?? '-'}</Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" style={sectionDividerStyle}>{t('计费与执行')}</Divider>
            <Descriptions column={2} bordered size="small" labelStyle={{ paddingBlock: 4, paddingInline: 8 }} contentStyle={{ paddingBlock: 4, paddingInline: 8 }}>
              <Descriptions.Item label={t('消耗积分')}>{detail.creditsCost ?? 0}</Descriptions.Item>
              <Descriptions.Item label={t('计费状态')}>{BILLING_MAP[detail.billingStatus] ?? detail.billingStatus ?? '-'}</Descriptions.Item>
              <Descriptions.Item label={t('耗时(ms)')}>{detail.durationMs ?? '-'}</Descriptions.Item>
              <Descriptions.Item label={t('执行节点')}>{detail.workerNode || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('GPU型号')}>{detail.gpuType || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('队列')}>{detail.queueName || '-'}</Descriptions.Item>
            </Descriptions>

            {(detail.errorCode || detail.errorMessage) && (
              <>
                <Divider orientation="left" style={sectionDividerStyle}>{t('错误信息')}</Divider>
                <Descriptions column={1} bordered size="small" labelStyle={{ paddingBlock: 4, paddingInline: 8 }} contentStyle={{ paddingBlock: 4, paddingInline: 8 }}>
                  {detail.errorCode && <Descriptions.Item label={t('错误码')}>{detail.errorCode}</Descriptions.Item>}
                  {detail.errorMessage && <Descriptions.Item label={t('错误信息')}>{detail.errorMessage}</Descriptions.Item>}
                </Descriptions>
              </>
            )}

            {inputUrls.length > 0 && (
              <>
                <Divider orientation="left" style={sectionDividerStyle}>{t('输入资源')}</Divider>
                <Image.PreviewGroup>
                  <Space wrap size={6}>
                    {inputUrls.map((url, i) =>
                      isVideoUrl(url) ? (
                        <video
                          key={i}
                          src={url}
                          controls
                          width={120}
                          style={{ maxHeight: 120, objectFit: 'contain', borderRadius: 4 }}
                        />
                      ) : (
                        <Image
                          key={i}
                          src={addImageCompressSuffix(url, 200)}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      )
                    )}
                  </Space>
                </Image.PreviewGroup>
              </>
            )}

            {outputUrls.length > 0 && (
              <>
                <Divider orientation="left" style={sectionDividerStyle}>{t('输出结果')}</Divider>
                <Image.PreviewGroup>
                  <Space wrap size={6}>
                    {outputUrls.map((url, i) =>
                      isVideoUrl(url) ? (
                        <video
                          key={i}
                          src={url}
                          controls
                          width={180}
                          style={{ maxHeight: 180, objectFit: 'contain', borderRadius: 4 }}
                        />
                      ) : (
                        <Image
                          key={i}
                          src={addImageCompressSuffix(url, 200)}
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      )
                    )}
                  </Space>
                </Image.PreviewGroup>
              </>
            )}

            {detail.metadata && (
              <>
                <Divider orientation="left" style={sectionDividerStyle}>{t('扩展信息(metadata)')}</Divider>
                <Collapse
                  size="small"
                  items={[
                    {
                      key: '1',
                      label: t('查看 JSON'),
                      children: (
                        <pre style={{ margin: 0, fontSize: 11, maxHeight: 160, overflow: 'auto', background: token.colorFillTertiary, padding: 8, borderRadius: 4 }}>
                          {(() => {
                          let str = detail.metadata
                          if (typeof str === 'string') {
                            try {
                              str = JSON.stringify(JSON.parse(str), null, 2)
                            } catch {
                              // 非 JSON 字符串则原样显示
                            }
                          } else if (str != null) {
                            str = JSON.stringify(str, null, 2)
                          }
                          return str ?? '-'
                        })()}
                        </pre>
                    ),
                  },
                ]} />
              </>
            )}
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default SaAiGenTaskDetailModal
