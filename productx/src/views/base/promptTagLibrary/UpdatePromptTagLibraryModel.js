import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd'

const { Option } = Select
const STATUS_OPTIONS = [{ value: 0, label: '禁用' }, { value: 1, label: '启用' }]
const GROUP_TYPE_OPTIONS = [
  { value: 1, label: '核心题材 (Subject)' },
  { value: 2, label: '艺术风格 (Style)' },
  { value: 3, label: '构图与视角 (View)' },
  { value: 4, label: '光影与氛围 (Lighting)' },
  { value: 5, label: '质量与修饰 (Quality)' },
]
const IS_RECOMMEND_OPTIONS = [{ value: 0, label: '否' }, { value: 1, label: '是' }]

const UpdatePromptTagLibraryModel = ({
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
        tagNameI18n: selectedItem.tagNameI18n,
        tagCode: selectedItem.tagCode,
        groupType: selectedItem.groupType,
        sort: selectedItem.sort,
        iconUrl: selectedItem.iconUrl,
        isRecommend: selectedItem.isRecommend,
        status: selectedItem.status,
      })
    }
  }, [isVisible, selectedItem, form])

  return (
    <Modal
      title={t('编辑标签')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="id" hidden><Input /></Form.Item>
        <Form.Item
          label={t('标签多语言(JSON)')}
          name="tagNameI18n"
          rules={[{ required: true, message: t('请输入标签多语言JSON') }]}
        >
          <Input.TextArea rows={3} placeholder='{"zh": "中文", "en": "English"}' />
        </Form.Item>
        <Form.Item label={t('标签编码')} name="tagCode">
          <Input placeholder="如 style" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('分组类型')} name="groupType">
              <Select placeholder={t('请选择')}>
                {GROUP_TYPE_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('排序权重')} name="sort">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t('标签图标URL')} name="iconUrl">
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item label={t('是否推荐')} name="isRecommend">
          <Select placeholder={t('请选择')}>
            {IS_RECOMMEND_OPTIONS.map((o) => (
              <Option key={o.value} value={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('状态')} name="status">
          <Select placeholder={t('请选择')}>
            {STATUS_OPTIONS.map((o) => (
              <Option key={o.value} value={o.value}>{o.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdatePromptTagLibraryModel
