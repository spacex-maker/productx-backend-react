import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateUserProductCategoryModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  categories,
  selectedCategory,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (visible && selectedCategory) {
      form.setFieldsValue({
        ...selectedCategory,
        status: selectedCategory.status === 1,
      });
    }
  }, [visible, selectedCategory, form]);

  const availableParentCategories = categories.filter(
    (category) => category.id !== selectedCategory?.id,
  );

  return (
    <Modal
      title={t('editCategory')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="i18nKey"
              label={t('i18nKey')}
              rules={[
                { required: true, message: t('pleaseEnterI18nKey') },
                { pattern: /^[a-zA-Z0-9._-]+$/, message: t('i18nKeyFormatError') },
              ]}
            >
              <Input autocomplete="off" placeholder={t('i18nKeyPlaceholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t('categoryName')}
              rules={[
                { required: true, message: t('pleaseEnterCategoryName') },
                { max: 50, message: t('categoryNameTooLong') },
              ]}
            >
              <Input autocomplete="off" placeholder={t('categoryNamePlaceholder')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="parentId" label={t('parentCategory')}>
          <Select
            allowClear
            placeholder={t('selectParentCategory')}
            options={availableParentCategories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ max: 200, message: t('descriptionTooLong') }]}
        >
          <Input.TextArea
            placeholder={t('descriptionPlaceholder')}
            rows={6}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item name="status" label={t('status')} valuePropName="checked">
          <Switch checkedChildren={t('enabled')} unCheckedChildren={t('disabled')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserProductCategoryModal;
