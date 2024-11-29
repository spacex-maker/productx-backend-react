import React, { useState } from 'react';
import { Input, AutoComplete } from 'antd';
import debounce from 'lodash.debounce';
import api from 'src/axiosInstance';

const ManagerSearchInput = ({ onSelect, inputStyle }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

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
        label: manager.username
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  }, 300);

  const handleSelect = (value) => {
    setInputValue(value);
    onSelect(value);
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
