import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import FilterComponent from "./filter";

const DataTable = dynamic(() => import("react-data-table-component"));

export default function Table({
  data,
  columns,
  searchKey,
  searchPlaceholder,
  buttons,
}) {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = searchKey
    ? data.filter(
        (item) =>
          item[searchKey] &&
          item[searchKey]
            .toString()
            .toLowerCase()
            .includes(filterText.toLowerCase())
      )
    : data;
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    if (!searchKey) {
      return null;
    }
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e)}
        onClear={handleClear}
        filterText={filterText}
        placeholder={searchPlaceholder}
        buttons={buttons}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "70px",
        fontSize: "14px",
        fontWeight: 500,
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: 600,
      },
    },
  };

  return (
    <div className="cs_table">
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        customStyles={customStyles}
      />
    </div>
  );
}
