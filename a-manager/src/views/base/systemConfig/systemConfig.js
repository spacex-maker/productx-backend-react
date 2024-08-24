import React, { useState, useEffect } from 'react';
import { Button, Spin, Modal, Form, Input } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';

const SystemConfig = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState({
        type: '',
        configKey: '',
        configValue: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [current, pageSize]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const filteredParams = Object.fromEntries(
                Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
            );
            const response = await api.get('/manage/system-config/list', {
                params: { current, size: pageSize, ...filteredParams },
            });

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

    const handleSearch = () => {
        fetchData();
    };

    const handleAddNew = () => {
        setIsAddModalVisible(true);
    };

    const handleAddModalCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleAddModalOk = async () => {
        try {
            const values = await form.validateFields();
            await api.post('/manage/system-config/add', values);
            fetchData(); // Refresh data after adding new record
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Failed to add new record', error);
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsEditModalVisible(true);
        form.setFieldsValue(record);
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        form.resetFields();
    };

    const handleEditModalOk = async () => {
        try {
            const values = await form.validateFields();
            await api.post('/manage/system-config/update', { ...values, id: editingRecord.id });
            fetchData(); // Refresh data after updating record
            setIsEditModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
        } catch (error) {
            console.error('Failed to update record', error);
        }
    };

    const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows(data.map(item => item.id));

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    {Object.keys(searchParams).map((key) => (
                        <div key={key} className="position-relative">
                            <input
                                type="text"
                                className="form-control search-box"
                                name={key}
                                placeholder={`搜索${key}`}
                                value={searchParams[key]}
                                onChange={handleSearchChange}
                            />
                        </div>
                    ))}
                    <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/system-config/delete-batch',
                            selectedRows,
                            fetchData,
                        })}
                        disabled={selectedRows.length === 0}
                    >
                        批量删除
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleAddNew}
                    >
                        新增
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
                                {['类型', '标题', '值', '描述'].map((field) => (
                                    <th key={field}>{field}</th>
                                ))}
                                <th className="fixed-column">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="record-font">
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
                                    <td>{item.configKey}</td>
                                    <td>{item.configValue}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <Button type="link" onClick={() => handleEdit(item)}>修改</Button>
                                        <Button type="link" danger>删除</Button>
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
                onPageChange={(page) => setCurrent(page)}
            />

            <Modal
                title="新增配置项"
                visible={isAddModalVisible}
                onOk={handleAddModalOk}
                onCancel={handleAddModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: '请输入类型!' }]}
                    >
                        <Input placeholder="请输入类型" />
                    </Form.Item>
                    <Form.Item
                        label="配置键"
                        name="configKey"
                        rules={[{ required: true, message: '请输入配置键!' }]}
                    >
                        <Input placeholder="请输入配置键" />
                    </Form.Item>
                    <Form.Item
                        label="配置值"
                        name="configValue"
                        rules={[{ required: true, message: '请输入配置值!' }]}
                    >
                        <Input placeholder="请输入配置值" />
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="description"
                    >
                        <Input placeholder="请输入描述" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="修改配置项"
                visible={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: '请输入类型!' }]}
                    >
                        <Input placeholder="请输入类型" />
                    </Form.Item>
                    <Form.Item
                        label="配置键"
                        name="configKey"
                        rules={[{ required: true, message: '请输入配置键!' }]}
                    >
                        <Input placeholder="请输入配置键" />
                    </Form.Item>
                    <Form.Item
                        label="配置值"
                        name="configValue"
                        rules={[{ required: true, message: '请输入配置值!' }]}
                    >
                        <Input placeholder="请输入配置值" />
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="description"
                    >
                        <Input placeholder="请输入描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SystemConfig;
