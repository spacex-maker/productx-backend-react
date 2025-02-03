import { useState } from 'react';

/**
 * 可选择行的自定义Hook
 * 提供表格多选功能的状态管理和处理方法
 * 
 * @param {string} idField - 用作唯一标识符的字段名，默认为'id'
 *                          例如：'id'用于大多数表格，'userId'用于用户相关表格
 * 
 * @returns {Object} 返回选择状态和处理方法
 * @property {string[]} selectedRows - 已选择行的id数组
 * @property {boolean} selectAll - 是否全选状态
 * @property {Function} handleSelectAll - 处理全选/取消全选的方法
 * @property {Function} handleSelectRow - 处理单行选择的方法
 * @property {Function} resetSelection - 重置选择状态的方法
 */
export const UseSelectableRows = (idField = 'id') => {
  // 存储选中行的id数组
  const [selectedRows, setSelectedRows] = useState([]);
  // 全选状态标志
  const [selectAll, setSelectAll] = useState(false);

  /**
   * 处理全选/取消全选
   * @param {Event} event - 复选框change事件
   * @param {Array} data - 表格数据数组
   * 
   * 当点击全选时：
   * 1. 更新全选状态
   * 2. 如果是选中，则将所有行的id添加到selectedRows
   * 3. 如果是取消选中，则清空selectedRows
   */
  const handleSelectAll = (event, data) => {
    const checked = typeof event === 'boolean' ? event : event.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? (data ? data.map((item) => item[idField]) : []) : []);
  };

  /**
   * 处理单行选择
   * @param {string|number} id - 当前行的唯一标识符
   * @param {Array} data - 表格数据数组
   * 
   * 当点击单行时：
   * 1. 如果该行已选中，则从selectedRows中移除
   * 2. 如果该行未选中，则添加到selectedRows
   * 3. 根据选中行数是否等于总行数，更新全选状态
   */
  const handleSelectRow = (id, data) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)  // 如果已选中，则移除
      : [...selectedRows, id];                        // 如果未选中，则添加

    setSelectedRows(newSelectedRows);
    // 更新全选状态：当选中的行数等于总行数时，设置为全选
    if (data) {
      setSelectAll(newSelectedRows.length === data.length);
    }
  };

  /**
   * 重置选择状态
   * 清空所有选中的行并取消全选状态
   * 通常在表格数据更新、切换页面等情况下使用
   */
  const resetSelection = () => {
    setSelectedRows([]);
    setSelectAll(false);
  };

  // 返回所有需要的状态和方法
  return {
    selectedRows,    // 当前选中的行id数组
    selectAll,       // 当前是否全选
    handleSelectAll, // 全选处理方法
    handleSelectRow, // 单行选择处理方法
    resetSelection,  // 重置选择状态的方法
  };
};
