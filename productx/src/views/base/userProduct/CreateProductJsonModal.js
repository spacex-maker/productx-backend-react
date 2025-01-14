import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Spin, Progress } from 'antd';
import { useTranslation } from "react-i18next";
import { CodeOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const CreateProductJsonModal = ({ visible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 130);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleOk = async () => {
    try {
      setLoading(true);
      // 验证 JSON 格式
      JSON.parse(jsonContent);
      
      // 发送请求
      await api.post('/manage/user-product/create-json', jsonContent, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      message.success(t('createSuccess'));
      setJsonContent('');
      onSuccess?.();
      onCancel();
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error(t('invalidJson'));
      } else {
        message.error(t('createFailed'));
      }
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <Modal
      title={<><CodeOutlined /> {t('createProductWithJson')}</>}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      okText={t('create')}
      cancelText={t('cancel')}
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>获取JSON数据步骤：</div>
          <ol style={{ paddingLeft: '20px', margin: 0 }}>
            <li>打开<a href="https://www.goofish.com" target="_blank" rel="noopener noreferrer">闲鱼网页版</a>，进入任意分类页面（需显示分页按钮）</li>
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
            minHeight: '300px'
          }}
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder={`{
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
}`}
        />
        {loading && <Progress percent={progress} status="active" />}
      </Spin>
    </Modal>
  );
};

export default CreateProductJsonModal;
