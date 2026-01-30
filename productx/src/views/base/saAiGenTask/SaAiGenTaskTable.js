import React from 'react'
import { Button, Tag, Space, Image, Avatar } from 'antd'

const STATUS_MAP = {
  0: { color: 'default', text: '排队' },
  1: { color: 'processing', text: '进行中' },
  2: { color: 'success', text: '成功' },
  3: { color: 'error', text: '失败' },
  4: { color: 'warning', text: '超时' },
}

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
  return (
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
          const urls = parseResultUrls(item.resultUrls)
          const firstUrl = urls[0] || item.thumbnailUrl
          return (
            <tr key={item.id} className="record-font">
              <td>{item.id}</td>
              <td>
                {(item.userAvatar != null || item.userNickname != null || item.userName != null) ? (
                  <Space size="small">
                    <Avatar src={item.userAvatar} size="small">{item.userNickname?.[0] || item.userName?.[0] || '-'}</Avatar>
                    <span>{item.userNickname || item.userName || item.userId}</span>
                  </Space>
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
                {STATUS_MAP[item.status] != null ? (
                  <Tag color={STATUS_MAP[item.status].color}>{STATUS_MAP[item.status].text}</Tag>
                ) : '-'}
              </td>
              <td>
                {firstUrl ? (
                  isVideoUrl(firstUrl) ? (
                    <video
                      src={firstUrl}
                      width={48}
                      height={48}
                      muted
                      loop
                      playsInline
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <Image
                      src={addImageCompressSuffix(firstUrl, 80)}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  )
                ) : (
                  <span style={{ color: '#999' }}>-</span>
                )}
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
  )
}

export default SaAiGenTaskTable
