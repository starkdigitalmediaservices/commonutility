import logo from './logo.svg';
import './App.css';
import SimpleTable from './components/Table/simpletable.component';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <SimpleTable
        role={1}
        columns={[
          { id: 'id', label: 'Id', roleAccess: [1], isDisplay: true, columnRender: (col => (<span style={{ fontWeight: 'bold' }}>{col.label}</span>)), render: (row) => { return (<b>{row.name}</b>) } },
          { id: 'name', label: 'Name', roleAccess: [1] },
          { id: 'email', label: 'Email', roleAccess: [3] },
        ]}
        rows={[
          { id: 1, name: 'Sample name', email: 'john.doe@example.com' },
          { id: 2, name: 'Sample name', email: 'john.doe@example.com' },
          { id: 3, name: 'Sample name', email: 'john.doe@example.com' },
          { id: 4, name: 'Sample name', email: 'john.doe@example.com' },
        ]}
        tableClass="table-striped"
        showCheckbox
        showPagination
        paginationProps={{
          totalCount: 5,
          itemsPerPage: 5,
        }}
        selectedRowItems={[4]}
        onSelectRowsIndexes={(indexes) => {
          console.log('indexes', indexes); // eslint-disable-line
        }}
        emptyRender={() => <h4>Data not exist</h4>}
        bulkActionsLabel="Apply"
      />
    </div>
  );
}

export default App;
