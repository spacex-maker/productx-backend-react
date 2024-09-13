import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, Modal } from 'antd';
import api from 'src/axiosInstance';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import AddGroupModal from './AddGroupModal'; // 引入新增分组的组件

const NoteGroupManagement = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // 弹窗可见性
    const [isModalVisible, setIsModalVisible] = useState(false); // 弹窗可见性
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [searchParams, setSearchParams] = useState({
        groupName: '',
        status: '',
        scopeAccess: '',
    });

    const [selectedItem, setSelectedItem] = useState(null); // 选中的记录

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

            const response = await api.get('/manage/an-note-group/listNoteGroup', { params });
            setData(response.data); // Assuming `records` contains the list of note groups
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

    const handleSearch = () => {
        fetchData();
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsDetailModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsDetailModalVisible(false);
        setSelectedItem(null);
    };

    const handleAddGroupSuccess = () => {
        fetchData(); // 重新加载数据
        setIsModalVisible(false); // 关闭弹窗
    };

    const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows(data.map(item => item.id));

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="groupName"
                        placeholder="搜索分组名称"
                        value={searchParams.groupName}
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
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="scopeAccess"
                        placeholder="搜索公开范围"
                        value={searchParams.scopeAccess}
                        onChange={handleSearchChange}
                    />
                    <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/an-note-group/delete-batch',
                            selectedRows,
                            fetchData,
                        })}
                        disabled={selectedRows.length === 0}
                    >
                        批量删除
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setIsModalVisible(true)} // 打开新增分组弹窗
                        className="ml-2"
                    >
                        新增分组
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
                                <th>分组名称</th>
                                <th>介绍</th>
                                <th>封面图片</th>
                                <th>分组状态</th>
                                <th>公开范围</th>
                                <th>浏览量</th>
                                <th>登录用户点赞数</th>
                                <th>登录用户不喜欢数</th>
                                <th>点赞数</th>
                                <th>不喜欢数</th>
                                <th>笔记总数</th>
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
                                    <td>{item.groupName}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        {item.coverImage && (
                                            <img src={item.coverImage} alt="cover" style={{ width: 100, height: 60, objectFit: 'cover' }} />
                                        )}
                                    </td>
                                    <td>{item.status}</td>
                                    <td>{item.scopeAccess}</td>
                                    <td>{item.viewCount}</td>
                                    <td>{item.loginUserLikeCount}</td>
                                    <td>{item.loginUserUnlikeCount}</td>
                                    <td>{item.likeCount}</td>
                                    <td>{item.unlikeCount}</td>
                                    <td>{item.noteCount}</td>
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
                open={isDetailModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={800}
            >
                {selectedItem && (
                    <div>
                        <p><strong>分组名称:</strong> {selectedItem.groupName}</p>
                        <p><strong>介绍:</strong> {selectedItem.description}</p>
                        <p><strong>封面图片:</strong></p>
                        {selectedItem.coverImage && (
                            <img src={selectedItem.coverImage} alt="cover" style={{ width: 200, height: 120, objectFit: 'cover' }} />
                        )}
                        <p><strong>分组状态:</strong> {selectedItem.status}</p>
                        <p><strong>公开范围:</strong> {selectedItem.scopeAccess}</p>
                        <p><strong>浏览量:</strong> {selectedItem.viewCount}</p>
                        <p><strong>登录用户点赞数:</strong> {selectedItem.loginUserLikeCount}</p>
                        <p><strong>登录用户不喜欢数:</strong> {selectedItem.loginUserUnlikeCount}</p>
                        <p><strong>点赞数:</strong> {selectedItem.likeCount}</p>
                        <p><strong>不喜欢数:</strong> {selectedItem.unlikeCount}</p>
                        <p><strong>笔记总数:</strong> {selectedItem.noteCount}</p>
                    </div>
                )}
            </Modal>

            {/* 新增分组弹窗 */}
            <AddGroupModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={handleAddGroupSuccess}
            />
        </div>
    );
};

export default NoteGroupManagement;
