import LoadingButton from "../Ui/Button";
import countryData from "~/data";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { formField, postData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function NewCustomer() {
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  async function handleInfo(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = formField(e.target.elements);
      const resp = await postData("/api/profile/address", data);
      resp.success
        ? (toast.success("Customer Added Successfully"), e.target.reset())
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setButtonState("");
  }
  return (
    <form onSubmit={handleInfo}>
      <div className="mb-3">
        <label className="mb-3">{t("add_address")}</label>
        <div className="mb-3">
          <input
            type="text"
            placeholder={`${t("full_name")}*`}
            name="name"
            required
            className="form-control"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="tel"
                placeholder={`${t("phone")}*`}
                name="phone"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="email"
                placeholder={`${t("email")}*`}
                name="email"
                required
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder={`${t("house_street")}*`}
            name="house"
            required
            rows="2"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder={`${t("city")}*`}
                name="city"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder={`${t("state_province")}*`}
                name="state"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder={`${t("post_zip_code")}*`}
                name="zipCode"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <select className="form-control" required name="country">
                <option value="" disabled>
                  {`${t("select_country")}*`}
                </option>
                {countryData.country.map((ct) => (
                  <option value={ct.name} key={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder={`${t(
                  "Save As? For example: Home Address, Office Address, etc.."
                )}*`}
                className="form-control"
                required
                name="addressTitle"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-2 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="main address"
                  id="flexCheckDefault"
                  name="addressType"
                />
                <label className="form-check-label" for="flexCheckDefault">
                  Default Address
                </label>
              </div>
              <small>
                Your existing default address setting will be replaced if you
                make some changes here.
              </small>
            </div>
          </div>
        </div>
      </div>
      <LoadingButton text={t("submit")} type="submit" state={buttonState} />
    </form>
  );
}
