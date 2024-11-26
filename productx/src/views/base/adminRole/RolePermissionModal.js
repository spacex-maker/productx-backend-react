import React, { useState, useEffect } from 'react';
import { Modal, Table, message, Spin, Input, Space, Radio, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
        setSelectedPermissions(response.map(item => item.permissionId));
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
      await api.post('/manage/role-permissions/configure', {
        roleId,
        permissionIds: selectedPermissions
      });
      message.success('权限配置成功');
      onCancel();
    } catch (error) {
      message.error('权限配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索和筛选
  const filteredPermissions = allPermissions.filter(item => {
    const matchSearch = (
      item.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.permissionNameEn.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const matchType = filterType === 'all' ||
      (filterType === 'menu' && item.type === 1) ||
      (filterType === 'api' && item.type === 2);

    return matchSearch && matchType;
  });

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '英文名称',
      dataIndex: 'permissionNameEn',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '10%',
      render: (type) => (
        <span style={{
          color: type === 1 ? '#1890ff' : '#52c41a',
          fontWeight: 500
        }}>
          {type === 1 ? '菜单' : '接口'}
        </span>
      )
    },
  ];

  return (
    <Modal
      title={
        <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>配置权限</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            当前角色：{roleName}
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={1000}
      confirmLoading={loading}
      bodyStyle={{ padding: '12px 24px' }}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Space>
              <Input
                placeholder="搜索权限名称/描述"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 200 }}
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
                <Radio.Button value="menu">菜单权限</Radio.Button>
                <Radio.Button value="api">接口权限</Radio.Button>
              </Radio.Group>
            </Space>
            <div style={{ color: '#666', fontSize: '12px' }}>
              已选择 {selectedPermissions.length} 项权限
            </div>
          </div>

          <Table
            rowSelection={{
              selectedRowKeys: selectedPermissions,
              onChange: (selectedRowKeys) => setSelectedPermissions(selectedRowKeys),
            }}
            columns={columns}
            dataSource={filteredPermissions}
            rowKey="id"
            size="small"
            scroll={{ y: 400 }}
            pagination={false}
            rowClassName={(record) => record.status ? '' : 'disabled-row'}
          />
        </Space>
      </Spin>

      <style jsx>{`
        .disabled-row {
          background-color: #fafafa;
          opacity: 0.7;
        }
        .ant-table-row:hover {
          background-color: #f5f5f5;
        }
        .ant-table-row-selected {
          background-color: #e6f7ff;
        }
      `}</style>
    </Modal>
  );
};

export default RolePermissionModal;
