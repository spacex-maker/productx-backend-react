import React, { useEffect, useState } from 'react';
import { Input, Button, List } from 'antd';
import api from 'src/axiosInstance';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [parentId, setParentId] = useState(1); // 初始父级部门 ID
  const [parentParentId, setParentParentId] = useState(1); // 初始父级部门 ID
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchDepartments(parentId);
  },[]);

  const fetchDepartments = async (id) => {
    try {
      const response = await api.get('/manage/admin-departments/list', {
        params: { parentId: id }
      });
      setDepartments(response);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentClick = (id) => {
    fetchDepartments(id);
    setParentParentId(parentId)
  };

  const handleBack = () => {
    fetchDepartments(parentId);
    setParentParentId(parentId)
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0 }}>
      <div style={{ width: '300px', padding: '10px', borderRight: '1px solid #f0f0f0' }}>
        <Input
          placeholder="搜索部门"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '8px', height: '32px' }}
        />
        <Button onClick={handleBack} style={{ marginBottom: '8px', height: '32px' }} disabled={!parentId}>
          返回上一级
        </Button>
        <List
          bordered
          dataSource={filteredDepartments}
          renderItem={item => (
            <List.Item onClick={() => handleDepartmentClick(item.id)} style={{ cursor: 'pointer' }}>
              {item.name}
            </List.Item>
          )}
          style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }} // 设置列表最大高度并使其可滚动
        />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {/* 在这里显示所选部门的详细信息 */}
        {/* 可以根据需要添加更多内容 */}
      </div>
    </div>
  );
};

export default AdminDepartments;
