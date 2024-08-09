import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import 'src/scss/_custom.scss'
import { Modal, Button, Form, Input, Upload, message, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// 上传资源
const uploadResource = async (values) => {
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

    await api.post('/manage/resource/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `${token}`,
      },
    })

    message.success('Upload successful!')
  } catch (error) {
    console.error('Failed to upload resource', error)
    message.error('Upload failed!')
  }
}

const ResourceList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [searchParams, setSearchParams] = useState({
    uploadUser: '',
    resourceName: '',
    title: '',
    description: '',
    isPublic: '',
  })

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // 添加加载状态
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [current, pageSize])

  const fetchData = async () => {
    setIsLoading(true) // 开始加载
    try {
      const token = localStorage.getItem('jwtManageToken')
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      )
      const response = await api.get('/manage/resource/list', {
        params: { current, size: pageSize, ...filteredParams },
        headers: { authorization: `${token}` },
      })

      setData(response.data.data.data)
      setTotalNum(response.data.data.totalNum)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false) // 完成加载
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
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

  const handleUploadModalCancel = () => setIsUploadModalVisible(false)

  const handleImageModalCancel = () => {
    setIsImageModalVisible(false)
    setFullscreenImage(null)
  }

  const handleImageClick = (imgUrl) => {
    const urlWithoutParams = imgUrl.split('?')[0]
    setFullscreenImage(urlWithoutParams)
    setIsImageModalVisible(true)
  }

  const handleSearch = () => {
    fetchData()
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
            onClick={handleSearch}
            className="search-button"
            disabled={isLoading} // 禁用按钮
          >
            {isLoading ? <Spin /> : '查询'}
          </Button>
          <Button
            type="primary"
            onClick={() => setIsUploadModalVisible(true)}
            className="upload-button"
          >
            上传资源
          </Button>
        </div>
      </div>

      <Modal
        title="上传资源"
        visible={isUploadModalVisible}
        onCancel={handleUploadModalCancel}
        footer={null}
        zIndex={1000}
      >
        <Form form={form} layout="vertical" onFinish={uploadResource}>
          <Form.Item name="uploadUser" label="上传用户">
            <Input placeholder="请输入上传用户" />
          </Form.Item>
          <Form.Item name="resourceName" label="资源名称">
            <Input placeholder="请输入资源名称" />
          </Form.Item>
          <Form.Item name="title" label="文件标题">
            <Input placeholder="请输入文件标题" />
          </Form.Item>
          <Form.Item name="description" label="文件介绍">
            <Input placeholder="请输入文件介绍" />
          </Form.Item>
          <Form.Item name="isPublic" label="是否公开">
            <Input placeholder="请输入是否公开" />
          </Form.Item>
          <Form.Item name="file" label="选择文件" valuePropName="fileList">
            <Upload beforeUpload={() => false} showUploadList={false}>
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

      <Modal
        visible={isImageModalVisible}
        footer={null}
        onCancel={handleImageModalCancel}
        width="80%"
        style={{ top: 20 }}
        zIndex={2000}
      >
        {fullscreenImage && (
          <img src={fullscreenImage} alt="fullscreen" style={{ width: '100%' }} />
        )}
      </Modal>

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
                  '上传用户',
                  '资源名称',
                  '文件标题',
                  '文件介绍',
                  '文件大小',
                  '是否公开',
                  '浏览量',
                  '下载量',
                  '点赞数',
                  '不喜欢数',
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
                  <td className="text-truncate">{item.uploadUser}</td>
                  <td className="text-truncate">{item.resourceName}</td>
                  <td className="text-truncate">{item.title}</td>
                  <td className="text-truncate">{item.description}</td>
                  <td className="text-truncate">{(item.fileSize / 1024).toFixed(2)}MB</td>
                  <td className="text-truncate">{item.isPublic ? '是' : '否'}</td>
                  <td className="text-truncate">{item.viewCount}</td>
                  <td className="text-truncate">{item.downloadCount}</td>
                  <td className="text-truncate">{item.likeCount}</td>
                  <td className="text-truncate">{item.dislikeCount}</td>
                  <td>
                    <Button onClick={() => handleImageClick(item.url)}>查看</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Spin>
      </div>

      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
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

export default ResourceList
