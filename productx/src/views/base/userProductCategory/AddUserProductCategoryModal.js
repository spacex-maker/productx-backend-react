import React from 'react';
import { Modal, Form, Input, Switch, Tree, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { FolderOutlined } from '@ant-design/icons';

const AddUserProductCategoryModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  categories,
  currentParentId,
}) => {
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 0',
          }}
        >
          <FolderOutlined style={{ color: 'var(--cui-primary)' }} />
          <span>{item.name}</span>
          <span
            style={{
              color: 'var(--cui-text-secondary)',
            }}
          >
            ({item.i18nKey})
          </span>
        </div>
      ),
      key: item.id,
      children:
        item.children && item.children.length > 0 ? renderTreeNodes(item.children) : undefined,
    }));

  return (
    <Modal
      title={t('addCategory')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: true,
          parentId: currentParentId || 0,
        }}
      >
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
              <Input autocomplete="off" />
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
              <Input autocomplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="parentId" label={t('parentCategory')}>
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
            }}
            className="modal-parent-tree"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ max: 200, message: t('descriptionTooLong') }]}
        >
          <Input.TextArea rows={6} showCount maxLength={200} />
        </Form.Item>
        <Form.Item name="status" label={t('status')} valuePropName="checked">
          <Switch checkedChildren={t('enabled')} unCheckedChildren={t('disabled')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserProductCategoryModal;
