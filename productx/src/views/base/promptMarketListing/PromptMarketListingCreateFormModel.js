import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Divider, Button, Avatar, Card, Image, Space, Typography, Tag, theme } from 'antd'
import { UserOutlined, FileImageOutlined, CodeOutlined, DollarOutlined, SafetyCertificateOutlined, SwapOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import ImageUpload from 'src/components/common/ImageUpload'
import MediaListUpload from 'src/components/common/MediaListUpload'
import SaAiGenTaskSelectModal from './SaAiGenTaskSelectModal'

const { TextArea } = Input
const { Option } = Select
const { Text } = Typography

const TASK_TYPE_OPTIONS = [
  { value: 't2i', label: '文生图 (t2i)' },
  { value: 'i2i', label: '图生图 (i2i)' },
  { value: 't2v', label: '文生视频 (t2v)' },
  { value: 'i2v', label: '图生视频 (i2v)' },
  { value: 'upscale', label: '超分放大 (upscale)' },
  { value: 'restore', label: '老照片修复 (restore)' },
]

const LICENSE_OPTIONS = [
  { value: 1, label: '仅个人学习' },
  { value: 2, label: '可商用' },
  { value: 3, label: '买断' },
]

const STATUS_OPTIONS = [
  { value: 1, label: '上架', color: 'success' },
  { value: 2, label: '下架', color: 'default' },
  { value: 3, label: '违规冻结', color: 'error' },
]

const AUDIT_OPTIONS = [
  { value: 0, label: '待审', color: 'processing' },
  { value: 1, label: '通过', color: 'success' },
  { value: 2, label: '驳回', color: 'error' },
]

// --- Helper Functions ---
const addImageCompressSuffix = (url, width = 100) => {
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

const parseTagNameI18n = (str) => {
  if (!str) return ''
  try {
    const o = typeof str === 'string' ? JSON.parse(str) : str
    return o.zh || o.en || str
  } catch {
    return String(str)
  }
}

const TAG_GROUP_TYPE_MAP = {
  1: '核心题材',
  2: '艺术风格',
  3: '构图与视角',
  4: '光影与氛围',
  5: '质量与修饰',
}

const PromptMarketListingCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
}) => {
  // 1. 获取当前主题 Token (核心修改)
  const { token } = theme.useToken()
  
  const [taskSelectVisible, setTaskSelectVisible] = useState(false)
  const [coverUrl, setCoverUrl] = useState('')
  const [selectedTaskInfo, setSelectedTaskInfo] = useState(null)
  const [mediaPreview, setMediaPreview] = useState({ visible: false, url: '', isVideo: false })
  const [tagLibraryOptions, setTagLibraryOptions] = useState([])

  useEffect(() => {
    if (!isVisible) {
      setCoverUrl('')
      setSelectedTaskInfo(null)
      form.resetFields()
    }
  }, [isVisible, form])

  useEffect(() => {
    if (!isVisible) return
    const fetchTagLibrary = async () => {
      try {
        const res = await api.get('/manage/prompt-tag-library/list', {
          params: { status: 1, currentPage: 1, pageSize: 500 },
        })
        const list = res?.data || []
        setTagLibraryOptions(
          list.map((item) => ({
            value: item.tagCode,
            label: parseTagNameI18n(item.tagNameI18n) || item.tagCode,
            tagCode: item.tagCode,
            groupTypeLabel: TAG_GROUP_TYPE_MAP[item.groupType] || '',
            isRecommend: item.isRecommend === 1,
          }))
        )
      } catch (_) {
        setTagLibraryOptions([])
      }
    }
    fetchTagLibrary()
  }, [isVisible])

  const handleTaskSelect = (task) => {
    form.setFieldsValue({
      userId: task.userId,
      originalTaskId: task.id,
      listingType: task.taskType || 't2i',
    })
    setSelectedTaskInfo({
      id: task.id,
      taskType: task.taskType,
      userId: task.userId,
      userAvatar: task.userAvatar,
      userNickname: task.userNickname,
      userName: task.userName,
      modelName: task.modelName,
      modelCode: task.modelCode,
      status: task.status,
      createTime: task.createTime,
      creditsCost: task.creditsCost,
      thumbnailUrl: task.thumbnailUrl,
      resultUrls: task.resultUrls,
    })
    setTaskSelectVisible(false)
  }

  const handlePreviewImagesChange = (jsonStr) => {
    form.setFieldsValue({ previewImages: jsonStr })
  }

  // 渲染任务详情卡片 (使用 Token 样式)
  const renderSelectedTaskInfo = () => {
    if (!selectedTaskInfo) return null;
    const urls = parseResultUrls(selectedTaskInfo.resultUrls)
    const previewUrls = urls.length > 0 ? urls : (selectedTaskInfo.thumbnailUrl ? [selectedTaskInfo.thumbnailUrl] : [])

    return (
      <div style={{ 
        // 修改点：使用 colorFillAlter (浅色填充) 和 colorBorderSecondary
        background: token.colorFillAlter, 
        padding: 16, 
        borderRadius: token.borderRadiusLG, 
        marginBottom: 24, 
        border: `1px solid ${token.colorBorderSecondary}` 
      }}>
        <Row gutter={24}>
          <Col span={10} style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}>
            <Space align="start">
              <Avatar
                src={selectedTaskInfo.userAvatar ? addImageCompressSuffix(selectedTaskInfo.userAvatar) : undefined}
                size={48}
                icon={<UserOutlined />}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: token.colorText }}>
                  {selectedTaskInfo.userNickname || selectedTaskInfo.userName || t('用户')}
                </div>
                {/* 修改点：使用 colorTextTertiary (三级文本色) */}
                <div style={{ color: token.colorTextTertiary, fontSize: 12 }}>ID: {selectedTaskInfo.userId}</div>
                <div style={{ marginTop: 8 }}>
                   <Tag color="blue">{selectedTaskInfo.taskType}</Tag>
                   <span style={{ fontSize: 12, color: token.colorTextSecondary }}>ID: {selectedTaskInfo.id}</span>
                </div>
              </div>
            </Space>
          </Col>

          <Col span={14}>
            <div style={{ marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: token.colorTextSecondary }}>{t('模型')}: </span>
              <strong style={{ color: token.colorText }}>{selectedTaskInfo.modelName || selectedTaskInfo.modelCode || '-'}</strong>
              <span style={{ marginLeft: 16, color: token.colorTextSecondary }}>{t('消耗')}: </span>
              <span style={{ color: token.colorText }}>{selectedTaskInfo.creditsCost} {t('积分')}</span>
            </div>
            
            {previewUrls.length > 0 && (
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {previewUrls.slice(0, 5).map((url, i) => {
                  const isVideo = isVideoUrl(url)
                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setMediaPreview({ visible: true, url, isVideo })}
                      onKeyDown={(e) => e.key === 'Enter' && setMediaPreview({ visible: true, url, isVideo })}
                      style={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: token.borderRadiusSM,
                        overflow: 'hidden',
                        border: `1px solid ${token.colorBorder}`,
                        cursor: 'pointer',
                      }}
                    >
                      {isVideo ? (
                        <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                      ) : (
                        <img
                          src={addImageCompressSuffix(url, 80)}
                          alt=""
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover', display: 'block' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Col>
        </Row>
      </div>
    )
  }

  // 样式对象提取
  const codeInputStyle = {
    fontFamily: 'monospace', 
    fontSize: 12, 
    // 修改点：代码块背景色自动适配深色模式
    backgroundColor: token.colorFillQuaternary,
    color: token.colorText,
    border: `1px solid ${token.colorBorder}`
  }

  return (
    <>
      <Modal
        title={t('创建提示词商品')}
        open={isVisible}
        onCancel={onCancel}
        onOk={() => form.submit()}
        okText={t('立即发布')}
        cancelText={t('cancel')}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            listingType: 't2i',
            isPromptHidden: 0,
            status: 1,
            auditStatus: 0,
            licenseType: 1,
            priceToken: 0,
          }}
        >
          <Form.Item name="userId" hidden rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="originalTaskId" hidden rules={[{ required: true }]}><Input /></Form.Item>

          {/* 1. 任务导入区域 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, color: token.colorTextHeading }}>
                <FileImageOutlined style={{ marginRight: 6 }} />{t('关联原始任务')}
                <span style={{ color: token.colorError, marginLeft: 4 }}>*</span>
              </div>
              {!selectedTaskInfo ? (
                <Button type="primary" onClick={() => setTaskSelectVisible(true)}>
                  {t('+ 选择任务导入')}
                </Button>
              ) : (
                <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => setTaskSelectVisible(true)}>
                  {t('切换任务')}
                </Button>
              )}
            </div>
            
            {!selectedTaskInfo ? (
               <div 
                 onClick={() => setTaskSelectVisible(true)}
                 style={{ 
                   border: `1px dashed ${token.colorBorder}`, 
                   borderRadius: token.borderRadiusLG, 
                   padding: 24, 
                   textAlign: 'center', 
                   cursor: 'pointer',
                   // 修改点：空状态背景
                   background: token.colorFillAlter,
                   color: token.colorTextDescription,
                   transition: 'all 0.3s'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.borderColor = token.colorPrimary
                   e.currentTarget.style.color = token.colorPrimary
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.borderColor = token.colorBorder
                   e.currentTarget.style.color = token.colorTextDescription
                 }}
               >
                 {t('请点击此处选择一个 AI 生成历史任务')}
               </div>
            ) : (
              renderSelectedTaskInfo()
            )}
          </div>

          <Divider />

          {/* 2. 商品核心信息 */}
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item label={t('商品标题')} name="title" rules={[{ required: true, message: t('请输入商品标题') }]}>
                <Input placeholder={t('精炼的标题，如：赛博朋克风格城市夜景')} size="large" />
              </Form.Item>
              <Form.Item label={t('详细描述')} name="description">
                <TextArea 
                  rows={4} 
                  placeholder={t('介绍该提示词的适用场景、风格特点、生成建议等...')} 
                  showCount 
                  maxLength={500}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('商品分类')} name="listingType" rules={[{ required: true, message: t('请选择商品分类') }]}>
                    <Select options={TASK_TYPE_OPTIONS} showSearch={false} allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            
            <Col span={8}>
              <Form.Item label={t('封面图 (16:9)')} name="coverImageUrl">
                <ImageUpload
                  imageUrl={coverUrl}
                  onImageChange={(url) => {
                    setCoverUrl(url)
                    form.setFieldsValue({ coverImageUrl: url })
                  }}
                  type="background"
                  tipText={t('点击上传封面')}
                  height={110}
                />
              </Form.Item>
              <Form.Item label={t('轮播预览图')} name="previewImages">
                 <MediaListUpload
                    mediaUrls={form.getFieldValue('previewImages') || '[]'}
                    onChange={handlePreviewImagesChange}
                    maxCount={9}
                  />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* 3. 价格与权益 */}
          <div style={{ marginBottom: 16, fontWeight: 'bold', color: token.colorTextHeading }}>
            <DollarOutlined style={{ marginRight: 6 }} />{t('定价与权益')}
          </div>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label={t('现价')} name="priceToken" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} addonAfter={t('积分')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('原价/划线价')} name="originalPriceToken">
                <InputNumber min={0} style={{ width: '100%' }} addonAfter={t('积分')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('授权类型')} name="licenseType">
                <Select options={LICENSE_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* 4. 技术参数 */}
          <div style={{ marginBottom: 16, fontWeight: 'bold', color: token.colorTextHeading }}>
            <CodeOutlined style={{ marginRight: 6 }} />{t('参数与模型配置')}
          </div>
          
          <Row gutter={24}>
            <Col span={8}>
               <Form.Item label={t('模型大类')} name="modelType" tooltip="如: sd_xl, midjourney">
                <Input placeholder="SDXL / MJ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('底模版本')} name="baseModelVersion" tooltip="如: v1.0, v6">
                <Input placeholder="v1.0" />
              </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item 
                 label={t('未购买隐藏Prompt')} 
                 name="isPromptHidden" 
                 valuePropName="checked"
                 style={{ paddingTop: 28 }}
                >
                <Switch checkedChildren={t('隐藏')} unCheckedChildren={t('公开')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label={t('搜索标签')} name="tags">
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  filterOption={(input, opt) =>
                    (opt?.label ?? '').toString().toLowerCase().includes(input.toLowerCase()) ||
                    (opt?.tagCode ?? '').toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={tagLibraryOptions}
                  optionRender={(option) => {
                    const d = option.data ?? option
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 500 }}>{d.label}</span>
                        <span style={{ color: token.colorTextSecondary, fontSize: 12 }}>{d.tagCode}</span>
                        {d.groupTypeLabel && (
                          <Tag color="blue" style={{ margin: 0 }}>{d.groupTypeLabel}</Tag>
                        )}
                        {d.isRecommend && <Tag color="gold">{t('推荐')}</Tag>}
                      </div>
                    )
                  }}
                  placeholder={t('请从标签库选择')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={t('参数快照 (JSON)')} name="parameterSnapshot" rules={[{ required: true }]}>
                <TextArea 
                  rows={4} 
                  style={codeInputStyle} 
                  placeholder='{"prompt": "...", "seed": 123}' 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('扩展配置 (JSON)')} name="extraConfig">
                <TextArea 
                  rows={4} 
                  style={codeInputStyle} 
                  placeholder='{}' 
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 5. 管理员状态 (使用 Warning Token 适配深色/浅色) */}
          <div style={{ 
            marginTop: 12, 
            padding: 12, 
            // 修改点：使用 colorWarningBg (浅黄/深黄)
            background: token.colorWarningBg, 
            borderRadius: token.borderRadius, 
            border: `1px solid ${token.colorWarningBorder}` 
          }}>
             <Row gutter={24} align="middle">
               <Col>
                  <SafetyCertificateOutlined style={{ color: token.colorWarning, marginRight: 8 }} />
                  <span style={{ fontWeight: 500, color: token.colorText }}>{t('管理选项')}</span>
               </Col>
               <Col span={8}>
                  <Form.Item label={t('上架状态')} name="status" style={{ marginBottom: 0 }}>
                    <Select options={STATUS_OPTIONS} size="small" />
                  </Form.Item>
               </Col>
               <Col span={8}>
                  <Form.Item label={t('审核状态')} name="auditStatus" style={{ marginBottom: 0 }}>
                    <Select options={AUDIT_OPTIONS} size="small" />
                  </Form.Item>
               </Col>
             </Row>
          </div>

        </Form>
      </Modal>

      <SaAiGenTaskSelectModal
        visible={taskSelectVisible}
        onClose={() => setTaskSelectVisible(false)}
        onSelect={handleTaskSelect}
        t={t}
      />

      <Modal
        title={mediaPreview.isVideo ? t('视频预览') : t('图片预览')}
        open={mediaPreview.visible}
        onCancel={() => setMediaPreview({ visible: false, url: '', isVideo: false })}
        footer={null}
        width={mediaPreview.isVideo ? 720 : undefined}
        style={{ maxWidth: '94vw' }}
        styles={{
          body: {
            padding: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 280,
            background: token.colorFillQuaternary,
            borderRadius: token.borderRadiusLG,
          },
          content: { borderRadius: token.borderRadiusLG },
          header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        }}
        destroyOnClose
        centered
      >
        {mediaPreview.visible && mediaPreview.url && (
          <div
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: token.borderRadius,
              overflow: 'hidden',
              boxShadow: token.boxShadowSecondary,
              background: token.colorBgContainer,
            }}
          >
            {mediaPreview.isVideo ? (
              <video
                src={mediaPreview.url}
                controls
                autoPlay
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  width: '100%',
                }}
              />
            ) : (
              <img
                src={addImageCompressSuffix(mediaPreview.url, 1920)}
                alt=""
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default PromptMarketListingCreateFormModel