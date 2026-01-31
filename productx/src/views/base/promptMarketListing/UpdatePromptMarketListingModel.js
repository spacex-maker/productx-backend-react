import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Divider } from 'antd'

const { TextArea } = Input
const { Option } = Select

const LICENSE_OPTIONS = [
  { value: 1, label: '仅个人学习' },
  { value: 2, label: '可商用' },
  { value: 3, label: '买断' },
]

const STATUS_OPTIONS = [
  { value: 1, label: '上架' },
  { value: 2, label: '下架' },
  { value: 3, label: '违规冻结' },
]

const AUDIT_OPTIONS = [
  { value: 0, label: '待审' },
  { value: 1, label: '通过' },
  { value: 2, label: '驳回' },
]

const UpdatePromptMarketListingModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  selectedItem,
  t,
}) => {
  useEffect(() => {
    if (isVisible && selectedItem) {
      form.setFieldsValue({
        id: selectedItem.id,
        title: selectedItem.title,
        description: selectedItem.description,
        coverImageUrl: selectedItem.coverImageUrl,
        previewImages: selectedItem.previewImages,
        priceToken: selectedItem.priceToken,
        originalPriceToken: selectedItem.originalPriceToken,
        licenseType: selectedItem.licenseType,
        parameterSnapshot: selectedItem.parameterSnapshot,
        isPromptHidden: selectedItem.isPromptHidden === 1,
        modelType: selectedItem.modelType,
        baseModelVersion: selectedItem.baseModelVersion,
        tags: selectedItem.tags,
        status: selectedItem.status,
        auditStatus: selectedItem.auditStatus,
        rejectReason: selectedItem.rejectReason,
        extraConfig: selectedItem.extraConfig,
      })
    }
  }, [isVisible, selectedItem, form])

  return (
    <Modal
      title={t('编辑提示词商品')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Divider orientation="left">{t('基本信息')}</Divider>
        <Form.Item label={t('商品标题')} name="title">
          <Input placeholder={t('商品标题')} />
        </Form.Item>
        <Form.Item label={t('详细描述')} name="description">
          <TextArea rows={3} placeholder={t('详细描述')} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('封面图URL')} name="coverImageUrl">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('预览图列表(JSON)')} name="previewImages">
              <Input placeholder='["url1","url2"]' />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">{t('价格与授权')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('现价(积分)')} name="priceToken">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('原价(划线价)')} name="originalPriceToken">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t('授权类型')} name="licenseType">
          <Select placeholder={t('请选择')}>
            {LICENSE_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider orientation="left">{t('参数与模型')}</Divider>
        <Form.Item label={t('参数快照(JSON)')} name="parameterSnapshot">
          <TextArea rows={3} placeholder='{"prompt":"..."}' />
        </Form.Item>
        <Form.Item label={t('未购买隐藏关键参数')} name="isPromptHidden" valuePropName="checked">
          <Switch checkedChildren={t('是')} unCheckedChildren={t('否')} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('模型大类')} name="modelType">
              <Input placeholder="如 sd_xl" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('底模版本')} name="baseModelVersion">
              <Input placeholder="如 1.0" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t('标签(JSON)')} name="tags">
          <Input placeholder='["tag1","tag2"]' />
        </Form.Item>

        <Divider orientation="left">{t('状态')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('状态')} name="status">
              <Select placeholder={t('请选择')}>
                {STATUS_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('审核状态')} name="auditStatus">
              <Select placeholder={t('请选择')}>
                {AUDIT_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t('驳回原因')} name="rejectReason">
          <TextArea rows={2} placeholder={t('驳回时填写')} />
        </Form.Item>
        <Form.Item label={t('扩展配置(JSON)')} name="extraConfig">
          <TextArea rows={2} placeholder='{}' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdatePromptMarketListingModel
