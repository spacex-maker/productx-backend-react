import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Table, message, Spin, Input, Space, Radio, Tree, Tag, Badge } from 'antd';
import { SearchOutlined, MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const RolePermissionModal = ({ visible, onCancel, roleId, roleName }) => {
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [currentRolePermissions, setCurrentRolePermissions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 获取所有权限列表
  const fetchAllPermissions = async () => {
    try {
      const response = await api.get('/manage/admin-permissions/list-all');
      if (response) {
        setAllPermissions(response);
      }
    } catch (error) {
      message.error('获取权限列表失败');
    }
  };

  // 获取当前角色的权限
  const fetchRolePermissions = async () => {
    try {
      const response = await api.get(`/manage/role-permissions/list/${roleId}`);
      if (response) {
        setCurrentRolePermissions(response);
        const actualPermissions = response.map(item => item.permissionId);
        setSelectedPermissions(actualPermissions);
      }
    } catch (error) {
      message.error('获取角色权限失败');
    }
  };

  useEffect(() => {
    if (visible && roleId) {
      setLoading(true);
      Promise.all([fetchAllPermissions(), fetchRolePermissions()])
        .finally(() => setLoading(false));
    }
  }, [visible, roleId]);

  const handleOk = async () => {
    try {
      setLoading(true);
      // 确保 selectedPermissions 是一个数组
      const permissionIds = Array.isArray(selectedPermissions) 
        ? selectedPermissions 
        : (selectedPermissions.checked || []);

      await api.post('/manage/role-permissions/configure', {
        roleId,
        permissionIds
      });
      message.success('权限配置成功');
      onCancel();
    } catch (error) {
      message.error('权限配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取权限类型的颜色
  const getTypeColor = (type) => {
    switch (type) {
      case 1: return '#1890ff';  // 菜单 - 蓝色
      case 2: return '#52c41a';  // 接口 - 绿色
      case 3: return '#722ed1';  // 按钮 - 紫色
      case 4: return '#fa8c16';  // 业务 - 橙色
      default: return '#999';
    }
  };

  // 获取权限类型的图标
  const getTypeIcon = (type) => {
    switch (type) {
      case 1: return <MenuOutlined />;
      case 2: return <ApiOutlined />;
      case 3: return <ControlOutlined />;
      case 4: return <AppstoreOutlined />;
      default: return null;
    }
  };

  // 获取权限类型的名称
  const getTypeName = (type) => {
    switch (type) {
      case 1: return '菜单';
      case 2: return '接口';
      case 3: return '按钮';
      case 4: return '业务';
      default: return '未知';
    }
  };

  // 将权限列表转换为树形结构
  const convertToTree = (permissions) => {
    const filteredPermissions = permissions.filter(item => item.type === 1 || item.type === 3);
    const nodeMap = new Map();
    
    filteredPermissions.forEach(item => {
      nodeMap.set(item.id, {
        key: item.id,
        id: item.id,
        title: (
          <div className="tree-node-content" style={{ 
            display: 'flex', 
            width: '100%',
            minWidth: 0,
            padding: '4px 0'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Space>
                <span style={{ fontWeight: 500 }}>{item.permissionName}</span>
                {item.isSystem && (
                  <Tag size="small">系统权限</Tag>
                )}
              </Space>
              <div style={{ 
                fontSize: '12px', 
                marginTop: '4px',
                opacity: 0.65
              }}>
                {item.permissionNameEn}
              </div>
            </div>
            <Space style={{ 
              marginLeft: 'auto',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {getTypeIcon(item.type)}
              <span style={{ fontSize: '12px' }}>{getTypeName(item.type)}</span>
            </Space>
          </div>
        ),
        children: [],
        ...item
      });
    });

    // 构建树形结构
    const tree = [];
    nodeMap.forEach(node => {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    // 移除空的children数组
    const removeEmptyChildren = (nodes) => {
      nodes.forEach(node => {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          removeEmptyChildren(node.children);
        }
      });
    };
    removeEmptyChildren(tree);

    return tree;
  };

  // 过滤树节点
  const filterTreeNode = (node) => {
    const matchSearch = (
      node.permissionName?.toLowerCase().includes(searchText.toLowerCase()) ||
      node.permissionNameEn?.toLowerCase().includes(searchText.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const matchType = filterType === 'all' ||
      (filterType === 'menu' && node.type === 1) ||
      (filterType === 'api' && node.type === 2) ||
      (filterType === 'button' && node.type === 3) ||
      (filterType === 'business' && node.type === 4);

    return matchSearch && matchType;
  };

  // 转换为树形结构的权限数据
  const treeData = useMemo(() => {
    return convertToTree(allPermissions);
  }, [allPermissions]);

  // 根据筛选类型决定是否显示树形结构
  const showAsTree = filterType === 'all';

  // 获取列表数据
  const listData = useMemo(() => {
    return allPermissions.filter(item => {
      const matchSearch = (
        item.permissionName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.permissionNameEn?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchType = filterType === 'all' ||
        (filterType === 'menu' && item.type === 1) ||
        (filterType === 'api' && item.type === 2) ||
        (filterType === 'button' && item.type === 3) ||
        (filterType === 'business' && item.type === 4);

      return matchSearch && matchType;
    });
  }, [allPermissions, searchText, filterType]);

  // 表格列定义
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      width: '45%',
      render: (text, record) => (
        <Space direction="vertical" size={1}>
          <Space>
            <span>{text}</span>
            {record.isSystem && (
              <span style={{
                display: 'inline-block',
                height: '20px',
                padding: '0 8px',
                fontSize: '12px',
                lineHeight: '20px',
                borderRadius: '4px',
                background: 'rgba(24, 144, 255, 0.1)',
                border: '1px solid rgba(24, 144, 255, 0.2)',
                color: '#1890ff'
              }}>系统权限</span>
            )}
          </Space>
          <span type="secondary">{record.permissionNameEn}</span>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '35%',
      ellipsis: true,
      render: (text) => (
        <span style={{ fontSize: '10px' }}>{text}</span>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '20%',
      render: (type) => (
        <div style={{ 
          color: getTypeColor(type),
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {getTypeIcon(type)}
          {getTypeName(type)}
        </div>
      )
    }
  ];

  // 阻止滚动传导
  const handleWheel = (e) => {
    e.stopPropagation();
  };

  // 修改 Tree 组件的选择处理
  const onCheck = (checkedKeys, info) => {
    // 如果 checkedKeys 是对象（包含 checked 和 halfChecked），直接使用
    // 如果是数组，则创建一个新的数组
    setSelectedPermissions(
      typeof checkedKeys === 'object' ? checkedKeys : [...checkedKeys]
    );
  };

  // 添加响应式样式
  const responsiveStyles = `
    .filter-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      gap: 16px;
    }

    .filter-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    @media screen and (max-width: 768px) {
      .filter-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .filter-left {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
      }

      .search-input {
        width: 100% !important;
      }

      .filter-radio-group {
        width: 100%;
      }
    }

    .permission-tree .ant-tree-treenode {
      width: 100%;
      padding: 4px 8px !important;
      border-radius: 4px;
    }

    .permission-tree .ant-tree-node-content-wrapper {
      flex: 1;
      min-width: 0;
    }

    .permission-tree .ant-tree-node-content-wrapper:hover {
      background: transparent;
    }

    .permission-tree .ant-tree-treenode:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .permission-tree .ant-tree-node-selected {
      background-color: transparent !important;
    }

    .permission-tree .ant-tree-indent-unit {
      width: 24px;
    }

    @media screen and (max-width: 768px) {
      .tree-node-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      
      .tree-node-content > div:last-child {
        margin-left: 0;
      }
    }
  `;

  return (
    <Modal
      title={
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>配置权限</div>
          <div style={{ 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px' 
          }}>
            <span>当前角色：</span>
            <Tag>{roleName}</Tag>
          </div>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={1200}
      confirmLoading={loading}
      bodyStyle={{ 
        padding: '24px',
        maxHeight: 'calc(100vh - 300px)',  // 调整为更小的高度，确保能看到整个模态框
        overflow: 'hidden'
      }}
    >
      <style>{responsiveStyles}</style>
      <Spin spinning={loading}>
        <Space 
          direction="vertical" 
          style={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }} 
          size={16}
        >
          <div className="filter-container">
            <div className="filter-left">
              <Input
                className="search-input"
                placeholder="搜索权限名称/描述"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
                style={{ 
                  width: '280px',
                  borderRadius: '6px'
                }}
              />
              <Radio.Group
                className="filter-radio-group"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <Radio.Button value="all" style={{ borderRadius: '6px' }}>全部</Radio.Button>
                <Radio.Button value="menu" style={{ borderRadius: '6px' }}><MenuOutlined /> 菜单</Radio.Button>
                <Radio.Button value="api" style={{ borderRadius: '6px' }}><ApiOutlined /> 接口</Radio.Button>
                <Radio.Button value="button" style={{ borderRadius: '6px' }}><ControlOutlined /> 按钮</Radio.Button>
                <Radio.Button value="business" style={{ borderRadius: '6px' }}><AppstoreOutlined /> 业务</Radio.Button>
              </Radio.Group>
            </div>
            <Badge count={selectedPermissions.length}>
              <Tag style={{ margin: 0 }}>已选择权限</Tag>
            </Badge>
          </div>

          <div 
            style={{ 
              flex: 1,
              minHeight: '400px',
              height: 'calc(100vh - 500px)',
              overflow: 'hidden',
              borderRadius: '8px',
            }}
          >
            {showAsTree ? (
              <div style={{ height: '100%', overflow: 'auto' }}>
                <Tree
                  checkable
                  checkedKeys={selectedPermissions}
                  onCheck={onCheck}
                  treeData={treeData}
                  filterTreeNode={filterTreeNode}
                  showLine={{ showLeafIcon: false }}
                  checkStrictly={true}
                  style={{ 
                    padding: '12px'
                  }}
                  className="permission-tree"
                />
              </div>
            ) : (
              <div style={{ height: '100%', overflow: 'auto' }}> {/* 添加滚动容器 */}
                <Table
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: Array.isArray(selectedPermissions) 
                      ? selectedPermissions 
                      : (selectedPermissions.checked || []),
                    onChange: (selectedRowKeys) => setSelectedPermissions(selectedRowKeys)
                  }}
                  columns={columns}
                  dataSource={listData}
                  rowKey="id"
                  size="middle"
                  pagination={false}
                  style={{ 
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </div>
        </Space>
      </Spin>
    </Modal>
  );
};

export default RolePermissionModal;
