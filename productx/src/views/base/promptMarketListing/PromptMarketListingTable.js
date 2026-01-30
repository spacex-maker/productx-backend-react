import React from 'react'
import { Button, Tag, Popconfirm, Space, Image } from 'antd'

const addImageCompressSuffix = (url, width = 200) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
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
  return (
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
                {item.coverImageUrl ? (
                  <Image
                    src={addImageCompressSuffix(item.coverImageUrl, 80)}
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <span style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 4 }} />
                )}
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
              <div>
                <Tag color="cyan">{item.listingType || '-'}</Tag>
                <span style={{ marginLeft: 4 }}>分类: {item.categoryId ?? '-'}</span>
              </div>
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
  )
}

export default PromptMarketListingTable
