import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import UserProductTable from "./UserProductTable";
import AddUserProductModal from "./AddUserProductModal";
import UpdateUserProductModal from "./UpdateUserProductModal";
import { useTranslation } from 'react-i18next';

const createProduct = async (productData) => {
  await api.post('/manage/user-product/create', productData);
};

const updateProduct = async (updateData) => {
  await api.put('/manage/user-product/update', updateData);
};

const UserProduct = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    category: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      );
      const response = await api.get('/manage/user-product/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      } else {
        message.info(t("noData"));
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateProduct = async (values) => {
    await createProduct(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateProduct = async (values) => {
    await updateProduct(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleDeleteClick = async (id) => {
    await api.post('/manage/user-product/remove', { id });
    await fetchData();
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    updateForm.setFieldsValue({
      id: product.id,
      userId: product.userId,
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      category: product.category,
      province: product.province,
      city: product.city,
      status: product.status === 1,
    });
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
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder={t("userId")}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="category"
                onChange={(value) => handleSearchChange({ target: { name: 'category', value } })}
                allowClear
                placeholder={t("selectCategory")}
              >
                <Option value="电脑">{t("computer")}</Option>
                <Option value="手机">{t("phone")}</Option>
                <Option value="其他">{t("other")}</Option>
              </Select>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : t("search")}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                {t("createProduct")}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/user-product/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                {t("batchDelete")}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserProductTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <AddUserProductModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateProduct}
        form={createForm}
      />

      <UpdateUserProductModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateProduct={handleUpdateProduct}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default UserProduct;
