import React from 'react';
import { Modal, Form, Input, Switch, Tree } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FolderOutlined } from '@ant-design/icons';

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

  .modal-parent-tree {
    .ant-tree-node-content-wrapper {
      padding: 0 4px;
      min-height: 20px;
      line-height: 20px;
    }

    .ant-tree-switcher {
      width: 16px;
      height: 20px;
      line-height: 20px;
      
      .ant-tree-switcher-icon {
        font-size: 10px;
      }
    }

    .ant-tree-title {
      line-height: 16px;
    }

    .ant-tree-indent-unit {
      width: 12px;
    }
  }

  .ant-modal-header::after {
    display: none !important;
  }

  .ant-modal-footer::before {
    display: none !important;
  }
`;

const AddUserProductCategoryModal = ({ visible, onCancel, onFinish, form, categories, currentParentId }) => {
  const { t } = useTranslation();

  const findCurrentNode = (data, targetId) => {
    for (const item of data) {
      if (item.id === targetId) {
        return item;
      }
      if (item.children) {
        const found = findCurrentNode(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const renderTreeNodes = (data) =>
    data.map((item) => ({
      title: (
        <div style={{ 
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 0'
        }}>
          <FolderOutlined style={{ fontSize: '10px', color: 'var(--cui-primary)' }} />
          <span>{item.name}</span>
          <span style={{ 
            color: 'var(--cui-text-secondary)',
            fontSize: '9px'
          }}>({item.i18nKey})</span>
        </div>
      ),
      key: item.id,
      children: item.children && item.children.length > 0 ? renderTreeNodes(item.children) : undefined,
    }));

  return (
    <StyledModal
      title={t('addCategory')}
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
        initialValues={{ 
          status: true,
          parentId: currentParentId || 0
        }}
      >
        <Form.Item
          name="i18nKey"
          label={t('i18nKey')}
          rules={[
            { required: true, message: t('pleaseEnterI18nKey') },
            { pattern: /^[a-zA-Z0-9._-]+$/, message: t('i18nKeyFormatError') }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label={t('categoryName')}
          rules={[
            { required: true, message: t('pleaseEnterCategoryName') },
            { max: 50, message: t('categoryNameTooLong') }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="parentId"
          label={t('parentCategory')}
        >
          <Tree
            treeData={renderTreeNodes(categories)}
            height={160}
            defaultExpandAll
            selectable
            defaultSelectedKeys={currentParentId ? [currentParentId] : []}
            onSelect={(selectedKeys) => {
              if (selectedKeys.length) {
                form.setFieldsValue({ parentId: selectedKeys[0] });
              } else {
                form.setFieldsValue({ parentId: 0 });
              }
            }}
            style={{
              border: '1px solid var(--cui-border-color)',
              borderRadius: '4px',
              padding: '4px',
              fontSize: '10px'
            }}
            className="modal-parent-tree"
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

export default AddUserProductCategoryModal;
