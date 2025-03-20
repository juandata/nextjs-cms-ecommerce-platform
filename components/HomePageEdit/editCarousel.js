import { useTranslation } from "react-i18next";
import FileUpload from "../FileUpload/fileUpload";
import LoadingButton from "../Ui/Button";
import { useState } from "react";
import { formField, updateData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function EditHeaderCarousel({ data, mutate, close }) {
  const { t } = useTranslation();
  const [updateCarouselImage, setUpdateCarouselImage] = useState(
    data.image || []
  );
  const [buttonState, setButtonState] = useState("");

  async function handleCarouselEdit(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const formData = formField(e.target.elements);
      formData.image = updateCarouselImage;
      formData.id = data.id;
      const { success, err } = await updateData(
        `/api/page/home?scope=carousel`,
        formData
      );
      success
        ? (toast.success("Item Updated Successfully"), mutate(), close())
        : (toast.error(err || "There has been no alteration in the data"),
          close());
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setButtonState("");
  }

  return (
    <>
      <form onSubmit={handleCarouselEdit}>
        <div className="pb-0">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={`${t("image")}(750px x 750px)*`}
            maxFileSizeInBytes={2000000}
            updateFilesCb={setUpdateCarouselImage}
            preSelectedFiles={data.image}
          />
        </div>
        <div className="pb-3">
          <label htmlFor="header-title" className="form-label">
            {t("title")}*
          </label>
          <input
            type="text"
            id="header-title"
            className="form-control"
            required
            defaultValue={data.title}
            name="title"
          />
        </div>
        <div className="pb-3">
          <label htmlFor="header-subtitle" className="form-label">
            {t("Subtitle")}*
          </label>
          <input
            type="text"
            id="header-subtitle"
            className="form-control"
            required
            defaultValue={data.subTitle}
            name="subTitle"
          />
        </div>
        <div className="pb-3">
          <label htmlFor="header-desc" className="form-label">
            {t("description")}*
          </label>
          <textarea
            id="header-desc"
            className="form-control"
            required
            defaultValue={data.description}
            name="description"
          />
        </div>
        <div className="pb-5">
          <label htmlFor="header-url" className="form-label">
            {t("URL")}*
          </label>
          <input
            type="text"
            id="header-url"
            className="form-control"
            required
            defaultValue={data.url}
            name="url"
          />
        </div>
        <div className="pb-0">
          <LoadingButton text={t("UPDATE")} type="submit" state={buttonState} />
        </div>
      </form>
    </>
  );
}
