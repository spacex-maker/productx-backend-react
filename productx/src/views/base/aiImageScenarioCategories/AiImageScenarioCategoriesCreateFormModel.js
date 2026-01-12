import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Divider } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const AiImageScenarioCategoriesCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  categoryTree,
  t
}) => {
  return (
    <Modal
      title={t('创建分类')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          parentId: 0,
          sortOrder: 0,
          isActive: true,
          isHot: false,
        }}
      >
        <Divider orientation="left">{t('基本信息')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('分类标识')}
              name="categoryKey"
              rules={[{ required: true, message: t('请输入分类标识') }]}
              tooltip={t('用于代码引用的唯一标识，如: PORTRAIT')}
            >
              <Input placeholder="PORTRAIT" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('分类名称')}
              name="categoryName"
              rules={[{ required: true, message: t('请输入分类名称') }]}
            >
              <Input placeholder={t('人像摄影')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('分类描述')}
          name="description"
        >
          <TextArea rows={2} placeholder={t('分类描述/副标题')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('父分类')}
              name="parentId"
              tooltip={t('选择0或留空表示创建一级分类')}
            >
              <Select placeholder={t('选择父分类（0表示一级分类）')}>
                <Option value={0}>{t('根分类（一级）')}</Option>
                {categoryTree.map(cat => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('排序权重')}
              name="sortOrder"
              tooltip={t('值越大越靠前')}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">{t('展示配置')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('分类图标URL')}
              name="iconUrl"
            >
              <Input placeholder="https://example.com/icon.png" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('封面图URL')}
              name="coverImageUrl"
            >
              <Input placeholder="https://example.com/cover.jpg" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('样式配置')}
          name="styleConfig"
          tooltip={t('前端样式配置(JSON)，如颜色、布局等')}
        >
          <TextArea rows={3} placeholder='{"color":"#1890ff","layout":"grid"}' />
        </Form.Item>

        <Form.Item
          label={t('可见角色')}
          name="visibleRoles"
          tooltip={t('JSON数组，NULL表示全员可见')}
        >
          <TextArea rows={2} placeholder='["VIP", "ADMIN"]' />
        </Form.Item>

        <Divider orientation="left">{t('状态设置')}</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('启用状态')}
              name="isActive"
              valuePropName="checked"
            >
              <Switch checkedChildren={t('启用')} unCheckedChildren={t('禁用')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('热门分类')}
              name="isHot"
              valuePropName="checked"
            >
              <Switch checkedChildren={t('是')} unCheckedChildren={t('否')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AiImageScenarioCategoriesCreateFormModel;
