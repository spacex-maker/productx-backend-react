import React, { useEffect, useRef, useState } from 'react';
import { Card, Empty, Spin, Space, Switch, Button, Tooltip } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, UndoOutlined, BarChartOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import { createChart, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

const QtsMarketDataChart = ({ 
  exchangeName,
  symbol,
  interval,
  startTime,
  endTime,
  limit
}) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [showVolume, setShowVolume] = useState(true);
  const [lastPrice, setLastPrice] = useState(null);
  const [crosshairData, setCrosshairData] = useState(null);

  // 清理图表
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    try {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const chart = createChart(chartContainerRef.current, {
        layout: { 
          textColor: theme === 'dark' ? '#d1d4dc' : '#000000',
          background: { 
            type: 'solid', 
            color: theme === 'dark' ? '#131722' : '#ffffff' 
          }
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0' },
          horzLines: { color: theme === 'dark' ? '#2e3947' : '#e0e0e0' },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            labelVisible: false,
          },
          horzLine: {
            labelVisible: false,
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          borderColor: theme === 'dark' ? '#2e3947' : '#e0e0e0',
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#2e3947' : '#e0e0e0',
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        width: chartContainerRef.current.clientWidth,
        height: 600,
      });
      chartRef.current = chart;

      // 准备并排序K线数据
      const candleData = data
        .map(item => ({
          time: item.openTime / 1000,
          open: parseFloat(item.openPrice),
          high: parseFloat(item.highPrice),
          low: parseFloat(item.lowPrice),
          close: parseFloat(item.closePrice),
        }))
        .sort((a, b) => a.time - b.time);

      // 创建K线图
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      });

      // 设置K线数据
      candlestickSeries.setData(candleData);

      // 添加十字光标移动事件监听
      chart.subscribeCrosshairMove(param => {
        if (
          param.point === undefined || 
          !param.time || 
          param.point.x < 0 || 
          param.point.x > chartContainerRef.current.clientWidth || 
          param.point.y < 0 || 
          param.point.y > chartContainerRef.current.clientHeight
        ) {
          setCrosshairData(null);
        } else {
          const currentData = data.find(item => item.openTime / 1000 === param.time);
          if (currentData) {
            const open = parseFloat(currentData.openPrice);
            const close = parseFloat(currentData.closePrice);
            const high = parseFloat(currentData.highPrice);
            const low = parseFloat(currentData.lowPrice);
            
            // 计算涨跌额和涨跌幅
            const change = close - open;
            const changePercent = (change / open) * 100;
            
            // 计算振幅
            const amplitude = ((high - low) / open) * 100;

            setCrosshairData({
              time: new Date(currentData.openTime).toLocaleString(),
              open: open.toFixed(4),
              high: high.toFixed(4),
              low: low.toFixed(4),
              close: close.toFixed(4),
              volume: currentData.volume,
              change: change.toFixed(4),
              changePercent: changePercent.toFixed(2),
              amplitude: amplitude.toFixed(2)
            });
          }
        }
      });

      // 添加成交量图表
      if (showVolume) {
        const volumeData = data
          .map(item => ({
            time: item.openTime / 1000,
            value: parseFloat(item.volume),
            color: parseFloat(item.closePrice) >= parseFloat(item.openPrice) 
              ? 'rgba(38, 166, 154, 0.5)'
              : 'rgba(239, 83, 80, 0.5)'
          }))
          .sort((a, b) => a.time - b.time);

        const volumeSeries = chart.addSeries(HistogramSeries, {
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });

        volumeSeries.setData(volumeData);

        const volumePriceScale = chart.priceScale('');
        volumePriceScale.applyOptions({
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
          drawTicks: false,
          borderVisible: false,
        });
      }

      // 自适应内容
      chart.timeScale().fitContent();

      // 处理窗口大小变化
      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('创建图表失败:', err);
      console.error('错误详情:', err.stack);
    }
  }, [data, theme, showVolume]);

  // 获取K线数据
  useEffect(() => {
    fetchKlineData();
  }, [exchangeName, symbol, interval, startTime, endTime, limit]);

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
        startTime: startTime.valueOf(),
        endTime: endTime?.valueOf(),
        limit
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

  // 工具栏操作函数
  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomOut();
    }
  };

  const handleReset = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
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
      title={`${symbol} - ${interval}`}
      extra={
        <Space>
          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
          </Tooltip>
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
          </Tooltip>
          <Tooltip title="重置">
            <Button icon={<UndoOutlined />} onClick={handleReset} />
          </Tooltip>
          <Tooltip title="成交量">
            <Switch
              checkedChildren={<BarChartOutlined />}
              unCheckedChildren={<BarChartOutlined />}
              checked={showVolume}
              onChange={setShowVolume}
            />
          </Tooltip>
          <Switch
            checkedChildren="暗色"
            unCheckedChildren="亮色"
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </Space>
      }
    >
      <div style={{ position: 'relative' }}>
        <div ref={chartContainerRef} />
        {crosshairData && (
          <div 
            style={{ 
              position: 'absolute',
              left: 10,
              top: 10,
              padding: '8px 12px',
              background: theme === 'dark' ? 'rgba(19, 23, 34, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${theme === 'dark' ? '#2e3947' : '#e0e0e0'}`,
              borderRadius: 4,
              color: theme === 'dark' ? '#d1d4dc' : '#000000',
              fontSize: 12,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <div>时间: {crosshairData.time}</div>
            <div>开盘: {crosshairData.open}</div>
            <div>最高: {crosshairData.high}</div>
            <div>最低: {crosshairData.low}</div>
            <div>收盘: {crosshairData.close}</div>
            <div>成交量: {crosshairData.volume}</div>
            <div style={{ 
              color: parseFloat(crosshairData.change) >= 0 
                ? '#26a69a' 
                : '#ef5350' 
            }}>
              涨跌: {crosshairData.change} ({crosshairData.changePercent}%)
            </div>
            <div>振幅: {crosshairData.amplitude}%</div>
          </div>
        )}
      </div>
      {lastPrice && (
        <div style={{ 
          textAlign: 'right', 
          marginTop: 8,
          color: theme === 'dark' ? '#d1d4dc' : '#000000'
        }}>
          最新价格: {lastPrice}
        </div>
      )}
    </Card>
  );
};

export default QtsMarketDataChart; 