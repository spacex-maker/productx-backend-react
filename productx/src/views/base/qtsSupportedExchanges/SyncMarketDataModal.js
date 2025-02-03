import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Spin, Button } from 'antd';
import api from 'src/axiosInstance';

const { Option } = Select;

const SyncMarketDataModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  loading,
  syncTime,
}) => {
  const [symbols, setSymbols] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loadingExchanges, setLoadingExchanges] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState('');

  const fetchExchanges = async () => {
    setLoadingExchanges(true);
    try {
      const response = await api.get('/manage/qts-supported-exchanges/list', {
        params: { 
          currentPage: 1,
          size: 1000,
          status: true, // 只获取已启用的交易所
        },
      });
      if (response && response.data) {
        setExchanges(response.data);
      }
    } catch (error) {
      console.error('获取交易所列表失败', error);
    } finally {
      setLoadingExchanges(false);
    }
  };

  const fetchSymbols = async (exchangeName) => {
    setLoadingExchanges(true);
    try {
      const response = await api.get('/manage/qts-symbol/list', {
        params: { 
          currentPage: 1,
          size: 1000,
          exchangeName,
        },
      });
      if (response && response.data) {
        setSymbols(response.data);
      }
    } catch (error) {
      console.error('获取交易对失败', error);
    } finally {
      setLoadingExchanges(false);
    }
  };

  const handleExchangeChange = (value) => {
    setSelectedExchange(value);
    form.setFieldValue('symbol', undefined);
    if (value) {
      fetchSymbols(value);
    } else {
      setSymbols([]);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchExchanges();
    } else {
      setSymbols([]);
      setSelectedExchange('');
    }
  }, [isVisible]);

  return (
    <Modal
      title="数据同步"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={() => form.submit()}
        >
          {loading ? `同步中 (${syncTime}秒)` : '确认'}
        </Button>
      ]}
      width={600}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="交易所名称"
          name="exchangeName"
          rules={[{ required: true, message: '请选择交易所名称' }]}
        >
          <Select
            placeholder="请选择交易所"
            onChange={handleExchangeChange}
            loading={loadingExchanges}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {exchanges.map((exchange) => (
              <Option key={exchange.exchangeName} value={exchange.exchangeName}>
                {exchange.exchangeName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="交易对"
          name="symbol"
          rules={[{ required: true, message: '请选择交易对' }]}
        >
          <Select
            placeholder="请选择交易对"
            loading={loadingExchanges}
            disabled={!selectedExchange}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {symbols.map((item) => (
              <Option key={item.symbol} value={item.symbol}>
                {item.symbol}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="K线周期"
          name="interval"
          rules={[{ required: true, message: '请输入K线周期' }]}
        >
          <Select placeholder="请选择K线周期">
            <Option value="1m">1分钟</Option>
            <Option value="3m">3分钟</Option>
            <Option value="5m">5分钟</Option>
            <Option value="15m">15分钟</Option>
            <Option value="30m">30分钟</Option>
            <Option value="1h">1小时</Option>
            <Option value="2h">2小时</Option>
            <Option value="4h">4小时</Option>
            <Option value="6h">6小时</Option>
            <Option value="8h">8小时</Option>
            <Option value="12h">12小时</Option>
            <Option value="1d">1天</Option>
            <Option value="3d">3天</Option>
            <Option value="1w">1周</Option>
            <Option value="1M">1月</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="时间范围"
          required
        >
          <Input.Group compact>
            <Form.Item
              name="startTime"
              rules={[{ required: true, message: '请选择开始时间' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 4px)', marginRight: '8px' }}
            >
              <DatePicker
                showTime
                placeholder="开始时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="endTime"
              style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
            >
              <DatePicker
                showTime
                placeholder="结束时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SyncMarketDataModal; 