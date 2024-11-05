import React, { useEffect, useState } from 'react';
import { Input, Button, List, Popconfirm, Switch, Col, Row, Modal, Form } from 'antd';
import api from 'src/axiosInstance';
import {CButton, CListGroup, CListGroupItem} from "@coreui/react";
import Pagination from "src/components/common/Pagination";
import {UseSelectableRows} from "src/components/common/UseSelectableRows";
import {formatDate} from "src/components/common/Common";
import AddDepartmentModal from "src/views/base/adminDepartment/AddDepartmentModal";
import CIcon from "@coreui/icons-react";
import {cilArrowLeft, cilCaretLeft, cilPlus} from "@coreui/icons";
import ManagerCreateFormModal from "src/views/base/manager/ManagerCreateFormModal";
import AddDepartmentManagerModal from "src/views/base/adminDepartment/AddDepartmentManagerModal";


const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [employees, setEmployees] = useState([]); // 部门内员工列表
  const [parentId, setParentId] = useState(1); // 初始父级部门 ID
  const [parentHistory, setParentHistory] = useState([1]); // 用于存储父级部门 ID 的历史
  const [searchTerm, setSearchTerm] = useState('');
  const [searchManagerTerm, setSearchManagerTerm] = useState('');
  const [pageSize, setPageSize] = useState(10); // 每页显示条数
  const totalPages = Math.ceil(totalNum / pageSize);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);

  const showAddDepartmentModal = () => setIsAddDepartmentModalVisible(true);
  const hideAddDepartmentModal = () => setIsAddDepartmentModalVisible(false);
  // Modal 状态管理
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);


  useEffect(() => {
    fetchDepartments(parentId);
  }, [parentId]);
  {}
  useEffect(() => {
    fetchEmployees(parentId, searchManagerTerm, isGlobalSearch).then(r =>{

    });
  }, [parentId, currentPage, pageSize, searchTerm, searchManagerTerm, isGlobalSearch]);

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
  const fetchEmployees = async (departmentId, searchManagerTerm = '', isGlobalSearch = false) => {
    try {
      const response = await api.get('/manage/admin-manager-departments/list', {
        params: { departmentId: isGlobalSearch ? null : departmentId, currentPage, pageSize, managerName: searchManagerTerm }
      });
      setEmployees(response.data);
      setTotalNum(response.totalNum);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDepartmentClick = (id) => {
    setParentHistory([...parentHistory, parentId]);
    setParentId(id);
    setCurrent(1);
  };

  const handleBack = () => {
    const previousId = parentHistory[parentHistory.length - 1];
    setParentId(previousId);
    setParentHistory(parentHistory.slice(0, -1));
    setCurrent(1);
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
  const handleStatusChange = async (id, checked) => {
    await api.post('/manage/admin-manager-departments/change-status', { id, status: checked });
    await fetchEmployees(parentId) // 状态更新后重新获取数据
  }
  const handleRemoveClick = async (id) => {
    try {
      await api.post('/manage/admin-manager-departments/remove',
        { id: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error removing department:', error);
    }
    await fetchEmployees(parentId); // 状态更新后重新获取数据
  };
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <CButton
            size="sm"
            onClick={handleBack}
            disabled={parentHistory.length <= 1}
            className="custom-button"
            style={{ marginRight: '8px',width: 60 }} // 增加右边距
          >
            <CIcon
              size="sm"
              icon={cilArrowLeft}
              title="返回" />
          </CButton>
          <Input
            size="small"
            placeholder="搜索部门"
            value={searchTerm}
            onChange={handleSearch}
            allowClear
          />
          <CButton size="sm" onClick={showAddDepartmentModal} >
            <CIcon
              size="sm"
              icon={cilPlus}
              title="新增" />
          </CButton>
        </div>

        <AddDepartmentModal
          visible={isAddDepartmentModalVisible}
          onClose={hideAddDepartmentModal}
          onAddSuccess={fetchDepartments} // Refresh list when a department is added
          parentId={parentId}
        />
        <CListGroup
          bordered
          style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
        >
          {filteredDepartments.map(item => (
            <CListGroupItem
              key={item.id}
              onClick={() => handleDepartmentClick(item.id)}
              style={{cursor: 'pointer'}}
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>{item.name}</div>
                <div>{item.employeeCount}</div>
              </div>
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>
      <div style={{flex: 1, padding: '0px 10px'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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
              <Button
                size="small"
                type="primary" onClick={showModal}>
                加入员工
              </Button>
            </Col>
            <Col>
              <Switch
                checked={isGlobalSearch}
                onChange={(checked) => setIsGlobalSearch(checked)}
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
                  onChange={(event) => handleSelectAll(event, employees)}
                />
                <label className="custom-control-label" htmlFor="select_all"></label>
              </div>
            </th>
            {['管理员名称', '加入时间', '操作人', '状态'].map((field) => (
              <th key={field}>{field}</th>
            ))}
            <th className="fixed-column">操作</th>
          </tr>
          </thead>
          <tbody>
          {employees.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id,employees)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`td_checkbox_${item.id}`}
                  ></label>
                </div>
              </td>
              <td>{item.managerName}</td>
              <td>{formatDate(item.createTime)}</td>
              <td>{item.createBy}</td>
              <td>
                <Switch
                  checked={item.status}
                  onChange={(checked) => handleStatusChange(item.id, checked)}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              </td>
              <td className="fixed-column">
                <Button type="link" onClick={() => handleEditClick(item)}>
                  修改
                </Button>
                <Popconfirm
                  title="确定要将此用户移除部门吗？"
                  onConfirm={() => handleRemoveClick(item.id)}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="link" danger>
                    移除
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
        <AddDepartmentManagerModal
          isVisible={isVisible}
          onClose={hideModal}
          onAddSuccess={(parentId) => fetchEmployees(parentId)}
          parentId={parentId}
        />
      </div>
    </div>
  );
};

export default AdminDepartments;
