import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import WalletTable from "src/views/base/sysWallets/WalletTable"
import UpdateWalletModal from "src/views/base/sysWallets/UpdateWalletModal"
import WalletCreateFormModal from "src/views/base/sysWallets/WalletsCreateFormModel"

const updateWalletStatus = async (id, newStatus) => {
  await api.post('/manage/sys-wallets/change-status', { id, status: newStatus })
}

const createWallet = async (walletData) => {
  await api.post('/manage/sys-wallets/create', walletData)
}

const updateWallet = async (updateData) => {
  await api.put(`/manage/sys-wallets/update`, updateData)
}

const WalletList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    address: '',
    type: '',
    label: '',
    countryCode: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [countries, setCountries] = useState([]);  // 存储获取到的国家列表
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);  // 存储获取到的钱包类型列表

  // 获取国家列表
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);  // 设置国家列表
        } else {
          message.error('获取国家列表失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
        console.error('获取国家列表失败:', error);
      }
    };
    fetchCountries();
  }, []);

  // 获取钱包类型列表
  useEffect(() => {
    const fetchCryptoCurrencies = async () => {
      try {
        const response = await api.get('/manage/sys-crypto-currencies/list-all-enable');
        if (response) {
          setCryptoCurrencies(response);  // 设置钱包类型列表
        } else {
          message.error('获取钱包类型列表失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
        console.error('获取钱包类型列表失败:', error);
      }
    };
    fetchCryptoCurrencies();
  }, []);


  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      )
      const response = await api.get('/manage/sys-wallets/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response && response.data) {
        setData(response.data) // Updated to match the new data structure
        setTotalNum(response.totalNum) // Read total number of items
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await api.post('/manage/sys-wallets/change-status', { id, status: newStatus })
    await fetchData() // Re-fetch data after status update
  }

  const handleCreateWallet = async (values) => {
    await createWallet(values)
    setIsCreateModalVisible(false)
    createForm.resetFields()
    await fetchData()
  }

  const handleUpdateWallet = async (values) => {
    await updateWallet(values)
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
    await fetchData()
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  const handleEditClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsUpdateModalVisible(true);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.address}
                onChange={handleSearchChange}
                name="address"
                placeholder="钱包地址"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="type"
                onChange={(value) => handleSearchChange({ target: { name: 'type', value } })}
                placeholder="请选择钱包类型"
                allowClear
                style={{ width: '100%' }}>
                {cryptoCurrencies.map((crypto) => (
                  <Select.Option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol})
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Input
                size="small"
                value={searchParams.label}
                onChange={handleSearchChange}
                name="label"
                placeholder="钱包标签/别名"
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                size="small"
                name="countryCode"
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value } })}
                placeholder="钱包所属国家"
                allowClear
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
                dropdownMatchSelectWidth={false}
                popupMatchSelectWidth={false}
                listHeight={256}
                dropdownStyle={{ 
                  minWidth: 250,
                  maxWidth: 300
                }}
              >
                {countries.map(country => (
                  <Select.Option key={country.code} value={country.code}>
                    <Space>
                      <img 
                        src={country.flagImageUrl} 
                        alt={country.name}
                        style={{ 
                          width: 20, 
                          height: 15, 
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid #f0f0f0'
                        }}
                      />
                      <span>{country.name}</span>
                      <span style={{ color: '#999' }}>({country.code})</span>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                className="search-button"
                disabled={isLoading}
                block
              >
                {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
                block
              >
                新增钱包
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/sys-wallets/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
                block
              >
                批量删除
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <WalletTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            countries={countries}
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
      <WalletCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateWallet}
        form={createForm}
        countries={countries}
        cryptoCurrencies={cryptoCurrencies}
      />
      <UpdateWalletModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateWallet={handleUpdateWallet}
        selectedWallet={selectedWallet}
        cryptoCurrencies={cryptoCurrencies}
      />
    </div>
  )
}

export default WalletList
