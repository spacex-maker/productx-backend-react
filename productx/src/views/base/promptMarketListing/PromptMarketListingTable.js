import React, { useState } from 'react'
import { Button, Tag, Popconfirm, Space, Image, Modal } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'

const addImageCompressSuffix = (url, width = 200) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
}

const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  const path = url.split('?')[0].toLowerCase()
  return /\.(mp4|webm|mov|avi|mkv|m4v|flv|wmv|3gp|ogv)(\?|$)/i.test(path)
}

const parsePreviewImages = (str) => {
  if (!str) return []
  try {
    const arr = typeof str === 'string' ? JSON.parse(str) : str
    return Array.isArray(arr) ? arr.filter(Boolean) : []
  } catch {
    return []
  }
}

const isVideoListing = (listingType) => {
  if (!listingType) return false
  const type = String(listingType).toUpperCase()
  return type === 'VIDEO' || type === 'T2V' || type === 'I2V'
}

const STATUS_MAP = {
  1: { color: 'green', text: '上架' },
  2: { color: 'default', text: '下架' },
  3: { color: 'red', text: '违规冻结' },
}

const AUDIT_MAP = {
  0: { color: 'orange', text: '待审' },
  1: { color: 'green', text: '通过' },
  2: { color: 'red', text: '驳回' },
}

const PromptMarketListingTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDelete,
  t,
}) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)

  const getMediaInfo = (item) => {
    const previews = parsePreviewImages(item.previewImages)
    const videoUrl = previews.find(isVideoUrl) || (isVideoUrl(item.coverImageUrl) ? item.coverImageUrl : null)
    const imageUrl =
      (!isVideoUrl(item.coverImageUrl) ? item.coverImageUrl : null) ||
      previews.find((url) => !isVideoUrl(url)) ||
      previews[0] ||
      item.coverImageUrl

    if (videoUrl || isVideoListing(item.listingType)) {
      return {
        type: 'video',
        playUrl: videoUrl || previews[0] || item.coverImageUrl,
        posterUrl: imageUrl && !isVideoUrl(imageUrl) ? imageUrl : item.coverImageUrl,
      }
    }

    return {
      type: 'image',
      url: imageUrl,
    }
  }

  const renderCoverMedia = (item) => {
    const media = getMediaInfo(item)
    if (!media?.url && !media?.playUrl) {
      return <span style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 4, display: 'inline-block' }} />
    }

    if (media.type === 'video') {
      const poster = media.posterUrl && !isVideoUrl(media.posterUrl)
        ? addImageCompressSuffix(media.posterUrl, 80)
        : undefined

      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setVideoPreviewUrl(media.playUrl)}
          onKeyDown={(e) => e.key === 'Enter' && setVideoPreviewUrl(media.playUrl)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            background: '#f0f0f0',
            border: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          {isVideoUrl(media.playUrl) ? (
            <video
              src={media.playUrl}
              poster={poster}
              preload="metadata"
              width={48}
              height={48}
              muted
              playsInline
              style={{ objectFit: 'cover', pointerEvents: 'none', display: 'block' }}
            />
          ) : poster ? (
            <img
              src={poster}
              alt=""
              width={48}
              height={48}
              style={{ objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#d9d9d9' }} />
          )}
          <PlayCircleOutlined
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 18,
              color: '#fff',
              textShadow: '0 1px 4px rgba(0,0,0,0.45)',
            }}
          />
        </div>
      )
    }

    return (
      <Image
        src={addImageCompressSuffix(media.url, 80)}
        preview={{ src: media.url }}
        width={48}
        height={48}
        style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
      />
    )
  }

  return (
    <>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="select_all_prompt_listing"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e, data)}
                />
                <label className="custom-control-label" htmlFor="select_all_prompt_listing" />
              </div>
            </th>
            {[
              t('商品信息'),
              t('类型/分类'),
              t('价格'),
              t('销量/浏览'),
              t('状态'),
              t('审核状态'),
              t('创建时间'),
              t('operations'),
            ].map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`} />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {renderCoverMedia(item)}
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                      {item.title || '-'}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      ID: {item.id}
                      {item.modelType && (
                        <Tag color="blue" style={{ marginLeft: 4, fontSize: 11 }}>
                          {item.modelType}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <Tag color="cyan">{item.listingType || '-'}</Tag>
              </td>
              <td className="text-truncate">
                <span>{item.priceToken ?? 0}</span>
                {item.originalPriceToken != null && (
                  <span style={{ marginLeft: 4, color: '#999', textDecoration: 'line-through' }}>
                    {item.originalPriceToken}
                  </span>
                )}
              </td>
              <td className="text-truncate">
                销量 {item.salesCount ?? 0} / 浏览 {item.viewCount ?? 0}
              </td>
              <td>
                {STATUS_MAP[item.status] ? (
                  <Tag color={STATUS_MAP[item.status].color}>
                    {STATUS_MAP[item.status].text}
                  </Tag>
                ) : (
                  '-'
                )}
              </td>
              <td>
                {AUDIT_MAP[item.auditStatus] != null ? (
                  <Tag color={AUDIT_MAP[item.auditStatus].color}>
                    {AUDIT_MAP[item.auditStatus].text}
                  </Tag>
                ) : (
                  '-'
                )}
              </td>
              <td className="text-truncate">{item.createTime || '-'}</td>
              <td>
                <Space>
                  <Button type="link" onClick={() => handleEditClick(item)} size="small">
                    {t('edit')}
                  </Button>
                  <Popconfirm
                    title={t('确定要删除吗？')}
                    onConfirm={() => handleDelete(item.id)}
                    okText={t('confirm')}
                    cancelText={t('cancel')}
                  >
                    <Button type="link" danger size="small">
                      {t('delete')}
                    </Button>
                  </Popconfirm>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title={t('视频预览')}
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

export default PromptMarketListingTable
