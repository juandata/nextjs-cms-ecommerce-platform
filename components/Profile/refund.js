import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { dateFormat } from "~/lib/clientFunctions";
import { useTranslation } from "react-i18next";
import PageLoader from "../Ui/pageLoader";
import Card from "../Ui/Card";
import GlobalModal from "../Ui/Modal/modal";
import Table from "../Table";
import { Eye } from "@styled-icons/bootstrap";

const Refund = ({ id }) => {
  const settings = useSelector((state) => state.settings);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({});
  const [showReason, setShowReason] = useState(null);
  const updateRef = useRef();

  const columns = [
    {
      name: t("tracking_number"),
      selector: (row) => row.orderId,
      grow: 1,
    },
    {
      name: t("date"),
      selector: (row) => dateFormat(row.date),
      sortable: true,
    },
    {
      name: t("Product"),
      selector: (row) => row.product.name,
      sortable: true,
    },
    {
      name: t("amount"),
      selector: (row) =>
        `${settings.settingsData?.currency?.symbol}${row.refundAmount.toFixed(
          2
        )}`,
    },
    {
      name: t("Status"),
      selector: (row) => (
        <>
          <span
            className={`badge rounded-pill fs-6 ${
              row.status === "Pending"
                ? "bg-primary"
                : row.status === "Approved"
                ? "bg-success"
                : "bg-danger"
            }`}
          >
            {row.status}
          </span>
          {row.status !== "Pending" && row.note && (
            <div
              className="btn btn-sm m-2 btn-info rounded-pill"
              title="Note"
              onClick={() => setShowReason(row.note)}
            >
              <Eye width={20} height={20} />
            </div>
          )}
        </>
      ),
      sortable: true,
    },
  ];

  return (
    <PageLoader
      url={`/api/profile?id=${id}&scope=refund`}
      setData={setData}
      ref={updateRef}
    >
      <Card title={t("Refund request")}>
        <Table
          columns={columns}
          data={data.user?.refundRequest || []}
          searchKey={"orderId"}
          searchPlaceholder={"Tracking Number"}
        />
      </Card>
      <GlobalModal
        isOpen={showReason ? true : false}
        small
        handleCloseModal={() => setShowReason(null)}
      >
        <div className="p-2">
          <p>{showReason}</p>
        </div>
      </GlobalModal>
    </PageLoader>
  );
};

export default Refund;
