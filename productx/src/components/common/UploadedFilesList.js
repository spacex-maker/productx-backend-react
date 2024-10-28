import React from 'react';
import { Form } from 'antd';

// 显示上传的文件名和大小
const UploadedFilesList = ({ uploadedFiles }) => {
    // 文件大小格式化函数
    const formatFileSize = (size) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    // 判断是否有上传文件，并返回对应的 JSX
    return (
        <Form.Item label="已上传文件列表">
            {uploadedFiles.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {uploadedFiles.map((file, index) => (
                        <div key={file.name + index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>{file.name}</div>
                            <div>{formatFileSize(file.size)}</div>
                        </div>
                    ))}
                </div>

            ) : (
                <div></div>
            )}
        </Form.Item>
    );
};

export default UploadedFilesList;
