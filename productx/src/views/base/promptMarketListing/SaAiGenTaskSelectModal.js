import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Input, Select, Button, Spin, message, Row, Col, Pagination, Image, Tag, Space, Avatar } from 'antd'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const TASK_TYPE_OPTIONS = [
  { value: 't2i', label: 't2i' },
  { value: 'i2i', label: 'i2i' },
  { value: 't2v', label: 't2v' },
  { value: 'i2v', label: 'i2v' },
  { value: 'upscale', label: 'upscale' },
  { value: 'restore', label: 'restore' },
]
const STATUS_OPTIONS = [
  { value: 0, label: '排队' },
  { value: 1, label: '进行中' },
  { value: 2, label: '成功' },
  { value: 3, label: '失败' },
  { value: 4, label: '超时' },
]

const STATUS_MAP = {
  0: { color: 'default', text: '排队' },
  1: { color: 'processing', text: '进行中' },
  2: { color: 'success', text: '成功' },
  3: { color: 'error', text: '失败' },
  4: { color: 'warning', text: '超时' },
}

const addImageCompressSuffix = (url, width = 80) => {
  if (!url) return ''
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}imageMogr2/format/webp/quality/80/thumbnail/${width}x`
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

const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  const path = url.split('?')[0].toLowerCase()
  return /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(path)
}

const SaAiGenTaskSelectModal = ({ visible, onClose, onSelect, t }) => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: undefined,
    taskType: undefined,
    status: undefined,
    modelCode: '',
    modelName: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    fetchData()
  }, [visible, currentPage, pageSize])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      )
      const response = await api.get('/manage/sa-ai-gen-task/list', {
        params: { currentPage, pageSize, ...filteredParams },
      })
      if (response) {
        setData(response.data || [])
        setTotalNum(response.totalNum || 0)
      }
    } catch (error) {
      console.error('Failed to fetch task list', error)
      message.error(error?.response?.data?.message || t('获取数据失败'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectTask = (task) => {
    onSelect(task)
    onClose()
  }

  return (
    <Modal
      title={t('选择任务')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col>
            <Input
              value={searchParams.userId}
              onChange={handleSearchChange}
              name="userId"
              placeholder={t('用户ID')}
              allowClear
              style={{ width: 120 }}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.taskType}
              onChange={(v) => handleSelectChange('taskType', v)}
              placeholder={t('任务类型')}
              allowClear
              style={{ width: 100 }}
            >
              {TASK_TYPE_OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.status}
              onChange={(v) => handleSelectChange('status', v)}
              placeholder={t('状态')}
              allowClear
              style={{ width: 90 }}
            >
              {STATUS_OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={() => { setCurrent(1); fetchData(); }} disabled={isLoading}>
              {isLoading ? <Spin size="small" /> : t('search')}
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>{t('任务ID')}</th>
                <th>{t('用户')}</th>
                <th>{t('任务类型')}</th>
                <th>{t('模型')}</th>
                <th>{t('状态')}</th>
                <th>{t('结果预览')}</th>
                <th>{t('创建时间')}</th>
                <th>{t('operations')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const urls = parseResultUrls(item.resultUrls)
                const firstUrl = urls[0] || item.thumbnailUrl
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {(item.userAvatar != null || item.userNickname != null || item.userName != null) ? (
                        <Space size="small">
                          <Avatar src={item.userAvatar} size="small">
                            {item.userNickname?.[0] || item.userName?.[0] || '-'}
                          </Avatar>
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
                    <td className="text-truncate">{item.createTime || '-'}</td>
                    <td>
                      <Button type="primary" size="small" onClick={() => handleSelectTask(item)}>
                        {t('选择')}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Spin>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          total={totalNum}
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={[10, 20, 50]}
          showTotal={(total) => `${t('共')} ${total} ${t('条')}`}
          onChange={(page, size) => {
            setCurrent(page)
            if (size !== pageSize) setPageSize(size)
          }}
        />
      </div>
    </Modal>
  )
}

export default SaAiGenTaskSelectModal
