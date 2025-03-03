import React, { useState, useEffect, useCallback } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CBadge,
  CInputGroup,
  CFormInput,
  CButton,
} from '@coreui/react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { formatBytes, formatUptime } from 'src/utils/format';
import CIcon from '@coreui/icons-react';
import { cilReload, cilBan } from '@coreui/icons';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';

const MAX_HISTORY_LENGTH = 300; // 存储5分钟的数据 (5分钟 * 60秒 = 300个数据点)
const DEFAULT_MONITOR_URL = 'http://localhost:61208/api/4/all';

const ServerMonitor = () => {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [countdown, setCountdown] = useState(refreshInterval / 1000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [monitorUrl, setMonitorUrl] = useState(() => {
    // 从 localStorage 获取保存的 URL，如果没有则使用默认值
    return localStorage.getItem('monitorUrl') || DEFAULT_MONITOR_URL;
  });
  const [historyData, setHistoryData] = useState({
    timestamps: [],
    cpu: [],
    memory: [],
    swap: []
  });

  const updateHistoryData = useCallback((newData) => {
    const now = new Date();
    setHistoryData(prev => {
      const newTimestamps = [...prev.timestamps, now];
      const newCpu = [...prev.cpu, newData.cpu.total];
      const newMemory = [...prev.memory, newData.mem.percent];
      const newSwap = [...prev.swap, newData.memswap.percent];

      // 保持最近5分钟的数据
      if (newTimestamps.length > MAX_HISTORY_LENGTH) {
        return {
          timestamps: newTimestamps.slice(-MAX_HISTORY_LENGTH),
          cpu: newCpu.slice(-MAX_HISTORY_LENGTH),
          memory: newMemory.slice(-MAX_HISTORY_LENGTH),
          swap: newSwap.slice(-MAX_HISTORY_LENGTH)
        };
      }
      return {
        timestamps: newTimestamps,
        cpu: newCpu,
        memory: newMemory,
        swap: newSwap
      };
    });
  }, []);

  // 添加倒计时效果
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          return refreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  // 更新刷新间隔时重置倒计时
  useEffect(() => {
    setCountdown(refreshInterval / 1000);
  }, [refreshInterval]);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(monitorUrl);
      setServerData(response.data);
      updateHistoryData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching server data:', error);
      setError(error.message || '无法连接到监控服务');
      setServerData(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setCountdown(refreshInterval / 1000);
    }
  }, [refreshInterval, monitorUrl]);

  // 保存 URL 到 localStorage
  useEffect(() => {
    localStorage.setItem('monitorUrl', monitorUrl);
  }, [monitorUrl]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  const getCpuChartOption = () => ({
    title: {
      text: 'CPU Usage',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: serverData?.percpu.map((cpu, index) => `CPU ${index}`) || [],
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      name: 'Usage',
      type: 'bar',
      data: serverData?.percpu.map(cpu => cpu.total) || [],
      itemStyle: {
        color: '#3b82f6'
      }
    }]
  });

  const getMemoryChartOption = () => ({
    title: {
      text: 'Memory Usage',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}MB'
      },
      data: [
        {
          name: 'Used',
          value: Math.round(serverData?.mem.used / 1024 / 1024),
          itemStyle: { color: '#ef4444' }
        },
        {
          name: 'Free',
          value: Math.round(serverData?.mem.free / 1024 / 1024),
          itemStyle: { color: '#22c55e' }
        },
        {
          name: 'Cached',
          value: Math.round(serverData?.mem.cached / 1024 / 1024),
          itemStyle: { color: '#f59e0b' }
        }
      ]
    }]
  });

  const getDiskChartOption = () => ({
    title: {
      text: 'Disk Usage',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: serverData?.fs.map(disk => disk.mnt_point) || [],
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      name: 'Usage',
      type: 'bar',
      data: serverData?.fs.map(disk => disk.percent) || [],
      itemStyle: {
        color: '#8b5cf6'
      }
    }]
  });

  const getNetworkChartOption = () => ({
    title: {
      text: 'Network Traffic',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Received', 'Sent'],
      top: 25
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: serverData?.network.map(net => net.interface_name) || []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: value => formatBytes(value)
      }
    },
    series: [
      {
        name: 'Received',
        type: 'bar',
        data: serverData?.network.map(net => net.bytes_recv) || [],
        itemStyle: { color: '#06b6d4' }
      },
      {
        name: 'Sent',
        type: 'bar',
        data: serverData?.network.map(net => net.bytes_sent) || [],
        itemStyle: { color: '#14b8a6' }
      }
    ]
  });

  const getDiskIOChartOption = () => ({
    title: {
      text: 'Disk I/O',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Read Speed', 'Write Speed'],
      top: 25
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: serverData?.diskio
        .filter(disk => !disk.disk_name.startsWith('loop'))
        .map(disk => disk.disk_name) || [],
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: value => formatBytes(value) + '/s'
      }
    },
    series: [
      {
        name: 'Read Speed',
        type: 'bar',
        data: serverData?.diskio
          .filter(disk => !disk.disk_name.startsWith('loop'))
          .map(disk => disk.read_bytes_rate_per_sec) || [],
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Write Speed',
        type: 'bar',
        data: serverData?.diskio
          .filter(disk => !disk.disk_name.startsWith('loop'))
          .map(disk => disk.write_bytes_rate_per_sec) || [],
        itemStyle: { color: '#ef4444' }
      }
    ]
  });

  const getProcessStatusColor = (status) => {
    const statusMap = {
      'R': 'success',   // Running
      'S': 'info',      // Sleeping
      'D': 'danger',    // Disk sleep
      'Z': 'warning',   // Zombie
      'T': 'secondary', // Stopped
      'I': 'primary'    // Idle
    };
    return statusMap[status] || 'light';
  };

  const getHistoryChartOption = () => ({
    title: {
      text: 'Resource Usage History',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['CPU', 'Memory', 'Swap'],
      top: 25
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleTimeString();
        }
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.1
        },
        data: historyData.timestamps.map((time, index) => [
          time,
          historyData.cpu[index]
        ]),
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Memory',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.1
        },
        data: historyData.timestamps.map((time, index) => [
          time,
          historyData.memory[index]
        ]),
        itemStyle: { color: '#22c55e' }
      },
      {
        name: 'Swap',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.1
        },
        data: historyData.timestamps.map((time, index) => [
          time,
          historyData.swap[index]
        ]),
        itemStyle: { color: '#f59e0b' }
      }
    ]
  });

  const getRefreshIndicatorOption = () => ({
    title: {
      text: 'Refreshing',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}s'
      },
      data: [{
        value: countdown,
        itemStyle: { color: '#3b82f6' }
      }, {
        value: refreshInterval - countdown,
        itemStyle: { color: '#e5e7eb' }
      }]
    }]
  });

  const renderRefreshControls = () => (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex align-items-center">
        <small className="text-medium-emphasis me-2">自动刷新:</small>
        <div className="btn-group">
          <CButton 
            color={refreshInterval === 2000 ? "primary" : "light"}
            size="sm"
            onClick={() => setRefreshInterval(2000)}
          >
            2s
          </CButton>
          <CButton 
            color={refreshInterval === 5000 ? "primary" : "light"}
            size="sm"
            onClick={() => setRefreshInterval(5000)}
          >
            5s
          </CButton>
          <CButton 
            color={refreshInterval === 10000 ? "primary" : "light"}
            size="sm"
            onClick={() => setRefreshInterval(10000)}
          >
            10s
          </CButton>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <CButton 
          color="light"
          size="sm"
          onClick={fetchData}
          disabled={isRefreshing}
          className="d-flex align-items-center gap-1"
        >
          <CIcon icon={cilReload} className={isRefreshing ? 'rotation' : ''} />
          <span>{countdown}s</span>
        </CButton>
      </div>
    </div>
  );

  const renderHeader = () => (
    <CRow className="mb-3">
      <CCol className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <CInputGroup style={{ maxWidth: '500px' }}>
          <CFormInput
            type="text"
            placeholder="Monitor API URL"
            value={monitorUrl}
            onChange={(e) => setMonitorUrl(e.target.value)}
            size="sm"
          />
          <CButton 
            color="primary" 
            size="sm"
            onClick={fetchData}
            title="Test connection"
          >
            <CIcon icon={cilReload} className={isRefreshing ? 'rotation' : ''} />
          </CButton>
        </CInputGroup>
        {renderRefreshControls()}
      </CCol>
    </CRow>
  );

  if (loading || !serverData) {
    return (
      <>
        {renderHeader()}
        <CCard className="mb-4">
          <CCardBody className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>正在加载服务器指标...</div>
          </CCardBody>
        </CCard>
      </>
    );
  }

  if (error) {
    return (
      <>
        {renderHeader()}
        <CCard className="mb-4">
          <CCardBody>
            <div className="text-center text-danger">
              <CIcon icon={cilBan} size="xl" className="mb-3" />
              <h5>连接失败</h5>
              <p>{error}</p>
            </div>
          </CCardBody>
        </CCard>
      </>
    );
  }

  return (
    <>
      {renderHeader()}

      <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">CPU Usage</div>
              <div className="text-medium-emphasis small mb-2">
                {serverData.cpu.total.toFixed(1)}% of {serverData.core.phys} cores
              </div>
              <CProgress
                thin
                color={serverData.cpu.total > 80 ? 'danger' : 'primary'}
                value={serverData.cpu.total}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">Memory Usage</div>
              <div className="text-medium-emphasis small mb-2">
                {formatBytes(serverData.mem.used)} / {formatBytes(serverData.mem.total)}
              </div>
              <CProgress
                thin
                color={serverData.mem.percent > 80 ? 'danger' : 'success'}
                value={serverData.mem.percent}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">Swap Usage</div>
              <div className="text-medium-emphasis small mb-2">
                {formatBytes(serverData.memswap.used)} / {formatBytes(serverData.memswap.total)}
              </div>
              <CProgress
                thin
                color={serverData.memswap.percent > 80 ? 'danger' : 'warning'}
                value={serverData.memswap.percent}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">System Load</div>
              <div className="text-medium-emphasis small mb-2">
                {serverData.load.min1.toFixed(2)} / {serverData.load.min5.toFixed(2)} / {serverData.load.min15.toFixed(2)}
              </div>
              <div className="text-medium-emphasis smaller">
                1min / 5min / 15min average
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts 
                option={getHistoryChartOption()} 
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }} // 使用SVG渲染器以获得更好的性能
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts option={getCpuChartOption()} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts option={getMemoryChartOption()} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts option={getDiskChartOption()} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts option={getNetworkChartOption()} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardHeader>System Information</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="mb-3">
                    <strong>Hostname:</strong> {serverData.system.hostname}
                  </div>
                  <div className="mb-3">
                    <strong>OS:</strong> {serverData.system.hr_name}
                  </div>
                  <div className="mb-3">
                    <strong>Uptime:</strong> {serverData.uptime}
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="mb-3">
                    <strong>CPU:</strong> {serverData.quicklook.cpu_name}
                  </div>
                  <div className="mb-3">
                    <strong>CPU Cores:</strong> {serverData.core.phys} Physical / {serverData.core.log} Logical
                  </div>
                  <div className="mb-3">
                    <strong>Process Count:</strong> {serverData.processcount.total} ({serverData.processcount.running} running)
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">Network Connections</div>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <div className="text-medium-emphasis">ESTABLISHED</div>
                  <div className="fs-5 fw-semibold">{serverData.connections.ESTABLISHED}</div>
                </div>
                <div>
                  <div className="text-medium-emphasis">LISTEN</div>
                  <div className="fs-5 fw-semibold">{serverData.connections.LISTEN}</div>
                </div>
                <div>
                  <div className="text-medium-emphasis">WAITING</div>
                  <div className="fs-5 fw-semibold">{serverData.connections.SYN_RECV}</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="fs-4 fw-semibold">Top IRQ</div>
              <div className="mt-2">
                {serverData.irq.slice(0, 3).map((irq, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                    <small>{irq.irq_line}</small>
                    <CBadge color="info">{Math.round(irq.irq_rate)}/s</CBadge>
                  </div>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardBody>
              <ReactECharts option={getDiskIOChartOption()} style={{ height: '300px' }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardHeader>Process List (Top 10 by CPU Usage)</CCardHeader>
            <CCardBody>
              <CTable small hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>PID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>CPU%</CTableHeaderCell>
                    <CTableHeaderCell>Memory%</CTableHeaderCell>
                    <CTableHeaderCell>Command</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {serverData.processlist
                    .sort((a, b) => b.cpu_percent - a.cpu_percent)
                    .slice(0, 10)
                    .map((process) => (
                      <CTableRow key={process.pid}>
                        <CTableDataCell>{process.pid}</CTableDataCell>
                        <CTableDataCell>{process.name}</CTableDataCell>
                        <CTableDataCell>{process.username}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getProcessStatusColor(process.status)}>
                            {process.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{process.cpu_percent.toFixed(1)}%</CTableDataCell>
                        <CTableDataCell>{process.memory_percent.toFixed(1)}%</CTableDataCell>
                        <CTableDataCell>
                          <small>{process.cmdline.join(' ').substring(0, 50)}</small>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardHeader>Detailed System Statistics</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={4}>
                  <h5>CPU Details</h5>
                  <div className="mb-2">
                    <strong>User:</strong> {serverData.cpu.user.toFixed(1)}%
                  </div>
                  <div className="mb-2">
                    <strong>System:</strong> {serverData.cpu.system.toFixed(1)}%
                  </div>
                  <div className="mb-2">
                    <strong>IOWait:</strong> {serverData.cpu.iowait.toFixed(1)}%
                  </div>
                  <div className="mb-2">
                    <strong>Context Switches:</strong> {serverData.cpu.ctx_switches_rate_per_sec}/s
                  </div>
                  <div className="mb-2">
                    <strong>Interrupts:</strong> {serverData.cpu.interrupts_rate_per_sec}/s
                  </div>
                </CCol>
                <CCol sm={4}>
                  <h5>Memory Details</h5>
                  <div className="mb-2">
                    <strong>Active:</strong> {formatBytes(serverData.mem.active)}
                  </div>
                  <div className="mb-2">
                    <strong>Inactive:</strong> {formatBytes(serverData.mem.inactive)}
                  </div>
                  <div className="mb-2">
                    <strong>Buffers:</strong> {formatBytes(serverData.mem.buffers)}
                  </div>
                  <div className="mb-2">
                    <strong>Cached:</strong> {formatBytes(serverData.mem.cached)}
                  </div>
                  <div className="mb-2">
                    <strong>Shared:</strong> {formatBytes(serverData.mem.shared)}
                  </div>
                </CCol>
                <CCol sm={4}>
                  <h5>Process Statistics</h5>
                  <div className="mb-2">
                    <strong>Total Processes:</strong> {serverData.processcount.total}
                  </div>
                  <div className="mb-2">
                    <strong>Running:</strong> {serverData.processcount.running}
                  </div>
                  <div className="mb-2">
                    <strong>Sleeping:</strong> {serverData.processcount.sleeping}
                  </div>
                  <div className="mb-2">
                    <strong>Threads:</strong> {serverData.processcount.thread}
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <style>
        {`
          .rotation {
            animation: rotate 1s linear infinite;
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default ServerMonitor; 