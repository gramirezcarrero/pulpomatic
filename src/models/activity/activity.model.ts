import * as Mongoose from "mongoose";
import ActivitySchema from "./activity.schema";
import { IActivityDocument, IActivityModel } from "./activity.types";

export const ActivityModel = Mongoose.model<IActivityDocument>(
  "activity",
  ActivitySchema
) as IActivityModel;
