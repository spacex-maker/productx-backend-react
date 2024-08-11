import React, {useState, useEffect} from 'react'
import api from 'src/axiosInstance'
import 'src/scss/_custom.scss'
import {Modal, Button, Form, Input, DatePicker, message, Spin} from 'antd'
import {UseSelectableRows} from 'src/components/common/UseSelectableRows'
import {HandleBatchDelete} from 'src/components/common/HandleBatchDelete';
// 示例函数: 用于更新用户状态
const updateUserStatus = async (id, newStatus) => {
    await api.post(
        '/manage/user/change-status',
        {id, state: newStatus === 'COMMON' ? 'COMMON' : 'BAN'},
    )
}
// 示例函数: 用于新增用户
const createUser = async (userData) => {
    await api.post('/manage/user/create', userData)
}

// 示例函数: 用于修改用户
const updateUser = async (updateData) => {
    await api.put(`/manage/user/update`, updateData)
}

const UserList = () => {
    const [data, setData] = useState([])
    const [totalNum, setTotalNum] = useState(0)
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchParams, setSearchParams] = useState({
        userName: '',
        nickname: '',
        mail: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
    const [createForm] = Form.useForm()
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
    const [updateForm] = Form.useForm()

    useEffect(() => {
        fetchData()
    }, [current, pageSize, searchParams])
    const {
        selectedRows,
        selectAll,
        handleSelectAll,
        handleSelectRow,
    } = UseSelectableRows();
    const fetchData = async () => {
        setIsLoading(true)
        try {
            const filteredParams = Object.fromEntries(
                Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
            )
            const response = await api.get('/manage/user/list', {
                params: {current, size: pageSize, ...filteredParams},
            })

            setData(response.data)
            setTotalNum(response.totalNum)
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setIsLoading(false)
        }
    }
    const handleStatusChange = async (id, event) => {
        const newStatus = event.target.checked ? 'COMMON' : 'BAN'
        const success = await updateUserStatus(id, newStatus)
        if (success) {
            const updatedData = data.map((item) =>
                item.id === id ? {...item, state: item.state === 'COMMON' ? 'BAN' : 'COMMON'} : item,
            )
            setData(updatedData)
        }
    }

    const handleSearchChange = (event) => {
        const {name, value} = event.target
        setSearchParams((prevParams) => ({...prevParams, [name]: value}))
    }

    const handleCreateUser = async (values) => {
        await createUser(values)
        setIsCreateModalVisible(false)
        createForm.resetFields()
        fetchData()
    }

    const handleUpdateUser = async (values) => {
        await updateUser(values)
        setIsUpdateModalVisible(false)
        updateForm.resetFields()
        fetchData()
    }

    const handleEditClick = (user) => {
        updateForm.setFieldsValue({
            id: user.id,
            nickname: user.nickname,
            mail: user.mail,
        })
        setIsUpdateModalVisible(true)
    }

    const totalPages = Math.ceil(totalNum / pageSize)

    return (
        <div>
            <div className="mb-3">
                <div className="search-container">
                    {Object.keys(searchParams).map((key) => (
                        <div key={key} className="position-relative">
                            <input
                                type="text"
                                className="form-control search-box"
                                name={key}
                                placeholder={`搜索${key}`}
                                value={searchParams[key]}
                                onChange={handleSearchChange}
                            />
                        </div>
                    ))}
                    <Button
                        type="primary"
                        onClick={fetchData}
                        className="search-button"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spin/> : '查询'}
                    </Button>
                </div>
            </div>

            <div className="mb-3">
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                    新增用户
                </Button>
                <Button
                    type="danger"
                    onClick={() => HandleBatchDelete({
                        url: '/manage/user/delete-batch',
                        selectedRows,
                        fetchData,
                    })}
                    disabled={selectedRows.length === 0}
                >
                    批量删除
                </Button>
            </div>

            <div className="table-responsive">
                <Spin spinning={isLoading}>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="select_all"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                    <label className="custom-control-label" htmlFor="select_all"></label>
                                </div>
                            </th>
                            {[
                                'ID',
                                '头像',
                                '用户名',
                                '昵称',
                                '生日',
                                '经验值',
                                '邮箱',
                                '登录天数',
                                '状态',
                                '操作',
                            ].map((field) => (
                                <th key={field}>{field}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="record-font">
                                <td>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`td_checkbox_${item.id}`}
                                            checked={selectedRows.includes(item.id)}
                                            onChange={() => handleSelectRow(item.id)}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor={`td_checkbox_${item.id}`}
                                        ></label>
                                    </div>
                                </td>
                                <td className="text-truncate">{item.id}</td>
                                <td className="text-truncate">
                                    <img
                                        src={item.avatar}
                                        alt="avatar"
                                        style={{width: '50px', height: '50px', borderRadius: '50%'}}
                                    />
                                </td>
                                <td className="text-truncate">{item.userName}</td>
                                <td className="text-truncate">{item.nickname}</td>
                                <td className="text-truncate">{item.birthday}</td>
                                <td className="text-truncate">{item.exp}</td>
                                <td className="text-truncate">{item.mail}</td>
                                <td className="text-truncate">{item.loginDays}</td>
                                <td>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={item.state === 'COMMON'}
                                            onChange={(e) => handleStatusChange(item.id, e)}
                                        />
                                        <span className="toggle-switch-slider"></span>
                                    </label>
                                </td>
                                <td>
                                    <Button type="link" onClick={() => handleEditClick(item)}>
                                        修改
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Spin>
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {Array.from({length: totalPages}, (_, index) => (
                        <li key={index} className={`page-item ${current === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrent(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <Modal
                title="新增用户"
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => createForm.submit()}
            >
                <Form form={createForm} onFinish={handleCreateUser}>
                    <Form.Item
                        label="用户姓名"
                        name="userName"
                        rules={[{required: true, message: '请输入用户姓名'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        label="用户昵称"
                        name="nickname"
                        rules={[{required: true, message: '请输入用户昵称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item label="用户生日" name="birthday">
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item label="邮箱" name="mail" rules={[{required: true, message: '请输入邮箱'}]}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="修改用户"
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                onOk={() => updateForm.submit()}
            >
                <Form form={updateForm} onFinish={handleUpdateUser}>
                    <Form.Item name="id"></Form.Item>
                    <Form.Item
                        label="用户昵称"
                        name="nickname"
                        rules={[{required: true, message: '请输入用户昵称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="mail"
                        rules={[
                            {required: true, message: '请输入邮箱'},
                            {type: 'email', message: '请输入有效的邮箱地址'},
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default UserList
