import React, { useEffect, useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Empty, Spin, Space, Select, Switch } from 'antd';
import api from 'src/axiosInstance';

const QtsMarketDataChart = ({ 
  exchangeName,  // 交易所名称
  symbol,        // 交易对
  interval,      // K线周期
  startTime,     // 开始时间
  endTime,       // 结束时间
  limit          // 限制数量
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [mainIndicator, setMainIndicator] = useState('none'); // 主图指标
  const [volumeIndicator, setVolumeIndicator] = useState('none'); // 成交量指标
  const [theme, setTheme] = useState('dark'); // 主题设置

  // 获取K线数据
  const fetchKlineData = async () => {
    if (!exchangeName || !symbol || !interval || !startTime) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        exchangeName,
        symbol,
        interval,
        startTime: startTime.valueOf(), // 转换为时间戳
        endTime: endTime?.valueOf(),    // 可选参数
        limit                           // 可选参数
      };

      const response = await api.get('/manage/qts-market-data/history', { params });
      setData(response);
    } catch (err) {
      console.error('获取K线数据失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 当参数变化时重新获取数据
  useEffect(() => {
    fetchKlineData();
  }, [exchangeName, symbol, interval, startTime, endTime, limit]);

  const calculateMA = (data, dayCount) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push(+(sum / dayCount).toFixed(2));
    }
    return result;
  };

  const getOption = (data) => {
    if (!data || data.length === 0) return {};

    const sortedData = [...data].sort((a, b) => a.openTime - b.openTime);
    const times = sortedData.map(item => item.openTime);
    
    const klineData = sortedData.map(item => [
      parseFloat(item.openPrice),
      parseFloat(item.closePrice),
      parseFloat(item.lowPrice),
      parseFloat(item.highPrice)
    ]);

    // 计算各周期均线
    const ma5 = calculateMA(klineData, 5);
    const ma10 = calculateMA(klineData, 10);
    const ma20 = calculateMA(klineData, 20);
    const ma30 = calculateMA(klineData, 30);

    const volumeData = sortedData.map(item => ({
      value: parseFloat(item.volume),
      itemStyle: {
        color: parseFloat(item.closePrice) >= parseFloat(item.openPrice) 
          ? '#26a69a' 
          : '#ef5350'
      }
    }));

    // 基础配置
    const baseOption = {
      backgroundColor: theme === 'dark' ? '#131722' : '#ffffff',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#ffffff',
            width: 1,
            type: 'dashed'
          }
        },
        backgroundColor: theme === 'dark' ? 'rgba(19, 23, 34, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: theme === 'dark' ? '#2e3947' : '#e0e0e0',
        textStyle: { color: theme === 'dark' ? '#ffffff' : '#333333' },
        formatter: function (params) {
          // 确保参数存在
          if (!params || params.length === 0) return '';

          // 找到K线数据和成交量数据
          const klineParam = params.find(param => param.seriesName === 'K线');
          const volumeParam = params.find(param => param.seriesName === '成交量');

          if (!klineParam) return '';

          const date = new Date(parseInt(klineParam.axisValue));
          const timeStr = date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          // 获取当前数据点的完整数据
          const currentData = sortedData[klineParam.dataIndex];
          
          // 格式化数字，保留适当的小数位
          const formatNumber = (value) => {
            if (typeof value !== 'number') return '0.00';
            return value >= 1000 
              ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : value.toFixed(2);
          };

          // 格式化成交量
          const formatVolume = (value) => {
            if (!value) return '0';
            if (value >= 1000000) {
              return (value / 1000000).toFixed(2) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(2) + 'K';
            }
            return value.toFixed(2);
          };

          return [
            `<div style="font-size: 12px;">`,
            `<div>时间: ${timeStr}</div>`,
            `<div>开盘: ${formatNumber(currentData.openPrice)}</div>`,
            `<div>最高: ${formatNumber(currentData.highPrice)}</div>`,
            `<div>最低: ${formatNumber(currentData.lowPrice)}</div>`,
            `<div>收盘: ${formatNumber(currentData.closePrice)}</div>`,
            `<div>成交量: ${formatVolume(currentData.volume)}</div>`,
            `</div>`
          ].join('');
        }
      },
      axisPointer: {
        link: { xAxisIndex: 'all' },
        label: { backgroundColor: '#777' }
      },
      grid: [
        {
          left: '3%',
          right: '3%',
          top: '5%',
          height: '65%'
        },
        {
          left: '3%',
          right: '3%',
          top: '75%',
          height: '15%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: times,
          scale: true,
          boundaryGap: true,
          axisLine: { lineStyle: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0' } },
          splitLine: { 
            show: true,
            lineStyle: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0', type: 'dashed' }
          },
          axisLabel: {
            show: true,
            color: '#999999',
            formatter: function (value) {
              const date = new Date(parseInt(value));
              return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          },
          axisTick: { alignWithLabel: true }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: times,
          scale: true,
          boundaryGap: true,
          axisLine: { lineStyle: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0' } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false }
        }
      ],
      yAxis: [
        {
          scale: true,
          position: 'right',
          splitLine: {
            show: true,
            lineStyle: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0', type: 'dashed' }
          },
          axisLabel: {
            color: '#999999',
            inside: true,
            formatter: function(value) {
              if (value >= 1000) {
                return value.toLocaleString();
              }
              return value.toFixed(2);
            }
          }
        },
        {
          scale: true,
          gridIndex: 1,
          position: 'right',
          splitNumber: 2,
          axisLabel: {
            color: '#999999',
            inside: true,
            formatter: function(value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
              return value;
            }
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
          top: '93%',
          left: '3%',
          right: '3%',
          height: 20,
          borderColor: theme === 'dark' ? '#2e3947' : '#e0e0e0',
          fillerColor: 'rgba(38, 166, 154, 0.1)',
          handleStyle: {
            color: '#26a69a',
            borderColor: '#26a69a'
          },
          textStyle: { color: '#999999' }
        }
      ],
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: '区域缩放',
              back: '区域还原'
            }
          },
          magicType: {
            type: ['line', 'bar'],
            title: {
              line: '切换为线性图',
              bar: '切换为柱状图'
            }
          },
          restore: {
            title: '还原'
          },
          saveAsImage: {
            title: '保存为图片'
          }
        },
        iconStyle: {
          borderColor: '#999999'
        }
      },
      legend: {
        data: ['K线', 'MA5', 'MA10', 'MA20', 'MA30', '成交量'],
        textStyle: {
          color: '#999999'
        },
        selected: {
          'MA5': mainIndicator === 'MA',
          'MA10': mainIndicator === 'MA',
          'MA20': mainIndicator === 'MA',
          'MA30': mainIndicator === 'MA'
        }
      },
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: klineData,
          barWidth: '60%',
          barMaxWidth: 8,
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a',
            borderWidth: 1
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: ma5,
          smooth: true,
          lineStyle: {
            opacity: 0.8,
            color: '#f6c85c'
          },
          symbol: 'none'
        },
        {
          name: 'MA10',
          type: 'line',
          data: ma10,
          smooth: true,
          lineStyle: {
            opacity: 0.8,
            color: '#4fb6f0'
          },
          symbol: 'none'
        },
        {
          name: 'MA20',
          type: 'line',
          data: ma20,
          smooth: true,
          lineStyle: {
            opacity: 0.8,
            color: '#f052af'
          },
          symbol: 'none'
        },
        {
          name: 'MA30',
          type: 'line',
          data: ma30,
          smooth: true,
          lineStyle: {
            opacity: 0.8,
            color: '#8352f0'
          },
          symbol: 'none'
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumeData,
          barWidth: '60%',
          barMaxWidth: 8,
          barGap: '0%'
        }
      ]
    };

    return baseOption;
  };

  if (loading) {
    return (
      <Card style={{ marginTop: 16, background: '#131722', borderColor: '#2e3947' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ marginTop: 16, background: '#131722', borderColor: '#2e3947' }}>
        <Empty 
          description={<span style={{ color: '#ef5350' }}>获取数据失败: {error}</span>} 
          style={{ color: '#999999' }} 
        />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card style={{ marginTop: 16, background: '#131722', borderColor: '#2e3947' }}>
        <Empty description="暂无数据" style={{ color: '#999999' }} />
      </Card>
    );
  }

  return (
    <Card 
      style={{ 
        marginTop: 16, 
        background: theme === 'dark' ? '#131722' : '#ffffff', 
        borderColor: theme === 'dark' ? '#2e3947' : '#e0e0e0' 
      }}
      extra={
        <Space>
          <Select
            value={mainIndicator}
            onChange={setMainIndicator}
            style={{ width: 120 }}
            options={[
              { label: '无指标', value: 'none' },
              { label: '均线', value: 'MA' },
              { label: 'BOLL', value: 'BOLL' },
            ]}
          />
          <Select
            value={volumeIndicator}
            onChange={setVolumeIndicator}
            style={{ width: 120 }}
            options={[
              { label: '成交量', value: 'none' },
              { label: 'MACD', value: 'MACD' },
              { label: 'KDJ', value: 'KDJ' },
            ]}
          />
          <Switch
            checkedChildren="暗色"
            unCheckedChildren="亮色"
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </Space>
      }
    >
      <ReactECharts
        ref={chartRef}
        option={getOption(data)}
        style={{ height: '600px' }}
        opts={{ 
          renderer: 'canvas',
          devicePixelRatio: window.devicePixelRatio
        }}
        notMerge={true}
        lazyUpdate={false}
      />
    </Card>
  );
};

export default QtsMarketDataChart; 