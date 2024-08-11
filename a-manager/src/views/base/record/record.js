import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import {Modal, Button, Form, Input, DatePicker, Upload, Spin, Select, Row, Col, Progress, message, Switch} from 'antd';
import Pagination from 'src/components/common/Pagination';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import FileUpload from 'src/components/common/TencentCosFileUpload';
import {RecordUploadImg} from "src/views/base/record/RecordUploadImg";
import UploadedFilesList from "src/components/common/UploadedFilesList";
const updateImageStatus = async (id, newStatus) => {
    try {
        await api.post(
            '/manage/record/change-status',
            { id, isChecked: newStatus === 'COMMON' },
        );
        return true;
    } catch (error) {
        console.error('Failed to update image status', error);
        return false;
    }
};



const RecordList = () => {
    const [data, setData] = useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState({
        type: '',
        title: '',
        location: '',
        description: '',
        imgUrl: '',
        photoTimeStart: '',
        photoTimeEnd: '',
        createTimeStart: '',
        createTimeEnd: '',
        photoBy: '',
    });
    const [imageTypes, setImageTypes] = useState([]); // 图文类型
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 添加加载状态
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);

    const handleUploadStatusChange = (uploading) => {
        console.log("上传状态改变:"+uploading)
        setIsUploading(uploading);
    };

    const handleUploadProgress = (percentCompleted, speed) => {
        setUploadPercent(percentCompleted);
        setUploadSpeed(speed);
    };
    useEffect(() => {
        fetchData();
        fetchImageTypes();
        // 获取图文类型
    }, [current, pageSize, searchParams]);

    const {
        selectedRows,
        selectAll,
        handleSelectAll,
        handleSelectRow,
        resetSelection, // 获取重置选择状态的方法
    } = UseSelectableRows();
