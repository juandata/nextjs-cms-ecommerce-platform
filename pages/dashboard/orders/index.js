/* eslint-disable react-hooks/exhaustive-deps */
import { Eye, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/tableFilter/table.module.css";
import {
  cpf,
  dateFormat,
  deleteData,
  fetchData,
  updateData,
} from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Link = dynamic(() => import("next/link"));

const OrderPage = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const { t } = useTranslation();

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "order"));
  }, [session]);

  const openModal = (id) => {
    setSelectedOrder(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const mutate = async () => await fetchServerData(currentPage, 10);

  const deleteOrder = async () => {
    setIsOpen(false);
    await deleteData(`/api/order?id=${selectedOrder}`)
      .then((data) =>
        data.success
          ? (toast.success("Order Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const handlePaymentStatus = async (e, orderStatus, id) => {
    const url = `/api/order/${id}?payment_status=${e.target.value}&order_status=${orderStatus}&action=payment`;
    await updateData(url)
      .then((data) =>
        data.success
          ? (toast.success("Order Payment Status Updated Successfully"),
            mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const handleOrderStatus = async (e, paymentStatus, id) => {
    const url = `/api/order/${id}?payment_status=${paymentStatus}&order_status=${e.target.value}&action=order`;
    await updateData(url)
      .then((data) =>
        data.success
          ? (toast.success("Order Status Updated Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const fetchServerData = async (page, rowsPerPage) => {
    try {
      setLoading(true);

      // Fetch data from the server based on the current page and rowsPerPage
      const response = await fetchData(
        `/api/order?pageSize=${rowsPerPage}&pageNumber=${page}&queryText=${filterText}`
      );
      if (response.success) {
        setOrderList(response.order);
        setTotalRows(response.total);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerData(1, 10);
  }, []);

  useEffect(() => {
    fetchServerData(currentPage, 10);
  }, [currentPage, filterText]);

  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

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
        placeholder={t("tracking_number")}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: t("tracking_number"),
      selector: (row) => (
        <>
          {row.orderId}
          {row.new && (
            <span className="badge rounded-pill bg-primary ms-1">NEW</span>
          )}
        </>
      ),
      minWidth: "215px",
    },
    {
      name: t("order_date"),
      selector: (row) => dateFormat(row.orderDate),
      sortable: true,
      wrap: true,
    },
    {
      name: t("amount"),
      selector: (row) => currencySymbol + decimalBalance(row.payAmount),
      sortable: true,
    },
    {
      name: t("payment_status"),
      selector: (row) =>
        permissions.edit ? (
          <div className="dropdown">
            <select
              defaultValue={row.paymentStatus}
              key={row.paymentStatus}
              onChange={(e) => handlePaymentStatus(e, row.status, row._id)}
              disabled={row.paymentStatus === "Paid" ? true : false}
              className="form-select form-select-sm"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        ) : (
          row.paymentStatus.toUpperCase()
        ),
    },
    {
      name: t("delivery_status"),
      selector: (row) =>
        permissions.edit ? (
          <div className="dropdown">
            <select
              defaultValue={row.status}
              key={row.status}
              onChange={(e) => handleOrderStatus(e, row.paymentStatus, row._id)}
              // disabled={row.status === "Delivered" ? true : false}
              className="form-select form-select-sm"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Packaged">Packaged</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
              <option value="Draft" disabled hidden>
                Failed
              </option>
            </select>
          </div>
        ) : (
          row.status.toUpperCase()
        ),
      minWidth: "130px",
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div className={classes.button} onClick={() => openModal(row._id)}>
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.view && (
            <Link href={`/dashboard/orders/${row._id}`}>
              <div className={classes.button}>
                <Eye width={22} height={22} title="VIEW" />
              </div>
            </Link>
          )}
        </div>
      ),
      minWidth: "140px",
    },
  ];

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h4 className="text-center pt-3 pb-5">{t("orders")}</h4>
      <div className={classes.container}>
        <DataTable
          columns={columns}
          data={orderList}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          customStyles={customStyles}
          paginationTotalRows={totalRows}
          paginationServer
          onChangePage={handlePageChange}
          progressPending={loading}
          paginationRowsPerPageOptions={[10]}
        />
        <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
          <div className={classes.modal_icon}>
            <Trash width={90} height={90} />
            <p>Are you sure, you want to delete?</p>
            <div>
              <button
                className={classes.danger_button}
                onClick={() => deleteOrder()}
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
        </GlobalModal>
      </div>
    </div>
  );
};

OrderPage.requireAuthAdmin = true;
OrderPage.dashboard = true;

export default OrderPage;
