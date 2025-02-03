import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, DatePicker, Tag, Select, Card, Radio } from 'antd'
import Pagination from "src/components/common/Pagination"
import QtsMarketDataTable from "./QtsMarketDataTable"
import QtsMarketDataChart from "./QtsMarketDataChart"
import dayjs from 'dayjs'
import moment from 'moment'

const { RangePicker } = DatePicker;

// 默认值设置
const DEFAULT_EXCHANGE = 'Binance';
const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_INTERVAL = '30m';
const DEFAULT_DAYS = 3;

const INTERVALS = [
  { label: '1分钟', value: '1m' },
  { label: '3分钟', value: '3m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '1小时', value: '1h' },
  { label: '2小时', value: '2h' },
  { label: '4小时', value: '4h' },
  { label: '6小时', value: '6h' },
  { label: '8小时', value: '8h' },
  { label: '12小时', value: '12h' },
  { label: '1天', value: '1d' },
  { label: '3天', value: '3d' },
  { label: '1周', value: '1w' },
  { label: '1月', value: '1M' }
];

// 添加时间范围限制常量
const MAX_TIME_RANGE = 3 * 365 * 24 * 60 * 60 * 1000; // 3年的毫秒数
const MIN_TIME = dayjs().subtract(3, 'year'); // 3年前
const MAX_TIME = dayjs(); // 当前时间

const QtsMarketData = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    exchangeName: '',
    symbol: '',
    interval: '',
    openTime: null,
    closeTime: null,
    minOpenPrice: '',
    maxOpenPrice: '',
    minClosePrice: '',
    maxClosePrice: '',
    minVolume: '',
    maxVolume: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [exchanges, setExchanges] = useState([])
  const [selectedExchange, setSelectedExchange] = useState(null)
  const [symbols, setSymbols] = useState([])
  const [loadingSymbols, setLoadingSymbols] = useState(false)

  const [chartForm] = Form.useForm();
  const [listForm] = Form.useForm();
  
  const [showListSection, setShowListSection] = useState(false);

  // 快捷时间范围选项
  const timeRangeOptions = [
    { label: '1小时', value: '1h' },
    { label: '4小时', value: '4h' },
    { label: '12小时', value: '12h' },
    { label: '1天', value: '1d' },
    { label: '3天', value: '3d' },
    { label: '7天', value: '7d' },
    { label: '15天', value: '15d' },
    { label: '1月', value: '1M' },
    { label: '自定义', value: 'custom' }
  ];

  // 初始化默认时间范围
  const getDefaultDateRange = () => {
    const end = dayjs();
    const start = end.subtract(DEFAULT_DAYS, 'day');
    return [start, end];
  };

  // 初始化表单默认值
  useEffect(() => {
    // 图表查询表单默认值
    chartForm.setFieldsValue({
      exchangeName: DEFAULT_EXCHANGE,
      symbol: DEFAULT_SYMBOL,
      interval: DEFAULT_INTERVAL,
      dateRange: getDefaultDateRange()
    });

    // 列表查询表单默认值
    listForm.setFieldsValue({
      exchangeName: DEFAULT_EXCHANGE,
      symbol: DEFAULT_SYMBOL,
      interval: DEFAULT_INTERVAL,
      dateRange: getDefaultDateRange()
    });
  }, []);

  // 获取交易所列表后自动获取交易对
  useEffect(() => {
    fetchExchanges().then(() => {
      if (DEFAULT_EXCHANGE) {
        fetchSymbols(DEFAULT_EXCHANGE);
      }
    });
  }, []);

  // 初始化完成后自动触发查询
  useEffect(() => {
    if (exchanges.length > 0 && symbols.length > 0) {
      const defaultValues = {
        exchangeName: DEFAULT_EXCHANGE,
        symbol: DEFAULT_SYMBOL,
        interval: DEFAULT_INTERVAL,
        dateRange: getDefaultDateRange()
      };
      
      handleListSearch(defaultValues);
    }
  }, [exchanges, symbols]);

  // 图表查询处理函数
  const handleChartSearch = (values) => {
    const { dateRange, ...rest } = values;
    const [startDate, endDate] = dateRange || [];
    
    // 构建查询参数
    const params = {
      ...rest,
      startTime: startDate?.valueOf(),
      endTime: endDate?.valueOf(),
      limit: 1000  // 设置较大的限制以获取足够的数据点
    };

    // 调用图表数据查询接口
    api.get('/manage/qts-market-data/list', { params })
      .then(response => {
        if (response?.data) {
          // 更新图表数据
          setChartParams(params);
        }
      })
      .catch(error => {
        console.error('获取K线数据失败:', error);
        message.error('获取K线数据失败');
      });
  };

  // 处理列表查询
  const handleListSearch = (values) => {
    const { dateRange, ...rest } = values;
    const [startDate, endDate] = dateRange || [];
    
    setSearchParams({
      ...rest,
      openTime: startDate?.valueOf(),
      closeTime: endDate?.valueOf()
    });
    setCurrent(1);
    fetchData();
  };

  const [chartParams, setChartParams] = useState(null);

  useEffect(() => {
    fetchExchanges()
  }, [])

  useEffect(() => {
    if (selectedExchange) {
      setSearchParams(prev => ({
        ...prev,
        exchangeName: selectedExchange
      }))
      fetchData()
    }
  }, [selectedExchange])

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 过滤掉空值参数
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      )
      
      // 列表查询使用分页参数
      const response = await api.get('/manage/qts-market-data/list', {
        params: { 
          currentPage, 
          size: pageSize, 
          ...filteredParams 
        },
      })

      if (response?.data) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('获取数据失败', error)
      message.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExchanges = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/manage/qts-supported-exchanges/list', {
        params: { status: 1 } // 只获取启用的交易所
      });
      if (response?.data) {
        setExchanges(response.data);
      }
    } catch (error) {
      console.error('获取交易所列表失败:', error);
      message.error('获取交易所列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSymbols = async (exchangeName) => {
    if (!exchangeName) return;
    
    setLoadingSymbols(true);
    try {
      const response = await api.get('/manage/qts-symbol/list', {
        params: { 
          exchangeName,
          status: 1, // 只获取启用的交易对
          currentPage: 1,
          size: 1000
        }
      });
      if (response?.data) {
        setSymbols(response.data);
      }
    } catch (error) {
      console.error('获取交易对列表失败:', error);
      message.error('获取交易对列表失败');
    } finally {
      setLoadingSymbols(false);
    }
  };

  const handleExchangeChange = (value) => {
    listForm.setFieldValue('symbol', undefined);
    setSymbols([]);
    fetchSymbols(value);
  };

  const handleSearchChange = (value, name) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  // 处理快捷时间范围选择
  const handleTimeRangeChange = (value) => {
    if (value === 'custom') {
      chartForm.setFieldValue('timeRangeType', 'custom');
      return;
    }

    const now = dayjs();
    let startTime;

    switch (value) {
      case '1h':
        startTime = now.subtract(1, 'hour');
        break;
      case '4h':
        startTime = now.subtract(4, 'hours');
        break;
      case '12h':
        startTime = now.subtract(12, 'hours');
        break;
      case '1d':
        startTime = now.subtract(1, 'day');
        break;
      case '3d':
        startTime = now.subtract(3, 'days');
        break;
      case '7d':
        startTime = now.subtract(7, 'days');
        break;
      case '15d':
        startTime = now.subtract(15, 'days');
        break;
      case '1M':
        startTime = now.subtract(1, 'month');
        break;
      default:
        return;
    }

    chartForm.setFieldsValue({
      dateRange: [startTime, now]
    });

    // 自动触发查询
    handleChartSearch({
      ...chartForm.getFieldsValue(),
      dateRange: [startTime, now]
    });
  };

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      {/* 图表查询区域 */}
      <Card title="K线图查询" style={{ marginBottom: 16 }}>
        <Form
          form={chartForm}
          layout="inline"
          style={{ marginBottom: 16 }}
          initialValues={{
            exchangeName: DEFAULT_EXCHANGE,
            symbol: DEFAULT_SYMBOL,
            interval: DEFAULT_INTERVAL,
            dateRange: [dayjs().subtract(7, 'day'), dayjs()]
          }}
        >
          <Form.Item
            name="exchangeName"
            rules={[{ required: true, message: '请选择交易所' }]}
          >
            <Select
              placeholder="选择交易所"
              style={{ width: 200 }}
              onChange={(value) => {
                chartForm.setFieldsValue({
                  symbol: undefined,
                  exchangeName: value
                });
                fetchSymbols(value);
                // 当有其他必填项都有值时，触发查询
                const formValues = chartForm.getFieldsValue();
                if (value && formValues.interval && formValues.dateRange) {
                  handleChartSearch({
                    ...formValues,
                    exchangeName: value,
                    symbol: undefined
                  });
                }
              }}
              options={exchanges.map(exchange => ({
                label: exchange.exchangeName,
                value: exchange.exchangeName
              }))}
            />
          </Form.Item>

          <Form.Item
            name="symbol"
            rules={[{ required: true, message: '请选择交易对' }]}
          >
            <Select
              placeholder="选择交易对"
              style={{ width: 200 }}
              loading={loadingSymbols}
              disabled={!chartForm.getFieldValue('exchangeName')}
              showSearch
              onChange={(value) => {
                const formValues = chartForm.getFieldsValue();
                if (value && formValues.exchangeName && formValues.interval && formValues.dateRange) {
                  handleChartSearch({
                    ...formValues,
                    symbol: value
                  });
                }
              }}
              options={symbols.map(symbol => ({
                label: symbol.symbol,
                value: symbol.symbol
              }))}
            />
          </Form.Item>

          <Form.Item
            name="interval"
            rules={[{ required: true, message: '请选择K线周期' }]}
          >
            <Select
              placeholder="选择K线周期"
              style={{ width: 150 }}
              onChange={(value) => {
                const formValues = chartForm.getFieldsValue();
                if (value && formValues.exchangeName && formValues.symbol && formValues.dateRange) {
                  handleChartSearch({
                    ...formValues,
                    interval: value
                  });
                }
              }}
              options={INTERVALS}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <DatePicker.RangePicker
              showTime={false}
              style={{ width: 380 }}
              ranges={{
                '最近1小时': [dayjs().subtract(1, 'hour'), dayjs()],
                '最近4小时': [dayjs().subtract(4, 'hour'), dayjs()],
                '最近12小时': [dayjs().subtract(12, 'hour'), dayjs()],
                '最近1天': [dayjs().subtract(1, 'day'), dayjs()],
                '最近3天': [dayjs().subtract(3, 'day'), dayjs()],
                '最近7天': [dayjs().subtract(7, 'day'), dayjs()],
                '最近1月': [dayjs().subtract(1, 'month'), dayjs()],
                '最近3月': [dayjs().subtract(3, 'month'), dayjs()],
                '最近6月': [dayjs().subtract(6, 'month'), dayjs()],
                '最近1年': [dayjs().subtract(1, 'year'), dayjs()],
              }}
              onChange={(dates) => {
                if (dates) {
                  const formValues = chartForm.getFieldsValue();
                  if (formValues.exchangeName && formValues.symbol && formValues.interval) {
                    handleChartSearch({
                      ...formValues,
                      dateRange: dates
                    });
                  }
                }
              }}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* 图表展示区域 */}
      {chartParams && <QtsMarketDataChart {...chartParams} />}

      {/* 展开/收起按钮 */}
      <Button 
        type="link" 
        onClick={() => setShowListSection(!showListSection)}
        style={{ marginTop: 16, marginBottom: 16 }}
      >
        {showListSection ? '收起列表查询 ↑' : '展开列表查询 ↓'}
      </Button>

      {/* 列表查询和展示区域 */}
      {showListSection && (
        <>
          <Card title="数据列表查询">
            <Form
              form={listForm}
              onFinish={handleListSearch}
              layout="inline"
              style={{ marginBottom: 16 }}
            >
              {/* 基本查询条件 */}
              <Form.Item
                name="exchangeName"
                rules={[{ required: true, message: '请选择交易所' }]}
              >
                <Select
                  placeholder="选择交易所"
                  style={{ width: 200 }}
                  onChange={(value) => {
                    listForm.setFieldValue('symbol', undefined);
                    fetchSymbols(value);
                  }}
                  allowClear
                  loading={isLoading}
                  options={exchanges.map(exchange => ({
                    label: exchange.exchangeName,
                    value: exchange.exchangeName
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="symbol"
                rules={[{ required: true, message: '请选择交易对' }]}
              >
                <Select
                  placeholder="选择交易对"
                  style={{ width: 200 }}
                  loading={loadingSymbols}
                  disabled={!listForm.getFieldValue('exchangeName')}
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  options={symbols.map(symbol => ({
                    label: symbol.symbol,
                    value: symbol.symbol
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="interval"
                rules={[{ required: true, message: '请选择K线周期' }]}
              >
                <Select
                  placeholder="选择K线周期"
                  style={{ width: 150 }}
                  allowClear
                  options={INTERVALS}
                />
              </Form.Item>

              <Form.Item
                name="dateRange"
                rules={[{ required: true, message: '请选择时间范围' }]}
              >
                <DatePicker.RangePicker
                  showTime
                  style={{ width: 380 }}
                  ranges={{
                    '最近1小时': [dayjs().subtract(1, 'hour'), dayjs()],
                    '最近4小时': [dayjs().subtract(4, 'hour'), dayjs()],
                    '最近12小时': [dayjs().subtract(12, 'hour'), dayjs()],
                    '最近1天': [dayjs().subtract(1, 'day'), dayjs()],
                    '最近3天': [dayjs().subtract(3, 'day'), dayjs()],
                    '最近7天': [dayjs().subtract(7, 'day'), dayjs()],
                    '最近1月': [dayjs().subtract(1, 'month'), dayjs()],
                  }}
                />
              </Form.Item>

              {/* 价格和成交量过滤条件 */}
              <Form.Item name="minOpenPrice">
                <Input placeholder="最小开盘价" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="maxOpenPrice">
                <Input placeholder="最大开盘价" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="minClosePrice">
                <Input placeholder="最小收盘价" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="maxClosePrice">
                <Input placeholder="最大收盘价" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="minVolume">
                <Input placeholder="最小成交量" style={{ width: 150 }} />
              </Form.Item>
              <Form.Item name="maxVolume">
                <Input placeholder="最大成交量" style={{ width: 150 }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询列表
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <div className="table-responsive" style={{ marginTop: 16 }}>
            <Spin spinning={isLoading}>
              <QtsMarketDataTable data={data} />
            </Spin>
          </div>

          <Pagination
            totalPages={totalPages}
            current={currentPage}
            onPageChange={setCurrent}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  )
}

export default QtsMarketData
