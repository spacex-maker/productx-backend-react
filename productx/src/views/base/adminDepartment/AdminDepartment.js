import React, { useEffect, useState } from 'react';
import { Input, Button, List, Popconfirm, Switch, Col, Row, Modal, Form } from 'antd';
import api from 'src/axiosInstance';
import {CButton, CListGroup, CListGroupItem} from "@coreui/react";
import Pagination from "src/components/common/Pagination";
import {UseSelectableRows} from "src/components/common/UseSelectableRows";



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

  // Modal 状态管理
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // 创建表单实例

  useEffect(() => {
    fetchDepartments(parentId);
  }, [parentId]);

  useEffect(() => {
    fetchEmployees(parentId, currentPage, pageSize, searchManagerTerm, isGlobalSearch);
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
  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await updateUserStatus(id, newStatus)
    await fetchEmployees() // 状态更新后重新获取数据
  }
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = () => {
    setIsModalVisible(true); // 显示模态框
    form.resetFields(); // 重置表单字段
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 验证表单
      const response = await api.post('/manage/manager/create', values); // 调用新增接口
      console.log('新增管理员成功:', response);
      setIsModalVisible(false); // 关闭模态框
      fetchEmployees(parentId, currentPage, pageSize); // 刷新员工列表
    } catch (error) {
      console.error('新增管理员失败:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // 关闭模态框
  };
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
            返回
          </CButton>
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
          style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
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
      <div style={{ flex: 1, padding: '0px 10px' }}>
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
              <Button
                size="small"
                type="primary" onClick={showModal}>
                新增管理员
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
            {['管理员名称', '部门 ID', '创建时间', '创建人', '状态'].map((field) => (
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
              <td>{item.departmentId}</td>
              <td>{item.createTime}</td>
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
                  title="确定要删除这个用户吗？"
                  onConfirm={() => handleDeleteClick(item.id)}
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

      <Modal
        size="small"
        title="新增管理员"
        open={isModalVisible}
        onCancel={handleCancel}
        okText="提交"
        cancelText="取消"
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="username"
            label="管理员名称"
            rules={[{ required: true, message: '请输入管理员名称' }]}
          >
            <Input placeholder="管理员名称" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="手机号" />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="部门 ID"
            rules={[{ required: true, message: '请输入部门 ID' }]}
          >
            <Input placeholder="部门 ID" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default AdminDepartments;
