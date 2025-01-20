import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Table, message, Spin, Input, Space, Radio, Tree } from 'antd';
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

  // 将权限列表转换为树形结构
  const convertToTree = (permissions) => {
    // 首先过滤出菜单和按钮类型的权限
    const filteredPermissions = permissions.filter(item => item.type === 1 || item.type === 3);
    
    const nodeMap = new Map();
    
    filteredPermissions.forEach(item => {
      nodeMap.set(item.id, {
        key: item.id,
        id: item.id,
        title: (
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '4px',
            padding: '2px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                marginBottom: '1px'
              }}>
                <span style={{ 
                  color: item.isSystem ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
                  fontWeight: item.isSystem ? 500 : 400,
                  lineHeight: '14px'
                }}>
                  {item.permissionName}
                </span>
                {item.isSystem && (
                  <span style={{ 
                    color: '#1890ff',
                    border: '1px solid #1890ff',
                    padding: '0 4px',
                    borderRadius: '2px',
                    lineHeight: '14px',
                    height: '14px',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}>
                    系统权限
                  </span>
                )}
              </div>
              <span style={{ 
                color: '#999',
                fontWeight: 400,
                lineHeight: '12px'
              }}>
                {item.permissionNameEn}
              </span>
            </div>
            <div style={{ 
              color: getTypeColor(item.type),
              minWidth: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getTypeIcon(item.type)}
              {getTypeName(item.type)}
            </div>
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

  // 获取权限类型的颜色
  const getTypeColor = (type) => {
    switch (type) {
      case 1: return '#1890ff';
      case 2: return '#52c41a';
      case 3: return '#722ed1';
      case 4: return '#fa8c16';
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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              marginBottom: '2px'
            }}>
              <span style={{ 
                color: record.isSystem ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
                fontWeight: record.isSystem ? 500 : 400,
              }}>
                {text}
              </span>
              {record.isSystem && (
                <span style={{ 
                  color: '#1890ff',
                  border: '1px solid #1890ff',
                  padding: '0 4px',
                  borderRadius: '2px',
                  lineHeight: '14px',
                  height: '16px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  系统权限
                </span>
              )}
            </div>
            <span style={{ 
              color: '#999',
              fontWeight: 400
            }}>
              {record.permissionNameEn}
            </span>
          </div>
        </div>
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

  return (
    <Modal
      title={
        <div className="modal-title">
          <div>配置权限</div>
          <div>当前角色：{roleName}</div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div className="header-container">
            <Space size="small">
              <Input
                placeholder="搜索权限名称/描述"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                size="small"
                allowClear
              />
              <Radio.Group
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="all">全部</Radio.Button>
                <Radio.Button value="menu"><MenuOutlined /> 菜单</Radio.Button>
                <Radio.Button value="api"><ApiOutlined /> 接口</Radio.Button>
                <Radio.Button value="button"><ControlOutlined /> 按钮</Radio.Button>
                <Radio.Button value="business"><AppstoreOutlined /> 业务</Radio.Button>
              </Radio.Group>
            </Space>
            <div className="selected-count">
              已选择 {selectedPermissions.length} 项权限
            </div>
          </div>

          <div className="content-container" onWheel={handleWheel}>
            {showAsTree ? (
              <div className="tree-container">
                <Tree
                  checkable
                  checkedKeys={selectedPermissions}
                  onCheck={onCheck}
                  treeData={treeData}
                  filterTreeNode={filterTreeNode}
                  showLine={{ showLeafIcon: false }}
                  checkStrictly={true}
                />
              </div>
            ) : (
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
                size="small"
                pagination={false}
                scroll={{ y: 400 }}
              />
            )}
          </div>
        </Space>
      </Spin>
    </Modal>
  );
};

export default RolePermissionModal;