// 获取图文类型枚举
    const fetchImageTypes = async () => {
        try {
            const response = await api.get('/base/system/record-type');
            const imageTypesFormatted = response.map(type => ({
                value: type,
                label: type,
            }));

            setImageTypes(imageTypesFormatted);
        } catch (error) {
            console.error('Failed to fetch image types', error);
            return [];
        }
    };
    const fetchData = async () => {
        setIsLoading(true); // 开始加载
        try {
            const filteredParams = Object.fromEntries(
                Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
            );
            const response = await api.get('/manage/record/list', {
                params: { current, size: pageSize, ...filteredParams },
            });

            setData(response.data);
            setTotalNum(response.totalNum);
            resetSelection(); // 重置选择状态
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false); // 完成加载
        }
    };

    const handleStatusChange = async (id, event) => {
        const newStatus = event.target.checked ? 'COMMON' : 'INVALID';
        const success = await updateImageStatus(id, newStatus);
        if (success) {
            const updatedData = data.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === 'COMMON' ? 'INVALID' : 'COMMON' }
                    : item,
            );
            setData(updatedData);
        }
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleTypeChange = (value) => {
        console.log('Selected type:', value); // 调试信息
        setSearchParams((prevParams) => ({ ...prevParams, type: value }));
    };
    const uploadRecord = async (values) => {
        try {
            await api.post('/manage/record/upload', values, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            message.success('上传成功!');
        } catch (error) {
            console.error('Failed to upload image', error);
            message.error('上传失败');
        }
        setIsUploadModalVisible(false);
        fetchData();
    };

    const handleImageClick = (imgUrl) => {
        const urlWithoutParams = imgUrl.split('?')[0];
        setFullscreenImage(urlWithoutParams);
        setIsImageModalVisible(true);
    };

    const handleUploadModalCancel = () => setIsUploadModalVisible(false);

    const handleImageModalCancel = () => {
        setIsImageModalVisible(false);
        setFullscreenImage(null);
    };
    const handleUploadSuccess = (newFiles) => {
        // 获取当前表单中的 fileUrls，如果没有则返回空数组
        const currentFiles = form.getFieldValue('files') || [];

        // 将当前的 fileUrls 与新上传的 newFileUrls 合并
        const updatedFiles = [...currentFiles, ...newFiles];

        // 更新表单字段的值
        form.setFieldsValue({ files: updatedFiles });

        // 更新文件名状态，将新文件名追加到已有文件名数组中
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

        fetchData();
    };
    const handleUploadError = (error) => {
        console.error('Upload error:', error);
        // 这里可以添加错误提示
    };

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    <Select
                        placeholder="选择图文类型"
                        className="search-box"
                        value={searchParams.type || undefined}
                        onChange={handleTypeChange}
                        style={{ width: 200, marginBottom: '16px' }}
                        allowClear // 允许清空
                    >
                        {imageTypes.map((type) => (
                            <Select.Option key={type.value} value={type.value}>
                                {type.label}
                            </Select.Option>
                        ))}
                    </Select>
                    {Object.keys(searchParams).filter(key => key !== 'type').map((key) => (
                        <div key={key} className="position-relative">
                            <input
                                type={key.includes('Time') ? 'datetime-local' : 'text'}
                                className="form-control search-box"
                                name={key}
                                placeholder={`搜索${key}`}
                                value={searchParams[key]}
                                onChange={handleSearchChange}
                            />
                        </div>
                    ))}
                    <Button
                        type="primary"
                        onClick={fetchData}
                        className="search-button"
                        disabled={isLoading} // 禁用按钮
                    >
                        {isLoading ? <Spin /> : '查询'}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setIsUploadModalVisible(true)}
                        className="upload-button"
                    >
                        上传图片
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => HandleBatchDelete({
                            url: '/manage/record/delete-batch',
                            selectedRows,
                            fetchData,
                        })}
                        disabled={selectedRows.length === 0}
                    >
                        批量删除
                    </Button>

                </div>
            </div>

            <Modal
                title="上传图片"
                open={isUploadModalVisible}
                onCancel={handleUploadModalCancel}
                footer={null}
                zIndex={1000}
            >
                <Form form={form} onFinish={uploadRecord} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="type" label="板块">
                                <Select placeholder="选择输入板块" style={{ width: '100%' }}>
                                    {imageTypes.map((type) => (
                                        <Option key={type.value} value={type.value}>
                                            {type.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="title" label="标题">
                                <Input placeholder="请输入标题" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="location" label="拍摄位置">
                                <Input placeholder="请输入拍摄位置" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="photoBy" label="拍摄者">
                                <Input placeholder="请输入拍摄者" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="imageSize" label="分辨率">
                                <Input placeholder="请输入分辨率" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="description" label="描述">
                                <Input placeholder="请输入描述" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="photoTime"
                                label="拍摄时间"
                                rules={[{ required: true, message: '请选择拍摄时间' }]}
                            >
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="status"
                                label="立即生效"
                                valuePropName="checked" // 这里用于将 Switch 的值与表单值绑定
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="files"
                        rules={[{ required: true, message: '请选择文件' }]}
                    >
                        <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                            onUploadStatusChange={handleUploadStatusChange}
                            onUploadProgress={handleUploadProgress}
                        />
                    </Form.Item>
                    <UploadedFilesList uploadedFiles={uploadedFiles} />
                    <Form.Item>
                        {isUploading && (
                            <div style={{ marginTop: '20px' }}>
                                <Progress percent={uploadPercent} />
                                <p>上传速度: {uploadSpeed} KB/s</p>
                            </div>
                        )}
                        <Button type="primary" htmlType="submit" disabled={isUploading}>
                            {isUploading ? '上传中' : '上传'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={isImageModalVisible}
                footer={null}
                onCancel={handleImageModalCancel}
                width="80%"
                style={{ top: 20 }}
                zIndex={2000}
            >
                {fullscreenImage && (
                    <img src={fullscreenImage} style={{ width: '100%' }} alt="fullscreen" />
                )}
            </Modal>

            <div className="table-container">
                <Spin spinning={isLoading}>
                    <table className="table table-bordered">
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
                            {[
                                'ID',
                                '类型',
                                '标题',
                                '拍摄位置',
                                '描述',
                                '拍摄者',
                                '尺寸',
                                '文件大小',
                                '状态',
                                '图片信息',
                                '操作',
                            ].map((field) => (
                                <th key={field}>{field}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="record-font">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => handleSelectRow(item.id, data)}
                                    />
                                </td>
                                <td className="text-truncate">{item.id}</td>
                                <td className="text-truncate">{item.type}</td>
                                <td className="text-truncate">{item.title}</td>
                                <td className="text-truncate">{item.location}</td>
                                <td className="text-truncate">{item.description}</td>
                                <td className="text-truncate">{item.photoBy}</td>
                                <td className="text-truncate">{item.imageSize}</td>
                                <td className="text-truncate">{(item.fileSize / 1024).toFixed(2)}MB</td>
                                <td>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={item.status === 'COMMON'}
                                            onChange={(e) => handleStatusChange(item.id, e)}
                                        />
                                        <span className="toggle-switch-slider"></span>
                                    </label>
                                </td>
                                <td className="text-truncate">
                                    <div className="media align-items-center">
                                        <div className="image-list">
                                            <img
                                                src={`${item.imgUrl}`}
                                                className="golden-ratio-image"
                                                alt="thumbnail"
                                                onClick={() => handleImageClick(item.imgUrl)}
                                            />
                                        </div>
                                        <div className="media-body">
                        <span className="vertical-span">
                          拍摄时间：{item.photoTime.replace('T', ' ')}
                        </span>
                                            <span className="vertical-span">
                          上传时间：{item.createTime.replace('T', ' ')}
                        </span>
                                            <span className="vertical-span">
                          修改时间：{item.updateTime.replace('T', ' ')}
                        </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Spin>
            </div>
            <Pagination
                totalPages={Math.ceil(totalNum / pageSize)}
                current={current}
                onPageChange={(page) => setCurrent(page)}
            />
        </div>
    );
};

export default RecordList;
