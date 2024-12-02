import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
    
    .ant-modal-header {
      margin-bottom: 8px;
      border-bottom: none !important;
      padding-bottom: 0;
    }

    .ant-modal-body {
      padding: 8px 0;
    }

    .ant-modal-footer {
      margin-top: 8px;
      padding: 8px 0 0;
      border-top: none !important;
    }
  }

  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item {
      margin-bottom: 4px;
    }

    .ant-form-item-label {
      padding: 0;
      
      > label {
        font-size: 10px;
        color: #666;
        height: 20px;
      }
    }

    .ant-input,
    .ant-select-selector {
      font-size: 10px;
      height: 24px !important;
      line-height: 24px;
      padding: 0 8px;
    }

    textarea.ant-input {
      height: auto !important;
      min-height: 48px;
      padding: 4px 8px;
    }
  }

  .ant-modal-footer .ant-btn {
    height: 24px;
    padding: 0 12px;
    font-size: 10px;
  }

  .ant-modal-header::after {
    display: none !important;
  }

  .ant-modal-footer::before {
    display: none !important;
  }
`;

const UpdateUserProductCategoryModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  categories,
  selectedCategory
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (visible && selectedCategory) {
      form.setFieldsValue({
        ...selectedCategory,
        status: selectedCategory.status === 1
      });
    }
  }, [visible, selectedCategory, form]);

  const availableParentCategories = categories.filter(
    category => category.id !== selectedCategory?.id
  );

  return (
    <StyledModal
      title={t('editCategory')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={400}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="i18nKey"
          label={t('i18nKey')}
          rules={[
            { required: true, message: t('pleaseEnterI18nKey') },
            { pattern: /^[a-zA-Z0-9._-]+$/, message: t('i18nKeyFormatError') }
          ]}
        >
          <Input placeholder={t('i18nKeyPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="name"
          label={t('categoryName')}
          rules={[
            { required: true, message: t('pleaseEnterCategoryName') },
            { max: 50, message: t('categoryNameTooLong') }
          ]}
        >
          <Input placeholder={t('categoryNamePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="parentId"
          label={t('parentCategory')}
        >
          <Select
            allowClear
            placeholder={t('selectParentCategory')}
            options={availableParentCategories.map(category => ({
              value: category.id,
              label: category.name
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description')}
          rules={[
            { max: 200, message: t('descriptionTooLong') }
          ]}
        >
          <Input.TextArea
            placeholder={t('descriptionPlaceholder')}
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('status')}
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t('enabled')}
            unCheckedChildren={t('disabled')}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default UpdateUserProductCategoryModal;

