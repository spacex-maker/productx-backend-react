import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Divider, Image, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import { CheckCircleOutlined, EditOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { detailProductService } from 'src/service/product.service';
import { ConsumerAvatar, useConsumerAvatar } from 'src/components';

const DetailUserProductModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { productId, ...modalProps } = props;
  const { t } = useTranslation();
  const [productData, setProductData] = useState(null);
  const consumer = useConsumerAvatar(productData?.userId);

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        const [error, responseData] = await detailProductService(productId);
        if (error) {
          return;
        }
        setProductData(responseData);
      };
      fetchProductDetails();
    }
  }, [productId]);

  if (!productData) {
    return null;
  }

  const statusConfig = {
    0: {
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      label: 'normal',
    },
    1: {
      icon: <EditOutlined />,
      color: '#faad14',
      label: 'draft',
    },
    2: {
      icon: <StopOutlined />,
      color: '#ff4d4f',
      label: 'offShelf',
    },
    3: {
      icon: <DeleteOutlined />,
      color: '#d9d9d9',
      label: 'deleted',
    },
  };

  const renderStatus = (status) => {
    const config = statusConfig[status] || statusConfig[0];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {React.cloneElement(config.icon, { style: { color: config.color } })}
        <Tag color={config.color}>{t(config.label)}</Tag>
      </div>
    );
  };

  return (
    <Modal
      title={t('productDetails')}
      {...modalProps}
      footer={null}
      width={800}
      maskClosable={false}
    >
      <Descriptions column={2}  bordered>
        <Descriptions.Item label={t('productStatus')} span={2}>
          {productData && renderStatus(productData.status)}
        </Descriptions.Item>
        <Descriptions.Item label={t('productId')} span={2}>
          {productData.id}
        </Descriptions.Item>
        <Descriptions.Item label={t('userId')} span={2}>
          <ConsumerAvatar consumer={consumer}></ConsumerAvatar>
        </Descriptions.Item>
        <Descriptions.Item label={t('productName')} span={2}>
          {productData.productName}
        </Descriptions.Item>
        <Descriptions.Item label={t('price')}>
          {productData.price} {productData.currencyCode}
        </Descriptions.Item>
        <Descriptions.Item label={t('originalPrice')}>
          {productData.originalPrice} {productData.currencyCode}
        </Descriptions.Item>
        <Descriptions.Item label={t('stock')}>{productData.stock}</Descriptions.Item>
        <Descriptions.Item label={t('viewCount')}>{productData.viewCount}</Descriptions.Item>
        <Descriptions.Item label={t('category')}>{productData.category}</Descriptions.Item>
        <Descriptions.Item label={t('location')}>
          {productData.province} - {productData.city}
        </Descriptions.Item>
        <Descriptions.Item label={t('createTime')}>
          {formatDate(productData.createTime)}
        </Descriptions.Item>
        <Descriptions.Item label={t('updateTime')}>
          {formatDate(productData.updateTime)}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '12px 0' }} />

      <div className="product-description">
        <div style={{ color: '#666', marginBottom: '4px' }}>{t('productDescription')}:</div>
        <div
          style={{
            background: '#fafafa',
            padding: '8px',
            borderRadius: '2px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {productData.productDescription}
        </div>
      </div>

      <div className="image-gallery">
        <div style={{ color: '#666', marginBottom: '4px' }}>{t('coverImage')}:</div>
        <div style={{ width: '25%' }}>
          <Image src={productData.imageCover} alt="cover" />
        </div>
      </div>
      <div className="image-gallery">
        <div style={{ color: '#666', marginBottom: '4px' }}>{t('productImages')}:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {productData.imageList &&
            productData.imageList.length > 0 &&
            productData.imageList.map((image, index) => (
              <div key={index} style={{ width: '24%', margin: '0 0.5% 1%' }}>
                <Image key={index} src={image} alt={`product-${index + 1}`} />
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default DetailUserProductModal;
