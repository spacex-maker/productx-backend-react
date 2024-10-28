import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import api from 'src/axiosInstance'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DailyVisitChart = () => {
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/base/system/daily-visit-counts', {
                    params: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0]
                    }
                });

                const dates = data.map(item => item.date);
                const visitCounts = data.map(item => item.visitCount);

                const chart = echarts.init(chartRef.current);

                chart.setOption({
                    title: {
                        text: '每日访问量数据',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: dates,
                        axisLabel: {
                            rotate: 45
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: visitCounts,
                            type: 'line',
                            smooth: true
                        }
                    ]
                });

                // Resize chart when window size changes
                window.addEventListener('resize', () => chart.resize());

            } catch (error) {
                console.error('Error fetching daily visit counts:', error);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                />
                <span style={{ margin: '0 10px' }}>to</span>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                />
            </div>
            <div ref={chartRef} style={{ height: '400px', width: '100%' }}></div>
        </div>
    );
};

export default DailyVisitChart;
