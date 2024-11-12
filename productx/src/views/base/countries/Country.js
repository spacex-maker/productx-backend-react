import React, {useState, useEffect} from 'react';
import api from 'src/axiosInstance';
import {Modal, Button, Form, Input, message, Spin, Select, Col, Row} from 'antd';
import {UseSelectableRows} from 'src/components/common/UseSelectableRows';
import {HandleBatchDelete} from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CountryTable from 'src/views/base/countries/CountryTable'; // 你需要创建这个表格组件
import UpdateCountryModal from 'src/views/base/countries/UpdateCountryModal'; // 你需要创建这个更新模态框
import CountryCreateFormModal from 'src/views/base/countries/CountryCreateFormModal'; // 你需要创建这个创建模态框
import WorldMap from './WorldMap';
const updateCountryStatus = async (id, newStatus) => {
  await api.post('/manage/countries/change-status', {id, status: newStatus});
};

const createCountry = async (countryData) => {
  await api.post('/manage/countries/create', countryData);
};

const updateCountry = async (updateData) => {
  await api.put(`/manage/countries/update`, updateData);
};

const CountryList = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
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
    fetchAllData()
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
        params: {currentPage, pageSize: pageSize, ...filteredParams},
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
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/countries/list-all');

      if (response) {
        setAllData(response);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('数据加载失败，请重试！');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchChange = (event) => {
    const {name, value} = event.target;
    setSearchParams((prevParams) => ({...prevParams, [name]: value}));
  };

  const handleCreateCountry = async (values) => {
    await createCountry(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchAllData()
    await fetchData();
  };
  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await updateCountryStatus(id, newStatus)
    await fetchAllData()
    await fetchData() // Re-fetch data after status update
  }
  const handleUpdateCountry = async (values) => {
    await updateCountry(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchAllData()
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
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder="搜索国家名称"
                allowClear
              />
            </Col>

            <Col>
              <Input
                size="small"
                value={searchParams.code}
                onChange={handleSearchChange}
                name="code"
                placeholder="搜索国家代码"
                allowClear
              />
            </Col>

            <Col>
              <Select
                size="small"
                name="continent"
                onChange={(value) => handleSearchChange({target: {name: 'continent', value}})}
                allowClear
                placeholder="选择大陆"
                style={{width: '100%'}}
                popupMatchSelectWidth={false} // 确保下拉菜单宽度根据内容自适应
                dropdownStyle={{minWidth: 150}} // 可调整此宽度以适应内容
              >
                <Select.Option value="非洲">非洲 (Africa)</Select.Option>
                <Select.Option value="亚洲">亚洲 (Asia)</Select.Option>
                <Select.Option value="欧洲">欧洲 (Europe)</Select.Option>
                <Select.Option value="北美洲">北美洲 (North America)</Select.Option>
                <Select.Option value="南美洲">南美洲 (South America)</Select.Option>
                <Select.Option value="大洋洲">大洋洲 (Oceania)</Select.Option>
                <Select.Option value="南极洲">南极洲 (Antarctica)</Select.Option>
              </Select>
            </Col>

            <Col>
              <Select
                size="small"
                name="status"
                onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                allowClear
                placeholder="是否已开展业务"
                style={{width: '100%'}}
              >
                <Select.Option value="1">是</Select.Option>
                <Select.Option value="0">否</Select.Option>
              </Select>
            </Col>

            <Col>
              <Button
                type="primary"
                size="small"
                onClick={fetchData}
                disabled={isLoading}
                style={{width: '100%', fontSize: '12px'}}
              >
                {isLoading ? <Spin size="small"/> : '查询'}
              </Button>
            </Col>
          </Row>
        </div>

      </div>

      <div className="mb-3">
        <Button
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
          size="small"
        >
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
          size="small"
        >
          批量删除
        </Button>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <CountryTable
            allData={allData}
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
          />
        </Spin>

        <Pagination
          size="small"
          totalPages={totalPages}
          current={currentPage}
          onPageChange={setCurrent}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <WorldMap countries={allData} />
      </div>
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
