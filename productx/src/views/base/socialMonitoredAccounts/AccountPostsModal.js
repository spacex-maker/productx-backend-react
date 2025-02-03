import React, { useState, useEffect } from 'react';
import { Modal, Spin, Button } from 'antd';
import api from 'src/axiosInstance';
import SocialPostsTable from '../socialPosts/SocialPostsTable';
import SocialPostsDetailModal from '../socialPosts/SocialPostsDetailModal';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';

const AccountPostsModal = ({
  isVisible,
  onCancel,
  account
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (isVisible && account) {
      fetchAccountPosts();
    }
  }, [isVisible, account]);

  const fetchAccountPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/manage/social-posts/list', {
        params: {
          authorId: account.accountId,
          platform: account.platform,
          currentPage: 1,
          size: 100
        }
      });
      if (response?.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('获取帖子失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (post) => {
    setSelectedPost(post);
    setIsDetailModalVisible(true);
  };

  const handleSelectAll = (data) => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      setSelectedRows(data.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, data) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = prevSelectedRows.includes(id)
        ? prevSelectedRows.filter(rowId => rowId !== id)
        : [...prevSelectedRows, id];
      
      setSelectAll(newSelectedRows.length === data.length);
      
      return newSelectedRows;
    });
  };

  return (
    <>
      <Modal
        title={`${account?.accountName || ''} 的帖子列表`}
        open={isVisible}
        onCancel={onCancel}
        width={1200}
        footer={[
          <Button 
            key="delete" 
            type="primary" 
            danger 
            onClick={() => HandleBatchDelete({
              url: '/manage/social-posts/delete-batch',
              selectedRows,
              fetchData: fetchAccountPosts,
            })}
            disabled={selectedRows.length === 0}
          >
            批量删除
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <div className="table-responsive">
            <SocialPostsTable
              data={posts}
              selectAll={selectAll}
              selectedRows={selectedRows}
              handleSelectAll={handleSelectAll}
              handleSelectRow={handleSelectRow}
              handleViewClick={handleViewClick}
            />
          </div>
        </Spin>
      </Modal>

      <SocialPostsDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        post={selectedPost}
      />
    </>
  );
};

export default AccountPostsModal; 