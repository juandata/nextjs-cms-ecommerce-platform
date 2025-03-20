import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData, updateData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const SubcategoryTable = (props) => {
  const url = `/api/categories`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const [childcategoryList, setChildcategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState({});
  const inputValue = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.category) {
      const subList = [];
      data.category.forEach((category) =>
        category.subCategories.forEach((sub) => {
          sub.child.forEach((child) => {
            child.categoryId = category._id;
            child.category = category.name;
            child.subcategoryId = sub._id;
            child.subcategory = sub.name;
            subList.push(child);
          });
        })
      );
      setChildcategoryList(subList);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "category"));
  }, [session]);

  const openModal = (categoryid, subcategoryId, slug, name, action) => {
    setSelectedSub({ categoryid, subcategoryId, slug, name, action });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(
      `/api/categories/childcategories?categoryId=${selectedSub.categoryid}&subcategoryId=${selectedSub.subcategoryId}&slug=${selectedSub.slug}`
    )
      .then((data) =>
        data.success
          ? (toast.success("Child Category Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const updateProduct = async () => {
    try {
      const bodyData = JSON.stringify({
        categoryId: selectedSub.categoryid,
        subcategoryId: selectedSub.subcategoryId,
        name: selectedSub.name,
        slug: selectedSub.slug,
        update: inputValue.current.value,
      });
      const data = new FormData();
      data.append("data", bodyData);
      const response = await updateData(
        "/api/categories/childcategories",
        data
      );
      response.success
        ? (toast.success("Subcategory Updated Successfully"), mutate())
        : toast.error("Something Went Wrong");
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = childcategoryList.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("slug"),
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: t("Parent Category"),
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: t("Subcategory"),
      selector: (row) => row.subcategory,
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div
              className={classes.button}
              onClick={() =>
                openModal(
                  row.categoryId,
                  row.subcategoryId,
                  row.slug,
                  row.name,
                  "delete"
                )
              }
            >
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.edit && (
            <div
              className={classes.button}
              onClick={() =>
                openModal(
                  row.categoryId,
                  row.subcategoryId,
                  row.slug,
                  row.name,
                  "edit"
                )
              }
            >
              <PencilSquare width={22} height={22} title="EDIT" />
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className={classes.container}>
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
      )}
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        {selectedSub.action === "delete" ? (
          <div className={classes.modal_icon}>
            <Trash width={70} height={70} />
            <p>Are you sure, you want to delete?</p>
            <div>
              <button
                className={classes.danger_button}
                onClick={() => deleteProduct()}
              >
                Delete
              </button>
              <button
                className={classes.success_button}
                onClick={() => closeModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-5">
              <label htmlFor="inp-1" className="form-label">
                Subcategory Name*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={inputValue}
                className="form-control"
                defaultValue={selectedSub.name}
                required
              />
            </div>
            <div className="text-center">
              <button
                className={classes.danger_button}
                onClick={() => updateProduct()}
              >
                Update
              </button>
              <button
                className={classes.success_button}
                onClick={() => closeModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </GlobalModal>
    </>
  );
};

SubcategoryTable.requireAuthAdmin = true;
SubcategoryTable.dashboard = true;

export default SubcategoryTable;
