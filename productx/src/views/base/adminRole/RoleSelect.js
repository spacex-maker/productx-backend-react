import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import api from 'src/axiosInstance';

const RoleSelect = ({ value, onChange, mode = 'single', ...props }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async (searchText = '') => {
    setLoading(true);
    try {
      const response = await api.get('/manage/admin-roles/list-all-enable', {
        params: {
          roleName: searchText,
          currentPage: 1,
          size: 10
        }
      });
      if (response) {
        setRoles(response);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      mode={mode}
      loading={loading}
      filterOption={false}
      onSearch={fetchRoles}
      showSearch
      {...props}
    >
      {roles.map(role => (
        <Select.Option key={role.id} value={role.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{role.roleName}</span>
            <span>ID: {role.id}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default RoleSelect;
