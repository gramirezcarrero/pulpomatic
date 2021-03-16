
import { Logger } from "../../utils/logger";
import axios from "axios";
import config from "config";
import Activity from "../activity/activity.service"
const logger = Logger.createLogger(__filename);

class IatiGetAll {
    async populateDatabase(): Promise<null> {
        const url = config.get("url");
        for (var i = 0; i < 24; i++) {
            const url_status = `${url}&status=${i}`
            const iatiGet = await axios.get(String(url_status))
            console.log(url_status)
            const ActivitySave = new Activity();
            const docs = iatiGet.data.response.docs || []
            if (docs.length) {
                for (const dataActivity of docs) {
                    try {
                        await ActivitySave.saveData(dataActivity.id, dataActivity.reporting_org_narrative[0], dataActivity.transaction_value_usd, new Date(dataActivity.transaction_value_date), new Date(dataActivity.transaction_value_date).getFullYear())
                    } catch (err) {
                        logger.warn(err)
                    }
                }
            }
        }

        return null
    }
}
export default IatiGetAll;
