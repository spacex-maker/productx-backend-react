import React, { useEffect, useState } from 'react';
import {Input, Button, List, Popconfirm, Switch, Col, Row} from 'antd';
import api from 'src/axiosInstance';
import { CListGroup, CListGroupItem } from "@coreui/react";
import Pagination from "src/components/common/Pagination";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);

  const [employees, setEmployees] = useState([]); // 部门内员工列表
  const [selectedRows, setSelectedRows] = useState([]);

  const [parentId, setParentId] = useState(1); // 初始父级部门 ID
  const [parentHistory, setParentHistory] = useState([1]); // 用于存储父级部门 ID 的历史
  const [searchTerm, setSearchTerm] = useState('');
  const [searchManagerTerm, setSearchManagerTerm] = useState('');
  const [pageSize, setPageSize] = useState(10); // 每页显示条数
  const [selectAll, setSelectAll] = useState(false);
  const totalPages = Math.ceil(totalNum / pageSize);

  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  useEffect(() => {
    fetchDepartments(parentId);
  }, [parentId]);

  useEffect(() => {
    fetchEmployees(parentId, currentPage, pageSize, searchManagerTerm, isGlobalSearch);
  }, [parentId, currentPage, pageSize, searchTerm,searchManagerTerm, isGlobalSearch]);

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
  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setSelectedRows(event.target.checked ? employees.map(item => item.managerId) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter(rowId => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };
  const handleGlobalSearchToggle = (checked) => {
    setIsGlobalSearch(checked);
  };
  const fetchEmployees = async (departmentId, page, pageSize, searchManagerTerm = '', isGlobalSearch = false) => {
    try {
      const response = await api.get('/manage/admin-manager-departments/list', {
        params: { departmentId: isGlobalSearch ? null : departmentId, page, pageSize, managerName: searchManagerTerm }
      });
      setEmployees(response.data);
      setTotalNum(response.totalNum);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDepartmentClick = (id) => {
    setParentHistory([...parentHistory, parentId]); // 保存当前 parentId 到历史记录
    setParentId(id); // 更新当前 parentId
    setCurrent(1); // 切换部门时重置页数
  };

  const handleBack = () => {
    const previousId = parentHistory[parentHistory.length - 1];
    setParentId(previousId);
    setParentHistory(parentHistory.slice(0, -1));
    setCurrent(1); // 返回上一级时重置页数
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleManagerSearch = (e) => {
    setSearchManagerTerm(e.target.value);
  };
  const handlePageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleStatusChange = (id, status) => {
    // Add status change logic here
  };

  const handleEditClick = (item) => {
    // Edit logic here
  };

  const handleDeleteClick = (id) => {
    // Delete logic here
  };
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{width: '200px'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
          <Button
            size="small"
            onClick={handleBack}
            disabled={parentHistory.length <= 1}
            style={{marginRight: '8px'}} // 增加右边距
          >
            返回上一级
          </Button>
          <Input
            size="small"
            placeholder="搜索部门"
            value={searchTerm}
            onChange={handleSearch}
            allowClear
          />
        </div>

        <CListGroup
          bordered
          style={{maxHeight: 'calc(100vh - 100px)', overflowY: 'auto'}}
        >
          {filteredDepartments.map(item => (
            <CListGroupItem
              key={item.id}
              onClick={() => handleDepartmentClick(item.id)}
              style={{cursor: 'pointer'}}
            >
              {item.name}
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>
      <div style={{flex: 1, padding: '0px 10px'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                placeholder="搜索员工"
                value={searchManagerTerm}
                onChange={handleManagerSearch}
                allowClear
              />
            </Col>
            <Col>
              <Switch
                checked={isGlobalSearch}
                onChange={handleGlobalSearchToggle}
                checkedChildren="全局搜索"
                unCheckedChildren="部门搜索"
              />
            </Col>
          </Row>




        </div>

        <table className="table table-bordered table-striped">
          <thead>
          <tr>
            <th>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="select_all"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label className="custom-control-label" htmlFor="select_all"></label>
              </div>
            </th>
            {['管理员名称', '部门 ID', '创建时间', '创建人', '状态'].map((field) => (
              <th key={field}>{field}</th>
            ))}
            <th className="fixed-column">操作</th>
          </tr>
          </thead>
          <tbody>
          {employees.map((item) => (
            <tr key={item.managerId}>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_${item.managerId}`}
                    checked={selectedRows.includes(item.managerId)}
                    onChange={() => handleSelectRow(item.managerId)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`td_checkbox_${item.managerId}`}
                  ></label>
                </div>
              </td>
              <td>{item.managerName}</td>
              <td>{item.departmentId}</td>
              <td>{item.createTime}</td>
              <td>{item.createBy}</td>
              <td>
                <Switch
                  checked={item.status} // 根据状态设置 Switch 是否开启
                  onChange={(checked) => handleChange(item.id, checked)} // 调用处理函数
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              </td>
              <td className="fixed-column">
                <Button type="link" onClick={() => handleEditClick(item)}>
                  修改
                </Button>
                <Popconfirm
                  title="确定要删除这个用户吗？"
                  onConfirm={() => handleDeleteClick(item.managerId)}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <Pagination
          totalPages={totalPages}
          current={currentPage}
          onPageChange={setCurrent}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default AdminDepartments;
