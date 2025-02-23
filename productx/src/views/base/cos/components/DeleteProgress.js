import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CProgress } from '@coreui/react';
import { ProgressModalWrapper } from './styles';

const DeleteProgress = ({ progress }) => {
  if (!progress || !progress.total) return null;

  const percentage = Math.round((progress.current / progress.total) * 100);
  const isComplete = percentage === 100;
  const hasError = progress.error;

  return (
    <CModal visible={true} size="lg">
      <CModalHeader>
        <CModalTitle>删除进度</CModalTitle>
      </CModalHeader>
      <ProgressModalWrapper>
        <div className="progress-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              正在删除 {progress.current} / {progress.total}
            </div>
            <div className={hasError ? 'text-error' : isComplete ? 'text-success' : ''}>
              {hasError ? '删除失败' : isComplete ? '删除完成' : `${percentage}%`}
            </div>
          </div>
          <CProgress 
            className={`progress-bar ${hasError ? 'error' : isComplete ? 'success' : ''}`}
            value={percentage}
          />
          {hasError && (
            <div className="text-error mt-2">
              {progress.error}
            </div>
          )}
        </div>
      </ProgressModalWrapper>
    </CModal>
  );
};

export default DeleteProgress; 