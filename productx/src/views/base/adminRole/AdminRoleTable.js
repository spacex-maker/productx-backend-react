import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { formatDate } from 'src/components/common/Common';
import RolePermissionModal from './RolePermissionModal';
import { EditOutlined, DeleteOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';

const AdminRoleTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDeleteClick,
  handleViewDetail,
}) => {
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  const handleConfigPermissions = (role) => {
    setCurrentRole(role);
    setIsPermissionModalVisible(true);
  };

  // 判断是否为超级管理员角色
  const isSuperAdmin = (role) => {
    return role.roleNameEn === 'super_admin' || role.id <= 18; // 可以根据实际情况调整判断条件
  };

  const renderActionButtons = (item) => {
    const isSuper = isSuperAdmin(item);

    return (
      <td className="fixed-column">
        <Button type="link" onClick={() => handleViewDetail(item)}>
          <EyeOutlined /> 详情
        </Button>
        <Button type="link" onClick={() => handleEditClick(item)}>
          <EditOutlined /> 修改
        </Button>
        <Button type="link" onClick={() => handleConfigPermissions(item)}>
          <SettingOutlined /> 配置权限
        </Button>
        {!isSuper && (
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDeleteClick(item.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger>
              <DeleteOutlined /> 删除
            </Button>
          </Popconfirm>
        )}
      </td>
    );
  };

  return (
    <>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>
              <div>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(event) => handleSelectAll(event, data)}
                />
              </div>
            </th>
            {[
              'ID',
              '角色名称',
              '英文名称',
              '描述',
              '创建者',
              '更新者',
              '创建时间',
              '更新时间',
              '状态',
            ].map((field) => (
              <th key={field}>{field}</th>
            ))}
            <th key="操作">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                    disabled={isSuperAdmin(item)}
                  />
                </div>
              </td>
              <td>{item.id}</td>
              <td>
                {item.roleName}
                {isSuperAdmin(item) && (
                  <span>
                    系统角色
                  </span>
                )}
              </td>
              <td>{item.roleNameEn}</td>
              <td>{item.description || '无'}</td>
              <td>{item.createBy || '无'}</td>
              <td>{item.updateBy || '无'}</td>
              <td>{formatDate(item.updateTime) || '无'}</td>
              <td>{formatDate(item.createTime) || '无'}</td>
              <td>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.checked)}
                    disabled={isSuperAdmin(item)}
                  />
                  <span className="toggle-switch-slider"></span>
                </label>
              </td>
              {renderActionButtons(item)}
            </tr>
          ))}
        </tbody>
      </table>

      <RolePermissionModal
        visible={isPermissionModalVisible}
        onCancel={() => setIsPermissionModalVisible(false)}
        roleId={currentRole?.id}
        roleName={currentRole?.roleName}
      />
    </>
  );
};

export default AdminRoleTable;
