"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SimpleTable;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.includes.js");

var _react = _interopRequireWildcard(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _sweetalert = _interopRequireDefault(require("sweetalert"));

var _reactNotifications = require("react-notifications");

require("react-notifications/lib/notifications.css");

var _pagination = _interopRequireDefault(require("../Pagination/pagination.component"));

var _userrestrictions = _interopRequireDefault(require("../UserRestrictions/userrestrictions.component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaults = {
  columns: [],
  rows: [],
  showCheckbox: false,
  tableClass: '',
  tableContainerClass: '',
  paginationProps: {},
  showPagination: false,
  dropdownContainerClass: '',
  bulkActions: [],
  selectedRowItems: [],
  role: '',
  emptyMessage: 'No record found.',
  bulkActionsLabel: 'Apply'
}; // Columns structure
// [{id: 'id', label: 'Id', roleAccess: [1], isDisplay: true, columnRender: (col => (<span style={{ fontWeight: 'bold' }}>{col.label}</span>)), render: (row) => { return (<b>{row.id}</b>) }},{id: 'name', label: 'Name'}{id: 'email', label: 'Email'}]
// Rows structure
// [{id: 1, name: 'Sample name', email: 'john.doe@example.com'}]
// Bulk action structure
// [
//   {
//     actionTitle: 'Delete',
//     actionCallback: () => { } // return selected array of ids
//   }
// ]
// Empty Row alter strcuture and data
// emptyRender={() => 'Data not exist'}
// emptyRender={() => <b>Data not exist</b>}
// Role based Datatable
// role = {1} i.e single role id
// Role based column based on datatable main role
// roleAccess: [1] 
// Add role access key to column to hide or show specific column based on role
// Keep empty to show column to all user

function SimpleTable(props) {
  const {
    columns,
    rows,
    showCheckbox,
    onSelectRowsIndexes,
    tableClass,
    tableContainerClass,
    paginationProps,
    showPagination,
    dropdownContainerClass,
    bulkActions,
    selectedRowItems,
    role,
    emptyMessage,
    bulkActionsLabel
  } = _objectSpread(_objectSpread({}, defaults), props);

  const [allSelected, setAllSelected] = (0, _react.useState)(false);
  const [selectedAction, setSelectedAction] = (0, _react.useState)('');
  const [selectedRows, setSelectedRows] = (0, _react.useState)(rows.filter(row => {
    return selectedRowItems.includes(Number(row.id));
  }));
  const [selectedRowIndexes, setSelectedRowIndexes] = (0, _react.useState)([...selectedRowItems]);
  const allColumnIds = columns.map(column => column.id);

  const onSelectHead = isChecked => {
    const selectedIndexes = [];
    const selectedItems = rows.filter(row => {
      // eslint-disable-line
      if (isChecked) selectedIndexes.push(Number(row.id));
      return isChecked;
    });
    setSelectedRows([...selectedItems]);
    setSelectedRowIndexes([...selectedIndexes]);
    setAllSelected(isChecked);

    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  const onSelectRow = (isChecked, rowIndex) => {
    let selectedItems = [...selectedRows];
    const selectedIndexes = [];

    if (isChecked) {
      selectedItems.push(rows[rowIndex]);
    } else {
      selectedItems = selectedItems.filter(j => Number(j.id) !== Number(rows[rowIndex].id));
    }

    const selectedCount = selectedItems.filter(item => {
      selectedIndexes.push(Number(item.id));
      return item;
    }).length;
    setSelectedRows(selectedItems);
    setAllSelected(selectedCount === rows.length);
    setSelectedRowIndexes([...selectedIndexes]);

    if (onSelectRowsIndexes) {
      onSelectRowsIndexes(selectedIndexes);
    }
  };

  const RenderColumnData = _ref => {
    let {
      rowData,
      columnData
    } = _ref;

    try {
      const columnDisplay = columnData && columnData.render ? columnData.render(rowData) : rowData[columnData.id];
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, columnDisplay);
    } catch (err) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, rowData[columnData.id]);
    }
  };

  const RenderColumn = _ref2 => {
    let {
      columnData
    } = _ref2;

    try {
      const columnDisplay = columnData && columnData.columnRender ? columnData.columnRender(columnData) : columnData.label;
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, columnDisplay);
    } catch (err) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, columnData.label);
    }
  };

  const DisplayViewComponent = _ref3 => {
    let {
      display,
      children
    } = _ref3;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, display && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, children));
  };

  const EmptyRecordRender = () => {
    try {
      const {
        emptyRender
      } = props;
      if (rows.length > 0) return null;
      const displayEmptyRow = emptyRender && emptyRender ? emptyRender() : /*#__PURE__*/_react.default.createElement("h4", null, emptyMessage);
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        className: "text-center"
      }, displayEmptyRow));
    } catch (err) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "text-center"
      }, /*#__PURE__*/_react.default.createElement("h4", null, emptyMessage));
    }
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNotifications.NotificationContainer, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "table-projects table-responsive ".concat(tableContainerClass)
  }, bulkActions && bulkActions.length > 0 && rows.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "mb-2 mt-2 bulk-action-apply d-flex ".concat(dropdownContainerClass)
  }, /*#__PURE__*/_react.default.createElement("select", {
    style: {
      width: '150px'
    },
    className: "form-control",
    value: selectedAction,
    onBlur: () => {},
    onChange: e => {
      setSelectedAction(e.target.value);
    }
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: ""
  }, "Bulk Actions"), bulkActions.map((action, index) => /*#__PURE__*/_react.default.createElement("option", {
    value: index
  }, action.actionTitle))), /*#__PURE__*/_react.default.createElement(_reactBootstrap.Button, {
    className: "me-2",
    onClick: () => {
      if (!selectedRowIndexes.length || !selectedAction) {
        (0, _sweetalert.default)({
          title: selectedRowIndexes.length && !selectedAction ? 'Please select atleast one action?' : 'Please select atleast one record?',
          icon: 'warning',
          dangerMode: true,
          buttons: true,
          closeOnClickOutside: false,
          allowOutsideClick: false
        });
      }

      if (!selectedRowIndexes.length || !selectedAction) return;
      (0, _sweetalert.default)({
        title: "Are you sure that you want to ".concat(bulkActions[selectedAction].actionTitle.toLowerCase(), "?"),
        icon: "warning",
        dangerMode: true,
        buttons: true,
        closeOnClickOutside: false,
        allowOutsideClick: false
      }).then(willAction => {
        if (willAction) {
          bulkActions[selectedAction].actionCallback(selectedRowIndexes, setAllSelected(false), setSelectedRows([]), setSelectedRowIndexes([]), setSelectedAction(''));
        }
      });
    }
  }, bulkActionsLabel))), /*#__PURE__*/_react.default.createElement("table", {
    className: "table ".concat(tableClass)
  }, columns && columns.length > 0 && rows.length > 0 && /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, showCheckbox && /*#__PURE__*/_react.default.createElement("th", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/_react.default.createElement(_reactBootstrap.Form.Check, {
    id: "chkAll",
    name: "chkAll",
    type: "checkbox" // className="form-check-input"
    ,
    checked: allSelected,
    onChange: e => {
      onSelectHead(e.target.checked);
    }
  }))), rows.length > 0 && columns.map((column, columnIndex) => /*#__PURE__*/_react.default.createElement(_userrestrictions.default, {
    permittedUsers: column.roleAccess || [],
    roleId: role || ''
  }, /*#__PURE__*/_react.default.createElement(DisplayViewComponent, {
    display: column.isDisplay !== undefined ? column.isDisplay : true
  }, /*#__PURE__*/_react.default.createElement("th", {
    scope: "col",
    key: "column-".concat(columnIndex)
  }, /*#__PURE__*/_react.default.createElement(RenderColumn, {
    columnData: column,
    key: columnIndex
  }))))))), /*#__PURE__*/_react.default.createElement("tbody", null, rows.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement("tr", {
    key: "row-".concat(rowIndex)
  }, showCheckbox && /*#__PURE__*/_react.default.createElement("th", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/_react.default.createElement(_reactBootstrap.Form.Check, {
    // className="form-check-input"
    id: "chk".concat(row.id),
    name: "chk".concat(row.id),
    value: row.id,
    type: "checkbox",
    checked: selectedRowIndexes.includes(row.id),
    onChange: e => {
      onSelectRow(e.target.checked, rowIndex);
    }
  }))), allColumnIds.map((rowDataId, columnIndex) => /*#__PURE__*/_react.default.createElement(_userrestrictions.default, {
    permittedUsers: columns[columnIndex].roleAccess || [],
    roleId: role || ''
  }, /*#__PURE__*/_react.default.createElement(DisplayViewComponent, {
    display: columns[columnIndex].isDisplay !== undefined ? columns[columnIndex].isDisplay : true
  }, /*#__PURE__*/_react.default.createElement("td", null, /*#__PURE__*/_react.default.createElement(RenderColumnData, {
    key: rowDataId,
    columnData: columns[columnIndex],
    rowData: row,
    colIdx: columnIndex,
    rowIdx: rowIndex
  }))))))))), /*#__PURE__*/_react.default.createElement(EmptyRecordRender, null)), showPagination && paginationProps && paginationProps.itemsPerPage < paginationProps.totalItems && /*#__PURE__*/_react.default.createElement(_pagination.default, paginationProps));
}