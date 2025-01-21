import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { getConsumerByIdService } from 'src/service/consumer.service';

export const useConsumerAvatar = (id) => {
  const [consumer, setConsumer] = useState({
    avatar: '',
    username: '未知',
    id: id,
  });
  const setConsumerByServe = async () => {
    if (!id) {
      return;
    }
    const [error, responseDate] = await getConsumerByIdService(id);
    if (error) {
      setConsumer({
        avatar: '',
        username: '未知',
        id: id,
      });
      return;
    }
    setConsumer(responseDate);
  };

  useEffect(() => {
    setConsumerByServe();
  }, [id]);

  return consumer;
};

export const ConsumerAvatar = (props) => {
  // eslint-disable-next-line react/prop-types
  const { consumer } = props;
  // eslint-disable-next-line react/prop-types
  const { avatar, username, id } = consumer;

  return (
    <Space>
      {avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
      {`${username ?? '未知'}(ID:${id})`}
    </Space>
  );
};
