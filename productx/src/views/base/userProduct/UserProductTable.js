import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Image, Tag, Table, message, Form, Spin, Modal } from 'antd';
import DetailUserProductModal from 'src/views/base/userProduct/DetailUserProductModal';
import { useTranslation } from 'react-i18next';
import {
  createProductService,
  deleteProductByIdsService,
  deleteProductService,
  getProductListService,
  updateProductService,
} from 'src/service/product.service';
import { useModal } from 'src/hooks/useModal';
import UpdateUserProductModal from './UpdateUserProductModal';
import AddUserProductModal from './AddUserProductModal';

const UserProductTable = (_, ref) => {
  const [data, setData] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [otherParam, setOtherParam] = useState({});
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const triggerTableLoadData = async (formParam) => {
    setIsLoading(true);
    try {
      const _otherParam = { ...otherParam };
      if (formParam) {
        setOtherParam(formParam);
        Object.assign(_otherParam, formParam);
      }
      const [error, response] = await getProductListService({
        currentPage: pagination.current,
        size: pagination.pageSize,
        ..._otherParam,
      });
      if (error) {
        return;
      }
      if (response) {
        // eslint-disable-next-line prettier/prettier
      const {data, totalNum} = response;
        setData(data);
        setPagination({
          ...pagination,
          total: totalNum,
        });
      } else {
        message.info(t('noData'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    triggerTableLoadData();
  }, [pagination?.current, pagination?.pageSize]);

  // 添加状态标签的渲染函数
  const renderStatus = (/** @type {string | number} */ status) => {
    const statusConfig = {
      0: { color: 'success', text: 'normal' },
      1: { color: 'warning', text: 'draft' },
      2: { color: 'error', text: 'offShelf' },
      3: { color: 'default', text: 'deleted' },
    };
    const config = statusConfig[status] || statusConfig[0];
    return <Tag color={config.color}>{t(config.text)}</Tag>;
  };

  const onTableSelectChange = (/** @type {React.SetStateAction<any[]>} */ selectedRowKeys) => {
    setProductIds(selectedRowKeys);
  };

  const onTableChange = (pagination) => {
    setPagination(pagination);
  };

  const [updateForm] = Form.useForm();
  const [editModal, editPlaceHolder] = useModal(UpdateUserProductModal, {
    form: updateForm,
    selectedProduct,
  });
  const onTableEditItem = async (product) => {
    setSelectedProduct(product);
    const [status, formData] = await editModal.open(updateForm);
    if (!status || !formData) {
      return;
    }
    const requestData = {
      ...formData,
      imageCover:
        Array.isArray(formData.imageCover) && formData.imageCover.length > 0
          ? formData.imageCover[0].response?.url || formData.imageCover[0].url
          : formData.imageCover,
      imageList: (formData.imageList || []).map((file) => file.response?.url || file.url),
      category: formData.category?.join(),
    };
    const [error, responseData] = await updateProductService(requestData);
    if (error || !responseData) {
      return;
    }
    message.success(t('更新成功'));
    triggerTableLoadData();
  };
  const [detailModal, detailPlaceHolder] = useModal(DetailUserProductModal, {
    productId: selectedProduct?.id,
  });
  // 显示商品详情的模态框
  const onTableViewItem = (product) => {
    setSelectedProduct(product);
    detailModal.open();
  };

  const onTableDeleteItem = async (productId) => {
    const [error] = await deleteProductService(productId);
    if (error) {
      return;
    }
    triggerTableLoadData();
  };

  const triggerTableDeleteMore = () => {
    if (productIds.length === 0) {
      message.warning(t('请选择要删除的项'));
      return;
    }
    Modal.confirm({
      title: t('批量删除'),
      content: t('确认要删除选中的数据吗？'),
      onOk: async () => {
        const [error] = await deleteProductByIdsService(productIds);
        if (error) {
          return message.error(t('批量删除失败'));
        }
        message.success(t('删除成功'));
        triggerTableLoadData();
      },
    });
  };

  const [createForm] = Form.useForm();
  const [createModal, createPlaceHolder] = useModal(AddUserProductModal, {
    form: createForm,
  });

  const triggerTableCreate = async () => {
    const [status, formData] = await createModal.open(createForm);
    if (!status || !formData) {
      return;
    }
    const requestData = {
      ...formData,
      currencyCode: 'CNY',
      category: formData.category?.join(),
      status: 0,
      imageCover:
        Array.isArray(formData.imageCover) && formData.imageCover.length > 0
          ? formData.imageCover[0].response?.url || formData.imageCover[0].url
          : '',
      imageList: (formData.imageList || []).map((file) => file.response?.url || file.url),
    };
    const [error, responseData] = await createProductService(requestData);
    if (error || !responseData) {
      return;
    }
    message.success(t('创建成功'));
    triggerTableLoadData();
  };

  // 暴露方法给父组件
  React.useImperativeHandle(ref, () => ({
    triggerTableDeleteMore,
    triggerTableCreate,
    triggerTableLoadData,
  }));

  const columns = [
    {
      title: t('coverImage'),
      dataIndex: 'imageCover',
      render: (value, rowData) => {
        if (!value) {
          return '-';
        }
        return (
          <Image
            src={rowData.imageCover}
            alt={rowData.productName}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
            preview={{
              mask: <div style={{ fontSize: '12px' }}>{t('preview')}</div>,
            }}
          />
        );
      },
    },
    {
      title: t('productId'),
      dataIndex: 'id',
    },
    {
      title: t('userId'),
      dataIndex: 'userId',
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
    },
    {
      title: t('price'),
      key: 'price',
      render: (_, rowData) => `${rowData.price} ${rowData.currencyCode}`,
    },
    {
      title: t('originalPrice'),
      key: 'originalPrice',
      render: (_, rowData) => `${rowData.originalPrice} ${rowData.currencyCode}`,
    },
    {
      title: t('stock'),
      dataIndex: 'stock',
    },
    {
      title: t('category'),
      dataIndex: 'category',
    },
    {
      title: t('province'),
      dataIndex: 'province',
    },
    {
      title: t('city'),
      dataIndex: 'city',
    },
    {
      title: t('viewCount'),
      dataIndex: 'viewCount',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      render: (/** @type {any} */ value) => renderStatus(value),
    },
    {
      title: t('action'),
      key: 'action',
      render: (/** @type {any} */ _, /** @type {{ id: any; }} */ rowData) => (
        <>
          <Button type="link" onClick={onTableEditItem.bind(null, rowData)}>
            {t('edit')}
          </Button>
          <Button type="link" onClick={onTableViewItem.bind(null, rowData)}>
            {t('detail')}
          </Button>
          <Popconfirm
            title={t('confirmDelete?')}
            onConfirm={onTableDeleteItem.bind(null, rowData.id)}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button type="link" danger>
              {t('delete')}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            onChange: onTableSelectChange,
          }}
          rowClassName={(_, index) => (index % 2 === 0 ? 'table-even-row' : 'table-odd-row')}
          bordered
          dataSource={data}
          pagination={pagination}
          onChange={onTableChange}
        />
      </Spin>
      {detailPlaceHolder}
      {editPlaceHolder}
      {createPlaceHolder}
    </div>
  );
};

export default React.forwardRef(UserProductTable);
