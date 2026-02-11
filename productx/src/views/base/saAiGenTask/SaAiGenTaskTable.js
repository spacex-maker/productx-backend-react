import React, { useState } from 'react'
import { Button, Tag, Space, Image, Avatar, Modal } from 'antd'

const STATUS_MAP = {
  0: { color: 'default', text: '排队' },
  1: { color: 'processing', text: '进行中' },
  2: { color: 'success', text: '成功' },
  3: { color: 'error', text: '失败' },
  4: { color: 'warning', text: '超时' },
}
const BILLING_MAP = { 0: '未扣费', 1: '已扣费', 2: '已退款' }

const addImageCompressSuffix = (url, width = 120) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
}

/** 根据 URL 判断是否为视频文件（不参与图片压缩） */
const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  const path = url.split('?')[0].toLowerCase()
  return /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(path)
}

const parseResultUrls = (str) => {
  if (!str) return []
  try {
    const arr = typeof str === 'string' ? JSON.parse(str) : str
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const SaAiGenTaskTable = ({ data, onViewDetail, t }) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)

  const renderPreview = (item) => {
    const urls = parseResultUrls(item.resultUrls)
    const firstUrl = urls[0] || item.thumbnailUrl
    if (!firstUrl) return <span style={{ color: '#999' }}>-</span>

    if (isVideoUrl(firstUrl)) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setVideoPreviewUrl(firstUrl)}
          onKeyDown={(e) => e.key === 'Enter' && setVideoPreviewUrl(firstUrl)}
          style={{
            width: 96,
            height: 96,
            borderRadius: 6,
            overflow: 'hidden',
            cursor: 'pointer',
            background: '#f0f0f0',
            border: '1px solid rgba(0,0,0,0.06)',
            transition: 'opacity 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85'
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
          }}
        >
          <video
            src={firstUrl}
            poster={item.thumbnailUrl || undefined}
            preload="metadata"
            width={96}
            height={96}
            muted
            playsInline
            style={{ objectFit: 'cover', pointerEvents: 'none', display: 'block' }}
          />
        </div>
      )
    }

    return (
      <Image
        src={firstUrl}
        width={96}
        height={96}
        style={{ objectFit: 'cover', borderRadius: 6 }}
      />
    )
  }

  return (
    <>
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>{t('任务ID')}</th>
          <th>{t('用户')}</th>
          <th>{t('任务类型')}</th>
          <th>{t('模型')}</th>
          <th>{t('状态')}</th>
          <th>{t('结果预览')}</th>
          <th>{t('消耗')}</th>
          <th>{t('创建时间')}</th>
          <th>{t('operations')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          return (
            <tr key={item.id} className="record-font">
              <td>{item.id}</td>
              <td>
                {(item.userAvatar != null || item.userNickname != null || item.userName != null || item.userId != null) ? (
                  <div>
                    <Space size="small" wrap>
                      <Space size="small">
                        <Avatar src={item.userAvatar} size="small">{item.userNickname?.[0] || item.userName?.[0] || '-'}</Avatar>
                        <span>{item.userNickname || item.userName || '-'}</span>
                      </Space>
                      {item.isBelongSystem === true && (
                        <Tag color="purple">{t('系统')}</Tag>
                      )}
                    </Space>
                    {item.userId != null && (
                      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>ID: {item.userId}</div>
                    )}
                  </div>
                ) : (
                  item.userId ?? '-'
                )}
              </td>
              <td><Tag color="blue">{item.taskType || '-'}</Tag></td>
              <td>
                <div style={{ fontSize: 12 }}>
                  <div>{item.modelName || '-'}</div>
                  {item.modelCode && <div style={{ color: '#666' }}>{item.modelCode}</div>}
                </div>
              </td>
              <td>
                <Space size="small">
                  {STATUS_MAP[item.status] != null ? (
                    <Tag color={STATUS_MAP[item.status].color}>{STATUS_MAP[item.status].text}</Tag>
                  ) : (
                    <span>-</span>
                  )}
                  <Tag color={item.billingStatus === 2 ? 'green' : item.billingStatus === 1 ? 'orange' : 'default'}>
                    {BILLING_MAP[item.billingStatus] ?? item.billingStatus ?? '-'}
                  </Tag>
                </Space>
              </td>
              <td style={{ position: 'relative' }}>
                {renderPreview(item)}
              </td>
              <td>{item.creditsCost ?? 0}</td>
              <td className="text-truncate">{item.createTime || '-'}</td>
              <td>
                <Button type="link" size="small" onClick={() => onViewDetail(item.id)}>
                  {t('详情')}
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <Modal
      open={!!videoPreviewUrl}
      onCancel={() => setVideoPreviewUrl(null)}
      footer={null}
      width="min(90vw, 800px)"
      centered
      destroyOnClose
    >
      {videoPreviewUrl && (
        <video
          src={videoPreviewUrl}
          controls
          autoPlay
          style={{ width: '100%', borderRadius: 8 }}
        />
      )}
    </Modal>
    </>
  )
}

export default SaAiGenTaskTable
