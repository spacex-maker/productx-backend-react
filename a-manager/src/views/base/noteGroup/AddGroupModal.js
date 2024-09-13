import React, { useState } from 'react';
import { Button, Input, Modal, Form, Select, message } from 'antd';
import FileUpload from 'src/components/common/TencentCosFileUpload';
import api from 'src/axiosInstance';
const { Option } = Select;

const AddGroupModal = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);

    const handleFinish = async (values) => {
        setIsSubmitting(true);
        try {
            // 发送请求到后端 API
            const response = await api.post('/manage/an-note-group/saveNoteGroup', values);
            if (response) {
                message.success('分组新增成功');
                onSuccess();
                form.resetFields();
                onClose();
            } else {
                message.error('分组新增失败');
            }
        } catch (error) {
            message.error('分组新增失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUploadSuccess = (newFiles) => {
        // 获取当前表单中的文件，如果没有则返回空数组
        const currentFiles = form.getFieldValue('coverImage') || [];

        // 将当前的文件与新上传的文件合并
        const updatedFiles = [...currentFiles, ...newFiles];

        // 更新表单字段的值
        form.setFieldsValue({ coverImage: updatedFiles });
    };

    const handleUploadError = (error) => {
        console.error('Upload error:', error);
        message.error('文件上传失败，请重试');
    };

    const handleUploadStatusChange = (uploading) => {
        setIsUploading(uploading);
    };

    const handleUploadProgress = (percentCompleted, speed) => {
        setUploadPercent(percentCompleted);
        setUploadSpeed(speed);
    };

    return (
        <Modal
            title="新增分组"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    status: 'COMMON',
                    scopeAccess: 0,
                }}
            >
                <Form.Item
                    label="分组名称"
                    name="groupName"
                    rules={[{ required: true, message: '分组名称不能为空' }]}
                >
                    <Input placeholder="请输入分组名称" />
                </Form.Item>
                <Form.Item
                    label="介绍"
                    name="description"
                >
                    <Input.TextArea placeholder="请输入介绍" rows={4} />
                </Form.Item>
                <Form.Item
                    label="封面图片"
                    name="coverImage"
                    rules={[{ required: true, message: '请选择文件' }]}
                >
                    <FileUpload
                        maxFileCount={1} // 限制为1张图
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        onUploadStatusChange={handleUploadStatusChange}
                        onUploadProgress={handleUploadProgress}
                    />
                </Form.Item>
                <Form.Item
                    label="分组状态"
                    name="status"
                >
                    <Select>
                        <Option value="COMMON">常规</Option>
                        <Option value="ARCHIVED">归档</Option>
                        {/* 根据需要添加其他状态 */}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="公开范围"
                    name="scopeAccess"
                >
                    <Select>
                        <Option value={0}>全站可见</Option>
                        <Option value={1}>仅某人可见</Option>
                        <Option value={2}>自己可见</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddGroupModal;
