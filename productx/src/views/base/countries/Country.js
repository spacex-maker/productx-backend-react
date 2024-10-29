import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CountryTable from 'src/views/base/countries/CountryTable'; // 你需要创建这个表格组件
import UpdateCountryModal from 'src/views/base/countries/UpdateCountryModal'; // 你需要创建这个更新模态框
import CountryCreateFormModal from 'src/views/base/countries/CountryCreateFormModal'; // 你需要创建这个创建模态框

const updateCountryStatus = async (id, newStatus) => {
  await api.post('/manage/countries/change-status', { id, status: newStatus ? 1 : 0 });
};

const createCountry = async (countryData) => {
  await api.post('/manage/countries/create', countryData);
};

const updateCountry = async (updateData) => {
  await api.put(`/manage/countries/update`, updateData);
};

const CountryList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    code: '',
    continent: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/countries/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('数据加载失败，请重试！');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateCountry = async (values) => {
    await createCountry(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateCountry = async (values) => {
    await updateCountry(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (country) => {
    updateForm.setFieldsValue({
      id: country.id,
      name: country.name,
      code: country.code,
      continent: country.continent,
      status: country.status,
    });
    setSelectedCountry(country);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Input
            value={searchParams.name}
            onChange={handleSearchChange}
            name="name"
            placeholder="搜索国家名称"
            allowClear
            className="mb-2"
          />
          <Input
            value={searchParams.code}
            onChange={handleSearchChange}
            name="code"
            placeholder="搜索国家代码"
            allowClear
            className="mb-2"
          />
          <Select
            className="mb-2"
            name="status"
            value={searchParams.status}
            onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
            allowClear
            placeholder="状态"
          >
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">禁用</Select.Option>
          </Select>
          <Button
            type="primary"
            onClick={fetchData}
            disabled={isLoading}
          >
            {isLoading ? <Spin /> : '查询'}
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          新增国家
        </Button>
        <Button
          type="danger"
          onClick={() => HandleBatchDelete({
            url: '/manage/country/delete-batch',
            selectedRows,
            fetchData,
          })}
          disabled={selectedRows.length === 0}
        >
          批量删除
        </Button>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <CountryTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <CountryCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCountry}
        form={createForm}
      />
      <UpdateCountryModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCountry={handleUpdateCountry}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default CountryList;
