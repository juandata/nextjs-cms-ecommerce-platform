import { model, models, Schema } from "mongoose";
import { refundRequest } from "~/utils/modelData.mjs";

const refundRequestSchema = new Schema(refundRequest);

export default models.refundRequest ||
  model("refundRequest", refundRequestSchema);
