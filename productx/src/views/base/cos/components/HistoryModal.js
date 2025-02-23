import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile, cilCheckCircle, cilXCircle } from '@coreui/icons';
import { formatBytes, formatDate } from 'src/utils';
import { DetailModalWrapper } from './styles';

const HistoryModal = ({ visible, history, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle className="modal-title">
          上传历史
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <DetailModalWrapper>
          {history.map((item, index) => (
            <div key={index} className="detail-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilFile} className="me-2" />
                  <span>{item.fileName}</span>
                </div>
                <CBadge color={item.status === 'success' ? 'success' : 'danger'}>
                  {item.status === 'success' ? '上传成功' : '上传失败'}
                </CBadge>
              </div>
              
              <table className="info-table">
                <tbody>
                  <tr>
                    <td>文件大小</td>
                    <td>{formatBytes(item.fileSize)}</td>
                  </tr>
                  <tr>
                    <td>上传时间</td>
                    <td>{formatDate(item.uploadTime)}</td>
                  </tr>
                  {item.error && (
                    <tr>
                      <td>错误信息</td>
                      <td className="text-danger">{item.error}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <CProgress 
                className={`progress-bar mt-3 ${item.status === 'success' ? 'success' : 'error'}`}
                value={item.status === 'success' ? 100 : 0}
              />
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-center text-muted py-5">
              暂无上传历史记录
            </div>
          )}
        </DetailModalWrapper>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary"
          onClick={onClose}
        >
          关闭
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default HistoryModal; 