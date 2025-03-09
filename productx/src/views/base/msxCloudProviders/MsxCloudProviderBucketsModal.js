import React, { useState, useEffect } from 'react';
import { Modal, Space, Spin } from 'antd';
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

  const fetchData = async () => {
    if (!providerId) return;
    
    setLoading(true);
    try {
      const response = await api.get('/manage/object-storage/bucket-info');
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Failed to fetch buckets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && providerId) {
      fetchData();
    }
  }, [isVisible, providerId]);

  return (
    <Modal
      title={`${t('bucketInfo')} - ${providerName}`}
      open={isVisible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
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