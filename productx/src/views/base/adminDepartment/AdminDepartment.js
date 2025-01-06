import React, { useEffect, useState } from 'react';
import { Input, Button, List, Popconfirm, Switch, Col, Row, Modal, Form, Descriptions, Badge, Tag, message } from 'antd';
import api from 'src/axiosInstance';
import { CButton, CListGroup, CListGroupItem } from '@coreui/react';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { formatDate } from 'src/components/common/Common';
import AddDepartmentModal from 'src/views/base/adminDepartment/AddDepartmentModal';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCaretLeft, cilPlus } from '@coreui/icons';
import ManagerCreateFormModal from 'src/views/base/manager/ManagerCreateFormModal';
import AddDepartmentManagerModal from 'src/views/base/adminDepartment/AddDepartmentManagerModal';
import ManagerSearchInput from "src/views/common/ManagerSearchInput";
import { useSelector } from 'react-redux';

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
  const [currentDepartmentName, setCurrentDepartmentName] = useState('总公司');
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [isCurrentUserManager, setIsCurrentUserManager] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);

  const showAddDepartmentModal = () => setIsAddDepartmentModalVisible(true);
  const hideAddDepartmentModal = () => setIsAddDepartmentModalVisible(false);
  // Modal 状态管理
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  useEffect(() => {
    fetchDepartments(parentId);
  }, [parentId]);
  {
  }
  useEffect(() => {
    fetchEmployees(parentId, searchManagerTerm, isGlobalSearch).then((r) => {});
  }, [parentId, currentPage, pageSize, searchTerm, searchManagerTerm, isGlobalSearch]);

  // 检查当前用户是否是部门经理
  useEffect(() => {
    if (currentDepartment && currentUser) {
      setIsCurrentUserManager(currentUser.username === currentDepartment.managerUsername);
    }
  }, [currentDepartment, currentUser]);

  const fetchDepartments = async (id) => {
    try {
      const response = await api.get('/manage/admin-departments/list', {
        params: { parentId: id },
      });
      setDepartments(response);

      // 如果不是根部门，获取当前部门详情
      if (id !== 1) {
        const currentDept = await api.get(`/manage/admin-departments/detail?id=${id}`);
        setCurrentDepartmentName(currentDept.name);
        setCurrentDepartment(currentDept);
      } else {
        setCurrentDepartmentName('总公司');
        setCurrentDepartment(null);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchEmployees = async (departmentId, searchManagerTerm = '', isGlobalSearch = false) => {
    try {
      const response = await api.get('/manage/admin-manager-departments/list', {
        params: {
          departmentId: isGlobalSearch ? null : departmentId,
          currentPage,
          pageSize,
          managerName: searchManagerTerm,
        },
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
    await fetchEmployees(parentId); // 状态更新后重新获取数据
  };
  const handleRemoveClick = async (id) => {
    try {
      await api.post(
        '/manage/admin-manager-departments/remove',
        { id: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Error removing department:', error);
    }
    await fetchEmployees(parentId); // 状态更新后重新获取数据
  };
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  // 打开编辑模态框
  const handleEdit = () => {
    editForm.setFieldsValue({
      name: currentDepartment.name,
      description: currentDepartment.description,
      managerName: currentDepartment.managerUsername,
      contactNumber: currentDepartment.contactNumber,
      email: currentDepartment.email,
      location: currentDepartment.location,
      status: currentDepartment.status
    });
    setIsEditModalVisible(true);
  };

  // 处理部门更新
  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await api.post('/manage/admin-departments/update', {
        ...values,
        id: currentDepartment.id
      });
      message.success('部门信息更新成功');
      setIsEditModalVisible(false);
      fetchDepartments(parentId);
    } catch (error) {
      console.error('Error updating department:', error);
      message.error('更新失败：' + (error.response?.data?.message || error.message));
    }
  };

  const handleDetailClick = async (managerId) => {
    try {
      const response = await api.get(`/manage/manager/get-by-id?id=${managerId}`);
      if (response) {
        setCurrentManager(response);
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching manager details:', error);
      message.error('获取管理员详情失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: '200px' }}>
          <div style={{ padding: '10px 0', fontSize: '14px', fontWeight: 'bold' }}>
            {currentDepartmentName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <CButton
              size="sm"
              onClick={handleBack}
              disabled={parentHistory.length <= 1}
              className="custom-button"
              style={{ marginRight: '8px', width: 60 }} // 增加右边距
            >
              <CIcon size="sm" icon={cilArrowLeft} title="返回" />
            </CButton>
            <Input
              size="small"
              placeholder="搜索部门"
              value={searchTerm}
              onChange={handleSearch}
              allowClear
            />
            <CButton size="sm" onClick={showAddDepartmentModal}>
              <CIcon size="sm" icon={cilPlus} title="新增" />
            </CButton>
          </div>

          <AddDepartmentModal
            visible={isAddDepartmentModalVisible}
            onClose={hideAddDepartmentModal}
            onAddSuccess={fetchDepartments} // Refresh list when a department is added
            parentId={parentId}
          />
          <CListGroup bordered style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {filteredDepartments.map((item) => (
              <CListGroupItem
                key={item.id}
                onClick={() => handleDepartmentClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>{item.name}</div>
                  <div>{item.employeeCount}</div>
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>
        <div style={{ flex: 1, padding: '0px 10px' }}>
          {currentDepartment && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-medium-emphasis small">
                    {isCurrentUserManager ? '您是当前部门的管理员' : ''}
                  </div>
                  {isCurrentUserManager && (
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={handleEdit}
                    >
                      编辑部门信息
                    </button>
                  )}
                </div>
                <div className="row g-2">
                  <div className="col-12 col-md-3">
                    <div className="p-1 border rounded d-flex flex-column">
                      <div className="text-medium-emphasis small mb-1">部门名称</div>
                      <div className="fw-semibold small">{currentDepartment.name}</div>
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="p-1 border rounded d-flex flex-column">
                      <div className="text-medium-emphasis small mb-1">部门经理</div>
                      <div className="fw-semibold small d-flex align-items-center gap-1">
                        {currentDepartment.managerAvatar ? (
                          <img 
                            src={currentDepartment.managerAvatar} 
                            alt="avatar" 
                            className="rounded-circle"
                            style={{ width: '20px', height: '20px' }} 
                          />
                        ) : null}
                        {currentDepartment.managerUsername}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="p-1 border rounded d-flex flex-column">
                      <div className="text-medium-emphasis small mb-1">员工数量</div>
                      <div className="fw-semibold small">
                        <span className="badge bg-primary">{currentDepartment.employeeCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="p-1 border rounded d-flex flex-column">
                      <div className="text-medium-emphasis small mb-1">状态</div>
                      <div className="fw-semibold small">
                        <span className={`badge ${currentDepartment.status ? 'bg-success' : 'bg-secondary'}`}>
                          {currentDepartment.status ? '启用' : '禁用'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentDepartment.contactNumber && (
                    <div className="col-12 col-md-3">
                      <div className="p-1 border rounded d-flex flex-column">
                        <div className="text-medium-emphasis small mb-1">联系电话</div>
                        <div className="fw-semibold small">{currentDepartment.contactNumber}</div>
                      </div>
                    </div>
                  )}
                  {currentDepartment.email && (
                    <div className="col-12 col-md-3">
                      <div className="p-1 border rounded d-flex flex-column">
                        <div className="text-medium-emphasis small mb-1">邮箱</div>
                        <div className="fw-semibold small">{currentDepartment.email}</div>
                      </div>
                    </div>
                  )}
                  {currentDepartment.location && (
                    <div className="col-12 col-md-3">
                      <div className="p-1 border rounded d-flex flex-column">
                        <div className="text-medium-emphasis small mb-1">位置</div>
                        <div className="fw-semibold small">{currentDepartment.location}</div>
                      </div>
                    </div>
                  )}
                  {currentDepartment.budget && (
                    <div className="col-12 col-md-3">
                      <div className="p-1 border rounded d-flex flex-column">
                        <div className="text-medium-emphasis small mb-1">预算</div>
                        <div className="fw-semibold small">{currentDepartment.budget}</div>
                      </div>
                    </div>
                  )}
                  {currentDepartment.description && (
                    <div className="col-12">
                      <div className="p-1 border rounded d-flex flex-column">
                        <div className="text-medium-emphasis small mb-1">描述</div>
                        <div className="fw-semibold small">{currentDepartment.description}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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
                <Button size="small" type="primary" onClick={showModal}>
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
                {['管理员信息', '加入时间', '操作人', '状态', '操作'].map((field) => (
                  <th key={field}>{field}</th>
                ))}
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
                        onChange={() => handleSelectRow(item.id, employees)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`td_checkbox_${item.id}`}
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.avatar ? (
                        <img 
                          src={item.avatar} 
                          alt="avatar" 
                          className="rounded-circle"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px', color: 'white', fontSize: '12px' }}
                        >
                          {item.managerName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <span>{item.managerName}</span>
                      <span className="text-muted">#{item.managerId}</span>
                    </div>
                  </td>
                  <td>{formatDate(item.createTime)}</td>
                  <td>{item.createBy}</td>
                  <td>
                    <Switch
                      checked={item.managerStatus}
                      onChange={(checked) => handleStatusChange(item.id, checked)}
                      checkedChildren="启用"
                      unCheckedChildren="禁用"
                    />
                  </td>
                  <td className="fixed-column">
                    <Button 
                      type="link" 
                      onClick={() => handleDetailClick(item.managerId)}
                    >
                      详情
                    </Button>
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

      <Modal
        title="编辑部门信息"
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="部门描述"
          >
            <Input.TextArea placeholder="请输入部门描述" />
          </Form.Item>

          <Form.Item
            name="managerName"
            label="部门经理"
            rules={[{ required: true, message: '请选择部门经理' }]}
          >
            <ManagerSearchInput
              defaultValue={currentDepartment?.managerUsername}
              onSelect={(value, manager) => {
                editForm.setFieldsValue({ 
                  managerName: value,
                  // 如果需要保存其他管理员信息，可以在这里设置
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="contactNumber"
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="location"
            label="位置"
          >
            <Input placeholder="请输入位置" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="启用" 
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="管理员详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentManager && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">
              {currentManager.id}
            </Descriptions.Item>
            <Descriptions.Item label="用户名">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentManager.username}
                <Badge 
                  status={currentManager.status ? 'success' : 'error'} 
                  text={currentManager.status ? '启用' : '禁用'} 
                />
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentManager.email || '-'}
                {currentManager.email && (
                  <Badge 
                    status={currentManager.emailVerification ? 'success' : 'warning'} 
                    text={currentManager.emailVerification ? '已验证' : '未验证'} 
                  />
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {currentManager.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建人">
              {currentManager.createBy || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="角色" span={2}>
              {currentManager.roles?.map(role => (
                <Tag 
                  key={role.roleId} 
                  color={role.managerRoleStatus ? 'blue' : 'default'}
                  style={{ marginBottom: '4px' }}
                >
                  {role.roleName}
                  {!role.managerRoleStatus && ' (已禁用)'}
                </Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminDepartments;
