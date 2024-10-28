import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, DatePicker, Modal } from 'antd';
import api from 'src/axiosInstance';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';

const { RangePicker } = DatePicker;

const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

const PathAccessLogManagement = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        path: '',
        clientIp: '',
        country: '',
        prov: '',
        city: '',
        district: '',
        createTimeStart: null,
        createTimeEnd: null,
    });

    const [selectedItem, setSelectedItem] = useState(null); // 选中的记录
    const [isModalVisible, setIsModalVisible] = useState(false); // 弹窗可见性

    useEffect(() => {
        fetchData();
    }, [current, pageSize]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 过滤掉空值和null值
            const params = Object.fromEntries(
                Object.entries({
                    ...searchParams,
                    createTimeStart: formatDate(searchParams.createTimeStart),
                    createTimeEnd: formatDate(searchParams.createTimeEnd),
                    current,
                    size: pageSize,
                }).filter(([_, v]) => v !== '' && v !== null)
            );

            const response = await api.get('/manage/path-statistic-log/list', { params });
            setData(response.data); // Assuming `data` contains the records array
            setTotalNum(response.totalNum); // Assuming `totalNum` is in the response
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleDateChange = (dates) => {
        setSearchParams((prevParams) => ({
            ...prevParams,
            createTimeStart: dates ? dates[0].toDate() : null,
            createTimeEnd: dates ? dates[1].toDate() : null,
        }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows(data.map(item => item.id));

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="path"
                        placeholder="搜索路径"
                        value={searchParams.path}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="clientIp"
                        placeholder="搜索IP"
                        value={searchParams.clientIp}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="country"
                        placeholder="搜索国家"
                        value={searchParams.country}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="prov"
                        placeholder="搜索省"
                        value={searchParams.prov}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="city"
                        placeholder="搜索市"
                        value={searchParams.city}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="district"
                        placeholder="搜索区"
                        value={searchParams.district}
                        onChange={handleSearchChange}
                    />
                    <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['访问时间-开始', '访问时间-结束']}
                        onChange={handleDateChange}
                    />
                    <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/path-statistic-log/delete-batch',
                            selectedRows,
                            fetchData,
                        })}
                        disabled={selectedRows.length === 0}
                    >
                        批量删除
                    </Button>
                </div>
            </div>

            <div className="table-responsive">
                <Spin spinning={isLoading}>
                    <div className="table-wrapper">
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
                                <th style={{ minWidth: '15rem', textAlign: 'left' }}>路径</th>
                                <th>访问者IP</th>
                                <th>国家</th>
                                <th>省</th>
                                <th>市</th>
                                <th>区</th>
                                <th>访问时间</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`td_checkbox_${item.id}`}
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor={`td_checkbox_${item.id}`}
                                            ></label>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'left' }}>{item.path}</td>
                                    <td>{item.clientIp}</td>
                                    <td>{item.country}</td>
                                    <td>{item.prov}</td>
                                    <td>{item.city}</td>
                                    <td>{item.district}</td>
                                    <td>{formatDate(item.createTime)}</td>
                                    <td>
                                        <Button onClick={() => handleViewDetails(item)} type="link">
                                            查看详情
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Spin>
            </div>
            <Pagination
                totalPages={Math.ceil(totalNum / pageSize)}
                current={current}
                onPageChange={setCurrent}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
            />
            {/* 详情弹窗 */}
            <Modal
                title="详情"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={800}
            >
                {selectedItem && (
                    <div>
                        <p><strong>路径:</strong> {selectedItem.path}</p>
                        <p><strong>访问者IP:</strong> {selectedItem.clientIp}</p>
                        <p><strong>国家:</strong> {selectedItem.country}</p>
                        <p><strong>省:</strong> {selectedItem.prov}</p>
                        <p><strong>市:</strong> {selectedItem.city}</p>
                        <p><strong>区:</strong> {selectedItem.district}</p>
                        <p><strong>访问时间:</strong> {formatDate(selectedItem.createTime)}</p>
                        <p><strong>设备信息:</strong></p>
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                            {JSON.stringify(JSON.parse(selectedItem.viewInfo), null, 2)}
                        </pre>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PathAccessLogManagement;
