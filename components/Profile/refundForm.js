import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  checkPercentage,
  decimalBalance,
  postData,
} from "~/lib/clientFunctions";
import ImageLoader from "../Image";
import { useSelector } from "react-redux";
import FileUpload from "../FileUpload/fileUpload";
import { useTranslation } from "react-i18next";
import LoadingButton from "../Ui/Button";

export default function RefundForm({
  data: productData,
  orderData,
  update,
  hide,
  close,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState("");
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const reason = useRef(null);
  const { t } = useTranslation();
  const vat = checkPercentage(
    productData.product.price * productData.product.qty,
    productData.product.vat || 0
  );

  const tax = checkPercentage(
    productData.product.price * productData.product.qty,
    productData.product.tax || 0
  );
  const subtotal = +(
    productData.product.price * productData.product.qty +
    vat +
    tax
  ).toFixed(2);
  const discount = +checkPercentage(
    productData.product.price,
    orderData.coupon?.discount || 0
  ).toFixed(2);
  const refundAmount = +(subtotal - discount).toFixed(2);

  async function requestRefundHandle(e) {
    try {
      e.preventDefault();
      setLoading("loading");
      const _data = {
        product: {
          id: productData.product._id,
          name: productData.product.name,
          color: productData.product?.color?.name || null,
          attribute: productData.product?.attribute?.name || null,
          price: productData.product.price,
          qty: productData.product.qty,
          vat: productData.product.vat,
          tax: productData.product.tax,
        },
        refundReason: reason.current.value.trim(),
        status: "Pending",
        attachments: files,
        refundAmount,
        orderId: productData.oid,
      };
      const resp = await postData("/api/refund", _data);
      resp.success
        ? (toast.success(
            "Refund Request Successful please wait for the response"
          ),
          update(),
          hide(),
          close())
        : toast.error("Something Went Wrong 500");
    } catch (err) {
      console.log(err);
      toast.error(`Something Went Wrong - ${err.message}`);
    }
    setLoading("");
  }
  return (
    <form className="p-2" onSubmit={requestRefundHandle}>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row">
            <div className="col-3 col-sm-2">
              <ImageLoader src={productData.product.image[0]?.url} />
            </div>
            <div className="col-9 col-sm-7 text-left">
              <p>{productData.product.name}</p>
              <span>{t("Variant")}:</span>
              {productData.product?.color?.name && (
                <span>{productData.product?.color?.name}</span>
              )}
              {productData.product?.attribute?.name && (
                <span>{productData.product?.attribute?.name}</span>
              )}
            </div>
            <div className="col-4 col-sm-3 text-left d-flex flex-column pl-0 mt-2 mt-sm-0 pl-sm-5">
              <span>QTY : {productData.product.qty}</span>
              <span>
                Price :{currencySymbol}
                {productData.product.price}
              </span>
              <span>
                Tax :{currencySymbol}
                {decimalBalance(productData.product.tax)}
              </span>
              <span>
                Vat :{currencySymbol}
                {decimalBalance(productData.product.vat)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <div className="row text-center">
            <span className="col-sm-2">
              Subtotal :{currencySymbol}
              {subtotal}
            </span>
            <span className="col-sm-5">
              Coupon discount :{currencySymbol}
              {discount}
            </span>
            <span className="col-sm-5">
              Total refund amount :{currencySymbol}
              {refundAmount}
            </span>
          </div>
        </div>
      </div>
      <div className="my-3">
        <label className="form-label">{t("Refund reason")}</label>
        <textarea className="form-control" required ref={reason}></textarea>
      </div>
      <div className="my-5">
        <FileUpload
          label={t("Attachments")}
          multiple
          updateFilesCb={setFiles}
          maxFileSizeInBytes={2e6}
          accept={".jpg,.png,.jpeg"}
        />
      </div>
      <LoadingButton text="Submit" state={loading} type="submit" />
    </form>
  );
}
