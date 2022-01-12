"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.replace.js");

var _react = _interopRequireWildcard(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _reactNotifications = require("react-notifications");

require("react-notifications/lib/notifications.css");

var _sweetalert = _interopRequireDefault(require("sweetalert"));

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
  bulkActionsLabel: 'Apply',
  popupMessage: 'Are you sure that you want to {key}?'
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

const SimpleTable = props => {
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
    bulkActionsLabel,
    popupMessage
  } = _objectSpread(_objectSpread({}, defaults), props);

  const [allSelected, setAllSelected] = (0, _react.useState)(false);
  const [selectedAction, setSelectedAction] = (0, _react.useState)('');
  const [selectedRows, setSelectedRows] = (0, _react.useState)(rows.filter(row => {
    return selectedRowItems.includes(String(row.id));
  }));
  const [selectedRowIndexes, setSelectedRowIndexes] = (0, _react.useState)([...selectedRowItems]);
  const [allSelectedPages, setAllSelectedPages] = (0, _react.useState)([]);
  const allColumnIds = columns.map(column => column.id);

  const onSelectHead = async isChecked => {
    let selectedIndexes = [...selectedRowIndexes];
    setSelectedRowIndexes([]);
    let selectedItems = [...selectedRows];

    for (let i = 0, n = rows.length; i < n; i++) {
      const findRowIndex = await selectedItems.findIndex(e => e.id === rows[i].id);

      if (isChecked && findRowIndex === -1) {
        selectedItems.push(rows[i]);
        selectedIndexes.push(String(rows[i].id));
      } else if (findRowIndex > -1 && !isChecked) {
        selectedItems.splice(findRowIndex, 1);
        selectedIndexes.splice(findRowIndex, 1);
      }

      if (i + 1 === n) {
        setSelectedRows([...selectedItems]);
        setSelectedRowIndexes([...selectedIndexes]);
        setAllSelected(isChecked);
        const selectedPages = [...allSelectedPages];
        setAllSelectedPages([]);
        const currentPage = paginationProps.activePage;
        const isCurrentPageAddedAlready = await allSelectedPages.findIndex(e => e === currentPage);

        if (isChecked && isCurrentPageAddedAlready === -1) {
          selectedPages.push(currentPage);
        } else if (!isChecked && isCurrentPageAddedAlready !== -1) {
          selectedPages.splice(isCurrentPageAddedAlready, 1);
        }

        setAllSelectedPages([...selectedPages]);

        if (onSelectRowsIndexes) {
          onSelectRowsIndexes(selectedIndexes);
        }
      }
    }
  };

  const onSelectRow = async (isChecked, rowIndex) => {
    let selectedItems = [...selectedRows];
    let selectedIndexes = [...selectedRowIndexes];
    const rowId = rows[rowIndex].id;

    for (let i = 0, n = rows.length; i < n; i++) {
      if (rowId === rows[i].id) {
        const findRowIndex = await selectedItems.findIndex(e => e.id === rows[i].id);

        if (isChecked && findRowIndex === -1) {
          selectedItems.push(rows[i]);
          selectedIndexes.push(String(rows[i].id));
        } else if (findRowIndex > -1 && !isChecked) {
          selectedItems.splice(findRowIndex, 1);
          selectedIndexes.splice(findRowIndex, 1);
        }
      }

      if (i + 1 === n) {
        let selectedCount = 0;
        await rows.forEach(row => {
          if (selectedIndexes.includes(String(row.id))) {
            selectedCount += 1;
          }
        });
        setSelectedRows([...selectedItems]);
        setAllSelected(selectedCount === rows.length);
        setSelectedRowIndexes([...selectedIndexes]);
        const selectedPages = [...allSelectedPages];
        const currentPage = paginationProps.activePage;
        const isCurrentPageAddedAlready = await allSelectedPages.findIndex(e => e === currentPage);

        if (selectedCount === rows.length && isCurrentPageAddedAlready === -1) {
          selectedPages.push(currentPage);
        } else if (selectedCount !== rows.length && isCurrentPageAddedAlready !== -1) {
          selectedPages.splice(isCurrentPageAddedAlready, 1);
        }

        setAllSelectedPages([...selectedPages]);

        if (onSelectRowsIndexes) {
          onSelectRowsIndexes(selectedIndexes);
        }
      }
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
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "float-left mb-3"
      }, displayEmptyRow);
    } catch (err) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "text-center"
      }, /*#__PURE__*/_react.default.createElement("h4", null, emptyMessage));
    }
  };

  const isAllSelected = () => {
    return allSelectedPages && allSelectedPages.length > 0 && allSelectedPages.includes(paginationProps.activePage);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNotifications.NotificationContainer, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "table-projects custom-table table-responsive ".concat(tableContainerClass)
  }, bulkActions && bulkActions.length > 0 && rows.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "bulk-option mb-2 mt-2 bulk-action-apply d-flex ".concat(dropdownContainerClass)
  }, /*#__PURE__*/_react.default.createElement("select", {
    style: {
      width: '150px'
    },
    className: "form-control",
    value: selectedAction // onBlur={() => { }}
    ,
    onChange: e => {
      setSelectedAction(e.target.value);
    }
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: ""
  }, "Bulk Actions"), bulkActions.map((action, index) => /*#__PURE__*/_react.default.createElement("option", {
    key: index,
    value: index
  }, action.actionTitle))), /*#__PURE__*/_react.default.createElement(_reactBootstrap.Button, {
    className: "me-2",
    onClick: () => {
      if (!selectedRowIndexes.length || !selectedAction) {
        (0, _sweetalert.default)({
          title: selectedRowIndexes.length && !selectedAction ? 'Please select atleast one action.' : 'Please select atleast one record.',
          icon: 'error',
          dangerMode: true,
          button: 'OK',
          closeOnClickOutside: false,
          allowOutsideClick: false
        });
      }

      if (!selectedRowIndexes.length || !selectedAction) return;
      let msg = popupMessage.replace('{key}', bulkActions[selectedAction].actionTitle.toLowerCase());
      (0, _sweetalert.default)({
        title: msg,
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            closeModal: true
          },
          confirm: {
            text: "Proceed",
            value: true,
            visible: true,
            className: "",
            closeModal: true
          }
        },
        closeOnClickOutside: false,
        allowOutsideClick: false
      }).then(willAction => {
        if (willAction) {
          bulkActions[selectedAction].actionCallback(selectedRowIndexes, setAllSelected(false), setSelectedRows([]), setSelectedRowIndexes([]), setSelectedAction(''), setAllSelectedPages([]));
        }
      });
    }
  }, bulkActionsLabel)), /*#__PURE__*/_react.default.createElement("table", {
    className: "table ".concat(tableClass)
  }, columns && columns.length > 0 && /*#__PURE__*/_react.default.createElement("thead", {
    style: {
      border: '2px solid #dee2e6'
    }
  }, /*#__PURE__*/_react.default.createElement("tr", null, showCheckbox && /*#__PURE__*/_react.default.createElement("th", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/_react.default.createElement(_reactBootstrap.Form.Check, {
    id: "chkAll",
    name: "chkAll",
    type: "checkbox" // className="form-check-input"
    ,
    checked: isAllSelected(),
    onChange: e => {
      onSelectHead(e.target.checked);
    }
  }))), columns.length > 0 && columns.map((column, columnIndex) => /*#__PURE__*/_react.default.createElement(_userrestrictions.default, {
    permittedUsers: column.roleAccess || [],
    roleId: role || ''
  }, /*#__PURE__*/_react.default.createElement(DisplayViewComponent, {
    display: column.isDisplay !== undefined ? column.isDisplay : true
  }, /*#__PURE__*/_react.default.createElement("th", {
    scope: "col",
    key: "column-".concat(columnIndex),
    className: "text-nowrap"
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
    checked: selectedRowIndexes.includes(String(row.id)),
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
  }))))))))), /*#__PURE__*/_react.default.createElement(EmptyRecordRender, null)), showPagination && rows.length > 0 && paginationProps && paginationProps.itemsPerPage < paginationProps.totalItems && /*#__PURE__*/_react.default.createElement(_pagination.default, paginationProps));
};

var _default = SimpleTable;
exports.default = _default;