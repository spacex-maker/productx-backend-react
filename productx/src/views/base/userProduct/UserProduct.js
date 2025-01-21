import React, { useRef, useState } from 'react';
import { Button, Form, Input, Select, Row, Col, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import UserProductTable from './UserProductTable';

const UserProduct = () => {
  const { t } = useTranslation();
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onFormSearch = async (values) => {
    setLoading(true);
    if (tableRef.current) {
      await tableRef.current.triggerTableLoadData(values);
    }
    setLoading(false);
  };

  const onTableCreate = () => {
    tableRef.current?.triggerTableCreate();
  };

  const onTableDelete = () => {
    tableRef.current?.triggerTableDeleteMore();
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                placeholder={t('productId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                placeholder={t('userId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                style={{ width: 150 }}
                allowClear
                placeholder={t('selectCategory')}
              >
                <Select.Option value="电脑">{t('computer')}</Select.Option>
                <Select.Option value="手机">{t('phone')}</Select.Option>
                <Select.Option value="其他">{t('other')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={onFormSearch}
                  loading={loading}
                >
                  {t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={onTableCreate}
                >
                  {t('createProduct')}
                </Button>
                <Button
                  type="primary"
                  onClick={onTableDelete}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <UserProductTable ref={tableRef}></UserProductTable>
      </div>
    </div>
  );
};

export default UserProduct;
