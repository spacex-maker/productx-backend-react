import { Form } from 'antd';

const ListUserProduct = () => {
  const [form] = Form.useForm();

  return (
    <div>
      <AddUserProductModal
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onFinish={handleAddUserProduct}
        form={form}
      />
    </div>
  );
};

export default ListUserProduct; 