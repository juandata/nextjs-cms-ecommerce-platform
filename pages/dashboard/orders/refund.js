import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Table from "~/components/Table";
import PageLoader from "~/components/Ui/pageLoader";
import { cpf, dateFormat, updateData } from "~/lib/clientFunctions";
import ImageLoader from "~/components/Image";
import GlobalModal from "~/components/Ui/Modal/modal";
import { toast } from "react-toastify";
import Card from "~/components/Ui/Card";
import { Eye } from "@styled-icons/bootstrap";

export default function RefundRequest() {
  const [data, setData] = useState({ data: [] });
  const [permissions, setPermissions] = useState({});
  const [showDetails, setShowDetails] = useState({});
  const [showReason, setShowReason] = useState(null);
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const { session } = useSelector((state) => state.localSession);
  const update = useRef(null);
  const note = useRef(null);

  useEffect(() => {
    setPermissions(cpf(session, "order"));
  }, [session]);

  const columns = [
    {
      name: t("order id"),
      selector: (row) => row.orderId,
    },
    {
      name: t("date"),
      selector: (row) => dateFormat(row.date),
      sortable: true,
      wrap: true,
    },
    {
      name: t("user"),
      selector: (row) => row.userId?.name,
    },
    {
      name: t("name"),
      selector: (row) => row.product?.name,
    },
    {
      name: t("amount"),
      selector: (row) => `${currencySymbol}${row.refundAmount}`,
      sortable: true,
    },
    {
      name: t("Status"),
      selector: (row) => (
        <>
          <span
            className={`badge rounded-pill fs-7 ${
              row.status === "Pending"
                ? "bg-primary"
                : row.status === "Approved"
                ? "bg-success"
                : "bg-danger"
            }`}
          >
            {row.status}
          </span>
        </>
      ),
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) => (
        <>
          {row.status === "Pending" && (
            <div className="btn btn-primary">
              <Eye
                title="view"
                width={20}
                height={20}
                onClick={() => setShowDetails(row)}
              />
            </div>
          )}
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
    },
  ];

  async function handleStatusChange(status, id) {
    try {
      const idt = toast.loading("Please wait...");
      const resp = await updateData("/api/admin/refund", {
        id,
        status,
        note: note.current.value.trim(),
      });
      toast.update(idt, {
        render: resp.success
          ? "Status Updated successfully"
          : "Something Went Wrong",
        type: resp.success ? "success" : "error",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss(idt);
      }, 1000);
      if (resp.success) {
        update.current.update();
        setShowDetails({});
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <PageLoader url="/api/admin/refund" setData={setData} ref={update}>
      <Card title={t("Refund request")}>
        <Table data={data.data} columns={columns} searchKey="" />
      </Card>
      <GlobalModal
        isOpen={showDetails._id ? true : false}
        handleCloseModal={() => setShowDetails({})}
      >
        {showDetails._id && (
          <>
            <div className="card mt-2">
              <div className="card-body">
                <div className="row">
                  <div className="col-3 col-sm-2">
                    <ImageLoader src={showDetails.product?.id?.image[0]?.url} />
                  </div>
                  <div className="col-9 col-sm-7 text-left">
                    <p>{showDetails.product?.name}</p>
                    <span>{t("Variant")}:</span>
                    {showDetails.product?.color?.name && (
                      <span>{showDetails.product?.color?.name}</span>
                    )}
                    {showDetails.product?.attribute?.name && (
                      <span>{showDetails.product?.attribute?.name}</span>
                    )}
                  </div>
                  <div className="col-4 col-sm-3 text-left d-flex flex-column pl-0 mt-2 mt-sm-0 pl-sm-5">
                    <span>QTY : {showDetails.product.qty}</span>
                    <span>
                      Price : {currencySymbol}
                      {showDetails.product.price}
                    </span>
                    <span>
                      Tax : {currencySymbol}
                      {showDetails.product.tax}
                    </span>
                    <span>
                      Vat : {currencySymbol}
                      {showDetails.product.vat}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="text-center">
                  Total refund amount : {currencySymbol}
                  {showDetails.refundAmount}
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    {t("name")}: {showDetails.userId?.name}
                  </div>
                  <div className="col-md-4">
                    {t("email")}: {showDetails.userId?.email}
                  </div>
                  <div className="col-md-4">
                    {t("phone")}: {showDetails.userId?.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-3">
              <p className="fw-bold">{t("Refund reason")}</p>
              <p>{showDetails.refundReason}</p>
            </div>
            <div className="my-3">
              <p className="fw-bold">{t("Attachments")}</p>
              <div className="row">
                {showDetails.attachments?.map((x, i) => (
                  <div
                    key={i}
                    className="img-thumbnail"
                    style={{ maxWidth: "225px", margin: "5px" }}
                  >
                    <ImageLoader src={x.url} width={200} height={200} />
                  </div>
                ))}
              </div>
            </div>
            <div className="my-3">
              <label className="form-label">{t("note")}</label>
              <textarea className="form-control" required ref={note}></textarea>
            </div>
            <div className="my-5">
              <div className="btn-group w-100">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    handleStatusChange("Approved", showDetails._id)
                  }
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleStatusChange("Rejected", showDetails._id)
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          </>
        )}
      </GlobalModal>
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
}

RefundRequest.requireAuthAdmin = true;
RefundRequest.dashboard = true;
