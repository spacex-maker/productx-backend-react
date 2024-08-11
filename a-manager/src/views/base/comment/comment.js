import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import 'src/scss/_custom.scss'
import { Modal, Button, Form, Input, DatePicker, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// 示例函数: 用于更新图片状态
const updateImageStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('jwtManageToken') // 获取 JWT 令牌
    await api.post(
      '/manage/record/change-status',
      { id, isChecked: newStatus === 'COMMON' }, // 请求体
      {
        headers: { authorization: `${token}` }, // 请求头
      },
    )
    console.log(`Update image ${id} to ${newStatus}`)
    return true
  } catch (error) {
    console.error('Failed to update image status', error)
    return false
  }
}

// 示例函数: 用于删除项目
const deleteItem = async (id) => {
  try {
    const token = localStorage.getItem('jwtManageToken') // 获取 JWT 令牌
    await api.delete(`/manage/record/delete/${id}`, {
      headers: { authorization: `${token}` }, // 请求头
    })
    console.log(`Delete item ${id}`)
  } catch (error) {
    console.error('Failed to delete item', error)
  }
}

// 上传图片
const uploadImage = async (values) => {
  try {
    const token = localStorage.getItem('jwtManageToken')
    const formData = new FormData()
    Object.keys(values).forEach((key) => {
      if (key === 'file') {
        values[key].forEach((file) => formData.append('file', file.file.originFileObj))
      } else {
        formData.append(key, values[key])
      }
    })

    await api.post('/manage/record/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `${token}`,
      },
    })

    message.success('Upload successful!')
  } catch (error) {
    console.error('Failed to upload image', error)
    message.error('Upload failed!')
  }
}

const RecordList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [searchParams, setSearchParams] = useState({
    type: '',
    title: '',
    location: '',
    description: '',
    imgUrl: '',
    photoTimeStart: '',
    photoTimeEnd: '',
    createTimeStart: '',
    createTimeEnd: '',
    photoBy: '',
  })

  // 控制模态框的显示
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtManageToken') // 获取 JWT 令牌

        // 过滤掉空值的搜索参数
        const filteredParams = Object.fromEntries(
          Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
        )

        const response = await api.get('/manage/record/list', {
          params: {
            current,
            size: pageSize,
            ...filteredParams, // 将过滤后的参数展开到请求中
          },
        })

        setData(response.data) // 访问数据对象中的 data 数组
        setTotalNum(response.totalNum) // 获取总条目数
      } catch (error) {
        console.error('Failed to fetch data', error)
      }
    }
    fetchData()
  }, [current, pageSize, searchParams]) // 添加 searchParams 作为依赖

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked ? 'COMMON' : 'INVALID'
    const success = await updateImageStatus(id, newStatus)
    if (success) {
      // 如果更新成功，修改状态
      const updatedData = data.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'COMMON' ? 'INVALID' : 'COMMON' }
          : item,
      )
      setData(updatedData)
    }
  }

  const handleDelete = (id) => {
    deleteItem(id)
  }

  const handleSelectAll = (event) => {
    const checked = event.target.checked
    setSelectAll(checked)
    setSelectedRows(checked ? data.map((item) => item.id) : [])
  }

  const handleSelectRow = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id]
    setSelectedRows(newSelectedRows)
    setSelectAll(newSelectedRows.length === data.length)
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }))
  }

  const handleUpload = async (values) => {
    await uploadImage(values)
    setIsModalVisible(false)
    form.resetFields() // 清空表单字段
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          {Object.keys(searchParams).map((key) => (
            <div key={key} className="position-relative">
              <input
                type={key.includes('Time') ? 'datetime-local' : 'text'}
                className="form-control search-box"
                name={key}
                placeholder={`搜索${key}`}
                value={searchParams[key]}
                onChange={handleSearchChange}
              />
            </div>
          ))}
          <Button type="primary" onClick={() => setIsModalVisible(true)} className="upload-button">
            上传图片
          </Button>
        </div>
      </div>

      <Modal
        title="上传图片"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpload} layout="vertical">
          <Form.Item name="type" label="图片类型">
            <Input placeholder="请输入图片类型" />
          </Form.Item>

          <Form.Item name="title" label="图片标题">
            <Input placeholder="请输入图片标题" />
          </Form.Item>

          <Form.Item name="location" label="拍摄位置">
            <Input placeholder="请输入拍摄位置" />
          </Form.Item>

          <Form.Item name="photoBy" label="摄影师">
            <Input placeholder="请输入摄影师姓名" />
          </Form.Item>

          <Form.Item name="imageSize" label="分辨率">
            <Input placeholder="请输入图片分辨率" />
          </Form.Item>

          <Form.Item name="description" label="图片介绍">
            <Input.TextArea placeholder="请输入图片介绍" />
          </Form.Item>

          <Form.Item
            name="photoTime"
            label="拍摄时间"
            rules={[{ required: true, message: '请选择拍摄时间' }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            name="file"
            label="选择文件"
            valuePropName="fileList"
            getValueFromEvent={({ file }) => (file ? [file] : [])}
            rules={[{ required: true, message: '请选择文件' }]}
          >
            <Upload beforeUpload={() => false} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              上传
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>id</th>
              <th>类型</th>
              <th>标题</th>
              <th>位置</th>
              <th>描述</th>
              <th>拍摄者</th>
              <th>尺寸</th>
              <th>文件大小</th>
              <th>状态</th>
              <th>图片信息</th>
              <th>操作</th>
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
                <td className="text-truncate">{item.type}</td>
                <td className="text-truncate">{item.title}</td>
                <td className="text-truncate">{item.location}</td>
                <td className="text-truncate">{item.description}</td>
                <td className="text-truncate">{item.photoBy}</td>
                <td className="text-truncate">{item.imageSize}</td>
                <td className="text-truncate">{(item.fileSize / 1024).toFixed(2)}MB</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.status === 'COMMON'}
                      onChange={(e) => handleStatusChange(item.id, e)}
                    />
                    <span className="toggle-switch-slider"></span>
                  </label>
                </td>
                <td className="text-truncate">
                  <div className="media align-items-center">
                    <div className="image-list">
                      <img src={`${item.imgUrl}`} className="golden-ratio-image" alt="thumbnail" />
                    </div>
                    <div className="media-body">
                      <span className="vertical-span">
                        拍摄时间：{item.photoTime.replace('T', ' ')}
                      </span>
                      <span className="vertical-span">
                        上传时间：{item.createTime.replace('T', ' ')}
                      </span>
                      <span className="vertical-span">
                        修改时间：{item.updateTime.replace('T', ' ')}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 添加分页组件 */}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${current === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrent(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default CommentList
