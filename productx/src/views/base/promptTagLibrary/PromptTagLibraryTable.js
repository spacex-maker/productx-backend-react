import React from 'react'
import { Button, Tag, Popconfirm, Space } from 'antd'

const STATUS_MAP = { 0: { color: 'default', text: '禁用' }, 1: { color: 'green', text: '启用' } }
const GROUP_TYPE_MAP = {
  1: '核心题材 (Subject)',
  2: '艺术风格 (Style)',
  3: '构图与视角 (View)',
  4: '光影与氛围 (Lighting)',
  5: '质量与修饰 (Quality)',
}

const parseTagNameI18n = (str) => {
  if (!str) return { zh: '-', en: '-' }
  try {
    const o = typeof str === 'string' ? JSON.parse(str) : str
    return { zh: o.zh || '-', en: o.en || '-' }
  } catch {
    return { zh: str, en: '-' }
  }
}

const PromptTagLibraryTable = ({
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
                id="select_all_tag"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label" htmlFor="select_all_tag" />
            </div>
          </th>
          <th>{t('标签名称(中/英)')}</th>
          <th>{t('标签编码')}</th>
          <th>{t('分组类型')}</th>
          <th>{t('排序')}</th>
          <th>{t('推荐')}</th>
          <th>{t('引用次数')}</th>
          <th>{t('状态')}</th>
          <th>{t('创建时间')}</th>
          <th>{t('operations')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const names = parseTagNameI18n(item.tagNameI18n)
          return (
            <tr key={item.id} className="record-font">
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_tag_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label className="custom-control-label" htmlFor={`td_tag_${item.id}`} />
                </div>
              </td>
              <td>
                <div>
                  <div>{names.zh}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{names.en}</div>
                </div>
              </td>
              <td><Tag color="cyan">{item.tagCode || '-'}</Tag></td>
              <td>{GROUP_TYPE_MAP[item.groupType] ?? item.groupType ?? '-'}</td>
              <td>{item.sort ?? 0}</td>
              <td>{item.isRecommend === 1 ? <Tag color="gold">推荐</Tag> : '-'}</td>
              <td>{item.usageCount ?? 0}</td>
              <td>
                {STATUS_MAP[item.status] ? (
                  <Tag color={STATUS_MAP[item.status].color}>{STATUS_MAP[item.status].text}</Tag>
                ) : '-'}
              </td>
              <td className="text-truncate">{item.createTime || '-'}</td>
              <td>
                <Space>
                  <Button type="link" onClick={() => handleEditClick(item)} size="small">{t('edit')}</Button>
                  <Popconfirm
                    title={t('确定要删除吗？')}
                    onConfirm={() => handleDelete(item.id)}
                    okText={t('confirm')}
                    cancelText={t('cancel')}
                  >
                    <Button type="link" danger size="small">{t('delete')}</Button>
                  </Popconfirm>
                </Space>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default PromptTagLibraryTable
