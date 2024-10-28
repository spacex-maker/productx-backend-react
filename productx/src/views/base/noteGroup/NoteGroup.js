import React, { useState, useEffect } from 'react';
import {Button, Spin, Input, Modal, message} from 'antd';
import api from 'src/axiosInstance';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import AddGroupModal from './AddGroupModal';
import {CModal, CTable} from "@coreui/react";

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
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false); // 控制“笔记管理”弹窗
    const [groupNotes, setGroupNotes] = useState([]); // 当前分组的笔记列表
    const [allNotes, setAllNotes] = useState([]); // 所有笔记的分页列表
    const [selectedGroup, setSelectedGroup] = useState(null); // 当前选中的分组
    const [selectedItem, setSelectedItem] = useState(null); // 选中的记录
    const [totalSelectNoteNum, setTotalSelectNoteNum] = useState(0);
    const [currentSelectNotePage, setCurrentSelectNotePage] = useState(1);
    const [selectNotePageSize, setSelectNotePageSize] = useState(10);
    const [currentGroupId, setCurrentGroupId] = useState(null); // 选中的记录

    const [totalGroupNoteNum, setTotalGroupNoteNum] = useState(0);
    const [currentGroupNotePage, setCurrentGroupNotePage] = useState(1);
    const [groupNotePageSize, setGroupNotePageSize] = useState(10);
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
    const handleNoteModalCancel = () => {
        setIsNoteModalVisible(false);
        setSelectedGroup(null);
    };

    const handleAddNoteToGroup = async (note) => {
        // 检查笔记是否已经存在于 groupNotes 列表中
        const isNoteExist = groupNotes.some(existingNote => existingNote.id === note.id);

        if (!isNoteExist) {
            const response =
                await api.post('/manage/note-group-rel/add-note-to-group',
                    {
                        noteGroupId: currentGroupId,
                        noteId: note.id
                    });
            if (response){
                handleManageNotes(currentGroupId)
            }

        } else {
            // 可以在这里添加提示用户笔记已存在的逻辑，例如使用 Ant Design 的 notification 组件
            message.error("这篇笔记已经在分组中")
        }
    };

    const handleRemoveNoteFromGroup = async (noteId) => {
        const response =
            await api.post('/manage/note-group-rel/remove-note-from-group',
                {
                    noteGroupId: currentGroupId,
                    noteId: noteId
                });
        if (response) {
            handleManageNotes(currentGroupId)
        }
    };

    const handleAddGroupSuccess = () => {
        fetchData(); // 重新加载数据
        setIsModalVisible(false); // 关闭弹窗
    };

    useEffect(() => {
        handleManageNotes(currentGroupId);
    }, [currentSelectNotePage, selectNotePageSize,currentGroupNotePage,groupNotePageSize]);

    const handleManageNotes = async (groupId) => {
        if (null==groupId){
            return;
        }
        setCurrentGroupId(groupId);
        setSelectedGroup(groupId);
        // 请求该分组下的笔记
        const groupResponse = await api.get(`/manage/note/list-notes-for-manage?noteGroupId=${groupId}`,{
            params:
                {
                    current: currentGroupNotePage,
                    size: groupNotePageSize
                }
            }
        );
        setGroupNotes(groupResponse.data);
        setTotalGroupNoteNum(groupResponse.totalNum);

        // 请求所有的笔记（分页）
        const allNotesResponse =
            await api.get('/manage/note/list-notes-for-manage',{
                params:
                    {
                        current: currentSelectNotePage,
                        size: selectNotePageSize
                    }
            });
        setAllNotes(allNotesResponse.data);
        setTotalSelectNoteNum(allNotesResponse.totalNum);
        // 显示模态框
        setIsNoteModalVisible(true);
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
                                            <Button onClick={() => handleManageNotes(item.id)} type="link">
                                                笔记管理
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
            {/* 笔记管理模态框 */}
            <CModal
                title={`管理笔记 - ${selectedGroup ? selectedGroup.groupName : ''}`}
                visible={isNoteModalVisible}
                onClose={handleNoteModalCancel}
                size="xl"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* 左侧：分组内笔记列表 */}
                    <div style={{ width: '48%' }}>
                        <div style={{ justifyContent: 'center',alignItems: 'center' ,display: 'flex'}}>
                            <div>分组笔记</div>
                        </div>
                        <div className="table-responsive">
                            <Spin spinning={isLoading}>
                                <div className="table-wrapper">
                                    <CTable striped className="table table-bordered table-striped">
                                        <thead>
                                        <tr>
                                            <th>笔记标题</th>
                                            <th>状态</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {groupNotes.map(note => (
                                                <tr key={note.id}>
                                                    <td>
                                                        {note.title}
                                                    </td>
                                                    <td style={{
                                                        color: note.status === 'COMMON' ? 'green' :
                                                            note.status === 'INVALID' ? 'orange' :
                                                                note.status === 'DRAFT' ? 'blue' :
                                                                note.status === 'DELETE' ? 'red' : 'black'
                                                    }}>
                                                        {note.status === 'COMMON' ? '正常' :
                                                            note.status === 'INVALID' ? '失效' :
                                                                note.status === 'DRAFT' ? '草稿' :
                                                                note.status === 'DELETE' ? '删除' : '未知'}
                                                    </td>
                                                    <td>
                                                        <Button type="link" onClick={() => handleRemoveNoteFromGroup(note.id)}>
                                                            移除
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </CTable>
                                </div>
                            </Spin>
                        </div>
                        {/* 分页组件 */}
                        <Pagination
                            totalPages={Math.ceil(totalGroupNoteNum / groupNotePageSize)}
                            current={currentGroupNotePage}
                            onPageChange={setCurrentGroupNotePage}
                            pageSize={groupNotePageSize}
                            onPageSizeChange={setGroupNotePageSize}
                        />
                    </div>
                    <div style={{ width: '48%' }}>
                        <div style={{ justifyContent: 'center',alignItems: 'center' ,display: 'flex'}}>
                            <div>全部笔记</div>
                        </div>
                        {/* 右侧：所有笔记列表 */}
                        <div className="table-responsive">
                            <Spin spinning={isLoading}>
                                <div className="table-wrapper">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                        <tr>
                                            <th>笔记标题</th>
                                            <th>状态</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                            {allNotes.map(note => (
                                                <tr key={note.id}>
                                                    <td>
                                                        {note.title}
                                                    </td>
                                                    <td style={{
                                                        color: note.status === 'COMMON' ? 'green' :
                                                            note.status === 'INVALID' ? 'orange' :
                                                                note.status === 'DRAFT' ? 'blue' :
                                                                note.status === 'DELETE' ? 'red' : 'black'
                                                    }}>
                                                        {note.status === 'COMMON' ? '正常' :
                                                            note.status === 'INVALID' ? '失效' :
                                                                note.status === 'DRAFT' ? '草稿' :
                                                                note.status === 'DELETE' ? '删除' : '未知'}
                                                    </td>
                                                    <td>
                                                        <Button type="link" onClick={() => handleAddNoteToGroup(note)}>
                                                            添加
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Spin>
                        </div>
                    {/* 分页组件 */}
                    <Pagination
                        totalPages={Math.ceil(totalSelectNoteNum / selectNotePageSize)}
                        current={currentSelectNotePage}
                        onPageChange={setCurrentSelectNotePage}
                        pageSize={selectNotePageSize}
                        onPageSizeChange={setSelectNotePageSize}
                    />
                    </div>
                </div>
            </CModal>
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
