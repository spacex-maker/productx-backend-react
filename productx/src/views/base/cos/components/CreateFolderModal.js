import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFolder } from '@coreui/icons';

const CreateFolderModal = ({ visible, folderName, onNameChange, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFolder} className="me-2" />
            新建文件夹
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            value={folderName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="请输入文件夹名称"
            autoFocus
          />
        </CModalBody>
        <CModalFooter>
          <CButton 
            type="submit" 
            color="primary"
            disabled={!folderName.trim()}
          >
            创建
          </CButton>
          <CButton 
            color="secondary"
            onClick={onClose}
          >
            取消
          </CButton>
        </CModalFooter>
      </form>
    </CModal>
  );
};

export default CreateFolderModal; 