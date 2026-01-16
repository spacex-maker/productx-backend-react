import React, { useState } from 'react';
import { Select, Avatar, Space, Tag, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';
import debounce from 'lodash.debounce';

const { Option } = Select;

const UserSearchSelect = ({
  value,
  onChange,
  onSelect,
  placeholder = '请输入用户ID或用户名搜索',
  allowClear = true,
  style = { width: '100%' },
  disabled = false,
  pageSize = 10,
  showStatusTag = true,
  showNickname = true,
  ...restProps
}) => {
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);

  // 用户搜索（支持ID、用户名）
  const fetchUsers = debounce(async (searchText) => {
    if (!searchText || searchText.trim() === '') {
      setUsers([]);
      return;
    }

    setFetching(true);
    try {
      const params = {};
      // 如果输入的是纯数字，按ID搜索
      if (/^\d+$/.test(searchText.trim())) {
        params.id = parseInt(searchText.trim());
      } else {
        // 否则按用户名搜索
        params.username = searchText.trim();
      }

      const response = await api.get('/manage/user/list', {
        params: { currentPage: 1, pageSize, ...params },
      });

      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('获取用户列表失败', error);
      message.error('获取用户列表失败');
      setUsers([]);
    } finally {
      setFetching(false);
    }
  }, 300);

  const handleSearch = (value) => {
    fetchUsers(value);
  };

  const handleSelect = (selectedValue, option) => {
    const user = users.find((u) => u.id === selectedValue);
    // 如果有 onChange，调用它（Form.Item 会自动注入）
    if (onChange) {
      onChange(selectedValue);
    }
    // 如果有自定义的 onSelect 回调，调用它并传递用户对象
    if (onSelect && user) {
      onSelect(user, selectedValue);
    }
  };

  // 处理 onChange，确保 Form.Item 能正常工作
  const handleChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
    // 同时触发 onSelect 以便传递用户对象
    if (onSelect) {
      const user = users.find((u) => u.id === selectedValue);
      if (user) {
        onSelect(user, selectedValue);
      }
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      notFoundContent={fetching ? '搜索中...' : '暂无数据'}
      filterOption={false}
      onSearch={handleSearch}
      onSelect={handleSelect}
      allowClear={allowClear}
      style={style}
      loading={fetching}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      {...restProps}
    >
      {users.map((user) => (
        <Option key={user.id} value={user.id} user={user}>
          <Space>
            <Avatar 
              src={user.avatar} 
              icon={<UserOutlined />}
              size="small"
            >
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <span>{user.username}</span>
            {showNickname && user.nickname && (
              <span style={{ color: '#999', fontSize: '12px' }}>
                ({user.nickname})
              </span>
            )}
            {showStatusTag && (
              <Tag color={user.status ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {user.status ? '正常' : '禁用'}
              </Tag>
            )}
            <span style={{ color: '#999', fontSize: '12px', marginLeft: 4 }}>
              ID: {user.id}
            </span>
          </Space>
        </Option>
      ))}
    </Select>
  );
};

UserSearchSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func, // Form.Item 会自动注入，可可选
  onSelect: PropTypes.func, // 选中用户时的回调，参数为 (user, userId)
  placeholder: PropTypes.string,
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  pageSize: PropTypes.number,
  showStatusTag: PropTypes.bool,
  showNickname: PropTypes.bool,
};

// 为了在 Form.Item 中使用，这些属性是可选的
UserSearchSelect.defaultProps = {
  allowClear: true,
  showStatusTag: true,
  showNickname: true,
  pageSize: 10,
};

export default UserSearchSelect;

