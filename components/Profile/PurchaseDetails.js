import { XLg } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkPercentage, dateFormat, postData } from "~/lib/clientFunctions";
import classes from "~/styles/orderTrack.module.css";
import LoadingButton from "../Ui/Button";
import StarRating from "../Ui/Rating/ratingInput";
import cls from "./purchaseDetails.module.css";
import { useTranslation } from "react-i18next";
import RefundForm from "./refundForm";

export default function PurchaseDetails({ data, hide, update }) {
  const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    name: null,
    oid: null,
  });
  const [selectedRefund, setSelectedRefund] = useState({
    product: {},
    oid: null,
  });
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const product_review = (id, name, oid) => {
    setSelectedProduct({ id, name, oid });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className={`${cls.card} border-0 shadow`}>
        <div className={cls.close} onClick={hide}>
          <XLg width={17} height={17} />
        </div>
        <div className="card border-0">
          <div className="card-header bg-white py-3 fw-bold">
            {t("order_details")}
          </div>
          <div className="card-body">
            <div className={classes.body}>
              <div className={`${classes.order_details} row`}>
                <div className="col-md-6">
                  <h6>{t("order_details")} :</h6>
                  <p>
                    {t("order_id")}: <span>{data.orderId}</span>
                  </p>
                  <p>
                    {t("order_date")} :{" "}
                    <span>{dateFormat(data.orderDate)}</span>
                  </p>
                  <p>
                    {t("payment_status")} :{" "}
                    {data.paymentStatus === "Unpaid" ? (
                      <span className="badge bg-danger">Unpaid</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                  </p>
                  <p>
                    {t("order_status")}:{" "}
                    <span className="badge bg-primary">{data.status}</span>
                  </p>
                  <p>
                    {t("payment_method")}: <span>{data.paymentMethod}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>{t("delivery_information")} :</h6>
                  <p>
                    {t("delivery_type")}: <span>{data.deliveryInfo.type}</span>
                  </p>
                  {data.deliveryInfo.area && (
                    <p>
                      {t("delivery_area")}:{" "}
                      <span>{data.deliveryInfo.area}</span>
                    </p>
                  )}
                  <p>
                    {t("delivery_cost")} :{" "}
                    <span>{currencySymbol + data.deliveryInfo.cost}</span>
                  </p>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t("products")}</th>
                      <th scope="col">{t("quantity")}</th>
                      <th scope="col">{t("price")}</th>
                      <th scope="col">{t("review")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product, idx) => (
                      <tr key={idx + product._id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.qty}</td>
                        <td>{currencySymbol + product.price}</td>
                        <td>
                          {data.status === "Delivered" ? (
                            <>
                              <button
                                className={cls.review_button}
                                onClick={() =>
                                  product_review(
                                    product._id,
                                    product.name,
                                    data.orderId
                                  )
                                }
                                disabled={product.review ? true : false}
                              >
                                {product.review ? "reviewed" : "Review"}
                              </button>
                              <button
                                className={cls.review_button}
                                onClick={() =>
                                  setSelectedRefund({
                                    product,
                                    oid: data.orderId,
                                  })
                                }
                                disabled={product.refundRequest ? true : false}
                              >
                                {product.refundRequest
                                  ? "Refund requested"
                                  : "Refund request"}
                              </button>
                            </>
                          ) : (
                            "Not Delivered Yet"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={classes.payment_info}>
                <div>
                  <span>{t("sub_total")}</span>
                  <span>{currencySymbol + data.totalPrice}</span>
                </div>
                <div>
                  <span>{t("discount")}</span>
                  <span>
                    {currencySymbol +
                      decimalBalance(
                        checkPercentage(
                          data.totalPrice,
                          data.coupon?.discount || 0
                        )
                      )}
                  </span>
                </div>
                <div>
                  <span>{t("delivery_charge")}</span>
                  <span>{currencySymbol + data.deliveryInfo.cost}</span>
                </div>
                <div>
                  <span>{t("vat")}</span>
                  <span>
                    {currencySymbol}
                    {decimalBalance(data.vat)}
                  </span>
                </div>
                <div>
                  <span>{t("tax")}</span>
                  <span>
                    {currencySymbol}
                    {decimalBalance(data.tax)}
                  </span>
                </div>
                <div>
                  <span>{t("total")}</span>
                  <span>{currencySymbol + data.payAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        <ReviewForm data={selectedProduct} />
      </GlobalModal>
      <GlobalModal
        isOpen={selectedRefund.oid ? true : false}
        handleCloseModal={() => setSelectedRefund({ product: {}, oid: null })}
      >
        <RefundForm
          data={selectedRefund}
          orderData={data}
          update={update}
          hide={hide}
          close={() => setSelectedRefund({ product: {}, oid: null })}
        />
      </GlobalModal>
    </>
  );

  function ReviewForm({ data }) {
    const [loading, setLoading] = useState("");
    const [rating, setRating] = useState(1);
    const comment = useRef();
    async function postReview(e) {
      try {
        e.preventDefault();
        setLoading("loading");
        const _data = {
          pid: data.id,
          oid: data.oid,
          rating,
          comment: comment.current.value.trim(),
        };
        const resp = await postData("/api/review", _data);
        resp.success
          ? (toast.success("Review Added Successfully"),
            hide(),
            closeModal(),
            update())
          : toast.error("Something Went Wrong 500");
      } catch (err) {
        console.log(err);
        toast.error(`Something Went Wrong - ${err.message}`);
      }
      setLoading("");
    }
    return (
      <form onSubmit={postReview}>
        <div className="mb-3">
          <label className="form-label">Product</label>
          <p>{data.name}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <StarRating rate={setRating} />
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea className="form-control" ref={comment} required></textarea>
        </div>
        <LoadingButton text="Submit Review" state={loading} type="submit" />
      </form>
    );
  }
}
