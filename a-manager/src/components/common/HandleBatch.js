import { Modal, message } from 'antd';
import {BatchButton} from "src/components/common/BatchButton";
const HandleBatch = ({ url, selectedRows, fetchData }) => {
        if (selectedRows.length === 0) {
            message.warning('请选择要操作的用户');
            return;
        }

        Modal.confirm({
            title: '批量操作',
            content: '确认执行此操作？',
            onOk: async () => {
                try {
                    await BatchButton(url, selectedRows);
                    message.success('操作成功');
                    fetchData();
                } catch (error) {
                    message.error('批量操作失败');
                }
            },
        });
    };

export { HandleBatch }
