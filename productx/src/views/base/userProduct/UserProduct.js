import React, { useRef, useState } from 'react';
import { Button, Form, Input, Select, Row, Col, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import UserProductTable from './UserProductTable';
import { getProductListService, deleteProductService, updateProductService } from 'src/service/product.service';
import DetailUserProductModal from './DetailUserProductModal';
import UpdateUserProductModal from './UpdateUserProductModal';

const UserProduct = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 加载数据
  const loadData = async (values = {}) => {
    setLoading(true);
    try {
      const [error, response] = await getProductListService(values);
      if (error) {
        return;
      }
      if (response?.data) {
        setData(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const onFormSearch = async (values) => {
    const searchParams = Object.fromEntries(
      Object.entries(values || {}).filter(([_, v]) => v != null && v !== '')
    );
    await loadData(searchParams);
  };

  // 全选处理
  const handleSelectAll = (event, data) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? data.map(item => item.id) : []);
  };

  // 单选处理
  const handleSelectRow = (id, data) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
  };

  // 编辑
  const onTableEditItem = (item) => {
    setSelectedProduct(item);
    setUpdateModalVisible(true);
  };

  // 查看详情
  const onTableViewItem = (item) => {
    setSelectedProduct(item);
    setDetailModalVisible(true);
  };

  // 删除
  const onTableDeleteItem = async (id) => {
    const [error] = await deleteProductService(id);
    if (!error) {
      message.success(t('deleteSuccess'));
      loadData();
    }
  };

  // 添加更新处理函数
  const handleUpdate = async (values) => {
    try {
      const [error] = await updateProductService(values);
      if (!error) {
        message.success(t('updateSuccess'));
        setUpdateModalVisible(false);
        loadData();
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // 初始加载数据
  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div className="mb-3">
        <Form form={form} onFinish={onFormSearch}>
          <Row gutter={[16, 16]}>
            <Col>
              <Form.Item name="productId">
                <Input
                  placeholder={t('productId')}
                  allowClear
                  style={{ width: 150 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="userId">
                <Input
                  placeholder={t('userId')}
                  allowClear
                  style={{ width: 150 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="category">
                <Select
                  style={{ width: 150 }}
                  allowClear
                  placeholder={t('selectCategory')}
                >
                  <Select.Option value="电脑">{t('computer')}</Select.Option>
                  <Select.Option value="手机">{t('phone')}</Select.Option>
                  <Select.Option value="其他">{t('other')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => console.log('create')}
                >
                  {t('createProduct')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => console.log('batch delete')}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="table-responsive">
        <UserProductTable
          data={data}
          selectAll={selectAll}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          onTableEditItem={onTableEditItem}
          onTableViewItem={onTableViewItem}
          onTableDeleteItem={onTableDeleteItem}
        />
      </div>

      <DetailUserProductModal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        productId={selectedProduct?.id}
      />

      <UpdateUserProductModal
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
        }}
        onOk={() => {
          updateForm.validateFields().then((values) => {
            handleUpdate({
              ...values,
              id: selectedProduct.id
            });
          });
        }}
        form={updateForm}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default UserProduct;
