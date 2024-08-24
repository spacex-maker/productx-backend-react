import React, { useState, useEffect } from 'react';
import {  Button, Spin} from 'antd';
import api from 'src/axiosInstance';
import {UseSelectableRows} from "src/components/common/UseSelectableRows";
import {HandleBatchDelete} from "src/components/common/HandleBatchDelete";
import Pagination from "src/components/common/Pagination";
import {HandleBatch} from "src/components/common/HandleBatch";

const CommentList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    type: '',
    nickname: '',
    comment: '',
    status: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
          Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/friends-comment/list-comments', {
        params: { current, size: pageSize, ...filteredParams },
      });

      setData(response.data);
      setTotalNum(response.totalNum);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleSearch = () => {
    fetchData();
  };

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow} = UseSelectableRows();
// 状态映射和样式
    const statusMap = {
        IN_REVIEW: { text: '审核中', color: 'red' },
        NORMAL: { text: '正常', color: 'green' },
        CLOSED: { text: '关闭', color: 'gray' },
    };

// 状态显示组件
    const StatusCell = ({ status }) => {
        const { text, color } = statusMap[status] || { text: '未知', color: 'black' };

        return (
            <td style={{ color: color }}>
                {text}
            </td>
        );
    };
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
            <Button type="primary" onClick={handleSearch} className="search-button" disabled={isLoading}>
              {isLoading ? <Spin /> : '查询'}
            </Button>
            <Button
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/friends-comment/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
            >
              批量删除
            </Button>
            <Button
                type="primary"
                onClick={() => HandleBatch({
                  url: '/manage/friends-comment/pass-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
            >
              批量通过
            </Button>
            <Button
                type="primary"
                onClick={() => HandleBatch({
                  url: '/manage/friends-comment/close-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
            >
              批量关闭
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Spin spinning={isLoading}>
            <div className="table-wrapper">
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
                          onChange={(event) => handleSelectAll(event, data)}
                      />
                      <label className="custom-control-label" htmlFor="select_all"></label>
                    </div>
                  </th>
                  {['评论类型', '头像', '昵称', '评论', '喜欢数', '不喜欢数', '状态'].map((field) => (
                      <th key={field}>{field}</th>
                  ))}

                  <th className="fixed-column">操作</th>
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
                      <td>{item.type}</td>
                      <td><img src={item.avatar} alt="Avatar" style={{ width: '50px' }} /></td>
                      <td>{item.nickname}</td>
                      <td>{item.comment}</td>
                      <td>{item.likeCount}</td>
                      <td>{item.unlikeCount}</td>
                      <StatusCell status={item.status} />
                      <td>
                        <Button type="link" danger>删除</Button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </Spin>
        </div>
          <Pagination
              totalPages={Math.ceil(totalNum / pageSize)}
              current={current}
              onPageChange={(page) => setCurrent(page)}
          />
      </div>
  );
};

export default CommentList;
