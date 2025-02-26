import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import WalletTable from "src/views/base/sysWallets/WalletTable"
import UpdateWalletModal from "src/views/base/sysWallets/UpdateWalletModal"
import WalletCreateFormModal from "src/views/base/sysWallets/WalletsCreateFormModel"
import { useTranslation } from 'react-i18next'
import WalletDetailModal from "src/views/base/sysWallets/WalletDetailModal"

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
  const { t } = useTranslation()
  
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
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedWalletForDetail, setSelectedWalletForDetail] = useState(null);

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
    try {
      setIsLoading(true)
      // 只发送 id 和 label 字段
      await updateWallet({
        id: values.id,
        label: values.label
      })
      message.success(t('updateSuccess'))
      setIsUpdateModalVisible(false)
      fetchData()
    } catch (error) {
      console.error('更新钱包失败:', error)
      message.error(t('updateFailed'))
    } finally {
      setIsLoading(false)
    }
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

  const handleViewDetails = (wallet) => {
    setSelectedWalletForDetail(wallet);
    setIsDetailModalVisible(true);
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <Row gutter={16} className="mb-3">
            <Col>
              <Input
                value={searchParams.address}
                onChange={handleSearchChange}
                name="address"
                placeholder={t('pleaseInputWalletAddress')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                name="type"
                onChange={(value) => handleSearchChange({ target: { name: 'type', value } })}
                placeholder={t('pleaseSelectWalletType')}
                allowClear
                style={{ width: 150 }}
              >
                {cryptoCurrencies.map((crypto) => (
                  <Select.Option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol})
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.label}
                onChange={handleSearchChange}
                name="label"
                placeholder={t('pleaseInputWalletLabel')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                name="countryCode"
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value } })}
                placeholder={t('pleaseSelectCountry')}
                allowClear
                style={{ width: 150 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
              >
                {countries.map(country => (
                  <Select.Option key={country.code} value={country.code}>
                    <Space>
                      <img 
                        src={country.flagImageUrl} 
                        alt={country.name}
                        style={{ width: 20, height: 15, objectFit: 'cover', borderRadius: 2 }}
                      />
                      <span>{country.name}</span>
                      <span style={{ color: '#999' }}>({country.code})</span>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('addWallet')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-wallets/delete-batch',
                    selectedRows,
                    fetchData,
                    t,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
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
            handleViewDetails={handleViewDetails}
            countries={countries}
            t={t}
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
        t={t}
      />

      <UpdateWalletModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateWallet={handleUpdateWallet}
        selectedWallet={selectedWallet}
        cryptoCurrencies={cryptoCurrencies}
        t={t}
      />

      <WalletDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedWalletForDetail(null);
        }}
        wallet={selectedWalletForDetail}
        countries={countries}
      />
    </div>
  )
}

export default WalletList
