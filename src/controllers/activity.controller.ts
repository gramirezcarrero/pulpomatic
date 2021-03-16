import { Request, Response, Router } from "express";
import BaseController from "./base.controller";
import { Logger } from "../utils/logger";
import { ActivityModel } from "../models/activity/activity.model";
import IatiGetAll from "../services/iati/iati.service"
import FindActiviy from "../services/activity/find.service"
import * as Joi from "joi";
const paramsSchema = Joi.object().keys({
  year: Joi.number().required()
})
const logger = Logger.createLogger(__filename);

interface Narrative {
  _id: {
    reporting_org_narrative: string;
    year: number
  };
  transaction_value_usd: number;
  count: number;

}
class ActivitiesController extends BaseController {
  public initRoutes(router: Router): void {
    router.get("/init", this.handler(this.createAll));
    router.get("/activities", this.handler(this.getAll));
  }
  private async getAll(request: Request, response: Response) {

    const { error: paramsError, value: query } = paramsSchema.validate(request.query);
    if (paramsError) {
      logger.warn("Error Params Data", { paramsError })
      response.status(400).send(paramsError)
      return
    }
    const Activity = new FindActiviy();
    const promisePool = []
    for (let i = 0; i < 5; i++) {
      promisePool[i] = await Activity.findByYear(query.year - i, query.page, query.size)
    }
    const data = await Promise.allSettled(promisePool);

    const data_response = data.filter((res) => res.status === 'fulfilled') as PromiseFulfilledResult<any>[];


    if (!data_response) {
      const error = (data.find(
        (res) => res.status === "rejected"
      ) as PromiseRejectedResult | undefined)?.reason;
      throw new Error(error);
    }
    let newData;
    newData = data_response.map((field) => {
      console.log(field.value[0])
      const data = field.value[0]?.data;
      if (data) {
        const _data = data.map((narrative: Narrative) => {
          return { [narrative._id.reporting_org_narrative]: narrative.transaction_value_usd }
        })
        return { [field.value[0]._id.year]: Object.values(_data) }
      }

    })
    response.status(200).send(newData)
  }

  private async createAll(request: Request, response: Response) {
    const iatiservice = new IatiGetAll();
    iatiservice.populateDatabase();
    const Layout = ActivityModel;
    const dataLayout = await Layout.find();
    response.status(200).send(dataLayout);
  }
}
export default ActivitiesController;
