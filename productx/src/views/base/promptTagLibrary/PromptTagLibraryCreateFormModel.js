import React from 'react'
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

const PromptTagLibraryCreateFormModel = ({ isVisible, onCancel, onFinish, form, t }) => {
  return (
    <Modal
      title={t('新建标签')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ groupType: 1, sort: 0, status: 1, isRecommend: 0 }}
      >
        <Form.Item
          label={t('标签多语言(JSON)')}
          name="tagNameI18n"
          rules={[{ required: true, message: t('请输入标签多语言JSON，如 {"zh":"中文","en":"English"}') }]}
          tooltip='格式: {"zh": "中文名", "en": "English Name"}'
        >
          <Input.TextArea rows={3} placeholder='{"zh": "风格", "en": "Style"}' />
        </Form.Item>
        <Form.Item label={t('标签编码')} name="tagCode">
          <Input placeholder="如 style" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('分组类型')}
              name="groupType"
              rules={[{ required: true, message: t('请选择分组类型') }]}
            >
              <Select placeholder={t('请选择')}>
                {GROUP_TYPE_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('排序权重')} name="sort">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t('标签图标URL')} name="iconUrl">
          <Input placeholder="https://..." />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('是否推荐')} name="isRecommend">
              <Select placeholder={t('请选择')}>
                {IS_RECOMMEND_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('状态')} name="status">
              <Select placeholder={t('请选择')}>
                {STATUS_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default PromptTagLibraryCreateFormModel
