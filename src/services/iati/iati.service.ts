
import { Logger } from "../../utils/logger";
import axios from "axios";
import config from "config";
import Activity from "../activity/activity.service"
import AddDataYears from "./addData.service"
import cron from "node-cron"
const logger = Logger.createLogger(__filename);

class IatiGetAll {
    async populateDatabase(): Promise<null> {
        const url = config.get("url");
        
        const init_year = 1980;
        let PoolDataRequest = [];
        for (var i = 0; i < 40; i++) {
            const AddDataYearsService = new AddDataYears();
            try {
                PoolDataRequest[i] = await AddDataYearsService.populateDatabase(init_year + i);
            } catch (err) {
                console.log(err)
            }
        }
        Promise.allSettled(PoolDataRequest).then(async () => {
            let time = 1;
            let interval = 2800;
            let general_cron = "*/1 * * * *";
            cron.schedule(general_cron, async () => {

                const url_status = `${url}&rows=${interval * time}`;
                time = time + 1;
                if (interval * time > 10000) {
                    return
                }
                const iatiGet = await axios.get(String(url_status))
                console.log(url_status)
                const ActivitySave = new Activity();
                const docs = iatiGet.data.response.docs || []
                if (docs.length) {
                    for (const dataActivity of docs) {
                        try {
                            await ActivitySave.saveData(
                                dataActivity.id,
                                dataActivity.reporting_org_narrative[0],
                                dataActivity.transaction_value_usd,
                                dataActivity.transaction_value_date,
                                new Date(dataActivity.transaction_value_date).getFullYear()
                            )
                        } catch (err) {
                            logger.warn(err)
                        }
                    }
                }
            })
        })



        return null
    }
}
export default IatiGetAll;
