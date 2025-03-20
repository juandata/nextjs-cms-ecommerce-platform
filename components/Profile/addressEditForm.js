import LoadingButton from "../Ui/Button";
import countryData from "~/data";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { formField, updateData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function EditCustomer({ data, close }) {
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  async function handleInfo(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = formField(e.target.elements);
      const resp = await updateData("/api/profile/address", data);
      resp.success
        ? (toast.success("Address Updated Successfully"), close())
        : toast.error("No changes have been made to the data.");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setButtonState("");
  }
  return (
    <form onSubmit={handleInfo}>
      <input type="hidden" name="_id" defaultValue={data._id} />
      <div className="mb-3">
        <label>{t("edit_address")}</label>
        <div className="mb-3">
          <input
            type="text"
            placeholder={`${t("full_name")}*`}
            name="name"
            required
            className="form-control"
            defaultValue={data.name}
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
                defaultValue={data.phone}
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
                defaultValue={data.email}
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
            defaultValue={data.house}
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
                defaultValue={data.city}
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
                defaultValue={data.state}
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
                defaultValue={data.zipCode}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <select
                className="form-control"
                required
                name="country"
                defaultValue={data.country}
              >
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
                defaultValue={data.addressTitle}
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
                  defaultChecked={data.addressType === "main address"}
                  key={data.addressType === "main address"}
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
