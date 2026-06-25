import React, { useEffect, useState } from 'react';
import { Button, Col, message, Row, Select, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import Pagination from 'src/components/common/Pagination';
import UserExpActionTable from './UserExpActionTable';
import UserExpActionModal from './UserExpActionModal';

const UserExpAction = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [category, setCategory] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editing, setEditing] = useState(null);

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/manage/user-exp-action/list', {
        params: {
          currentPage,
          pageSize,
          category: category || undefined,
          status: status ?? undefined,
        },
      });
      setData(response?.data || []);
      setTotalNum(response?.totalNum || 0);
    } catch (e) {
      message.error('获取经验行为配置失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, category, status]);

  const handleCreate = async (values) => {
    try {
      await api.post('/manage/user-exp-action/create', values);
      message.success('创建成功');
      setCreateOpen(false);
      createForm.resetFields();
      fetchData();
    } catch (e) {
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await api.put('/manage/user-exp-action/update', values);
      message.success('更新成功');
      setEditOpen(false);
      editForm.resetFields();
      setEditing(null);
      fetchData();
    } catch (e) {
      message.error('更新失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/manage/user-exp-action/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.length) return;
    try {
      await Promise.all(selectedRows.map((id) => api.delete(`/manage/user-exp-action/${id}`)));
      message.success('批量删除成功');
      fetchData();
    } catch (e) {
      message.error('批量删除失败');
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize) || 1;

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-3">
        <Col>
          <Select
            allowClear
            placeholder="分类"
            style={{ width: 140 }}
            value={category}
            onChange={setCategory}
            options={[
              { value: 'login', label: '登录' },
              { value: 'community', label: '社区' },
              { value: 'challenge', label: '挑战' },
              { value: 'ai', label: 'AI创作' },
              { value: 'growth', label: '成长' },
            ]}
          />
        </Col>
        <Col>
          <Select
            allowClear
            placeholder="状态"
            style={{ width: 120 }}
            value={status}
            onChange={setStatus}
            options={[
              { value: 1, label: '启用' },
              { value: 0, label: '禁用' },
            ]}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={fetchData}>
            <SearchOutlined /> 查询
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setCreateOpen(true)}>
            <PlusOutlined /> 新增
          </Button>
        </Col>
        <Col>
          <Button type="primary" danger disabled={!selectedRows.length} onClick={handleBatchDelete}>
            <DeleteOutlined /> 批量删除
          </Button>
        </Col>
      </Row>

      <Spin spinning={isLoading}>
        <UserExpActionTable
          data={data}
          selectedRows={selectedRows}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleEditClick={(row) => {
            setEditing(row);
            setEditOpen(true);
          }}
          handleDeleteClick={handleDelete}
        />
      </Spin>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <UserExpActionModal
        open={createOpen}
        title="新增经验行为"
        onCancel={() => setCreateOpen(false)}
        onFinish={handleCreate}
        form={createForm}
        isEdit={false}
      />

      <UserExpActionModal
        open={editOpen}
        title="编辑经验行为"
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onFinish={handleUpdate}
        form={editForm}
        initialValues={editing}
        isEdit
      />
    </div>
  );
};

export default UserExpAction;
