import React, { useState, useEffect } from 'react';
import { Modal, Space, Spin, Select, message } from 'antd';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';

const MsxCloudProviderBucketsModal = ({
  isVisible,
  onCancel,
  providerId,
  providerName,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState(null);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  // 获取凭证列表
  const fetchCredentials = async () => {
    setLoadingCredentials(true);
    try {
      const response = await api.get('/manage/cloud-credentials/page');
      if (response?.data) {
        setCredentials(response.data);
        // 如果有凭证数据，默认选择第一个
        if (response.data.length > 0) {
          setSelectedCredentialId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setLoadingCredentials(false);
    }
  };

  // 获取bucket列表
  const fetchBuckets = async (credentialId) => {
    if (!credentialId || !providerId) return;
    
    setLoading(true);
    try {
      const response = await api.get('/manage/object-storage/bucket-info', {
        params: {
          id: credentialId,
          providerId: providerId
        }
      });
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Failed to fetch buckets:', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 当模态框显示时，获取凭证列表
  useEffect(() => {
    if (isVisible) {
      fetchCredentials();
    }
  }, [isVisible]);

  // 当选择的凭证改变时，获取bucket列表
  useEffect(() => {
    if (selectedCredentialId) {
      fetchBuckets(selectedCredentialId);
    }
  }, [selectedCredentialId]);

  // 处理凭证选择变化
  const handleCredentialChange = (value) => {
    setSelectedCredentialId(value);
  };

  return (
    <Modal
      title={`${t('bucketInfo')} - ${providerName}`}
      open={isVisible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder={t('pleaseSelectCredential')}
          onChange={handleCredentialChange}
          value={selectedCredentialId}
          style={{ width: 300 }}
          loading={loadingCredentials}
          disabled={loadingCredentials}
        >
          {credentials.map(credential => (
            <Select.Option key={credential.id} value={credential.id}>
              {credential.name} ({credential.type})
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="table-responsive">
        <Spin spinning={loading}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {[
                  t('bucketName'),
                  t('region'),
                  t('creationDate'),
                  t('location')
                ].map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.bucketName} className="record-font">
                  <td className="text-truncate">{item.bucketName}</td>
                  <td className="text-truncate">{item.region}</td>
                  <td className="text-truncate">{item.creationDate}</td>
                  <td className="text-truncate">
                    <a href={item.location} target="_blank" rel="noopener noreferrer">
                      {item.location}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Spin>
      </div>
    </Modal>
  );
};

MsxCloudProviderBucketsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  providerId: PropTypes.number,
  providerName: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default MsxCloudProviderBucketsModal; 