import { Model, Document } from "mongoose";
export interface IActivity extends Document {
  reporting_org_narrative: string,
  transaction_value_usd: number,
  transaction_value_date: number,
  year: number
}

export interface IActivityDocument extends IActivity, Document { }

export interface IActivityModel extends Model<IActivityDocument> {
  /*eslint-disable-next-line*/
  createFromJson: (json: any) => Promise<IActivityDocument>;
}
