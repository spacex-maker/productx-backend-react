import React from 'react';
import {Modal, Button, Descriptions, Typography, Space} from 'antd';
import {formatDate} from "src/components/common/Common";

const {Text} = Typography;

const UserDetailModal = ({
                           isVisible,
                           onCancel,
                           selectedUser,
                         }) => {

  const textStyle = { fontSize: '10px' }; // 统一的文本样式
  return (
    <Modal
      title="用户详情"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          返回
        </Button>,
      ]}
      width={500} // 调整宽度以适应内容
      style={{ zIndex: 1050 }} // 设置较高的 z-index
    >
      {selectedUser && (
        <div>
          <Space style={{marginBottom: 20, width: '100%', justifyContent: 'space-between'}}>
            <Space style={{width: 30}}>
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.nickname}的头像`}
                style={{width: '50px', height: '50px', borderRadius: '25%'}}
              />
              <Space direction="vertical" style={{width: '100px'}}>
                <Text type={selectedUser.status? 'success' : 'danger'}>
                  {selectedUser.status ? '正常' : '禁用'}
                </Text>
              </Space>
            </Space>
            <br/>
            <Space direction="vertical" style={{width: 300}}>
              <Space direction="vertical">
                <Space>
                  <Text style={textStyle}><strong>用户名(全站唯一):</strong>{selectedUser.username}</Text>
                  <Text style={textStyle}><strong>昵称:</strong> {selectedUser.nickname}</Text>
                  <Text style={textStyle}><strong>真实姓名:</strong> {selectedUser.fullName}</Text>
                </Space>
                <Text style={textStyle}><strong>手机号码:</strong> {selectedUser.phoneNumber}</Text>
              </Space>
            </Space>
          </Space>

          <Descriptions bordered size="small" column={1} style={{fontSize: '14px'}}>
            <Descriptions.Item label="地址信息">
              <Space direction="vertical" style={{width: '100%'}}>
                <Space>
                  <Text style={textStyle}><strong>国家:</strong> {selectedUser.country}</Text>
                  <Text style={textStyle}><strong>州:</strong> {selectedUser.state}</Text>
                  <Text style={textStyle}><strong>城市:</strong> {selectedUser.city}</Text>
                </Space>
                <Text style={textStyle}><strong>默认地址:</strong> {selectedUser.address}</Text>
                <Text style={textStyle}><strong>邮政编码:</strong> {selectedUser.postalCode}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="财务信息">
              <Space direction="vertical" style={{width: '100%'}}>
                <Text style={textStyle}><strong>平台余额:</strong> {selectedUser.balance}</Text>
                <Text style={textStyle}><strong>USDT地址:</strong> {selectedUser.usdtAddress}</Text>
                <Text style={textStyle}><strong>USDT余额:</strong> {selectedUser.usdtAmount}</Text>
                <Text style={textStyle}><strong>USDT冻结金额:</strong> {selectedUser.usdtFrozenAmount}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="其他信息">
              <Space direction="vertical" style={{width: '100%'}}>
                <Text style={textStyle}><strong>信用评分:</strong> {selectedUser.creditScore}</Text>
                <Text style={textStyle}><strong>注册时间:</strong> {formatDate(selectedUser.createTime)}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailModal;
