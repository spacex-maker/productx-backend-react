import { Modal, message } from 'antd';
import { DeleteBatchButton } from 'src/components/common/DeleteBatchButton';
const HandleBatchDelete = ({ url, selectedRows, resetSelection, fetchData }) => {
  if (selectedRows.length === 0) {
    message.warning('请选择要删除的用户');
    return;
  }

  Modal.confirm({
    title: '批量删除',
    content: '确认要删除选中的数据吗？',
    onOk: async () => {
      try {
        await DeleteBatchButton(url, selectedRows);
        message.success('删除成功');
        fetchData();
        resetSelection();
      } catch (error) {
        message.error('批量删除失败');
      }
    },
  });
};

export { HandleBatchDelete };
