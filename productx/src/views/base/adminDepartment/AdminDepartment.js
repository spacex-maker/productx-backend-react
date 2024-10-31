import React, { useEffect, useState } from 'react';
import { Input, Button, List } from 'antd';
import api from 'src/axiosInstance';
import {CListGroup, CListGroupItem} from "@coreui/react";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [parentId, setParentId] = useState(1); // 初始父级部门 ID
  const [parentHistory, setParentHistory] = useState([1]); // 用于存储父级部门 ID 的历史
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments(parentId);
  }, [parentId]);

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
    setParentHistory([...parentHistory, parentId]); // 保存当前 parentId 到历史记录
    setParentId(id); // 更新当前 parentId
  };

  const handleBack = () => {
    // 从历史中获取上一个 parentId
    const previousId = parentHistory[parentHistory.length - 1];
    setParentId(previousId); // 更新当前 parentId
    setParentHistory(parentHistory.slice(0, -1)); // 移除最后一个历史记录
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh'}}>
      <div style={{ width: '200px', borderRight: '1px solid #f0f0f0' }}>
        <Input
          size="small"
          placeholder="搜索部门"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '8px'}}
          allowClear // 添加这个属性
        />
        <Button
          size="small"
          onClick={handleBack} style={{ marginBottom: '8px'}} disabled={parentHistory.length <= 1}>
          返回上一级
        </Button>
        <CListGroup
          bordered
          style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }} // 设置列表最大高度并使其可滚动
        >
          {filteredDepartments.map(item => (
            <CListGroupItem
              key={item.id}
              onClick={() => handleDepartmentClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {item.name}
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {/* 在这里显示所选部门的详细信息 */}
        {/* 可以根据需要添加更多内容 */}
      </div>
    </div>
  );
};

export default AdminDepartments;
