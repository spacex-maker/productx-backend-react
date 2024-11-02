import React, { useState } from 'react';
import { Input, AutoComplete } from 'antd';
import debounce from 'lodash.debounce';
import api from 'src/axiosInstance';

const ManagerSearchInput = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 防抖搜索管理者的函数
  const handleSearch = debounce(async (searchValue) => {
    if (!searchValue) {
      setOptions([]);
      return;
    }

    try {
      const response = await api.get('/manage/manager/list', { params: { username: searchValue } });
      const managers = response.data;
      const newOptions = managers.map(manager => ({
        value: manager.username, // 使用用户名作为选项的值
        label: manager.username // 显示用户名
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  }, 300);

  // 处理选择的管理者
  const handleSelect = (value) => {
    setInputValue(value); // 更新输入框显示名称
    onSelect(value); // 将选中的用户名传递给父组件
  };

  return (
    <AutoComplete
      placeholder="搜索用户名"
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      value={inputValue}
    >
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </AutoComplete>
  );
};

export default ManagerSearchInput;
