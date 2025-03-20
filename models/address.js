import { model, models, Schema } from "mongoose";
import { address } from "~/utils/modelData.mjs";

const addressSchema = new Schema(address);

export default models.address || model("address", addressSchema);
