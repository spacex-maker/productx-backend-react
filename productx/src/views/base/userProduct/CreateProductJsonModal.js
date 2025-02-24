import React, { useState } from 'react';
import { Modal, Input, message, Spin, Form, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CodeOutlined } from '@ant-design/icons';
import { createProductByJsonService } from 'src/service/product.service';
import { searchUserService } from 'src/service/user.service';
import { ConsumerAvatar } from 'src/components';

const placeholder = `{
  "api": "mtop.taobao.idlemtopsearch.pc.search",
  "data": {
    // 搜索结果的控制信息
    "resultInfo": {
      "forceUseTppRepair": false,
      "hasNextPage": true,
      "loadingTextList": ["宝贝正在来...", "呼哧呼哧...", "还有很多页..."],
      "searchResControlFields": {
        "hasItems": true,
        "maxPrice": 50000,
        "minPrice": 1,
        "nextPage": true,
        "numFound": 480000,
        "searchId": "c9098fc5ef34f55eaf639df12fadec77"
      }
    },

    // 搜索结果列表
    "resultList": [
      {
        "data": {
          "item": {
            "main": {
              // 商品基本信息
              "clickParam": {
                "args": {
                  "price": "25",
                  "id": "875798355314",
                  "keyword": "手机壳"
                }
              }
            },
            // 商品详细信息
            "exContent": {
              "area": "北京",
              "detailParams": {
                "title": "商品标题",
                "price": "25",
                "picUrl": "图片URL"
              }
            }
          }
        }
      }
      // ... 更多搜索结果
    ]
  },
  "ret": ["SUCCESS::调用成功"],
  "v": "1.0"
}`;

const CreateProductJsonModal = (props) => {
  const { open, onOk, onCancel } = props;
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form] = Form.useForm();

  const onSearch = async (value) => {
    if (!value) {
      setUserOptions([]);
      return;
    }
    setUserSearchLoading(true);
    try {
      const [error, response] = await searchUserService(value);
      if (!error && Array.isArray(response)) {
        setUserOptions(response);
      }
    } finally {
      setUserSearchLoading(false);
    }
  };

  const _onOk = async () => {
    if (!jsonContent.trim()) {
      message.error(t('jsonContentRequired'));
      return;
    }
    if (!selectedUserId) {
      message.error(t('pleaseSelectUser'));
      return;
    }
    try {
      // 验证 JSON 格式
      JSON.parse(jsonContent);
    } catch (error) {
      return message.error(t('invalidJson'));
    }
    setLoading(true);
    const [error] = await createProductByJsonService({
      jsonContent,
      userId: selectedUserId
    });
    if (error) {
      setLoading(false);
      return message.error(t('创建失败'));
    }
    message.success(t('创建成功'));
    setJsonContent('');
    setSelectedUserId(null);
    form.resetFields();
    onOk();
    setLoading(false);
  };

  const _onCancel = () => {
    setJsonContent('');
    setSelectedUserId(null);
    form.resetFields();
    onCancel();
  };

  const onInputChange = (event) => {
    setJsonContent(event.target.value);
  };

  return (
    <Modal
      title={
        <>
          <CodeOutlined /> {t('createProductWithJson')}
        </>
      }
      open={open}
      onOk={_onOk}
      onCancel={_onCancel}
      width={600}
      okText={t('create')}
      cancelText={t('cancel')}
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('selectUser')}
            required
            style={{ marginBottom: '15px' }}
          >
            <Select
              showSearch
              value={selectedUserId}
              placeholder={t('searchUser')}
              loading={userSearchLoading}
              onSearch={onSearch}
              onChange={(value) => setSelectedUserId(value)}
              filterOption={false}
              style={{ width: '100%' }}
            >
              {userOptions.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  <Space>
                    <ConsumerAvatar consumer={user} />
                    <span>{user.nickname || user.username}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>获取JSON数据步骤：</div>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              <li>
                打开
                <a href="https://www.goofish.com" target="_blank" rel="noopener noreferrer">
                  闲鱼网页版
                </a>
                ，进入任意分类页面（需显示分页按钮）
              </li>
              <li>按 F12 打开浏览器开发者工具</li>
              <li>点击 XHR 选项，过滤出 XHR 请求</li>
              <li>点击垃圾桶图标，清理当前所有请求记录</li>
              <li>点击分页按钮切换到第二页</li>
              <li>在请求记录中找到并复制完整的 JSON 响应数据，粘贴到下方输入框</li>
            </ol>
          </div>

          <Input.TextArea
            style={{
              fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
              fontSize: '12px',
              minHeight: '300px',
            }}
            value={jsonContent}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateProductJsonModal;
