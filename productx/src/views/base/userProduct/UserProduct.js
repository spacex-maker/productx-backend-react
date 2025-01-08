import React, { useRef, useState } from 'react';
import { Button, Form, Input, Select, Divider, Space } from 'antd';
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
      <Form layout="inline" autoComplete="off" onFinish={onFormSearch}>
        <Form.Item label={null} name="userId">
          <Input size="small" placeholder={t('userId')} allowClear />
        </Form.Item>
        <Form.Item label={null} name="category">
          <Select
            size="small"
            style={{ width: '180px' }}
            allowClear
            placeholder={t('selectCategory')}
          >
            <Select.Option value="电脑">{t('computer')}</Select.Option>
            <Select.Option value="手机">{t('phone')}</Select.Option>
            <Select.Option value="其他">{t('other')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button size="small" type="primary" htmlType="submit" loading={loading}>
            {t('search')}
          </Button>
          <Divider type="vertical" />
          <Space>
            <Button size="small" type="primary" onClick={onTableCreate}>
              {t('createProduct')}
            </Button>
            <Button size="small" type="primary" onClick={onTableDelete}>
              {t('batchDelete')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <div className="table-responsive">
        <UserProductTable ref={tableRef}></UserProductTable>
      </div>
    </div>
  );
};

export default UserProduct;
