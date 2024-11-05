import React, {useState} from 'react';
import {Modal, Form, Input, Select, AutoComplete} from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
const emailSuffixes = [
  '@gmail.com', '@yahoo.com', '@outlook.com', '@qq.com', '@icloud.com',
  '@hotmail.com', '@live.com', '@msn.com', '@aol.com', '@comcast.net',
  '@sina.com', '@163.com', '@126.com', '@yeah.net', '@foxmail.com',
  '@mail.ru', '@yandex.ru', '@protonmail.com', '@gmx.com', '@zoho.com',
  '@me.com', '@mac.com', '@bk.ru', '@list.ru', '@inbox.ru', '@mail.com',
  '@fastmail.com', '@hushmail.com', '@tutanota.com', '@rocketmail.com', '@rediffmail.com',
  '@china.com', '@21cn.com', '@tom.com', '@aliyun.com', '@263.net', '@sohu.com',
  '@email.com', '@web.de', '@naver.com', '@hanmail.net', '@daum.net', '@nate.com',
  '@uol.com.br', '@terra.com.br', '@bol.com.br', '@ig.com.br', '@oi.com.br',
  '@sapo.pt', '@orange.fr', '@laposte.net', '@free.fr', '@wanadoo.fr', '@libero.it',
  '@virgilio.it', '@tiscali.it', '@alice.it', '@tin.it', '@inwind.it', '@virginmedia.com',
  '@btinternet.com', '@talktalk.net', '@blueyonder.co.uk', '@sky.com', '@mailbox.org'
];

const ManagerCreateFormModal = ({
                                    isVisible,
                                    onCancel,
                                    onFinish,
                                    form,
                                  }) => {
  const [emailOptions, setEmailOptions] = useState([]);

  const handleEmailChange = (value) => {
    if (!value || value.includes('@')) {
      setEmailOptions([]);
    } else {
      const newOptions = emailSuffixes.map(suffix => ({
        label: `${value}${suffix}`,
        value: `${value}${suffix}`,
      }));
      setEmailOptions(newOptions);
    }
  };
  return (
    <Modal
      title="新增管理员用户 (Create Admin User)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名 (Username)"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱 (Email)"
          name="email"
          rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
        >
          <AutoComplete
            options={emailOptions}
            onChange={handleEmailChange}
            placeholder="请输入邮箱"
          >
            <Input />
          </AutoComplete>
        </Form.Item>
        <Form.Item
          label="电话 (Phone)"
          name="phone"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码 (Password)"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <RoleSelect
        />
      </Form>
    </Modal>
  );
};

export default ManagerCreateFormModal;
