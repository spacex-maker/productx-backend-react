import { Modal, message } from 'antd';
import { DeleteBatchButton } from 'src/components/common/DeleteBatchButton';
const HandleBatchDelete = ({ url, selectedRows, resetSelection, fetchData }) => {
  if (selectedRows.length === 0) {
    message.warning('请选择要删除的数据');
    return;
  }

  Modal.confirm({
    title: '批量删除',
    content: `确认要删除选中的 ${selectedRows.length} 条数据吗？`,
    onOk: async (close) => {
      try {
        await DeleteBatchButton(url, selectedRows);
        message.success('删除成功');
        await fetchData();
        if (resetSelection) {
          resetSelection();
        }
        close(); // 手动关闭确认框
      } catch (error) {
        // 发生错误时也需要关闭确认框
        close();
        // 错误已经被 axiosInstance 处理，这里不需要额外处理
      }
    },
  });
};

export { HandleBatchDelete };
