import * as Mongoose from "mongoose";
const ActivitySchema = new Mongoose.Schema(
  {
    id: { unique: true, type: String },
    reporting_org_narrative: { type: String },
    transaction_value_usd: { type: Number },
    year: Number,
    transaction_value_date: { type: Date }
  },
  { timestamps: true }
);


export default ActivitySchema;
