import React, { useState, useEffect } from 'react';
import { Input, AutoComplete, Avatar } from 'antd';
import debounce from 'lodash.debounce';
import api from 'src/axiosInstance';

const ManagerSearchInput = ({ onSelect, inputStyle, defaultValue }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(defaultValue || "");

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  const handleSearch = debounce(async (searchValue) => {
    if (!searchValue) {
      setOptions([]);
      return;
    }

    try {
      const response = await api.get('/manage/manager/list', { params: { username: searchValue } });
      const managers = response.data;
      const newOptions = managers.map(manager => ({
        value: manager.username,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar 
              src={manager.avatar} 
              size="small" 
              style={{ width: '24px', height: '24px' }}
            >
              {manager.username[0]?.toUpperCase()}
            </Avatar>
            <span>{manager.username}</span>
          </div>
        ),
        manager: manager // 保存完整的管理员信息
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  }, 300);

  const handleSelect = (value, option) => {
    setInputValue(value);
    onSelect(value, option?.manager);
  };

  return (
    <AutoComplete
      placeholder="搜索用户名"
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      value={inputValue}
      style={{ width: '100%' }}
    >
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleSearch(e.target.value);
        }}
        style={{
          ...inputStyle,
          '& .ant-input': {
            color: '#333333 !important',
          }
        }}
      />
    </AutoComplete>
  );
};

export default ManagerSearchInput;
