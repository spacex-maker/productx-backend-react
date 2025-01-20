import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Tree,
  Modal,
  Switch,
  Space,
  Card,
  Spin,
  Popconfirm,
} from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';
import {
  PlusOutlined,
  FolderOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import AddUserProductCategoryModal from './AddUserProductCategoryModal';
import UpdateUserProductCategoryModal from './UpdateUserProductCategoryModal';

const StyledCard = styled(Card)`
  background: var(--cui-card-bg);
  color: var(--cui-body-color);

  .ant-card-body {
    background: var(--cui-card-bg);
  }

  .ant-tree {
    background: var(--cui-card-bg);
    color: var(--cui-body-color);

    // 节点容器样式
    .ant-tree-node-content-wrapper {
      color: var(--cui-body-color);
      transition: all 0.3s ease;
      padding: 4px 8px;
      margin: 2px 0;
      border-radius: 4px;

      // 悬停效果
      &:hover {
        background-color: rgba(var(--cui-primary-rgb), 0.1) !important;
        .ant-btn {
          opacity: 1;
        }
      }

      // 选中效果
      &.ant-tree-node-selected {
        background-color: rgba(var(--cui-primary-rgb), 0.15) !important;
        box-shadow: 0 0 0 1px rgba(var(--cui-primary-rgb), 0.2);

        .node-title {
          color: var(--cui-primary);
          font-weight: 500;
        }

        .node-key {
          color: rgba(var(--cui-primary-rgb), 0.7);
        }
      }
    }

    // 展开/折叠图标
    .ant-tree-switcher {
      color: var(--cui-body-color);
      transition: all 0.3s ease;

      &:hover {
        color: var(--cui-primary);
      }
    }
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
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (parentId = 0) => {
    setLoading(true);
    try {
      const response = await api.get('/manage/user-product-category/list', {
        params: { parentId },
      });

      setCategories(response);
      setCurrentParentId(parentId);

      if (parentId !== 0) {
        const findCategory = (categories, id) => {
          for (const cat of categories) {
            if (cat.id === id) return cat;
            if (cat.children && cat.children.length) {
              const found = findCategory(cat.children, id);
              if (found) return found;
            }
          }
          return null;
        };

        const currentCategory = findCategory(categories, parentId);
        if (currentCategory && !categoryPath.find((item) => item.id === currentCategory.id)) {
          setCategoryPath((prev) => [...prev, currentCategory]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      message.error(t('fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleTreeNodeSelect = (selectedKeys, { node }) => {
    if (selectedKeys.length) {
      const nodeId = node.key;
      fetchCategories(nodeId);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    form.resetFields();
    form.setFieldsValue({
      parentId: currentParentId,
      status: true,
    });
    setIsModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        parentId: values.parentId || 0,
        status: values.status ? 1 : 0,
      };

      await api.put('/manage/user-product-category/update', {
        ...submitData,
        id: selectedCategory.id,
      });

      message.success(t('operationSuccess'));
      setIsUpdateModalVisible(false);
      fetchCategories(currentParentId);
    } catch (error) {
      console.error('Update failed:', error);
      message.error(t('operationFailed'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.post(`/manage/user-product-category/remove`, { id });
      message.success(t('deleteSuccess'));
      fetchCategories(currentParentId);
    } catch (error) {
      console.error('Delete failed:', error);
      message.error(t('deleteFailed'));
    }
  };

  const renderTreeNodes = (data) =>
    data.map((item) => ({
      title: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Space>
            <FolderOutlined
              style={{
                color: 'var(--cui-primary)',
                transition: 'transform 0.3s ease',
              }}
              className="folder-icon"
            />
            <span className="node-title">{item.name}</span>
            <span
              className="node-key"
              style={{
                color: 'var(--cui-text-secondary)',
                fontSize: '12px',
                transition: 'color 0.3s ease',
              }}
            >
              ({item.i18nKey})
            </span>
            {item.description && (
              <span
                className="node-description"
                style={{
                  color: 'var(--cui-text-secondary)',
                  fontSize: '12px',
                  transition: 'color 0.3s ease',
                }}
              >
                - {item.description}
              </span>
            )}
          </Space>
          <Space size={4} style={{ marginLeft: 8 }}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditCategory(item);
              }}
              style={{
                color: 'var(--cui-primary)',
                padding: '4px',
                height: 'auto',
              }}
            />
            <Popconfirm
              title={t('deleteConfirm')}
              onConfirm={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              onCancel={(e) => e.stopPropagation()}
              okText={t('confirm')}
              cancelText={t('cancel')}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
                style={{
                  padding: '4px',
                  height: 'auto',
                }}
              />
            </Popconfirm>
          </Space>
        </div>
      ),
      key: item.id,
      children:
        item.children && item.children.length > 0 ? renderTreeNodes(item.children) : undefined,
    }));

  const handleGoBack = () => {
    if (categoryPath.length > 0) {
      const newPath = [...categoryPath];
      newPath.pop();
      setCategoryPath(newPath);

      const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : 0;
      fetchCategories(parentId);
    }
  };

  const renderModalTreeNodes = (data) =>
    data.map((item) => ({
      title: (
        <div
          style={{
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 0',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FolderOutlined style={{ fontSize: '10px', color: 'var(--cui-primary)' }} />
            <span>{item.name}</span>
            <span
              style={{
                color: 'var(--cui-text-secondary)',
                fontSize: '9px',
              }}
            >
              ({item.i18nKey})
            </span>
          </div>
          <Button
            type="link"

            icon={<EditOutlined style={{ fontSize: '10px' }} />}
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(item);
            }}
            style={{
              padding: '0 4px',
              height: '16px',
              color: 'var(--cui-primary)',
              opacity: 0.7,
            }}
          />
        </div>
      ),
      key: item.id,
      children:
        item.children && item.children.length > 0 ? renderModalTreeNodes(item.children) : undefined,
    }));

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        parentId: values.parentId || 0,
        status: values.status ? 1 : 0,
      };

      await api.post('/manage/user-product-category/add', submitData);

      message.success(t('operationSuccess'));
      setIsModalVisible(false);
      fetchCategories(currentParentId);
    } catch (error) {
      console.error('Add failed:', error);
      message.error(t('operationFailed'));
    }
  };

  return (
    <StyledCard>
      <div style={{ marginBottom: 16 }}>
        <Space>
          {currentParentId !== 0 && (
            <Button icon={<RollbackOutlined />} onClick={handleGoBack} loading={loading}>
              {loading ? t('loading') : t('goBack')}
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddCategory(currentParentId)}
            disabled={loading}
          >
            {t('addCategory')}
          </Button>
        </Space>
        {categoryPath.length > 0 && (
          <div
            style={{
              marginTop: 8,
              color: 'var(--cui-text-secondary)',
              fontSize: '12px',
            }}
          >
            {t('currentCategory')}:{' '}
            {categoryPath.map((category, index) => (
              <span key={category.id}>
                {index > 0 && ' > '}
                <span style={{ color: 'var(--cui-primary)' }}>{category.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <Spin spinning={loading}>
        <Tree
          showLine={{
            showLeafIcon: false,
          }}
          showIcon
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          treeData={renderTreeNodes(categories)}
          onSelect={handleTreeNodeSelect}
          draggable
          blockNode
          disabled={loading}
          style={{
            backgroundColor: 'var(--cui-card-bg)',
            border: '1px solid var(--cui-border-color)',
            borderRadius: 'var(--cui-border-radius)',
            padding: 'var(--cui-card-spacer-y) var(--cui-card-spacer-x)',
          }}
        />
      </Spin>

      <AddUserProductCategoryModal
        visible={isModalVisible && !selectedCategory}
        onCancel={() => setIsModalVisible(false)}
        onFinish={handleSubmit}
        form={form}
        categories={categories}
        currentParentId={currentParentId}
      />

      <UpdateUserProductCategoryModal
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onFinish={handleUpdateSubmit}
        form={updateForm}
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </StyledCard>
  );
};

export default UserProductCategory;
