import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import api from 'src/axiosInstance';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  // 选择框中已选项的文字
  .ant-select-selection-item {
    font-size: 10px !important;
    color: #000000 !important;
  }

  // 下拉选项的文字
  .ant-select-item {
    font-size: 10px !important;
    color: #000000 !important;

    &-option-selected {
      color: #000000 !important;
      font-weight: 600;
    }
    
    &-option-active {
      color: #000000 !important;
    }
  }

  // 多选模式下的标签文字
  .ant-select-selection-item-content {
    color: #000000 !important;
    font-size: 10px !important;
  }

  // 占位符文字
  .ant-select-selection-placeholder {
    color: #999999 !important;
    font-size: 10px !important;
  }

  // 搜索输入框
  .ant-select-selection-search-input {
    color: #000000 !important;
    font-size: 10px !important;
  }

  // 下拉选项中的样式
  .ant-select-item-option-content {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;

    .role-name {
      color: #000000 !important;
      font-size: 10px !important;
    }
    
    .role-id {
      color: #999999 !important;
      font-size: 10px !important;
    }
  }
`;

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

  const handleSearch = (value) => {
    fetchRoles(value);
  };

  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      loading={loading}
      mode={mode}
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      {...props}
    >
      {roles.map(role => (
        <Select.Option 
          key={role.id} 
          value={role.id}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="role-name">{role.roleName}</span>
            <span className="role-id">ID: {role.id}</span>
          </div>
        </Select.Option>
      ))}
    </StyledSelect>
  );
};

export default RoleSelect;
