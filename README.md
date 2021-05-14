# Custom Datatable

**Customizable datatable for react**


Create customizable datatable


## Installation

Install custom-bottom-tab-bar

```
npm i stark-custom-datatable
```


## Usage

Import this component in page where you want to display table content.

```
import CustomTable from 'stark-custom-datatable';
```


Use this in your page


```
import CustomTable from "stark-custom-datatable";

// some code

const rowData = [
    { id: 1, name: 'Sample name', email: 'john.doe@example.com' },
    { id: 2, name: 'Sample name', email: 'john.doe@example.com' },
    { id: 3, name: 'Sample name', email: 'john.doe@example.com' },
    { id: 4, name: 'Sample name', email: 'john.doe@example.com' },
  ]

// some code

render() {
    return (
        <>
        <CustomTable
        // role (optional:number) : Current user role for role wise column show
        role={1}
        // columns (required:array) : dispay column , id and label compulsory and one row column with 'id' key required  
        columns={[
          { id: 'id', label: 'Id', roleAccess: [1], isDisplay: true, columnRender: (col => (<span style={{ fontWeight: 'bold' }}>{col.label}</span>)), render: (row) => { return (<b>{row.name}</b>) } },
          { id: 'name', label: 'Name', roleAccess: [1] },
          { id: 'email', label: 'Email', roleAccess: [3] },
        ]}
        // rows (required:array) : display row data of column
        rows={rowData}
        // tableClass (optional:String) : to override class of the table
        tableClass="table-striped"
        // tableContainerClass (optional:String) : to override class of the table wrapper
        tableContainerClass=""
        // dropdownContainerClass (optional:String) : to override class of the dropdown wrapper
        dropdownContainerClass=""
        // bulkActions (optional:array) : to add action on table
        bulkActions={[
          {
            actionTitle: 'Change Status',
            actionCallback: (e) => { console.log(e) },
          },
          {
            actionTitle: 'Delete',
            actionCallback: (e) => { console.log(e) },
          }
        ]}
        // showCheckbox (optional:boolean) : to show checkbox as first column
        showCheckbox={true}
        // showPagination (optional:boolean) : to show pagination of table
        showPagination={true}
        // paginationProps (optional:Object) : to display page number based on this props
        paginationProps={{
          totalCount: 5,
          itemsPerPage: 5,
        }}
        // selectedRowItems (optional:array) : to show selected row in table
        selectedRowItems={[4]}
        // onSelectRowsIndexes (optional:callback) : callback to get selected row ids
        onSelectRowsIndexes={(indexes) => {
          console.log('indexes', indexes); // eslint-disable-line
        }}
        // emptyRender (optional:callback) : callback to override empty table caption
        emptyRender={() => <h4>Data not exist</h4>}
        // emptyRender (optional:String) : override label of action button
        bulkActionsLabel="Apply"
      />
        </>
    )
}

```


### dependencies package

* react-boostrap
* boostrap
* react-js-pagination
* react-notifications
* sweetalert

