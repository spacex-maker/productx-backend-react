import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, Modal, Select, Form, Checkbox ,AutoComplete } from 'antd';
import api from 'src/axiosInstance';
import Pagination from 'src/components/common/Pagination';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import { formatDate } from 'src/components/common/Common';

const { Option } = Select;

const RoomManagement = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        roomType: '',
        roomName: '',
        isTemp: '',
        isEncrypt: '',
        isPublicForSearch: '',
        enterType: '',
        status: '',
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [currentEnterType, setCurrentEnterType] = useState('');
    const [userOptions, setUserOptions] = useState([]); // 保存用户下拉选项
    const [selectedUserId, setSelectedUserId] = useState(null);
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

            const response = await api.get('/manage/chat-room/list', { params });
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

    const handleSelectChange = (value, name) => {
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
    const [form] = Form.useForm();
    const handleCreateRoom = async (values) => {
        try {
            await api.post('/manage/chat-room/create', values);
            setIsCreateModalVisible(false);
            form.resetFields();
            setSelectedUserId(null);
            fetchData();
        } catch (error) {
            console.error('创建失败', error);
        }
    };

    const handleEnterTypeChange = (value) => {
        setCurrentEnterType(value);
    };
    const handleSearchUser = async (searchText) => {
        try {
            if (searchText){
                const response = await api.get('/manage/chat-room/list-user-for-room', { params: { userNameAndUserId: searchText } });
                setUserOptions(response.map(user => ({
                    value: user.id,
                    label: user.nickname,
                })));
            }
        } catch (error) {
            console.error('Failed to search users', error);
        }
    };
    const handleUserSelect = (value) => {
        setSelectedUserId(value);
    };
    const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows(data.map(item => item.id));

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="roomType"
                        placeholder="搜索房间类型"
                        value={searchParams.roomType}
                        onChange={handleSearchChange}
                    />
                    <Input
                        type="text"
                        className="form-control search-box"
                        name="roomName"
                        placeholder="搜索房间名称"
                        value={searchParams.roomName}
                        onChange={handleSearchChange}
                    />
                    <Select
                        className="search-box"
                        placeholder="是否临时消息"
                        value={searchParams.isTemp || undefined}
                        onChange={(value) => handleSelectChange(value, 'isTemp')}
                        allowClear
                    >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
                    </Select>
                    <Select
                        allowClear
                        className="search-box"
                        placeholder="是否加密"
                        value={searchParams.isEncrypt || undefined}
                        onChange={(value) => handleSelectChange(value, 'isEncrypt')}
                    >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
                    </Select>
                    <Select
                        allowClear
                        className="search-box"
                        placeholder="是否公开可搜索"
                        value={searchParams.isPublicForSearch || undefined}
                        onChange={(value) => handleSelectChange(value, 'isPublicForSearch')}
                    >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
                    </Select>
                    <Select
                        allowClear
                        className="search-box"
                        placeholder="进入类型"
                        value={searchParams.enterType || undefined}
                        onChange={(value) => handleSelectChange(value, 'enterType')}
                    >
                        <Option value={1}>自由进入</Option>
                        <Option value={2}>密码进入</Option>
                        <Option value={3}>申请进入</Option>
                        <Option value={4}>邀请进入</Option>
                    </Select>
                    <Select
                        allowClear
                        className="search-box"
                        placeholder="状态"
                        value={searchParams.status || undefined}
                        onChange={(value) => handleSelectChange(value, 'status')}
                    >
                        <Option value="NORMAL">正常</Option>
                        <Option value="CLOSED">关闭</Option>
                    </Select>
                    <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/room/delete-batch',
                            selectedRows,
                            fetchData,
                        })}
                        disabled={selectedRows.length === 0}
                    >
                        批量删除
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        新建聊天室
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
                                <th>房间类型</th>
                                <th>房主ID</th>
                                <th>房间名称</th>
                                <th>介绍</th>
                                <th>是否临时消息</th>
                                <th>是否加密</th>
                                <th>是否公开可搜索</th>
                                <th>进入类型</th>
                                <th>状态</th>
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
                                    <td>{item.roomType}</td>
                                    <td>{item.roomMasterId}</td>
                                    <td>{item.roomName}</td>
                                    <td>{item.description}</td>
                                    <td>{item.isTemp ? '是' : '否'}</td>
                                    <td>{item.isEncrypt ? '是' : '否'}</td>
                                    <td>{item.isPublicForSearch ? '是' : '否'}</td>
                                    <td>
                                        {item.enterType === 1 && '自由进入'}
                                        {item.enterType === 2 && '密码进入'}
                                        {item.enterType === 3 && '申请进入'}
                                        {item.enterType === 4 && '邀请进入'}
                                    </td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Button onClick={() => handleViewDetails(item)}>查看</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        totalPages={Math.ceil(totalNum / pageSize)}
                        current={current}
                        onPageChange={setCurrent}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                    />
                </Spin>
            </div>

            <Modal
                title="房间详情"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                {selectedItem && (
                    <div className="details-container">
                        <div className="details-row">
                            <p><strong>房间ID:</strong> {selectedItem.id}</p>
                            <p><strong>房间类型:</strong> {selectedItem.roomType}</p>
                        </div>
                        <div className="details-row">
                            <p><strong>房主ID:</strong> {selectedItem.roomMasterId}</p>
                            <p><strong>房间名称:</strong> {selectedItem.roomName}</p>
                        </div>
                        <div className="details-row">
                            <p><strong>介绍:</strong> {selectedItem.description}</p>
                            <p><strong>是否临时消息:</strong> {selectedItem.isTemp ? '是' : '否'}</p>
                        </div>
                        <div className="details-row">
                            <p><strong>是否加密:</strong> {selectedItem.isEncrypt ? '是' : '否'}</p>
                            <p><strong>是否公开可搜索:</strong> {selectedItem.isPublicForSearch ? '是' : '否'}</p>
                        </div>
                        <div className="details-row">
                            <p><strong>进入类型:</strong> {selectedItem.enterType === 1 ? '自由进入' : selectedItem.enterType === 2 ? '密码进入' : selectedItem.enterType === 3 ? '申请进入' : '邀请进入'}</p>
                            <p><strong>状态:</strong> {selectedItem.status}</p>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title="新建聊天室"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleCreateRoom}
                    initialValues={{
                        roomType: "1",
                        isTemp: false,
                        isEncrypt: false,
                        isPublicForSearch: true,
                        enterType: 1,
                        status: "NORMAL",
                    }}
                >
                    <Form.Item name="roomType" label="房间类型" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="avatar" label="头像">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="roomMasterId"
                        label="房主"
                        rules={[{ required: true, message: '请输入用户昵称或ID' }]}
                    >
                        <AutoComplete
                            options={userOptions}
                            onSearch={handleSearchUser}
                            onSelect={handleUserSelect}
                        >
                            <Input.Search placeholder="请输入用户昵称或ID" />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item name="roomName" label="房间名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="介绍">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="isTemp" valuePropName="checked">
                        <Checkbox>是否临时消息</Checkbox>
                    </Form.Item>
                    <Form.Item name="isEncrypt" valuePropName="checked">
                        <Checkbox>是否加密</Checkbox>
                    </Form.Item>
                    <Form.Item name="isPublicForSearch" valuePropName="checked">
                        <Checkbox>是否公开可搜索</Checkbox>
                    </Form.Item>
                    <Form.Item name="enterType" label="进入类型" rules={[{ required: true }]}>
                        <Select onChange={handleEnterTypeChange}>
                            <Option value={1}>自由进入</Option>
                            <Option value={2}>密码进入</Option>
                            <Option value={3}>申请进入</Option>
                            <Option value={4}>邀请进入</Option>
                        </Select>
                    </Form.Item>
                    {form.getFieldValue('enterType') === 2 && (
                        <Form.Item name="enterPassword" label="加入密码">
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                        <Select>
                            <Option value="NORMAL">正常</Option>
                            <Option value="CLOSED">关闭</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default RoomManagement;
