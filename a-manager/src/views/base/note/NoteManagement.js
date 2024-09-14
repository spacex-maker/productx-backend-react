import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, Modal } from 'antd';
import api from 'src/axiosInstance';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';

const NoteManagement = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        type: '',
        location: '',
        author: '',
        title: '',
        status: '',
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
                    current,
                    size: pageSize,
                }).filter(([_, v]) => v !== '' && v !== null)
            );

            const response = await api.get('/manage/note/list-notes-for-manage', { params });
            setData(response.data); // 假设响应数据结构中包含 `data`
            setTotalNum(response.totalNum); // 假设 `totalNum` 是返回的总数
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
                        name="type"
                        placeholder="搜索笔记类型"
                        value={searchParams.type}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="location"
                        placeholder="搜索发布位置"
                        value={searchParams.location}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="author"
                        placeholder="搜索作者"
                        value={searchParams.author}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="title"
                        placeholder="搜索标题"
                        value={searchParams.title}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="status"
                        placeholder="搜索状态"
                        value={searchParams.status}
                        onChange={handleSearchChange}
                    />
                    <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/note/delete-batch',
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
                                <th>类型</th>
                                <th>发布位置</th>
                                <th>标题</th>
                                <th>作者</th>
                                <th>状态</th>
                                <th>浏览量</th>
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
                                    <td>{item.type}</td>
                                    <td>{item.location}</td>
                                    <td>{item.title}</td>
                                    <td>{item.author}</td>
                                    <td>{item.status}</td>
                                    <td>{item.viewCount}</td>
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
                        <p><strong>类型:</strong> {selectedItem.type}</p>
                        <p><strong>发布位置:</strong> {selectedItem.location}</p>
                        <p><strong>标题:</strong> {selectedItem.title}</p>
                        <p><strong>作者:</strong> {selectedItem.author}</p>
                        <p><strong>浏览量:</strong> {selectedItem.viewCount}</p>
                        <p><strong>内容:</strong></p>
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                            {selectedItem.content}
                        </pre>
                        <p><strong>状态:</strong> {selectedItem.status}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NoteManagement;
