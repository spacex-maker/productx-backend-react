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

const UserProductTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  onTableEditItem,
  onTableViewItem,
  onTableDeleteItem
}) => {
  const { t } = useTranslation();

  const columns = [
    t('productInfo'),
    t('userId'),
    t('price'),
    t('originalPrice'),
    t('stock'),
    t('category'),
    t('province'),
    t('city'),
    t('viewCount'),
    t('status')
  ];

  const renderStatus = (status) => {
    const statusConfig = {
      0: { color: 'success', text: 'normal' },
      1: { color: 'warning', text: 'draft' },
      2: { color: 'error', text: 'offShelf' },
      3: { color: 'default', text: 'deleted' },
    };
    const config = statusConfig[status] || statusConfig[0];
    return <Tag color={config.color}>{t(config.text)}</Tag>;
  };

  return (
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
          {columns.map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column" key='操作'>{t('action')}</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
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
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.imageCover ? (
                  <Image
                    src={item.imageCover}
                    alt={item.productName}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    preview={{
                      mask: <div style={{ fontSize: '12px' }}>{t('preview')}</div>,
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}
                  >
                    -
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>{item.productName}</span>
                  <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {item.id}</span>
                </div>
              </div>
            </td>
            <td>{item.userId}</td>
            <td>{`${item.price} ${item.currencyCode}`}</td>
            <td>{`${item.originalPrice} ${item.currencyCode}`}</td>
            <td>{item.stock}</td>
            <td>{item.category}</td>
            <td>{item.province}</td>
            <td>{item.city}</td>
            <td>{item.viewCount}</td>
            <td>{renderStatus(item.status)}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => onTableEditItem(item)}>
                {t('edit')}
              </Button>
              <Button type="link" onClick={() => onTableViewItem(item)}>
                {t('detail')}
              </Button>
              <Popconfirm
                title={t('confirmDelete?')}
                onConfirm={() => onTableDeleteItem(item.id)}
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
  );
};

export default UserProductTable;
