import "./App.css";
import SimpleTable from "./lib/components/Table/simpletable.component";

function App() {
  return (
    <div className="App">
      <h1>React Datatable demo</h1>
      <div className="container">
        <section className="content-area">
          <SimpleTable
            role={1}
            columns={[
              {
                id: "id",
                label: "Id",
                roleAccess: [1],
                isDisplay: true,
                columnRender: (col) => (
                  <span style={{ fontWeight: "bold" }}>{col.label}</span>
                ),
                render: (row) => {
                  return <b>{row.name}</b>;
                },
              },
              { id: "name", label: "Name", roleAccess: [1], classes: "bgGray" },
              { id: "email", label: "Email", roleAccess: [3] },
            ]}
            rows={[
              {
                id: 1,
                name: "Sample name",
                email: "john.doe@example.com",
                rowClass: "bgred",
              },
              { id: 2, name: "Sample name", email: "john.doe@example.com" },
              { id: 3, name: "Sample name", email: "john.doe@example.com" },
              { id: 4, name: "Sample name", email: "john.doe@example.com" },
              { id: 5, name: "Sample name", email: "john.doe@example.com" },
              { id: 6, name: "Sample name", email: "john.doe@example.com" },
              { id: 7, name: "Sample name", email: "john.doe@example.com" },
              { id: 8, name: "Sample name", email: "john.doe@example.com" },
              { id: 9, name: "Sample name", email: "john.doe@example.com" },
              { id: 10, name: "Sample name", email: "john.doe@example.com" },
            ]}
            tableClass="table-striped"
            bulkActions={[
              {
                actionTitle: "Change Status",
                actionCallback: (e) => {
                  console.log(e);
                },
              },
              {
                actionTitle: "Delete",
                actionCallback: (e) => {
                  console.log(e);
                },
              },
            ]}
            showCheckbox
            showPagination
            popupMessage="Are you sure, you want to {key} this record?"
            paginationProps={{
              totalItems: 10,
              itemsPerPage: 2,
              hideDisabled: true,
              firstPageText: "<<",
              lastPageText: ">>",
              hideFirstLastPages: false,
              pageRangeDisplayed: 5,
              hideNavigation: false,
              onPageChange: (page) => {
                console.log(page);
              },
            }}
            selectedRowItems={[4]}
            onSelectRowsIndexes={(indexes) => {
              console.log("indexes", indexes); // eslint-disable-line
            }}
            emptyRender={() => <h4>Data not exist</h4>}
            bulkActionsLabel="Apply"
          />
        </section>
      </div>
    </div>
  );
}

export default App;
