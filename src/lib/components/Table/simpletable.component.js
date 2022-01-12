import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  NotificationContainer
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import swal from 'sweetalert';
import Pagination from '../Pagination/pagination.component';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';

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
};

// Columns structure
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

const SimpleTable = (props) => {
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
  } = {
    ...defaults,
    ...props,
  };

  const [allSelected, setAllSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedRows, setSelectedRows] = useState(
    rows.filter((row) => {
      return selectedRowItems.includes(String(row.id));
    })
  );
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([
    ...selectedRowItems,
  ]);
  const [allSelectedPages, setAllSelectedPages] = useState([]);
  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = async (isChecked) => {
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
        await rows.forEach((row) => {
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

  const RenderColumnData = ({ rowData, columnData }) => {
    try {
      const columnDisplay =
        columnData && columnData.render
          ? columnData.render(rowData)
          : rowData[columnData.id];
      return <>{columnDisplay}</>;
    } catch (err) {
      return <>{rowData[columnData.id]}</>;
    }
  };

  const RenderColumn = ({ columnData }) => {
    try {
      const columnDisplay =
        columnData && columnData.columnRender
          ? columnData.columnRender(columnData)
          : columnData.label;
      return <>{columnDisplay}</>;
    } catch (err) {
      return <>{columnData.label}</>;
    }
  };

  const DisplayViewComponent = ({ display, children }) => {
    return <>{display && <>{children}</>}</>;
  };

  const EmptyRecordRender = () => {
    try {
      const { emptyRender } = props;
      if (rows.length > 0) return null;

      const displayEmptyRow =
        emptyRender && emptyRender ? emptyRender() : <h4>{emptyMessage}</h4>;
      return <div className="float-left mb-3">{displayEmptyRow}</div>;
    } catch (err) {
      return (
        <div className="text-center">
          <h4>{emptyMessage}</h4>
        </div>
      );
    }
  };

  const isAllSelected = () => {
    return allSelectedPages && allSelectedPages.length > 0 && allSelectedPages.includes(paginationProps.activePage);
  }

  return (
    <>
      <NotificationContainer />
      <div className={`table-projects custom-table table-responsive ${tableContainerClass}`}>
        {bulkActions && bulkActions.length > 0 && rows.length > 0 && (
          <div
            className={`bulk-option mb-2 mt-2 bulk-action-apply d-flex ${dropdownContainerClass}`}
          >
            <select
              style={{ width: '150px' }}
              className="form-control"
              value={selectedAction}
              // onBlur={() => { }}
              onChange={(e) => {
                setSelectedAction(e.target.value);
              }}
            >
              <option value="">Bulk Actions</option>
              {bulkActions.map((action, index) => (
                <option key={index} value={index}>
                  {action.actionTitle}
                </option>
              ))}
            </select>

            <Button
              className="me-2"
              onClick={() => {
                if (!selectedRowIndexes.length || !selectedAction) {
                  swal({
                    title: selectedRowIndexes.length && !selectedAction
                      ? 'Please select atleast one action.'
                      : 'Please select atleast one record.',
                    icon: 'error',
                    dangerMode: true,
                    button: 'OK',
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                  });
                }
                if (!selectedRowIndexes.length || !selectedAction) return;
                let msg = popupMessage.replace('{key}', bulkActions[selectedAction].actionTitle.toLowerCase())
                swal({

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
                  allowOutsideClick: false,
                })
                  .then(willAction => {
                    if (willAction) {
                      bulkActions[selectedAction].actionCallback(
                        selectedRowIndexes,
                        setAllSelected(false),
                        setSelectedRows([]),
                        setSelectedRowIndexes([]),
                        setSelectedAction(''),
                        setAllSelectedPages([]),
                      );
                    }
                  });
              }}
            >
              {bulkActionsLabel}
            </Button>
          </div>
        )}
        <table className={`table ${tableClass}`}>
          {columns && columns.length > 0 && (
            <thead style={{ border: '2px solid #dee2e6' }}>
              <tr>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        id="chkAll"
                        name="chkAll"
                        type="checkbox"
                        // className="form-check-input"
                        checked={isAllSelected()}
                        onChange={(e) => {
                          onSelectHead(e.target.checked);
                        }}
                      />
                    </div>
                  </th>
                )}
                {columns.length > 0 &&
                  columns.map((column, columnIndex) => (
                    <UserRestrictions
                      permittedUsers={column.roleAccess || []}
                      roleId={role || ''}
                    >
                      <DisplayViewComponent
                        display={
                          column.isDisplay !== undefined
                            ? column.isDisplay
                            : true
                        }
                      >
                        <th
                          scope="col"
                          key={`column-${columnIndex}`}
                          className="text-nowrap"
                        >
                          <RenderColumn columnData={column} key={columnIndex} />
                        </th>
                      </DisplayViewComponent>
                    </UserRestrictions>
                  ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        // className="form-check-input"
                        id={`chk${row.id}`}
                        name={`chk${row.id}`}
                        value={row.id}
                        type="checkbox"
                        checked={selectedRowIndexes.includes(String(row.id))}
                        onChange={(e) => {
                          onSelectRow(e.target.checked, rowIndex);
                        }}
                      />
                    </div>
                  </th>
                )}
                {allColumnIds.map((rowDataId, columnIndex) => (
                  <UserRestrictions
                    permittedUsers={columns[columnIndex].roleAccess || []}
                    roleId={role || ''}
                  >
                    <DisplayViewComponent
                      display={
                        columns[columnIndex].isDisplay !== undefined
                          ? columns[columnIndex].isDisplay
                          : true
                      }
                    >
                      <td>
                        <RenderColumnData
                          key={rowDataId}
                          columnData={columns[columnIndex]}
                          rowData={row}
                          colIdx={columnIndex}
                          rowIdx={rowIndex}
                        />
                      </td>
                    </DisplayViewComponent>
                  </UserRestrictions>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <EmptyRecordRender />
      </div>
      {showPagination &&
        rows.length > 0 &&
        paginationProps &&
        paginationProps.itemsPerPage < paginationProps.totalItems && (
          <Pagination {...paginationProps} />
        )}
    </>
  );
}

export default SimpleTable;