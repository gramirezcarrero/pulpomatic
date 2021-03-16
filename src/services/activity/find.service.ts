
import { Logger } from "../../utils/logger";
const logger = Logger.createLogger(__filename);
import { ActivityModel } from "../../models/activity/activity.model";
class FindActiviy {
    async findByYear(year: number, page: number, size: number): Promise<any | null> {

        const query = [
            {
                "$match": {
                    "year": year
                }
            },
            {
                $group: {
                    _id: {
                        reporting_org_narrative: "$reporting_org_narrative",
                        year: {
                            $year: "$transaction_value_date",
                        },
                    },
                    transaction_value_usd: {
                        $sum: "$transaction_value_usd",
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    transaction_value_usd: -1,
                },
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year"
                    },
                    data: { $push: "$$ROOT" }
                }
            }
        ]
        const data = await ActivityModel.aggregate(query)
        logger.info("activity find by year", { data })
        return data
    }
}
export default FindActiviy;