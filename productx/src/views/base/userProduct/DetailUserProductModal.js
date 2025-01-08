import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Divider, Image, Space, Alert, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import styled from 'styled-components';
import { CheckCircleOutlined, EditOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { detailProductService } from 'src/service/product.service';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }

  .ant-modal-header {
    margin-bottom: 8px;
  }

  .ant-modal-title {
    color: #000000;
  }

  .ant-descriptions-item-label {
    color: #666;
    width: 100px;
  }

  .image-gallery {
    margin: 8px 0;

    .image-title {
      color: #666;
      margin-bottom: 4px;
    }

    .image-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .ant-image {
        width: 80px;
        height: 80px;
        border-radius: 2px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .ant-alert {
    margin-bottom: 8px;
    padding: 4px 8px;
  }

  .ant-modal-footer {
    margin-top: 8px;
    padding: 8px 0 0;
    border-top: 1px solid #f0f0f0;

    .ant-btn {
      height: 24px;
      padding: 0 12px;
    }
  }
`;

const DetailUserProductModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { productId, ...modalProps } = props;
  const { t } = useTranslation();
  const [productData, setProductData] = useState(null);

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
    <StyledModal
      title={t('productDetails')}
      {...modalProps}
      footer={null}
      width={800}
      maskClosable={false}
    >
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label={t('productStatus')} span={2}>
          {productData && renderStatus(productData.status)}
        </Descriptions.Item>
        <Descriptions.Item label={t('productId')} span={2}>
          {productData.id}
        </Descriptions.Item>
        <Descriptions.Item label={t('userId')} span={2}>
          {productData.userId}
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
        <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
          {t('productDescription')}:
        </div>
        <div
          style={{
            fontSize: '11px',
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
        <div className="image-title">{t('coverImage')}:</div>
        <div className="image-container">
          <Image src={productData.imageCover} alt="cover" />
        </div>
      </div>

      {productData.imageList && productData.imageList.length > 0 && (
        <div className="image-gallery">
          <div className="image-title">{t('productImages')}:</div>
          <div className="image-container">
            {productData.imageList.map((image, index) => (
              <Image key={index} src={image} alt={`product-${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </StyledModal>
  );
};

export default DetailUserProductModal;
