import React, { useState } from 'react';
import { Button, Popconfirm, Image, Tag } from 'antd';
import { formatDate } from "src/components/common/Common";
import DetailUserProductModal from "src/views/base/userProduct/DetailUserProductModal";
import { useTranslation } from 'react-i18next';

const UserProductTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDeleteClick
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productId, setProductId] = useState(null);
  const { t } = useTranslation();

  // 添加状态标签的渲染函数
  const renderStatus = (status) => {
    const statusConfig = {
      0: { color: 'success', text: 'normal' },
      1: { color: 'warning', text: 'draft' },
      2: { color: 'error', text: 'offShelf' },
      3: { color: 'default', text: 'deleted' }
    };

    const config = statusConfig[status] || statusConfig[0];
    return (
      <Tag color={config.color}>
        {t(config.text)}
      </Tag>
    );
  };

  // 显示商品详情的模态框
  const handleViewDetails = (product) => {
    setProductId(product);
    setIsModalVisible(true);
  };

  // 关闭商品详情模态框
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setProductId(null);
  };

  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="select_all"
                  checked={selectAll}
                  onChange={(event) => handleSelectAll(event, data)}
                />
                <label className="custom-control-label" htmlFor="select_all"></label>
              </div>
            </th>
            <th>{t('coverImage')}</th>
            {[
              'productId',
              'userId',
              'productName',
              'price',
              'originalPrice',
              'stock',
              'category',
              'province',
              'city',
              'viewCount',
              'status'
            ].map((field) => (
              <th key={field}>{t(field)}</th>
            ))}
            <th className="fixed-column">{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`td_checkbox_${item.id}`}
                  ></label>
                </div>
              </td>
              <td style={{ width: '60px', padding: '4px' }}>
                {item.imageCover && (
                  <Image
                    src={item.imageCover}
                    alt={item.productName}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    preview={{
                      mask: <div style={{ fontSize: '12px' }}>{t('preview')}</div>
                    }}
                  />
                )}
              </td>
              <td className="text-truncate">{item.id}</td>
              <td className="text-truncate">{item.userId}</td>
              <td className="text-truncate">{item.productName}</td>
              <td className="text-truncate">{item.price} {item.currencyCode}</td>
              <td className="text-truncate">{item.originalPrice} {item.currencyCode}</td>
              <td className="text-truncate">{item.stock}</td>
              <td className="text-truncate">{item.category}</td>
              <td className="text-truncate">{item.province}</td>
              <td className="text-truncate">{item.city}</td>
              <td className="text-truncate">{item.viewCount}</td>
              <td className="text-truncate">
                {renderStatus(item.status)}
              </td>
              <td className="fixed-column">
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Button type="link" onClick={() => handleViewDetails(item.id)}>
                  {t('detail')}
                </Button>
                <Popconfirm
                  title={t('confirmDelete?')}
                  onConfirm={() => handleDeleteClick(item.id)}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button type="link" danger>
                    {t('delete')}
                  </Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DetailUserProductModal
        visible={isModalVisible}
        productId={productId}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default UserProductTable;
