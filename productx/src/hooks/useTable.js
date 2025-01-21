import React, { useEffect, useState } from 'react';

export function useAntdTable(params) {
  const { fetchData, otherParams, pagination = { current: 1, pageSize: 30 } } = params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination,
  });

  let _otherParams = otherParams;
  if (typeof otherParams === 'function') {
    _otherParams = otherParams();
  }

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        tableParams,
        otherParams: _otherParams,
      });
      setData(res.data);
      setTableParams({
        ...tableParams,
        pagination: { ...pagination, total: res.total },
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [JSON.stringify(tableParams), JSON.stringify(_otherParams)]);

  const onTableChange = (_pagination, filters, sorter) => {
    setTableParams({
      pagination,
      // @ts-ignore
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
    if (_pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const setPagination = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, ...pagination },
    });
  };

  return [loading, data, onTableChange, tableParams.pagination, setPagination];
}
