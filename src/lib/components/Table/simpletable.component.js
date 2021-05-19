import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import {
  NotificationContainer,
  // NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
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
  bulkActionsLabel: 'Apply'
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

export default function SimpleTable(props) {
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
  } = {
    ...defaults,
    ...props,
  };
  const [allSelected, setAllSelected] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedRows, setSelectedRows] = useState(
    rows.filter((row) => {
      return selectedRowItems.includes(Number(row.id));
    })
  );
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([
    ...selectedRowItems,
  ]);
  const allColumnIds = columns.map((column) => column.id);

  const onSelectHead = (isChecked) => {
    const selectedIndexes = [];
    const selectedItems = rows.filter((row) => {
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
    const selectedCount = selectedItems.filter((item) => {
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

  const RenderColumnData = ({ rowData, columnData }) => {
    try {
      const columnDisplay = columnData && columnData.render ? columnData.render(rowData) : rowData[columnData.id];
      return (
        <>
          {columnDisplay}
        </>
      )
    } catch (err) {
      return (
        <>
          {rowData[columnData.id]}
        </>
      )
    }

  }

  const RenderColumn = ({ columnData }) => {
    try {
      const columnDisplay = columnData && columnData.columnRender ? columnData.columnRender(columnData) : columnData.label;
      return (
        <>
          {columnDisplay}
        </>
      )
    } catch (err) {
      return (
        <>
          {columnData.label}
        </>
      )
    }

  }

  const DisplayViewComponent = ({ display, children }) => {
    return <>{display && <>{children}</>}</>;
  }

  const EmptyRecordRender = () => {
    try {
      const { emptyRender } = props;
      if (rows.length > 0) return null;

      const displayEmptyRow = emptyRender && emptyRender ? emptyRender() : <h4>{emptyMessage}</h4>;
      return (
        <>
          <div className="text-center">{displayEmptyRow}</div>
        </>
      )
    } catch (err) {
      return (
        <div className="text-center">
          <h4>{emptyMessage}</h4>
        </div>
      )
    }
  }

  return (
    <>
      <NotificationContainer />
      <div className={`table-projects table-responsive ${tableContainerClass}`}>
        {bulkActions && bulkActions.length > 0 && rows.length > 0 && (
          <>
            <div className={`mb-2 mt-2 bulk-action-apply d-flex ${dropdownContainerClass}`}>
              <select
                style={{ width: '150px' }}
                className="form-control"
                value={selectedAction}
                onBlur={() => { }}
                onChange={(e) => { setSelectedAction(e.target.value) }}
              >
                <option value="">Bulk Actions</option>
                {bulkActions.map((action, index) => (
                  <option value={index}>{action.actionTitle}</option>
                ))}
              </select>

              <Button
                className="me-2"
                onClick={() => {
                  if (!selectedRowIndexes.length || !selectedAction) {
                    swal({
                      title: selectedRowIndexes.length && !selectedAction
                        ? 'Please select atleast one action?'
                        : 'Please select atleast one record?',
                      icon: 'warning',
                      dangerMode: true,
                      buttons: true,
                      closeOnClickOutside: false,
                      allowOutsideClick: false,
                    });
                  }
                  if (!selectedRowIndexes.length || !selectedAction) return;

                  swal({
                    title: `Are you sure that you want to ${bulkActions[selectedAction].actionTitle.toLowerCase()}?`,
                    icon: "warning",
                    dangerMode: true,
                    buttons: true,
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
                          setSelectedAction('')
                        );
                      }
                    });
                }}
              >
                {bulkActionsLabel}
              </Button>
            </div>
          </>
        )}
        <table className={`table ${tableClass}`}>
          {columns && columns.length > 0 && rows.length > 0 && (
            <thead>
              <tr>
                {showCheckbox && (
                  <th>
                    <div className="form-check">
                      <Form.Check
                        id='chkAll'
                        name='chkAll'
                        type="checkbox"
                        // className="form-check-input"
                        checked={allSelected}
                        onChange={(e) => {
                          onSelectHead(e.target.checked);
                        }}
                      />
                    </div>
                  </th>
                )}
                {rows.length > 0 && columns.map((column, columnIndex) => (
                  <UserRestrictions permittedUsers={column.roleAccess || []} roleId={role || ''}>
                    <DisplayViewComponent display={column.isDisplay !== undefined ? column.isDisplay : true}>
                      <th scope="col" key={`column-${columnIndex}`}>
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
                        checked={selectedRowIndexes.includes(row.id)}
                        onChange={(e) => {
                          onSelectRow(e.target.checked, rowIndex);
                        }}
                      />
                    </div>
                  </th>
                )}
                {allColumnIds.map((rowDataId, columnIndex) => (
                  <UserRestrictions permittedUsers={columns[columnIndex].roleAccess || []} roleId={role || ''}>
                    <DisplayViewComponent display={columns[columnIndex].isDisplay !== undefined ? columns[columnIndex].isDisplay : true}>
                      <td>
                        <RenderColumnData key={rowDataId} columnData={columns[columnIndex]} rowData={row} colIdx={columnIndex} rowIdx={rowIndex} />
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
        paginationProps &&
        paginationProps.itemsPerPage < paginationProps.totalItems && (
          <Pagination {...paginationProps} />
        )}
    </>
  );
}
