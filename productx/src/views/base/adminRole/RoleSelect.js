import React, { useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import api from 'src/axiosInstance';
const RoleSelect = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取角色数据的函数
  const fetchRoles = async (search) => {
    setLoading(true);
    try {
      const response = await api.get('/manage/admin-roles/list', {
        params: { roleName: search }, // 传入角色名称搜索参数
      });

      if (response) {
        setRoles(response); // 假设返回的数据在 data 字段中
      } else {
        console.error('Error fetching roles:', response.message);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索角色
  const handleSearch = (value) => {
    if (value) {
      fetchRoles(value);
    } else {
      setRoles([]); // 如果没有搜索内容，清空下拉框
    }
  };

  return (
    <Form.Item
      label="角色ID (Role ID)"
      name="roleId"
      rules={[{ required: true, message: '请选择角色ID' }]}
    >
      <Select
        placeholder="请选择角色ID"
        showSearch
        filterOption={false} // 关闭默认过滤功能
        onSearch={handleSearch} // 输入时触发搜索
        loading={loading}
      >
        {roles.map(role => (
          <Select.Option key={role.id} value={role.id}>
            {role.roleName} {/* 显示角色名称 */}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default RoleSelect;
