import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Tree, Modal, Switch, Space, Card } from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, FolderOutlined, EditOutlined, RollbackOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyledCard = styled(Card)`
  background: var(--cui-card-bg);
  color: var(--cui-body-color);

  .ant-card-body {
    background: var(--cui-card-bg);
  }

  .ant-tree {
    background: var(--cui-card-bg);
    color: var(--cui-body-color);
  }

  .ant-tree-node-content-wrapper:hover {
    background-color: var(--cui-btn-hover-bg);
  }

  .ant-tree-node-selected {
    background-color: var(--cui-btn-active-bg) !important;
  }

  .ant-tree-switcher {
    color: var(--cui-body-color);
  }

  .ant-tree-node-content-wrapper {
    color: var(--cui-body-color);
  }

  .ant-modal-content {
    background: var(--cui-card-bg);
  }

  .ant-modal-header {
    background: var(--cui-card-bg);
  }

  .ant-modal-body {
    background: var(--cui-card-bg);
  }

  .ant-modal-footer {
    background: var(--cui-card-bg);
  }
`;

const UserProductCategory = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const sidebarUnfoldable = useSelector((state) => state.sidebarUnfoldable);
  const [currentParentId, setCurrentParentId] = useState(0);
  const [categoryPath, setCategoryPath] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (parentId = 0) => {
    try {
      const response = await api.get('/manage/user-product-category/list', {
        params: { parentId }
      });
        const processedData = processTreeData(response);
        setCategories(processedData);
        setCurrentParentId(parentId);

        if (parentId !== 0) {
          const currentCategory = findCategoryById(categories, parentId);
          if (currentCategory && !categoryPath.find(item => item.id === currentCategory.id)) {
            setCategoryPath([...categoryPath, currentCategory]);
          }

      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      message.error(t('fetchFailed'));
    }
  };

  const processTreeData = (data) => {
    const map = {};
    const result = [];

    data.forEach(item => {
      map[item.id] = {
        ...item,
        children: [],
      };
    });

    data.forEach(item => {
      const node = map[item.id];
      if (item.parentId === 0 || !item.parentId) {
        result.push(node);
      } else {
        if (map[item.parentId]) {
          map[item.parentId].children.push(node);
        }
      }
    });

    return result;
  };

  const getAllKeys = (data) => {
    const keys = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
        keys.push(node.id);
        if (node.children && node.children.length) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return keys;
  };

  const handleAddCategory = (parentId = 0) => {
    setSelectedCategory(null);
    form.resetFields();
    form.setFieldsValue({ parentId });
    setIsModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        parentId: values.parentId || 0,
        status: values.status ? 1 : 0
      };

      if (selectedCategory) {
        await api.put('/manage/user-product-category/update', { 
          ...submitData, 
          id: selectedCategory.id 
        });
      } else {
        await api.post('/manage/user-product-category/create', submitData);
      }
      message.success(t('operationSuccess'));
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error(t('operationFailed'));
    }
  };

  const renderTreeNodes = (data) =>
    data.map((item) => ({
      title: (
        <Space>
          <FolderOutlined style={{ color: 'var(--cui-primary)' }} />
          <span>{item.name}</span>
          <span style={{ color: 'var(--cui-text-secondary)', fontSize: '12px' }}>({item.i18nKey})</span>
          {item.description && (
            <span style={{ color: 'var(--cui-text-secondary)', fontSize: '12px' }}>- {item.description}</span>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(item);
            }}
            style={{ color: 'var(--cui-primary)' }}
          />
        </Space>
      ),
      key: item.id,
      children: item.children && item.children.length > 0 ? renderTreeNodes(item.children) : undefined,
    }));

  const findCategoryById = (data, id) => {
    for (const item of data) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findCategoryById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleGoBack = () => {
    if (categoryPath.length > 0) {
      const newPath = [...categoryPath];
      newPath.pop();
      setCategoryPath(newPath);
      
      const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : 0;
      fetchCategories(parentId);
    } else {
      fetchCategories(0);
    }
  };

  return (
    <StyledCard>
      <div style={{ marginBottom: 16 }}>
        <Space>
          {currentParentId !== 0 && (
            <Button
              icon={<RollbackOutlined />}
              onClick={handleGoBack}
              style={{ 
                backgroundColor: 'var(--cui-primary)',
                borderColor: 'var(--cui-primary)',
                color: 'var(--cui-btn-color)'
              }}
            >
              {t('goBack')}
            </Button>
          )}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => handleAddCategory(currentParentId)}
            style={{ 
              backgroundColor: 'var(--cui-primary)',
              borderColor: 'var(--cui-primary)',
              color: 'var(--cui-btn-color)'
            }}
          >
            {t('addCategory')}
          </Button>
        </Space>
        {categoryPath.length > 0 && (
          <div style={{ 
            marginTop: 8,
            color: 'var(--cui-text-secondary)',
            fontSize: '12px'
          }}>
            {t('currentPath')}: {categoryPath.map((category, index) => (
              <span key={category.id}>
                {index > 0 && ' > '}
                <span style={{ color: 'var(--cui-primary)' }}>{category.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <Tree
        showLine={{ 
          showLeafIcon: false,
          color: 'var(--cui-border-color)' 
        }}
        showIcon
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        treeData={renderTreeNodes(categories)}
        onSelect={(selectedKeys, { node }) => {
          if (selectedKeys.length) {
            fetchCategories(node.key);
          }
        }}
        draggable
        blockNode
        style={{
          backgroundColor: 'var(--cui-card-bg)',
          border: '1px solid var(--cui-border-color)',
          borderRadius: 'var(--cui-border-radius)',
          padding: 'var(--cui-card-spacer-y) var(--cui-card-spacer-x)'
        }}
      />

      <Modal
        title={selectedCategory ? t('editCategory') : t('addCategory')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
        styles={{
          header: {
            borderBottom: '1px solid var(--cui-border-color)',
            padding: 'var(--cui-card-cap-padding-y) var(--cui-card-cap-padding-x)',
            marginBottom: 'var(--cui-card-spacer-y)'
          },
          body: {
            backgroundColor: 'var(--cui-card-bg)'
          },
          footer: {
            borderTop: '1px solid var(--cui-border-color)',
            padding: 'var(--cui-card-cap-padding-y) var(--cui-card-cap-padding-x)',
            marginTop: 'var(--cui-card-spacer-y)'
          }
        }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{ status: true }}
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
            label={t('name')} 
            rules={[{ required: true, message: t('pleaseEnterName') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            name="parentId" 
            label={t('parentCategory')}
          >
            <Tree
              treeData={renderTreeNodes(categories)}
              height={200}
              defaultExpandAll
              selectable
              onSelect={(selectedKeys) => {
                if (selectedKeys.length) {
                  form.setFieldsValue({ parentId: selectedKeys[0] });
                }
              }}
              style={{
                border: '1px solid var(--cui-border-color)',
                borderRadius: 'var(--cui-border-radius)',
                padding: 'var(--cui-card-spacer-y) var(--cui-card-spacer-x)'
              }}
            />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label={t('description')}
          >
            <Input.TextArea rows={3} />
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
      </Modal>
    </StyledCard>
  );
};

export default UserProductCategory;
