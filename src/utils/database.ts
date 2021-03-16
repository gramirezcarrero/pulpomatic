import mongoose from "mongoose";
import config from "config";
import { Logger } from "./logger";

import { ActivityModel } from "../models/activity/activity.model";
import { IActivityModel } from "../models/activity/activity.types";



const mongo_uri = process.env.MONGODB_URI || config.get<string>("mongodb.uri");
const logger = Logger.createLogger(__filename);
let database: mongoose.Connection;
export const connect: () => IDatabase = () => {
  const uri = mongo_uri;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;

  database.once("open", async () => {
    logger.info(
      "Connected to database ------------------------->>><<<<<<<<<<<------------"
    );
  });

  database.on("error", (error) => {
    logger.info("Error connecting to database");
    if (error) throw error;
  });

  return {
    ActivityModel,
  };
};
export interface IDatabase {
  ActivityModel: IActivityModel;
}
export const disconnect: () => void = () => {
  if (!database) {
    return;
  }
  logger.info("Disconnected to database");
  mongoose.disconnect();
};
